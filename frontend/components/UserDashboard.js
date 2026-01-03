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
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadSlots(selectedDate);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate]);

  const loadData = async () => {
    try {
      const appointmentsRes = await appointmentsAPI.getAll();
      setAppointments(appointmentsRes.data.appointments || []);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSlots = async (date) => {
    if (!date) {
      setAvailableSlots([]);
      return;
    }
    
    setLoadingSlots(true);
    try {
      console.log('Loading slots for date:', date);
      const response = await slotsAPI.getAll({ date });
      const slots = response.data.slots || [];
      
      console.log('Received slots from API:', slots);
      
      // The backend already filters for available slots, but double-check for safety
      const available = slots.filter(slot => !slot.isBooked);
      
      console.log('Available slots after filtering:', available);
      setAvailableSlots(available);
    } catch (error) {
      console.error('Failed to load slots:', error);
      setError('Failed to load available slots. Please try again.');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.date) {
      setError('Please select a date');
      return;
    }
    if (!formData.timeSlot) {
      setError('Please select a time slot');
      return;
    }
    if (!formData.reason.trim()) {
      setError('Please enter a reason for the appointment');
      return;
    }
    if (formData.reason.trim().length < 10) {
      setError('Reason must be at least 10 characters long');
      return;
    }

    setSubmitting(true);

    try {
      await appointmentsAPI.create(formData);
      setSuccess('Appointment booked successfully!');
      setShowBookingForm(false);
      setFormData({ date: '', timeSlot: '', reason: '' });
      setSelectedDate('');
      setAvailableSlots([]);
      setTimeout(() => {
        loadData();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
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
      setSuccess('Appointment cancelled successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cancel appointment');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-amber-100 text-amber-800 border-amber-300',
      Approved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      Rejected: 'bg-red-100 text-red-800 border-red-300',
      Completed: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      ),
      Approved: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      Rejected: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      Completed: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    };
    return icons[status] || null;
  };

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.date) >= new Date() && apt.status !== 'Rejected'
  );
  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.date) < new Date() || apt.status === 'Rejected'
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Appointments</h1>
            <p className="text-gray-600">Manage and book your appointments</p>
          </div>
          <button
            onClick={() => {
              setShowBookingForm(!showBookingForm);
              setError('');
              setSuccess('');
              if (!showBookingForm) {
                setFormData({ date: '', timeSlot: '', reason: '' });
                setSelectedDate('');
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            {showBookingForm ? (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Book Appointment
              </span>
            )}
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-emerald-700 font-medium">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Booking Form */}
        {showBookingForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book New Appointment
            </h2>
            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) => {
                      const date = e.target.value;
                      setFormData({ ...formData, date, timeSlot: '' });
                      setSelectedDate(date);
                    }}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900"
                  />
                </div>
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Time Slot <span className="text-red-500">*</span>
                  </label>
                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
                      <span className="ml-3 text-gray-600">Loading available slots...</span>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot._id}
                            type="button"
                            onClick={() => setFormData({ ...formData, timeSlot: slot.timeSlot })}
                            className={`p-3 rounded-xl border-2 transition-all font-medium text-sm ${
                              formData.timeSlot === slot.timeSlot
                                ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
                            }`}
                          >
                            {slot.timeSlot}
                          </button>
                        ))}
                      </div>
                      {formData.timeSlot && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-700 text-sm font-medium">
                            ✓ Selected: {formData.timeSlot}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-xl">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-amber-800 font-medium mb-1">
                            No available slots for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <p className="text-amber-700 text-sm">
                            All time slots for this date are already booked. Please select another date or contact the administrator to create more slots.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Appointment <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-900 placeholder-gray-400 resize-none"
                  rows="4"
                  placeholder="Please describe the reason for your appointment..."
                />
                <p className="mt-1 text-xs text-gray-500">Minimum 10 characters required</p>
              </div>

              <button
                type="submit"
                disabled={submitting || !formData.date || !formData.timeSlot || !formData.reason.trim()}
                className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking Appointment...
                  </span>
                ) : (
                  'Book Appointment'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Appointments Sections */}
        <div className="space-y-8">
          {upcomingAppointments.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Upcoming Appointments
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingAppointments.map((apt) => (
                  <div key={apt._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-lg font-bold text-gray-900">
                            {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex items-center text-gray-600 mb-3">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{apt.timeSlot}</span>
                        </div>
                        <p className="text-gray-700 text-sm line-clamp-2">{apt.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(apt.status)}`}>
                        {getStatusIcon(apt.status)}
                        <span className="ml-1.5">{apt.status}</span>
                      </span>
                      {apt.status === 'Pending' && (
                        <button
                          onClick={() => handleCancel(apt._id)}
                          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pastAppointments.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Appointment History
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastAppointments.map((apt) => (
                  <div key={apt._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 opacity-75">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-lg font-bold text-gray-900">
                            {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex items-center text-gray-600 mb-3">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{apt.timeSlot}</span>
                        </div>
                        <p className="text-gray-700 text-sm line-clamp-2">{apt.reason}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(apt.status)}`}>
                        {getStatusIcon(apt.status)}
                        <span className="ml-1.5">{apt.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {appointments.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Yet</h3>
              <p className="text-gray-600 mb-6">Get started by booking your first appointment!</p>
              <button
                onClick={() => setShowBookingForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Book Your First Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
