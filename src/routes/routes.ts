import { HOST_URL } from '~config/environment';

export const moduleRoute = {
  dashboard: {
    path: '/dashboard',
    module_name: 'dashboard',
    module_code: 'dc7161be3dbf2250c8954e560cc35060',
    text: 'Home',
    icon: 'home'
  },
  farmers: {
    path: '/dashboard/farmers',
    module_name: 'farmers',
    module_code: '18fa3b09cc4b1e9819621b16ab9cebeb',
    text: 'Productores',
    icon: 'person',
    submodule: [
      {
        path: '/dashboard/resumen_archivos',
        module_name: '',
        module_code: '',
        text: 'Resumen de archivos',
        icon: ''
      }
    ]
  },
  dividir1: {
    divider: true
  },
  agro_leader: {
    path: '/dashboard/farm_agent',
    module_name: 'agro_leader',
    module_code: '18fa3b09cc4b1e9819621b16ab9ceeee',
    text: 'Agente de Campo',
    icon: 'group'
  },
  digital_identity_credentials_file: {
    path: '/dashboard/digital_identity/credentials/files',
    module_name: 'digital_identity',
    module_code: '18fa3b09cc4b1e9819621b16ab9cebeb',
    text: 'Certificados',
    icon: 'payment'
  },
  verify_credential: {
    path: '/dashboard/verify_credentials',
    module_name: 'verify_credential',
    module_code: '18fa3b09cc4b1e98196',
    text: 'Credenciales por verificar',
    icon: 'payment_sharp'
  },
  organizationForm: {
    path: '/dashboard/organization_form'
  }
};

export default {
  // -- Endpoint-- //
  login: HOST_URL + '/',
  recoveryPassword: HOST_URL + '/recovery-password',

  //Dashboard
  dashboard: HOST_URL + moduleRoute.dashboard.path,

  //Farmer
  farmers: HOST_URL + moduleRoute.farmers.path,
  farmerId: HOST_URL + moduleRoute.farmers.path + '/:farmer_id',

  // farmers files loaded
  farmersFileListLoaded: HOST_URL + '/dashboard/file_summury',
  farmersListLoaded: HOST_URL + '/dashboard/file_summury/:file_loaded_id',

  //Credentials files loaded
  digitalIdentityCredentialsFiles: HOST_URL + moduleRoute.digital_identity_credentials_file.path,
  digitalIdentityCredentialsShowFilesRecords:
    HOST_URL + `${moduleRoute.digital_identity_credentials_file.path}/:file_loaded_id`,

  // Agro Leader
  agroLeader: HOST_URL + moduleRoute.agro_leader.path,
  agroLeaderId: HOST_URL + moduleRoute.agro_leader.path + '/:agro_leader_id',

  // verify credentials
  verifyCredential: HOST_URL + moduleRoute.verify_credential.path,
  verifyCredentialId: HOST_URL + moduleRoute.verify_credential.path + '/:credential_id',

  organizationForm: HOST_URL + moduleRoute.organizationForm.path,
  organizationFormDisabled: HOST_URL + '/dashboard/organization_form_delete',
  organizationFormEditId: HOST_URL + moduleRoute.organizationForm.path + '/:organization_form_id',
  organizationFormDataId: HOST_URL + moduleRoute.organizationForm.path + '/:organization_form_id/data',

  moreServices: HOST_URL + '/dashboard/more_services',
  organizationProfile: HOST_URL + '/dashboard/organization/profile'
};
