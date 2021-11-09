import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from '@material-ui/core';
import ThemeConfig from '~ui/themes';
import Header from '~organisms/Header/Header';
import SideBar from '~organisms/SideBar/SideBar';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import ScrollToTop from '~atoms/ScrollToTop/ScrollToTop';
import { routes } from '~routes/_nav';
import '~assets/scss/app.scss';
import '../../../i18next';
import { useSnackbar } from 'notistack';
import { getUserData } from '~services/user';
import { forceLogOut, updateTheme } from '~redux-store/actions/authActions';
import { COMMUNITY_BASE_URL_S3 } from '~config/environment';
import LogIDPanel from '~ui/assets/img/id_panel.png';
import cover from '~assets/img/farmer_banner.png';

export type Props = {
  children?: React.ReactNode;
};

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

// eslint-disable-next-line @typescript-eslint/typedef
const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

const defaultOrganizationTheme: any = {
  initial_gps: [-5.197188653750377, -80.62666654586792],
  farmers_profile_path_logo: cover
};

const CompLayout: React.FC<Props> = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [activeDrawer, setActiveDrawer] = useState<boolean>(true);
  const [isUserDataLoading, setIsUserDataLoading] = useState<boolean>(true);
  const [logo, setLogo] = useState<any>('');

  const handleActiveDrawer = useCallback(() => {
    setActiveDrawer((prevValue: any) => !prevValue);
  }, [setActiveDrawer]);

  const alertMessage = useCallback(
    (message: string = 'Error', type: any = 'warning', duration: number = 3000) => {
      return enqueueSnackbar(message, {
        autoHideDuration: duration,
        variant: type,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
    },
    [enqueueSnackbar]
  );

  useEffect(() => {
    getUserData()
      .then((res: any) => {
        const data = res?.data?.data;
        if (data?.organizations?.length !== 0) {
          const newTheme: any = {};
          const organization = data?.organizations[0]?.organization;
          if (
            organization.logo_path !== null &&
            organization.logo_path !== '' &&
            organization.logo_path !== undefined
          ) {
            setLogo(COMMUNITY_BASE_URL_S3 + organization.logo_path);
          } else {
            setLogo(LogIDPanel);
          }

          if (organization.theme !== null && organization.theme !== undefined) {
            const theme = organization?.theme;
            newTheme['initial_gps'] = theme?.hasOwnProperty('initial_gps')
              ? theme?.initial_gps
              : defaultOrganizationTheme?.initial_gps;

            newTheme['farmers_profile_path_logo'] = theme?.hasOwnProperty('farmers_profile_path_logo')
              ? COMMUNITY_BASE_URL_S3 + theme?.farmers_profile_path_logo
              : defaultOrganizationTheme?.farmers_profile_path_logo;
            dispatch(updateTheme(newTheme));
          }
          setIsUserDataLoading(false);
          return;
        }

        alertMessage('Problemas al cargar los datos del usuario.');
        dispatch(forceLogOut());
      })
      .catch(() => {
        alertMessage('Problemas al cargar los datos del usuario.');
        dispatch(forceLogOut());
      });
  }, [alertMessage, dispatch]);

  if (isUserDataLoading) {
    return (
      <div className="load">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <ThemeConfig>
      <ScrollToTop />
      <RootStyle>
        <Header activeDrawer={activeDrawer} handleActiveDrawer={handleActiveDrawer} />
        <SideBar
          activeDrawer={activeDrawer}
          routes={routes}
          handleActiveDrawer={handleActiveDrawer}
          isLogoLoading={isUserDataLoading}
          logo={logo}
        />
        <MainStyle>
          <Container maxWidth="xl">{props.children}</Container>
        </MainStyle>
        {/* <Footer /> */}
      </RootStyle>
    </ThemeConfig>
  );
};

export const Layout = React.memo(CompLayout);
