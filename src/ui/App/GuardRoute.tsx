import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import routesName from '~routes/routes';
import { useSelector } from 'react-redux';

const GuardRoute = ({ component: Component, type, module_code, ...rest }: any) => {
  const { auth }: any = useSelector((state: any) => state);

  const rol = localStorage.getItem('permissions');
  if (rol && module_code) {
    const rolParse = JSON.parse(rol);

    if (rolParse.name_rol !== 'agro_admins') {
      const result = rolParse?.permission?.modules?.some((value: any) => value?.module_code === module_code);
      if (!result) {
        return <Redirect to={routesName.dashboard} />;
      }
    }
  }

  return (
    <Route
      {...rest}
      render={(props: any) => {
        if (type === 'public' && auth?.isLoggedIn) {
          return <Redirect to={routesName.dashboard} />;
        }

        if (type === 'private' && !auth?.isLoggedIn) {
          return <Redirect to={routesName.login} />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default React.memo(GuardRoute);
