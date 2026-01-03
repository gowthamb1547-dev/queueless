'use client';

import { useState, useEffect } from 'react';
import { appointmentsAPI, slotsAPI } from '@/lib/api';

export default function UserDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [formData, setFormData] = useState({ date: '', timeSlot: '', reason: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadSlots(selectedDate);
    }
  }, [selectedDate]);

  const loadData = async () => {
    try {
      const [appointmentsRes, slotsRes] = await Promise.all([
        appointmentsAPI.getAll(),
        slotsAPI.getAll()
      ]);
      setAppointments(appointmentsRes.data.appointments || []);
      setAvailableSlots(slotsRes.data.slots || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSlots = async (date) => {
    try {
      const response = await slotsAPI.getAll({ date });
      setAvailableSlots(response.data.slots || []);
    } catch (error) {
      console.error('Failed to load slots:', error);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await appointmentsAPI.create(formData);
      setShowBookingForm(false);
      setFormData({ date: '', timeSlot: '', reason: '' });
      setSelectedDate('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentsAPI.delete(id);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
      Completed: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.date) >= new Date() && apt.status !== 'Rejected'
  );
  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.date) < new Date() || apt.status === 'Rejected'
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
        <button
          onClick={() => setShowBookingForm(!showBookingForm)}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          {showBookingForm ? 'Cancel' : 'Book Appointment'}
        </button>
      </div>

      {showBookingForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Book New Appointment</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  setSelectedDate(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
                {availableSlots.length > 0 ? (
                  <select
                    required
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a time slot</option>
                    {availableSlots.map((slot) => (
                      <option key={slot._id} value={slot.timeSlot}>
                        {slot.timeSlot}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-500">No available slots for this date</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
              <textarea
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                rows="3"
                placeholder="Brief reason for appointment..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
            >
              {submitting ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-8">
        {upcomingAppointments.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
            <div className="grid gap-4">
              {upcomingAppointments.map((apt) => (
                <div key={apt._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-semibold">{new Date(apt.date).toLocaleDateString()}</p>
                      <p className="text-gray-600">Time: {apt.timeSlot}</p>
                      <p className="text-gray-700 mt-2">{apt.reason}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                      {apt.status === 'Pending' && (
                        <button
                          onClick={() => handleCancel(apt._id)}
                          className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pastAppointments.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Appointment History</h2>
            <div className="grid gap-4">
              {pastAppointments.map((apt) => (
                <div key={apt._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-semibold">{new Date(apt.date).toLocaleDateString()}</p>
                      <p className="text-gray-600">Time: {apt.timeSlot}</p>
                      <p className="text-gray-700 mt-2">{apt.reason}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {appointments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No appointments yet. Book your first appointment!</p>
          </div>
        )}
      </div>
    </div>
  );
}

