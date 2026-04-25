const API = import.meta.env.VITE_API_URL;

const headers = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const searchHotels = (params: any, token: string) =>
  fetch(`${API}/api/bookings/hotels/search`, { method: 'POST', headers: headers(token), body: JSON.stringify(params) }).then(r => r.json());

export const searchFlights = (params: any, token: string) =>
  fetch(`${API}/api/bookings/flights/search`, { method: 'POST', headers: headers(token), body: JSON.stringify(params) }).then(r => r.json());

export const searchActivities = (params: any, token: string) =>
  fetch(`${API}/api/bookings/activities/search`, { method: 'POST', headers: headers(token), body: JSON.stringify(params) }).then(r => r.json());

export const saveBooking = (data: any, token: string) =>
  fetch(`${API}/api/bookings/save`, { method: 'POST', headers: headers(token), body: JSON.stringify(data) }).then(r => r.json());

export const getMyBookings = (token: string) =>
  fetch(`${API}/api/bookings`, { headers: headers(token) }).then(r => r.json());

export const deleteBooking = (id: string, token: string) =>
  fetch(`${API}/api/bookings/${id}`, { method: 'DELETE', headers: headers(token) }).then(r => r.json());

export const createAlert = (data: any, token: string) =>
  fetch(`${API}/api/bookings/alerts`, { method: 'POST', headers: headers(token), body: JSON.stringify(data) }).then(r => r.json());

export const getAlerts = (token: string) =>
  fetch(`${API}/api/bookings/alerts`, { headers: headers(token) }).then(r => r.json());

export const deleteAlert = (id: string, token: string) =>
  fetch(`${API}/api/bookings/alerts/${id}`, { method: 'DELETE', headers: headers(token) }).then(r => r.json());
