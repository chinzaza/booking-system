const API_BASE = '/api';

let currentBookingId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadServices();
  loadBookings();
  setDefaultDate();
});

function showTab(tab) {
  document.getElementById('tab-content-services').classList.toggle('hidden', tab !== 'services');
  document.getElementById('tab-content-bookings').classList.toggle('hidden', tab !== 'bookings');
  
  document.getElementById('tab-services').classList.toggle('bg-blue-700', tab === 'services');
  document.getElementById('tab-services').classList.toggle('hover:bg-blue-700', tab !== 'services');
  document.getElementById('tab-bookings').classList.toggle('bg-blue-700', tab === 'bookings');
  document.getElementById('tab-bookings').classList.toggle('hover:bg-blue-700', tab !== 'bookings');
}

function setDefaultDate() {
  const today = new Date().toISOString().split('T')[0];
  const bookingDateInput = document.getElementById('booking-bookingDate');
  if (bookingDateInput) {
    bookingDateInput.min = today;
    bookingDateInput.value = today;
  }
}

async function loadServices() {
  try {
    const res = await fetch(`${API_BASE}/services`);
    const services = await res.json();
    renderServicesTable(services);
    renderBookingServicesCheckboxes(services);
  } catch (err) {
    console.error('Error loading services:', err);
  }
}

function renderServicesTable(services) {
  const tbody = document.getElementById('services-table-body');
  tbody.innerHTML = services.map(s => `
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-4">
        <div class="font-medium text-gray-900">${escapeHtml(s.name)}</div>
      </td>
      <td class="px-6 py-4 text-gray-600">${escapeHtml(s.description || '-')}</td>
      <td class="px-6 py-4 font-medium text-green-600">${Number(s.price).toLocaleString()}</td>
      <td class="px-6 py-4 text-gray-600">${s.duration} นาที</td>
      <td class="px-6 py-4 text-right pr-6">
        <button onclick="editService('${s._id}')" class="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">แก้ไข</button>
        <button onclick="deleteService('${s._id}')" class="text-red-600 hover:text-red-800 text-sm font-medium">ลบ</button>
      </td>
    </tr>
  `).join('');
}

function renderBookingServicesCheckboxes(services) {
  const container = document.getElementById('booking-services-list');
  container.innerHTML = services.map(s => `
    <label class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
      <input type="checkbox" value="${s._id}" data-price="${s.price}" data-duration="${s.duration}" data-name="${escapeHtml(s.name)}" 
        onchange="updateBookingTotal()" class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500">
      <span class="font-medium">${escapeHtml(s.name)}</span>
      <span class="text-gray-500">${Number(s.price).toLocaleString()} บาท</span>
      <span class="text-gray-400">(${s.duration} นาที)</span>
    </label>
  `).join('');
}

function updateBookingTotal() {
  const checkboxes = document.querySelectorAll('#booking-services-list input[type="checkbox"]:checked');
  let totalPrice = 0;
  let totalDuration = 0;
  
  checkboxes.forEach(cb => {
    totalPrice += parseFloat(cb.dataset.price);
    totalDuration += parseInt(cb.dataset.duration);
  });
  
  document.getElementById('booking-totalPrice').value = `${totalPrice.toLocaleString()} บาท (${totalDuration} นาที)`;
}

async function loadBookings() {
  try {
    const res = await fetch(`${API_BASE}/bookings`);
    const bookings = await res.json();
    renderBookingsTable(bookings);
  } catch (err) {
    console.error('Error loading bookings:', err);
  }
}

