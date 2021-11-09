import React, { useCallback } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid, Box, Rating } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '~ui/atoms/TextField/TextField';
import Button from '~ui/atoms/Button/Button';
import { AxiosResponse } from 'axios';
import { showMessage } from '~utils/Messages';
import { ServiceInteractionCloseRequest } from '~models/organizationServiceInteraction';

type CalificationDialogProps = {
  open: boolean;
  closeAction(isUpdateTable?: boolean): void;
  saveAction(calification: ServiceInteractionCloseRequest): Promise<AxiosResponse<any>>;
};

const CalificationDialog: React.FC<CalificationDialogProps> = (props: CalificationDialogProps) => {
  const { open, closeAction, saveAction } = props;

  const newCalification: ServiceInteractionCloseRequest = {
    rate: 0,
    message: ''
  };

  // validation
  const validationSchema = yup.object().shape({});

  const formik = useFormik({
    initialValues: newCalification,
    onSubmit: (value: ServiceInteractionCloseRequest) => {
      //Verifica Phone

      const errors: any = {};
      if (formik?.values?.rate === 0) {
        errors['organization_service_category_id'] = 'Sin categoria de consulta';
      }

      if (Object.keys(errors).length !== 0) {
        formik.setSubmitting(false);
        formik.setErrors(errors);
        return;
      }
      const prevFarmer = Object.assign({}, value);

      saveAction(prevFarmer)
        .then((res: any) => {
          const message = res?.data?.data?.message;
          showMessage('', message, 'success');
          formik.resetForm({});
          closeAction(true);
        })
        .catch((err: any) => {
          const errorMessage = 'Problemas al crear la solicitud.';
          const data = err?.response?.data;
          if (data?.hasOwnProperty('error')) {
            showMessage('', data?.error?.message ?? errorMessage, 'error', true);
          } else if (data?.hasOwnProperty('errors')) {
            formik.setErrors(data.errors);
          } else {
            showMessage('', errorMessage, 'error', true);
          }
          formik.setSubmitting(false);
        });
    },
    validationSchema
  });

  const onSubmit = useCallback(async () => {
    await formik.setErrors({});
    formik.handleSubmit();
  }, [formik]);

  return (
    <Dialog open={open} onClose={() => closeAction()}>
      <Box display="flex" flexDirection="row" justifyContent="center" fontSize="1.3em">
        ¿Qué le pareció el servicio?
      </Box>
      <Box mb={3} display="flex" flexDirection="row" justifyContent="center" fontSize="1em">
        Toque una estrella para calificar la asesoría del 1 al 5
      </Box>
      <Grid container={true}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box display="flex" flexDirection="row" justifyContent="center">
            <Rating
              id="rate"
              name="rate"
              value={formik.values.rate}
              onChange={(event: any, newValue: any) => {
                formik.setFieldValue('rate', newValue);
              }}
            />
          </Box>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="message"
            name="message"
            type="text"
            label="Puede dejarnos su comentario"
            value={formik.values.message}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            multiline={true}
            rowsMax={4}
            touched={formik.touched}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box display="flex" flexDirection="row" justifyContent="center">
            <Button
              onClick={() => onSubmit()}
              color="primary"
              variant="contained"
              disabled={formik.isSubmitting}
              isLoading={formik.isSubmitting}
              text="Enviar"
            />
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default React.memo(CalificationDialog);
