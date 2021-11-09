import { OrganizationForm } from '~models/organizationForm';
import apiClient from '../api';

/**
 * * Create a OrganizationForm
 */
function createOrganizationForm(data: OrganizationForm) {
  return apiClient.post('/organizations/forms', data);
}

/**
 * * Create a OrganizationForm
 */
function createOrganizationFormAttributes(data: OrganizationForm) {
  return apiClient.post(`/organizations/forms/${data.id}/attributes`, data);
}

/**
 * * List OrganizationForms
 */
function listOrganizationForm() {
  return apiClient.get('/organizations/forms');
}

/**
 * * List disabled OrganizationForms
 */
function listDisabledOrganizationForm() {
  return apiClient.get('/organizations/forms/disabled');
}

/**
 * * Get a OrganizationForm
 */
function getOrganizationForm(id: string) {
  return apiClient.get(`/organizations/forms/${id}`);
}

/**
 * * Get OrganizationForm Data
 */
function getOrganizationFormData(id: string) {
  return apiClient.get(`/organizations/forms/${id}/data`);
}

/**
 * * Delete OrganizationForm
 */
function deleteOrganizationForm(id: string) {
  return apiClient.delete(`/organizations/forms/${id}`);
}

/**
 * * Restore OrganizationForm
 */
function restoreOrganizationForm(id: string) {
  return apiClient.put(`/organizations/forms/${id}/restore`, {});
}

export {
  listOrganizationForm,
  createOrganizationFormAttributes,
  createOrganizationForm,
  getOrganizationForm,
  getOrganizationFormData,
  deleteOrganizationForm,
  restoreOrganizationForm,
  listDisabledOrganizationForm
};
