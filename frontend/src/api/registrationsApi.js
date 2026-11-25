const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Fetch registrations list with search, filter, and pagination query params
 */
export async function fetchRegistrations({
  search = '',
  type = '',
  status = '',
  page = 1,
  pageSize = 5,
} = {}) {
  const params = new URLSearchParams();

  if (search) params.append('search', search);
  if (type) params.append('type', type);
  if (status) params.append('status', status);
  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());

  const response = await fetch(`${API_BASE_URL}/registrations?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch registrations (${response.status} ${response.statusText})`);
  }

  return await response.json();
}

/**
 * Fetch KPI summary metrics from backend API
 */
export async function fetchRegistrationSummary() {
  const response = await fetch(`${API_BASE_URL}/registrations/summary`);

  if (!response.ok) {
    throw new Error(`Failed to fetch summary metrics (${response.status} ${response.statusText})`);
  }

  return await response.json();
}
