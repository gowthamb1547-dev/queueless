import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Test admin login first
const testAdmin = {
  email: 'admin@example.com',
  password: 'admin123'
};

const testUser = {
  email: 'user@example.com', 
  password: 'user123'
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

const testSlotFiltering = async () => {
  try {
    console.log('=== Testing Slot Filtering ===\n');

    // Try to login as admin
    try {
      const adminLogin = await api.post('/auth/login', testAdmin);
      console.log('✅ Admin login successful');
      
      // Create some test slots
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      const testSlots = [
        { date: today.toISOString().split('T')[0], timeSlot: '09:00 AM' },
        { date: today.toISOString().split('T')[0], timeSlot: '10:00 AM' },
        { date: today.toISOString().split('T')[0], timeSlot: '11:00 AM' },
        { date: tomorrow.toISOString().split('T')[0], timeSlot: '09:00 AM' },
        { date: tomorrow.toISOString().split('T')[0], timeSlot: '10:00 AM' }
      ];

      console.log('\nCreating test slots...');
      for (const slotData of testSlots) {
        try {
          await api.post('/slots', slotData);
          console.log(`✅ Created slot: ${slotData.date} ${slotData.timeSlot}`);
        } catch (err) {
          console.log(`⚠️  Slot already exists: ${slotData.date} ${slotData.timeSlot}`);
        }
      }

      // Test 1: Get all slots (admin view)
      console.log('\n--- Test 1: Admin view all slots ---');
      const allSlotsRes = await api.get('/slots?includeBooked=true');
      console.log(`Total slots (admin): ${allSlotsRes.data.slots.length}`);
      allSlotsRes.data.slots.forEach(slot => {
        console.log(`  ${slot.date.split('T')[0]} ${slot.timeSlot} - ${slot.isBooked ? 'BOOKED' : 'AVAILABLE'}`);
      });

      // Test 2: Get available slots for today
      console.log('\n--- Test 2: Available slots for today ---');
      const todayStr = today.toISOString().split('T')[0];
      const availableSlotsRes = await api.get(`/slots?date=${todayStr}`);
      console.log(`Available slots for ${todayStr}: ${availableSlotsRes.data.slots.length}`);
      availableSlotsRes.data.slots.forEach(slot => {
        console.log(`  ${slot.timeSlot}`);
      });

      // Test 3: Get available slots for tomorrow
      console.log('\n--- Test 3: Available slots for tomorrow ---');
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      const tomorrowSlotsRes = await api.get(`/slots?date=${tomorrowStr}`);
      console.log(`Available slots for ${tomorrowStr}: ${tomorrowSlotsRes.data.slots.length}`);
      tomorrowSlotsRes.data.slots.forEach(slot => {
        console.log(`  ${slot.timeSlot}`);
      });

      // Test 4: Book a slot and verify it's no longer available
      console.log('\n--- Test 4: Book a slot ---');
      if (availableSlotsRes.data.slots.length > 0) {
        const slotToBook = availableSlotsRes.data.slots[0];
        console.log(`Booking slot: ${slotToBook.timeSlot}`);
        
        // Create appointment to book the slot
        const appointmentData = {
          date: slotToBook.date,
          timeSlot: slotToBook.timeSlot,
          reason: 'Test appointment for slot filtering verification'
        };
        
        await api.post('/appointments', appointmentData);
        console.log('✅ Appointment created, slot should now be booked');
        
        // Check available slots again
        const updatedSlotsRes = await api.get(`/slots?date=${todayStr}`);
        console.log(`Available slots after booking: ${updatedSlotsRes.data.slots.length}`);
        updatedSlotsRes.data.slots.forEach(slot => {
          console.log(`  ${slot.timeSlot}`);
        });
      }

    } catch (adminError) {
      console.log('❌ Admin login failed, trying user login');
      
      // Try user login
      const userLogin = await api.post('/auth/login', testUser);
      console.log('✅ User login successful');
      
      // Test user can see available slots
      const todayStr = new Date().toISOString().split('T')[0];
      const userSlotsRes = await api.get(`/slots?date=${todayStr}`);
      console.log(`Available slots for user (${todayStr}): ${userSlotsRes.data.slots.length}`);
      userSlotsRes.data.slots.forEach(slot => {
        console.log(`  ${slot.timeSlot}`);
      });
    }

    console.log('\n=== Test completed ===');

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
};

testSlotFiltering();
