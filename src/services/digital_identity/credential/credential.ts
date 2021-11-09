import apiClientPanel from '../../api';
import apiClient from '../../digitalIdentityApi';

/**
 * * Obtiene todos los Farmers
 */
function getAllCredentialFromConnection(farmerId: any) {
  return apiClient.get(`/organizations/digital_identity/farmers/${farmerId}/credentials`);
}

function issuedCredential(farmerId: any, credentialId: any, values: any) {
  return apiClient.post(
    `/organizations/digital_identity/farmers/${farmerId}/credentials/${credentialId}/issued_credential`,
    values
  );
}

function issuedRecordCredential(values: any) {
  return apiClient.post('/organizations/digital_identity/farmers/credentials/issued/multiple', values);
}

function getCredentialsDefinitions() {
  return apiClientPanel.get('/credentials/definitions');
}

function selectCredentialsDefinitions() {
  return apiClientPanel.get('/credentials/definitions/select');
}

function loadCredentialsFile(data: any) {
  return apiClientPanel.post('/credentials/load/file', data);
}

function getCredentialsFileLoaded() {
  return apiClientPanel.get('/credentials/file/records');
}

function getCredentialsFileLoadedRecords(id: string) {
  return apiClientPanel.get(`/credentials/file/records/${id}`);
}

function updateRecordCredential(id: string, values: any) {
  return apiClientPanel.put(`/credentials/file/records/${id}`, values);
}

export {
  getAllCredentialFromConnection,
  selectCredentialsDefinitions,
  getCredentialsDefinitions,
  issuedCredential,
  issuedRecordCredential,
  loadCredentialsFile,
  getCredentialsFileLoaded,
  getCredentialsFileLoadedRecords,
  updateRecordCredential
};
