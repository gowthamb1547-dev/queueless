import express from 'express';
import Appointment from '../models/Appointment.js';
import Slot from '../models/Slot.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create appointment
router.post('/', async (req, res) => {
  try {
    const { date, timeSlot, reason } = req.body;

    if (!date || !timeSlot || !reason) {
      return res.status(400).json({ message: 'Date, time slot, and reason are required' });
    }

    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Check if the selected date is a Sunday (day 0)
    if (appointmentDate.getDay() === 0) {
      return res.status(400).json({ message: 'Please select another day. Appointments are not available on Sundays.' });
    }

    // Normalize date to midnight for comparison
    const normalizedDate = new Date(appointmentDate);
    normalizedDate.setHours(0, 0, 0, 0);
    const startOfDay = new Date(normalizedDate);
    const endOfDay = new Date(normalizedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Check if slot exists and is available
    const slot = await Slot.findOne({ 
      date: { $gte: startOfDay, $lte: endOfDay }, 
      timeSlot 
    });
    if (!slot) {
      return res.status(400).json({ message: 'Time slot not available' });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    // Check if user already has an appointment at this time
    const existingAppointment = await Appointment.findOne({
      userId: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
      timeSlot,
      status: { $in: ['Pending', 'Approved'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'You already have an appointment at this time' });
    }

    // Create appointment (store normalized date)
    const appointment = await Appointment.create({
      userId: req.user._id,
      date: normalizedDate,
      timeSlot,
      reason,
      status: 'Pending'
    });

    // Mark slot as booked - use the exact same date range query for consistency
    const slotToUpdate = await Slot.findOne({ 
      date: { $gte: startOfDay, $lte: endOfDay }, 
      timeSlot,
      isBooked: false  // Ensure we only update if it's not already booked
    });
    
    if (!slotToUpdate) {
      // Rollback appointment creation if slot is not available
      await Appointment.findByIdAndDelete(appointment._id);
      return res.status(400).json({ message: 'Time slot is no longer available' });
    }
    
    slotToUpdate.isBooked = true;
    await slotToUpdate.save();
    
    console.log('Slot marked as booked:', {
      slotId: slotToUpdate._id,
      date: slotToUpdate.date,
      timeSlot: slotToUpdate.timeSlot,
      isBooked: slotToUpdate.isBooked
    });

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Failed to create appointment', error: error.message });
  }
});

// Get appointments
router.get('/', async (req, res) => {
  try {
    const { status, date } = req.query;
    const query = {};

    // If user is not admin, only show their appointments
    if (req.user.role !== 'ADMIN') {
      query.userId = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate('userId', 'name email')
      .sort({ date: -1, createdAt: -1 });

    res.json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

// Get single appointment
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('userId', 'name email');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Users can only view their own appointments unless admin
    if (req.user.role !== 'ADMIN' && appointment.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ appointment });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Failed to fetch appointment', error: error.message });
  }
});

// Update appointment
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Users can only update their own appointments unless admin
    if (req.user.role !== 'ADMIN' && appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Admin can update status
    if (req.user.role === 'ADMIN' && req.body.status) {
      const validStatuses = ['Pending', 'Approved', 'Rejected', 'Completed'];
      if (validStatuses.includes(req.body.status)) {
        appointment.status = req.body.status;
      }
    }

    // Users can update date, timeSlot, and reason (if not approved/completed)
    if (req.user.role !== 'ADMIN') {
      if (appointment.status === 'Approved' || appointment.status === 'Completed') {
        return res.status(400).json({ message: 'Cannot update approved or completed appointments' });
      }

      if (req.body.date) {
        const updateDate = new Date(req.body.date);
        updateDate.setHours(0, 0, 0, 0);
        appointment.date = updateDate;
      }
      if (req.body.timeSlot) {
        appointment.timeSlot = req.body.timeSlot;
      }
      if (req.body.reason) {
        appointment.reason = req.body.reason;
      }
    }

    await appointment.save();

    res.json({
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
});

// Delete/Cancel appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Users can only delete their own appointments unless admin
    if (req.user.role !== 'ADMIN' && appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Free up the slot (normalize appointment date for lookup)
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(0, 0, 0, 0);
    const slotStart = new Date(appointmentDate);
    const slotEnd = new Date(appointmentDate);
    slotEnd.setHours(23, 59, 59, 999);
    
    const slot = await Slot.findOne({
      date: { $gte: slotStart, $lte: slotEnd },
      timeSlot: appointment.timeSlot,
      isBooked: true  // Only update if currently booked
    });

    if (slot) {
      slot.isBooked = false;
      await slot.save();
      
      console.log('Slot marked as available:', {
        slotId: slot._id,
        date: slot.date,
        timeSlot: slot.timeSlot,
        isBooked: slot.isBooked
      });
    } else {
      console.log('No booked slot found to free up:', {
        appointmentDate: appointmentDate.toISOString(),
        timeSlot: appointment.timeSlot
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ message: 'Failed to delete appointment', error: error.message });
  }
});

export default router;

