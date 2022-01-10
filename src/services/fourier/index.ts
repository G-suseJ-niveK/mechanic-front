import apiClient from '../api';

/**
 * * Obtiene todos los paginateAgroLeaders
 */

function getFourier(data: any) {
  return apiClient.post('/fourier', data);
}

export { getFourier };
