import apiClient from '../api';
import { AgroLeader } from '~models/agroLeader';

/**
 * * Obtiene todos los paginateAgroLeaders
 */
function paginateAgroLeaders(page: number, per_page: number, sort_by: string, order: string, search: string) {
  return apiClient.get(
    `/agro_leaders?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`
  );
}

function getAgroLeader(agroLeaderId: any) {
  return apiClient.get(`/agro_leaders/${agroLeaderId}`);
}

function deleteAgroLeader(agroLeaderId: any) {
  return apiClient.delete(`/agro_leaders/${agroLeaderId}`);
}

function createAgroLeader(data: AgroLeader) {
  return apiClient.post('/agro_leaders', data);
}

function updateAgroLeader(id?: string, data?: AgroLeader) {
  return apiClient.put(`/agro_leaders/${id}`, data);
}

function listAssignedCredentialToAgroLeader(agroLeaderId: string) {
  return apiClient.get(`/agro_leaders/${agroLeaderId}/assigned_credentials`);
}

function assignedCredentialToAgroLeader(agroLeaderId: string, data: any) {
  return apiClient.post(`/agro_leaders/${agroLeaderId}/assigned_credentials`, data);
}

function assignedFarmersToAgroLeader(agroLeaderId: any) {
  return apiClient.get(`/agro_leaders/${agroLeaderId}/assigned_farmers`);
}

function assignFarmersToAgroLeader(agroLeaderId: any, data: any) {
  return apiClient.post(`/agro_leaders/${agroLeaderId}/assigned_farmers`, data);
}

function removeAssignedFarmerToAgroLeader(agroLeaderId: any, farmerId: any) {
  return apiClient.delete(`/agro_leaders/${agroLeaderId}/assigned_farmers/${farmerId}`);
}

function removeAssignedCertificateToAgroLeader(agroLeaderId: any, credentialId: any) {
  return apiClient.delete(`/agro_leaders/${agroLeaderId}/assigned_credentials/${credentialId}`);
}

export {
  paginateAgroLeaders,
  deleteAgroLeader,
  getAgroLeader,
  createAgroLeader,
  updateAgroLeader,
  assignedFarmersToAgroLeader,
  assignFarmersToAgroLeader,
  removeAssignedFarmerToAgroLeader,
  listAssignedCredentialToAgroLeader,
  assignedCredentialToAgroLeader,
  removeAssignedCertificateToAgroLeader
};
