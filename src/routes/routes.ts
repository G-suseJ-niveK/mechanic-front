import { HOST_URL } from '~config/environment';

export const moduleRoute = {
  dashboard: {
    path: '/dashboard',
    module_name: 'dashboard',
    module_code: 'dc7161be3dbf2250c8954e560cc35060',
    text: 'Home',
    icon: 'home'
  }
};

export default {
  //Dashboard
  dashboard: HOST_URL + moduleRoute.dashboard.path
};
