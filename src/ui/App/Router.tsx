import React, { Suspense, lazy } from 'react';
import { Switch } from 'react-router-dom';
import LogIn from '../pages/Auth/LogIn';
import GuardRoute from './GuardRoute';
import routesName, { moduleRoute } from '~routes/routes';
import { Layout } from '~templates/Layouts/Layout';
import Root from './Root';
import { Box } from '@material-ui/core';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';

const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard" */ '~pages/Dashboard/Dashboard'));
const Farmer = lazy(() => import(/* webpackChunkName: "Farmer" */ '~pages/Dashboard/Farmer'));
const ShowFarmer = lazy(() => import(/* webpackChunkName: "ShowFarmer" */ '~pages/Dashboard/Farmer/showFarmer'));
const FarmersFileListLoaded = lazy(
  () => import(/* webpackChunkName: "FarmersFileListLoaded" */ '~pages/Dashboard/Farmer/FilesLoaded')
);

const FarmersListLoaded = lazy(
  () => import(/* webpackChunkName: "FarmersListLoaded" */ '~pages/Dashboard/Farmer/FilesLoaded/ShowResultFile')
);

const AgroLeaderPage = lazy(() => import(/* webpackChunkName: "AgroLederPage" */ '~pages/Dashboard/AgroLeader'));

const ShowAgroLeaderPage = lazy(
  () => import(/* webpackChunkName: "ShowAgroLederPage" */ '~pages/Dashboard/AgroLeader/ShowAgroLeader')
);

const OrganizationFormComponent = lazy(
  () => import(/* webpackChunkName: "OrganizationFormComponent" */ '~ui/pages/Dashboard/OrganizationForm')
);

const ShowOrganizationFormComponent = lazy(
  () =>
    import(
      /* webpackChunkName: "ShowOrganizationFormComponent" */ '~ui/pages/Dashboard/OrganizationForm/EditOrganizationForm'
    )
);

const DataOrganizationFormComponent = lazy(
  () =>
    import(
      /* webpackChunkName: "ShowOrganizationFormComponent" */ '~ui/pages/Dashboard/OrganizationForm/DataOrganizationForm'
    )
);

const DisabledOrganizationFormComponent = lazy(
  () =>
    import(
      /* webpackChunkName: "ShowOrganizationFormComponent" */ '~ui/pages/Dashboard/OrganizationForm/DisabledOrganizationForm'
    )
);

const MoreServicesComponent = lazy(() => import(/* webpackChunkName: "Service" */ '~ui/pages/Dashboard/Service'));

const OrganizationProfileComponent = lazy(
  () => import(/* webpackChunkName: "OrganizationProfile" */ '~ui/pages/Dashboard/Organization/profile')
);

const wrappedRoutes = () => (
  <Layout>
    <Suspense
      fallback={
        <Box width="100%">
          <LinearProgress loading={true} />
        </Box>
      }>
      <GuardRoute
        type="private"
        exact={true}
        path={routesName.dashboard}
        component={Dashboard}
        key="dashboard"
        module_code={moduleRoute.dashboard.module_code}
      />
      <GuardRoute
        type="private"
        exact={true}
        path={routesName.farmers}
        component={Farmer}
        key="farmers"
        module_code={moduleRoute.farmers.module_code}
      />
      <GuardRoute
        type="private"
        exact={true}
        path={routesName.farmerId}
        component={ShowFarmer}
        module_code={moduleRoute.farmers.module_code}
        key="show_farmer"
      />

      <GuardRoute
        type="private"
        exact={true}
        path={routesName.farmersFileListLoaded}
        component={FarmersFileListLoaded}
        key="farmers_file_list_loaded"
      />
      <GuardRoute
        type="private"
        exact={true}
        path={routesName.farmersListLoaded}
        component={FarmersListLoaded}
        key="farmers_list_loaded"
      />

      <GuardRoute
        type="private"
        exact={true}
        path={routesName.agroLeader}
        component={AgroLeaderPage}
        key="agro_leader"
      />

      <GuardRoute
        type="private"
        exact={true}
        path={routesName.agroLeaderId}
        component={ShowAgroLeaderPage}
        key="show_agro_leader"
      />

      <GuardRoute
        type="private"
        exact={true}
        path={routesName.organizationForm}
        component={OrganizationFormComponent}
        key="organization_form"
      />
      <GuardRoute
        type="private"
        exact={true}
        path={routesName.organizationFormEditId}
        component={ShowOrganizationFormComponent}
        key="show_organization_form"
      />
      <GuardRoute
        type="private"
        exact={true}
        path={routesName.organizationFormDataId}
        component={DataOrganizationFormComponent}
        key="data_organization_form"
      />
      <GuardRoute
        type="private"
        exact={true}
        path={routesName.organizationFormDisabled}
        component={DisabledOrganizationFormComponent}
        key="disabled_organization_form"
      />
      <GuardRoute
        type="private"
        exact={true}
        path={routesName.moreServices}
        component={MoreServicesComponent}
        key="more_services"
      />

      <GuardRoute
        type="private"
        exact={true}
        path={routesName.organizationProfile}
        component={OrganizationProfileComponent}
        key="organization_profile"
      />
    </Suspense>
  </Layout>
);

const Router = () => (
  <main>
    <Switch>
      <Root>
        <GuardRoute path="/" type="public" exact={true} component={LogIn} />
        <GuardRoute type="private" component={wrappedRoutes} />
      </Root>
    </Switch>
  </main>
);

export default React.memo(Router);
