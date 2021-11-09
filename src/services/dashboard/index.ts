import apiClient from '../api';

/**
 * * Obtiene Farmer cumulative
 */
function getFarmerCumulative() {
  return apiClient.get('/dashboard/producers');
}

/**
 * * Obtiene Form cumulative
 */
function getFormCumulative() {
  return apiClient.get('/dashboard/forms');
}

/**
 * * Obtiene las Farms de los productores registrados
 */
function getRegisteredFarms() {
  return apiClient.get('/dashboard/farms');
}

export { getFormCumulative, getFarmerCumulative, getRegisteredFarms };
