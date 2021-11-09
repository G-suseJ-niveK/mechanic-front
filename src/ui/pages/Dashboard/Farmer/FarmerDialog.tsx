import React, { useCallback } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '~ui/atoms/TextField/TextField';
import Button from '~ui/atoms/Button/Button';
import { Farmer } from '~models/farmer';
import { AxiosResponse } from 'axios';
import { showMessage } from '~utils/Messages';
import PhoneTextField from '~ui/atoms/PhoneTextField/PhoneTextField';

type FarmerDialogProps = {
  open: boolean;
  farmer: Farmer;
  closeAction(isUpdateTable?: boolean): void;
  saveAction(farmer: Farmer): Promise<AxiosResponse<any>>;
};

const FarmerDialog: React.FC<FarmerDialogProps> = (props: FarmerDialogProps) => {
  const { open, farmer, closeAction, saveAction } = props;

  const newFarmer = {
    ...farmer,
    phone: farmer.phone ?? '',
    whatsapp_number: farmer.whatsapp_number ?? ''
  };

  // validation
  const validationSchema = yup.object().shape({
    last_name: yup.string().required('Campo requerido.'),
    first_name: yup.string().required('Campo requerido.'),
    dni: yup
      .string()
      .required('Campo requerido.')
      .min(8, 'El DNI debe tener 8 caracteres.')
      .max(8, 'El DNI debe tener 8 caracteres.')
  });

  const formik = useFormik({
    initialValues: newFarmer,
    onSubmit: (farmer: Farmer) => {
      //Verifica Phone

      const errors: any = {};

      if (Object.keys(errors).length !== 0) {
        formik.setSubmitting(false);
        formik.setErrors(errors);
        return;
      }

      const prevFarmer = Object.assign({}, farmer);
      const phone = prevFarmer.phone ? prevFarmer.phone : '';
      if (!phone.includes('+')) {
        prevFarmer.phone = phone.length > 5 ? '+' + phone : null;
      }
      const whatsapp_number = prevFarmer.whatsapp_number ? prevFarmer.whatsapp_number : '';
      if (!whatsapp_number.includes('+')) {
        prevFarmer.whatsapp_number = whatsapp_number.length > 5 ? '+' + whatsapp_number : null;
      }
      saveAction(prevFarmer)
        .then((res: any) => {
          const { message } = res?.data?.data;
          showMessage('', message, 'success');
          closeAction(true);
        })
        .catch((err: any) => {
          const errorMessage = 'Problemas al crear al productor.';
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

  const handleOnChangePhoneInput = useCallback(
    (value: string, name: string) => {
      formik.setFieldValue(name, value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Dialog
      open={open}
      title={'Registrar Productor'}
      subtitle={'Para registrar a un productor ingresa los campos solicitados'}
      onClose={() => closeAction()}
      actions={
        <>
          <Button onClick={() => closeAction()} variant="outlined" disabled={formik.isSubmitting} text="Cancelar" />

          <Button
            onClick={() => onSubmit()}
            color="primary"
            variant="contained"
            disabled={formik.isSubmitting}
            isLoading={formik.isSubmitting}
            text="Registrar"
          />
        </>
      }>
      <Grid container={true}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="dni"
            name="dni"
            type="text"
            label="DNI"
            value={formik.values.dni}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="first_name"
            name="first_name"
            type="text"
            label="Nombre"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="last_name"
            name="last_name"
            type="text"
            label="Apellidos"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <PhoneTextField
            id="phone"
            name="phone"
            label="Celular"
            value={formik.values?.phone}
            onChange={handleOnChangePhoneInput}
            errors={formik.errors}
            touched={formik.touched}
            disabled={formik.isSubmitting}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <PhoneTextField
            id="whatsapp_number"
            name="whatsapp_number"
            label="Whatsapp"
            value={formik.values.whatsapp_number}
            onChange={handleOnChangePhoneInput}
            errors={formik.errors}
            touched={formik.touched}
            disabled={formik.isSubmitting}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default React.memo(FarmerDialog);
