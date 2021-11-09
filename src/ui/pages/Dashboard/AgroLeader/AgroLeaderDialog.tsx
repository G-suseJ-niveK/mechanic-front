import React, { useCallback } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '~ui/atoms/TextField/TextField';
import Button from '~ui/atoms/Button/Button';
import { AgroLeader } from '~models/agroLeader';
import { AxiosResponse } from 'axios';
import { showMessage } from '~utils/Messages';
import PhoneTextField from '~ui/atoms/PhoneTextField/PhoneTextField';
import { Zone } from '~models/zone';
import SelectField from '~ui/atoms/SelectField/SelectField';

type AgroLeaderDialogProps = {
  agroLeader?: AgroLeader;
  zones: Zone[];
  closeAction(isUpdateTable?: boolean): void;
  saveAction(agroLeader: AgroLeader): Promise<AxiosResponse<any>>;
};

const AgroLeaderDialog: React.FC<AgroLeaderDialogProps> = (props: AgroLeaderDialogProps) => {
  const { zones, closeAction, saveAction, agroLeader } = props;

  const newZones = [{ id: '', description: 'No seleccionar' }, ...zones];
  const newAgroLeader: any = {
    username: agroLeader?.username || '',
    first_name: agroLeader?.first_name || '',
    last_name: agroLeader?.last_name || '',
    full_name: agroLeader?.full_name || '',
    dni: agroLeader?.dni || '',
    email: agroLeader?.email || '',
    phone: agroLeader?.phone || '',
    whatsapp_number: agroLeader?.whatsapp_number || '',
    zone_id: agroLeader?.zone_id || ''
  };
  if (agroLeader?.id !== undefined) {
    newAgroLeader['id'] = agroLeader?.id;
  }
  // validation
  const validationSchema = yup.object().shape({
    last_name: yup.string().required('Campo requerido.'),
    first_name: yup.string().required('Campo requerido.'),
    username: yup.string().required('Campo requerido.'),
    phone: yup.string().required('Campo requerido.'),
    dni: yup
      .string()
      .required('Campo requerido.')
      .min(8, 'El DNI debe tener 8 caracteres.')
      .max(8, 'El DNI debe tener 8 caracteres.')
  });

  const formik = useFormik({
    initialValues: newAgroLeader,
    onSubmit: (value: AgroLeader) => {
      //Verifica Phone
      if (
        (formik.values.phone === '' && formik.values.whatsapp_number === '') ||
        (formik.values.phone === '51' && formik.values.whatsapp_number === '51')
      ) {
        formik.setSubmitting(false);
        formik.setErrors({
          phone: 'Debe registrar celular ó Whatsapp.',
          whatsapp_number: 'Debe registrar celular ó Whatsapp.'
        });
        return;
      }
      const errors: any = {};
      if (
        formik?.values?.phone?.slice(0, 2) === '51' &&
        formik?.values?.phone?.length > 2 &&
        formik?.values?.phone?.length !== 11
      ) {
        errors['phone'] = 'El número de celular debe tener 9 caracteres.';
      }

      if (
        formik?.values?.whatsapp_number?.slice(0, 2) === '51' &&
        formik?.values?.whatsapp_number?.length > 2 &&
        formik?.values?.whatsapp_number?.length !== 11
      ) {
        formik.setSubmitting(false);
        errors['whatsapp_number'] = 'El número de whatsapp debe tener 9 caracteres.';
      }
      if (Object.keys(errors).length !== 0) {
        formik.setSubmitting(false);
        formik.setErrors(errors);
        return;
      }

      const prevFarmer = Object.assign({}, value);
      const phone = prevFarmer.phone ? prevFarmer.phone : '';
      if (!phone.includes('+')) {
        prevFarmer['phone'] = phone.length > 5 ? '+' + phone : '';
      }
      const whatsapp_number = prevFarmer.whatsapp_number ? prevFarmer.whatsapp_number : '';
      if (!whatsapp_number.includes('+')) {
        prevFarmer['whatsapp_number'] = whatsapp_number.length > 5 ? '+' + whatsapp_number : '';
      }
      saveAction(prevFarmer)
        .then((res: any) => {
          const message = res?.data?.data;
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

  const handleOnChangeSelect = useCallback(
    (field: string, value: any) => {
      formik.setFieldValue(field, value);
    },
    [formik]
  );

  const handleOnChangePhoneInput = useCallback(
    (value: string, name: string) => {
      formik.setFieldValue(name, value);
    },
    [formik]
  );

  return (
    <Dialog
      open={true}
      title={agroLeader !== undefined ? 'Actualizar promotor de identidad' : 'Registrar promotor de identidad'}
      subtitle="Para registrar a un promotor de identidad ingresa los campos solicitados"
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
            text={agroLeader !== undefined ? 'Guardar' : 'Registrar'}
          />
        </>
      }>
      <Grid container spacing={1}>
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
        <Grid item={true} xs={12} sm={12} md={6} lg={6} xl={6}>
          <TextField
            id="username"
            name="username"
            type="text"
            label="Nombre de usuario"
            value={formik.values.username}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting || agroLeader !== undefined}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={6} lg={6} xl={6}>
          <TextField
            id="email"
            name="email"
            type="text"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <SelectField
            id="zone_id"
            name="zone_id"
            label="Zona"
            items={newZones}
            itemText="description"
            itemValue="id"
            value={formik.values?.zone_id}
            onChange={handleOnChangeSelect}
            errors={formik.errors}
            touched={formik.touched}
            disabled={formik.isSubmitting}
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

export default React.memo(AgroLeaderDialog);