function renderBookingsTable(bookings) {
  const tbody = document.getElementById('bookings-table-body');
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  
  const statusLabels = {
    pending: 'รอดำเนินการ',
    confirmed: 'ยืนยันแล้ว',
    completed: 'เสร็จสิ้น',
    cancelled: 'ยกเลิก'
  };
  
  tbody.innerHTML = bookings.map(b => {
    const servicesHtml = b.services.map(s => `<span class="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1 mb-1">${escapeHtml(s.name)}</span>`).join('');
    const date = new Date(b.bookingDate).toLocaleDateString('th-TH');
    
    return `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4">
          <div class="font-medium text-gray-900">${escapeHtml(b.customerName)}</div>
          <div class="text-sm text-gray-500">${escapeHtml(b.phone)}</div>
        </td>
        <td class="px-6 py-4">${servicesHtml}</td>
        <td class="px-6 py-4 text-gray-600">${date}</td>
        <td class="px-6 py-4 text-gray-600">${b.bookingTime}</td>
        <td class="px-6 py-4 font-medium text-green-600">${Number(b.totalPrice).toLocaleString()} บาท</td>
        <td class="px-6 py-4">
          <span class="px-2 py-1 text-xs font-medium rounded-full ${statusColors[b.status]}">${statusLabels[b.status]}</span>
        </td>
        <td class="px-6 py-4 text-right pr-6">
          <button onclick="openStatusModal('${b._id}', '${b.status}')" class="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">สถานะ</button>
          <button onclick="deleteBooking('${b._id}')" class="text-red-600 hover:text-red-800 text-sm font-medium">ลบ</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openServiceModal(service = null) {
  const modal = document.getElementById('service-modal');
  const form = document.getElementById('service-form');
  const title = document.getElementById('service-modal-title');
  
  form.reset();
  document.getElementById('service-id').value = '';
  
  if (service) {
    title.textContent = 'แก้ไขบริการ';
    document.getElementById('service-id').value = service._id;
    document.getElementById('service-name').value = service.name;
    document.getElementById('service-description').value = service.description || '';
    document.getElementById('service-price').value = service.price;
    document.getElementById('service-duration').value = service.duration;
  } else {
    title.textContent = 'เพิ่มบริการ';
  }
  
  modal.classList.remove('hidden');
}

function closeServiceModal() {
  document.getElementById('service-modal').classList.add('hidden');
}

async function saveService(e) {
  e.preventDefault();
  
  const id = document.getElementById('service-id').value;
  const data = {
    name: document.getElementById('service-name').value,
    description: document.getElementById('service-description').value,
    price: parseFloat(document.getElementById('service-price').value),
    duration: parseInt(document.getElementById('service-duration').value)
  };
  
  try {
    const url = id ? `${API_BASE}/services/${id}` : `${API_BASE}/services`;
    const method = id ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) throw new Error('Failed to save service');
    
    closeServiceModal();
    loadServices();
  } catch (err) {
    alert('เกิดข้อผิดพลาด: ' + err.message);
  }
}

async function editService(id) {
  try {
    const res = await fetch(`${API_BASE}/services/${id}`);
    const service = await res.json();
    openServiceModal(service);
  } catch (err) {
    alert('เกิดข้อผิดพลาด: ' + err.message);
  }
}

async function deleteService(id) {
  if (!confirm('ยืนยันการลบบริการนี้?')) return;
  
  try {
    const res = await fetch(`${API_BASE}/services/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete service');
    loadServices();
  } catch (err) {
    alert('เกิดข้อผิดพลาด: ' + err.message);
  }
}

function openBookingModal(booking = null) {
  const modal = document.getElementById('booking-modal');
  const form = document.getElementById('booking-form');
  const title = document.getElementById('booking-modal-title');
  
  form.reset();
  document.getElementById('booking-id').value = '';
  document.querySelectorAll('#booking-services-list input[type="checkbox"]').forEach(cb => cb.checked = false);
  updateBookingTotal();
  
  if (booking) {
    title.textContent = 'แก้ไขการจอง';
    document.getElementById('booking-id').value = booking._id;
    document.getElementById('booking-customerName').value = booking.customerName;
    document.getElementById('booking-phone').value = booking.phone;
    document.getElementById('booking-bookingDate').value = new Date(booking.bookingDate).toISOString().split('T')[0];
    document.getElementById('booking-bookingTime').value = booking.bookingTime;
    document.getElementById('booking-notes').value = booking.notes || '';
    
    booking.services.forEach(s => {
      const cb = document.querySelector(`#booking-services-list input[value="${s.serviceId}"]`);
      if (cb) cb.checked = true;
    });
    updateBookingTotal();
  } else {
    title.textContent = 'จองคิวใหม่';
  }
  
  modal.classList.remove('hidden');
}

function closeBookingModal() {
  document.getElementById('booking-modal').classList.add('hidden');
}

async function saveBooking(e) {
  e.preventDefault();
  
  const id = document.getElementById('booking-id').value;
  const serviceIds = Array.from(document.querySelectorAll('#booking-services-list input[type="checkbox"]:checked'))
    .map(cb => cb.value);
  
  if (serviceIds.length === 0) {
    alert('กรุณาเลือกบริการอย่างน้อย 1 รายการ');
    return;
  }
  
  const data = {
    customerName: document.getElementById('booking-customerName').value,
    phone: document.getElementById('booking-phone').value,
    serviceIds,
    bookingDate: document.getElementById('booking-bookingDate').value,
    bookingTime: document.getElementById('booking-bookingTime').value,
    notes: document.getElementById('booking-notes').value
  };
  
  try {
    const url = id ? `${API_BASE}/bookings/${id}` : `${API_BASE}/bookings`;
    const method = id ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) throw new Error('Failed to save booking');
    
    closeBookingModal();
    loadBookings();
  } catch (err) {
    alert('เกิดข้อผิดพลาด: ' + err.message);
  }
}

function openStatusModal(id, currentStatus) {
  currentBookingId = id;
  document.getElementById('status-select').value = currentStatus;
  document.getElementById('status-modal').classList.remove('hidden');
}

function closeStatusModal() {
  currentBookingId = null;
  document.getElementById('status-modal').classList.add('hidden');
}

async function confirmStatusChange() {
  if (!currentBookingId) return;
  
  const status = document.getElementById('status-select').value;
  
  try {
    const res = await fetch(`${API_BASE}/bookings/${currentBookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    
    if (!res.ok) throw new Error('Failed to update status');
    
    closeStatusModal();
    loadBookings();
  } catch (err) {
    alert('เกิดข้อผิดพลาด: ' + err.message);
  }
}

async function deleteBooking(id) {
  if (!confirm('ยืนยันการลบการจองนี้?')) return;
  
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete booking');
    loadBookings();
  } catch (err) {
    alert('เกิดข้อผิดพลาด: ' + err.message);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}