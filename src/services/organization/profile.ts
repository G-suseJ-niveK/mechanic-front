import apiClient from '../api';
import apiFormClient from '../apiform';

/**
 * * get a Organization profile
 */
function updateOrganizationProfile(data: any) {
  return apiFormClient.put('/organizations/profile', data);
}

/**
 * * Update Organization profile
 */
function getOrganizationProfile() {
  return apiClient.get('/organizations/profile');
}

export { getOrganizationProfile, updateOrganizationProfile };
