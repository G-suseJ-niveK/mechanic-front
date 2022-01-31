import React from 'react';
import { Route } from 'react-router-dom';

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
