import React, { useCallback, useState } from 'react';
import { CircularProgress, Box, Typography, InputAdornment, IconButton, useMediaQuery } from '@material-ui/core';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import RemoveRedEyeOutlinedIcon from '@material-ui/icons/RemoveRedEyeOutlined';
import TextFieldMaterial from '@material-ui/core/TextField';
import IconUser from '~assets/icons/user.svg';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import CognitoAWS from '~services/cognito';
import { CognitoForgotPassword } from '~models/cognito';
import * as yup from 'yup';
import clsx from 'clsx';
import useStylesTextField from '../LogIn/TextField.css';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(() => ({
  buttonProgress: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}));

type ForgotPasswordProps = {
  onVerifyCode(): void;
};

const cognito = new CognitoAWS();

const ForgotPassword: React.FC<ForgotPasswordProps> = (props: ForgotPasswordProps) => {
  const matches = useMediaQuery('(min-width:640px)');
  const [isViewPassword, setIsViewPassword] = useState<boolean>(false);
  const { onVerifyCode } = props;
  const { enqueueSnackbar } = useSnackbar();
  const classesTextField = useStylesTextField();

  const validationSchema = yup.object().shape({
    username: yup.string().required('Ingrese el usuario.'),
    newPassword: yup.string().required('Ingrese la nueva contraseña.'),
    verificationCode: yup.string().required('Ingrese el código de verificación.')
  });

  const classes = useStyles();

  const initialValues: CognitoForgotPassword = { username: '', newPassword: '', verificationCode: '' };

  const formik = useFormik({
    initialValues,
    onSubmit: (credentials: CognitoForgotPassword) => {
      confirmPassword(credentials);
    },
    validationSchema
  });

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

  const confirmPassword = useCallback(
    (credentials: CognitoForgotPassword) => {
      cognito
        .confirmPassword(credentials)
        .then(() => {
          alertMessage('Se cambió la contraseña con éxito.', 'success');
          onVerifyCode();
        })
        .catch((error: any) => {
          formik.setSubmitting(false);
          switch (error.code) {
            case 'ExpiredCodeException':
              alertMessage('Código de verificación expiró.', 'warning');
              break;
            default:
              alertMessage('Código incorrecto.');
              break;
          }
        });
    },
    [formik, onVerifyCode, alertMessage]
  );

  const handleResetPassword = useCallback(
    async (e: any) => {
      e.preventDefault();

      const validateForm = await formik.validateForm();
      if (validateForm.hasOwnProperty('username')) {
        alertMessage('Ingrese el nombre de usuario.');
      } else {
        cognito
          .forgotPassword(formik.values.username)
          .then(() => {
            alertMessage('Código enviado.', 'success');
          })
          .catch((error: any) => {
            switch (error.code) {
              case 'ExpiredCodeException':
                alertMessage('Código de verificación expiró.', 'warning');
                break;
              case 'LimitExceededException':
                alertMessage('A superado el limite de intentos. Inténtelo mas tarde!');
                break;
              default:
                alertMessage('Problemas al reenviar el codigo de verificación.');
                break;
            }
          });
      }
    },
    [formik, alertMessage]
  );

  return (
    <>
      <Typography align="center" variant="h5" component="h2" style={{ color: '#339253', marginBottom: '10px' }}>
        Cambio de contraseña
      </Typography>

      <form className="form" autoComplete="off">
        <div className="form__form-group">
          <span className="form__form-group-label">Usuario</span>
          <TextFieldMaterial
            className={clsx(
              classesTextField.root,
              !(formik.errors['username'] && formik.touched['username'] && Boolean(formik.errors['username']))
                ? classesTextField.default
                : null
            )}
            id="username"
            fullWidth
            name="username"
            autoComplete="usename"
            label=""
            variant="outlined"
            color="primary"
            value={formik.values.username}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            onBlur={formik.handleBlur}
            placeholder="Ingrese su usuario"
            error={
              formik.errors['username'] && formik.touched['username'] && Boolean(formik.errors['username'])
                ? true
                : false
            }
            helperText={formik.errors['username'] && formik.touched['username'] ? formik.errors['username'] : ''}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={IconUser} alt="user" />
                </InputAdornment>
              )
            }}
          />
        </div>

        <div className="form__form-group">
          <span className="form__form-group-label">Codigo de verificacion</span>
          <TextFieldMaterial
            className={clsx(
              classesTextField.root,
              !(
                formik.errors['verificationCode'] &&
                formik.touched['verificationCode'] &&
                Boolean(formik.errors['verificationCode'])
              )
                ? classesTextField.default
                : null
            )}
            id="verificationCode"
            fullWidth
            name="verificationCode"
            label=""
            variant="outlined"
            color="primary"
            value={formik.values.verificationCode}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            onBlur={formik.handleBlur}
            placeholder="Ingrese el código de verificación"
            error={
              formik.errors['verificationCode'] &&
              formik.touched['verificationCode'] &&
              Boolean(formik.errors['verificationCode'])
                ? true
                : false
            }
            helperText={
              formik.errors['verificationCode'] && formik.touched['verificationCode']
                ? formik.errors['verificationCode']
                : ''
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={IconUser} alt="user" />
                </InputAdornment>
              )
            }}
          />
        </div>

        <div className="form__form-group">
          <span className="form__form-group-label">Nueva Contraseña</span>
          <TextFieldMaterial
            className={clsx(
              classesTextField.root,
              !(formik.errors['newPassword'] && formik.touched['newPassword'] && Boolean(formik.errors['newPassword']))
                ? classesTextField.default
                : null
            )}
            id="newPassword"
            fullWidth
            name="newPassword"
            label=""
            variant="outlined"
            color="primary"
            type={isViewPassword ? 'text' : 'password'}
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            onBlur={formik.handleBlur}
            placeholder="Contraseña"
            error={
              formik.errors['newPassword'] && formik.touched['newPassword'] && Boolean(formik.errors['newPassword'])
                ? true
                : false
            }
            helperText={
              formik.errors['newPassword'] && formik.touched['newPassword'] ? formik.errors['newPassword'] : ''
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={IconUser} alt="user" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    disabled={formik.isSubmitting}
                    style={{ padding: '3px' }}
                    onClick={() => setIsViewPassword((prevValue: boolean) => !prevValue)}>
                    {isViewPassword ? <RemoveRedEyeOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </div>
        <Box display="flex" justifyContent="flex-end">
          <a
            href="/"
            style={{
              fontFamily: 'Fira Sans',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '13px'
            }}
            onClick={handleResetPassword}>
            Reenviar código
          </a>
        </Box>
      </form>
      <Box
        width="100%"
        style={
          matches
            ? {
                padding: '0rem 6rem'
              }
            : {}
        }>
        <div className="account__btns">
          <button type="button" className="btn" onClick={formik.submitForm}>
            Cambiar contraseña
          </button>
          {formik.isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
      </Box>
    </>
  );
};

export default React.memo(ForgotPassword);
