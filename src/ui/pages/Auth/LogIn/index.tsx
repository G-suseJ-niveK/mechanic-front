import React, { useState, useCallback } from 'react';
import { Grid, Box, Typography, useMediaQuery } from '@material-ui/core';
import LogIn from './LogIn';
import ForgotPassword from '../ForgotPassword';
import LogoAgros from '~assets/img/id_panel.png';
import IconBackground from '~assets/icons/logo_vector.svg';
import './Login.scss';

const Login = () => {
  const matches = useMediaQuery('(min-width:960px)');
  const [isActiveVerifyCode, setIsActiveVerifyCode] = useState<boolean>(true);

  const handleVerifyCode = useCallback(() => {
    setIsActiveVerifyCode((prevValue: boolean) => !prevValue);
  }, []);

  return (
    <>
      <Grid container style={{ height: '100%' }}>
        {matches && (
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <div className="account">
              <div className="account__photo">
                <div className="account_Photo_img">
                  <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
                    <Box color="white" fontSize={30} p={15}>
                      <Typography
                        align="justify"
                        style={{ fontSize: '25px', fontWeight: 'bold', marginBottom: '20px' }}>
                        &ldquo;Nos preocupamos por ti, para que tú te preocupes por tus productores.&rdquo;
                      </Typography>
                      <Typography gutterBottom style={{ fontSize: '25px', fontWeight: 'bold' }}>
                        - AGROS
                      </Typography>
                      <Box display="flex" justifyContent="flex-end">
                        <img src={IconBackground} alt="IconBackground" />
                      </Box>
                    </Box>
                  </Box>
                </div>
              </div>
            </div>
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="account">
            <div className="account__card">
              <div className="account__head">
                <img src={LogoAgros} className="account__logo__img" alt="logo" />
              </div>
              {isActiveVerifyCode && <LogIn onVerifyCode={handleVerifyCode} />}
              {!isActiveVerifyCode && <ForgotPassword onVerifyCode={handleVerifyCode} />}
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
