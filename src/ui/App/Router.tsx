import React, { Suspense, lazy } from 'react';
import { Switch } from 'react-router-dom';
import GuardRoute from './GuardRoute';
import routesName, { moduleRoute } from '~routes/routes';
import { Box } from '@material-ui/core';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';

const Dashboard = lazy(() => import(/* webpackChunkName: "Dashboard" */ '~pages/Dashboard/Dashboard'));

const wrappedRoutes = () => (
  <Suspense
    fallback={
      <Box width="100%">
        <LinearProgress loading={true} />
      </Box>
    }>
    <GuardRoute
      type="public"
      exact={true}
      path={routesName.dashboard}
      component={Dashboard}
      key="dashboard"
      module_code={moduleRoute.dashboard.module_code}
    />
  </Suspense>
);

const Router = () => (
  <main>
    <Switch>
      <GuardRoute type="public" component={wrappedRoutes} />
    </Switch>
  </main>
);

export default React.memo(Router);
