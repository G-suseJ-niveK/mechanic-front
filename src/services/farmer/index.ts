import apiClient from '../api';

/**
 * * Obtiene todos los Farmers
 */
function paginateFarmers(page: number, per_page: number, sort_by: string, order: string, search: string) {
  return apiClient.get(`/farmers?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`);
}

/**
 * * Obtiene todos los Farmers
 */
function selectFarmer() {
  return apiClient.get('/farmers/select');
}

/**
 * * Obtiene todos los Farmers
 */
function getFarmer(farmerId: string) {
  return apiClient.get(`/farmers/${farmerId}`);
}

function getVerifyColumnsFromFarmer(farmerId: string) {
  return apiClient.get(`/farmers/${farmerId}/verify_columns`);
}

function getFarmsFromFarmer(farmerId: string) {
  return apiClient.get(`/farmers/${farmerId}/farms`);
}

function getFormsFromFarmer(farmerId: string) {
  return apiClient.get(`/farmers/${farmerId}/forms`);
}

function getAdditionalDataFromFarmer(farmerId: string) {
  return apiClient.get(`/farmers/${farmerId}/additional_data`);
}

function createAdditionalDataFromFarmer(farmerId: string, data: any) {
  return apiClient.post(`/farmers/${farmerId}/additional_data`, data);
}

function loadFarmers(data: any) {
  return apiClient.post('/farmers/file', data);
}

function loadAdditionalDataFarmers(data: any) {
  return apiClient.post('/farmers/file/additional_data', data);
}

function DeleteFarmer(farmerId?: string) {
  return apiClient.delete(`/farmers/${farmerId}`);
}

function updateFarmer(farmerId?: string, data?: any) {
  return apiClient.put(`/farmers/${farmerId}`, data);
}

function createFarmer(data: any) {
  return apiClient.post('/farmers', data);
}

function listAllFarmersFilesLoaded() {
  return apiClient.get('/farmers/file/records');
}

function loadAllFarmersRecords(record_id: string) {
  return apiClient.get(`/farmers/file/records/${record_id}`);
}

function updateFarmerRecord(record_id: string, data: any) {
  return apiClient.put(`/farmers/file/records/${record_id}`, { ...data });
}

function updateFarmerLocation(farmerId: string, data: any) {
  return apiClient.put(`/farmers/${farmerId}/location`, data);
}

export {
  paginateFarmers,
  selectFarmer,
  getVerifyColumnsFromFarmer,
  loadFarmers,
  loadAdditionalDataFarmers,
  createFarmer,
  getFarmer,
  listAllFarmersFilesLoaded,
  loadAllFarmersRecords,
  updateFarmerRecord,
  DeleteFarmer,
  updateFarmer,
  getFarmsFromFarmer,
  getFormsFromFarmer,
  getAdditionalDataFromFarmer,
  createAdditionalDataFromFarmer,
  updateFarmerLocation
};
