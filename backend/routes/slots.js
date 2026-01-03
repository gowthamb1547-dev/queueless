import express from 'express';
import Slot from '../models/Slot.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get available slots
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const query = { isBooked: false };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    } else {
      // Default to today and future dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.date = { $gte: today };
    }

    const slots = await Slot.find(query).sort({ date: 1, timeSlot: 1 });

    res.json({ slots });
  } catch (error) {
    console.error('Get slots error:', error);
    res.status(500).json({ message: 'Failed to fetch slots', error: error.message });
  }
});

// Create slot (Admin only)
router.post('/', authorize('ADMIN'), async (req, res) => {
  try {
    const { date, timeSlot } = req.body;

    if (!date || !timeSlot) {
      return res.status(400).json({ message: 'Date and time slot are required' });
    }

    const slotDate = new Date(date);
    if (isNaN(slotDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Normalize date to midnight
    const normalizedDate = new Date(slotDate);
    normalizedDate.setHours(0, 0, 0, 0);

    // Check if slot already exists (using date range query)
    const startOfDay = new Date(normalizedDate);
    const endOfDay = new Date(normalizedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const existingSlot = await Slot.findOne({ 
      date: { $gte: startOfDay, $lte: endOfDay }, 
      timeSlot 
    });
    if (existingSlot) {
      return res.status(400).json({ message: 'Slot already exists' });
    }

    const slot = await Slot.create({
      date: normalizedDate,
      timeSlot,
      isBooked: false
    });

    res.status(201).json({
      message: 'Slot created successfully',
      slot
    });
  } catch (error) {
    console.error('Create slot error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Slot already exists' });
    }
    res.status(500).json({ message: 'Failed to create slot', error: error.message });
  }
});

// Delete slot (Admin only)
router.delete('/:id', authorize('ADMIN'), async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: 'Cannot delete a booked slot' });
    }

    await Slot.findByIdAndDelete(req.params.id);

    res.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    console.error('Delete slot error:', error);
    res.status(500).json({ message: 'Failed to delete slot', error: error.message });
  }
});

export default router;

