import apiClient from '../api_user';

function getUserData() {
  return apiClient.get('/users/me');
}

export { getUserData };
