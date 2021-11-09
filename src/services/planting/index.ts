import apiClient from '../api';
import { PlantingsEdit } from '~models/plantings';

/**
 * * Obtiene todos los Farmers
 */

function selectIrrigationFrecuency() {
  return apiClient.get('/plantings/irrigation_frecuency');
}

function updatePlanting(plantingId?: string, data?: PlantingsEdit) {
  return apiClient.put(`/plantings/${plantingId}`, data);
}

export { selectIrrigationFrecuency, updatePlanting };
