import React, { useCallback } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '~ui/atoms/Button/Button';
import { AxiosResponse } from 'axios';
import { showMessage } from '~utils/Messages';
import PhoneTextField from '~ui/atoms/PhoneTextField/PhoneTextField';
import SelectField from '~ui/atoms/SelectField/SelectField';
import { Farmer } from '~models/farmer';

type AgroLeaderDialogProps = {
  farmer?: Farmer;
  closeAction(): void;
  saveAction(farmer: Farmer): Promise<AxiosResponse<any>>;
};

const AgroLeaderDialog: React.FC<AgroLeaderDialogProps> = (props: AgroLeaderDialogProps) => {
  const { closeAction, saveAction, farmer } = props;
  const itemOperador = [
    { description: 'Bitel', name: 'Bitel' },
    { description: 'Entel', name: 'entel' },
    { description: 'Movistar', name: 'movistar' },
    { description: 'Claro', name: 'claro' }
  ];
  const newFarmer: any = {
    id: farmer?.id || '',
    first_name: farmer?.first_name || '',
    last_name: farmer?.last_name || '',
    full_name: farmer?.full_name || '',
    dni: farmer?.dni || '',
    phone_carrier: farmer?.phone_carrier || '',
    email: farmer?.email || '',
    phone: farmer?.phone || '',
    whatsapp_number: farmer?.whatsapp_number || ''
  };

  // validation
  const validationSchema = yup.object().shape({});

  const formik = useFormik({
    initialValues: newFarmer,
    onSubmit: (value: Farmer) => {
      //Verifica Phone

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
      prevFarmer['phone_carrier'] = prevFarmer['phone_carrier'] ? '' : null;

      const phone = prevFarmer.phone ? prevFarmer.phone : '';
      if (!phone.includes('+')) {
        prevFarmer['phone'] = phone.length > 5 ? '+' + phone : null;
      }
      const whatsapp_number = prevFarmer.whatsapp_number ? prevFarmer.whatsapp_number : '';
      if (!whatsapp_number.includes('+')) {
        prevFarmer['whatsapp_number'] = whatsapp_number.length > 5 ? '+' + whatsapp_number : null;
      }
      saveAction(prevFarmer)
        .then((res: any) => {
          const message = res?.data?.message;
          showMessage('', message, 'success');
          closeAction();
        })
        .catch((err: any) => {
          const errorMessage = 'Problemas al actualizar al productor.';
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
    [formik]
  );
  const handleOnChangeSelectPhoneInput = useCallback(
    (value: string, name: string) => {
      formik.setFieldValue(value, name);
    },
    [formik]
  );

  return (
    <Dialog
      open={true}
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
            text={'Guardar'}
          />
        </>
      }>
      <Grid container spacing={1}>
        <Grid item={true} xs={12} sm={12} md={6} lg={6} xl={6}>
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
        <Grid item={true} xs={12} sm={12} md={6} lg={6} xl={6}>
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
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <SelectField
            id="phone_carrier"
            name="phone_carrier"
            label="Operador"
            items={itemOperador}
            itemText="description"
            itemValue="name"
            value={formik.values.phone_carrier}
            onChange={handleOnChangeSelectPhoneInput}
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
