import { THEME, SIGN_IN, SIGN_OUT, LOADING_AUTH, REFRESH_TOkEN } from '../constans';
import cover from '~assets/img/farmer_banner.png';

type InitialValues = {
  authReady: boolean;
  isLoggedIn: boolean;
  user: any;
  organizationTheme: any;
};

const initialState: InitialValues = {
  authReady: false,
  isLoggedIn: false,
  user: null,
  organizationTheme: {
    initial_gps: [-5.197188653750377, -80.62666654586792],
    farmers_profile_path_logo: cover
  }
};

export default function (state: InitialValues = initialState, action: any) {
  switch (action.type) {
    case THEME: {
      return {
        ...state,
        organizationTheme: { ...action.payload }
      };
    }
    case SIGN_IN: {
      return {
        ...state,
        authReady: action.payload.authReady,
        isLoggedIn: action.payload.isLoggedIn,
        user: { ...action.payload.user }
      };
    }
    case SIGN_OUT:
      return { ...state, authReady: true, isLoggedIn: false, user: null };
    case LOADING_AUTH:
      return { ...state, authReady: action.payload.authReady };
    case REFRESH_TOkEN:
      return { ...state, user: { ...state.user, accessToken: action.payload } };
    default:
      return state;
  }
}
