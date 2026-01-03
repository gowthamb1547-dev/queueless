'use client';

import { useState, useEffect } from 'react';
import { appointmentsAPI, slotsAPI } from '@/lib/api';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [slotFormData, setSlotFormData] = useState({ date: '', timeSlot: '' });
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentsRes, slotsRes] = await Promise.all([
        appointmentsAPI.getAll(),
        slotsAPI.getAll()
      ]);
      const apts = appointmentsRes.data.appointments || [];
      setAppointments(apts);
      setSlots(slotsRes.data.slots || []);

      // Calculate stats
      setStats({
        total: apts.length,
        pending: apts.filter(a => a.status === 'Pending').length,
        approved: apts.filter(a => a.status === 'Approved').length,
        rejected: apts.filter(a => a.status === 'Rejected').length,
        completed: apts.filter(a => a.status === 'Completed').length,
      });
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await appointmentsAPI.update(id, { status: newStatus });
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await slotsAPI.create(slotFormData);
      setShowSlotForm(false);
      setSlotFormData({ date: '', timeSlot: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create slot');
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!confirm('Are you sure you want to delete this slot?')) {
      return;
    }
    try {
      await slotsAPI.delete(id);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete slot');
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-md p-6">
          <p className="text-yellow-600 text-sm">Pending</p>
          <p className="text-3xl font-bold text-yellow-800">{stats.pending}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-6">
          <p className="text-green-600 text-sm">Approved</p>
          <p className="text-3xl font-bold text-green-800">{stats.approved}</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow-md p-6">
          <p className="text-red-600 text-sm">Rejected</p>
          <p className="text-3xl font-bold text-red-800">{stats.rejected}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-md p-6">
          <p className="text-blue-600 text-sm">Completed</p>
          <p className="text-3xl font-bold text-blue-800">{stats.completed}</p>
        </div>
      </div>

      {/* Slot Management */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Time Slot Management</h2>
          <button
            onClick={() => setShowSlotForm(!showSlotForm)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            {showSlotForm ? 'Cancel' : 'Create Slot'}
          </button>
        </div>

        {showSlotForm && (
          <form onSubmit={handleCreateSlot} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={slotFormData.date}
                  onChange={(e) => setSlotFormData({ ...slotFormData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 10:00 AM - 11:00 AM"
                  value={slotFormData.timeSlot}
                  onChange={(e) => setSlotFormData({ ...slotFormData, timeSlot: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Create Slot
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {slots.slice(0, 9).map((slot) => (
            <div
              key={slot._id}
              className={`p-4 rounded-lg border-2 ${
                slot.isBooked ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
              }`}
            >
              <p className="font-semibold">{new Date(slot.date).toLocaleDateString()}</p>
              <p className="text-gray-600">{slot.timeSlot}</p>
              <p className={`text-sm mt-2 ${slot.isBooked ? 'text-red-600' : 'text-green-600'}`}>
                {slot.isBooked ? 'Booked' : 'Available'}
              </p>
              {!slot.isBooked && (
                <button
                  onClick={() => handleDeleteSlot(slot._id)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Appointments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">All Appointments</h2>
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div key={apt._id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-lg font-semibold">
                    {apt.userId?.name || 'Unknown User'} ({apt.userId?.email || 'N/A'})
                  </p>
                  <p className="text-gray-600 mt-1">
                    {new Date(apt.date).toLocaleDateString()} at {apt.timeSlot}
                  </p>
                  <p className="text-gray-700 mt-2">{apt.reason}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                  {apt.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(apt._id, 'Approved')}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(apt._id, 'Rejected')}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {apt.status === 'Approved' && (
                    <button
                      onClick={() => handleStatusUpdate(apt._id, 'Completed')}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {appointments.length === 0 && (
            <p className="text-center text-gray-500 py-8">No appointments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

