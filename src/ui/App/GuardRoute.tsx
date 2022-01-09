import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import routesName from '~routes/routes';

const GuardRoute = ({ component: Component, type, ...rest }: any) => {
  return (
    <Route
      {...rest}
      render={(props: any) => {
        if (type === 'public') {
          return <Component {...props} />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default React.memo(GuardRoute);
