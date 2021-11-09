import apiClient from '../api';

/**
 * * Obtiene todos los Farmers
 */
function getCredentials() {
  return apiClient.get('/credentials/definitions');
}

export { getCredentials };
