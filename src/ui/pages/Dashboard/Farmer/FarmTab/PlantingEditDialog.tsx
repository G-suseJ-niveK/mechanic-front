import React, { useCallback } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '~ui/atoms/Button/Button';
import { AxiosResponse } from 'axios';
import { showMessage } from '~utils/Messages';
import TextField from '~ui/atoms/TextField/TextField';
import SelectField from '~ui/atoms/SelectField/SelectField';
import { PlantingsEdit } from '~models/plantings';
import { SystemTable } from '~models/systemTable';

type PlantingDialogProps = {
  planting: any;
  crops: SystemTable[];
  closeAction(isUpdated?: boolean): void;
  saveAction(data: PlantingsEdit): Promise<AxiosResponse<any>>;
};

const PlantingDialog: React.FC<PlantingDialogProps> = (props: PlantingDialogProps) => {
  const { closeAction, saveAction, planting, crops } = props;
  const itemOperador = [
    { description: 'Convencional', name: 'conventional' },
    { description: 'Orgánico', name: 'organic' }
  ];
  const newPlanting: any = {
    crop_type: planting?.crop_type || undefined,
    crop_id: planting?.crop?.id || undefined,
    commentary: planting?.commentary || undefined
  };

  // validation
  const validationSchema = yup.object().shape({});

  const formik = useFormik({
    initialValues: newPlanting,
    onSubmit: (value: PlantingsEdit) => {
      //Verifica Phone

      const errors: any = {};

      if (Object.keys(errors).length !== 0) {
        formik.setSubmitting(false);
        formik.setErrors(errors);
        return;
      }

      const prevPlanting = Object.assign({}, value);

      saveAction(prevPlanting)
        .then((res: any) => {
          const message = res?.data?.message;
          showMessage('', message, 'success');
          closeAction(true);
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

  const handleOnChangeSelect = useCallback(
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
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <SelectField
            id="crop_id"
            name="crop_id"
            label="Variedad"
            items={crops}
            itemText="description"
            itemValue="id"
            value={formik.values.crop_id}
            onChange={handleOnChangeSelect}
            errors={formik.errors}
            touched={formik.touched}
            disabled={formik.isSubmitting}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <SelectField
            id="crop_type"
            name="crop_type"
            label="Tipo de cultivo"
            items={itemOperador}
            itemText="description"
            itemValue="name"
            value={formik.values.crop_type}
            onChange={handleOnChangeSelect}
            errors={formik.errors}
            touched={formik.touched}
            disabled={formik.isSubmitting}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="commentary"
            name="commentary"
            type="text"
            label="Comentarios"
            value={formik.values.commentary}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default React.memo(PlantingDialog);
