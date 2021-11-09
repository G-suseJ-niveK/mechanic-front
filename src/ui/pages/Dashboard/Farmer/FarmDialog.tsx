import React, { useCallback } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '~ui/atoms/TextField/TextField';
import Button from '~ui/atoms/Button/Button';
import SelectField from '~ui/atoms/SelectField/SelectField';
import { showMessage } from '~utils/Messages';
import { Zone } from '~models/zone';
import CheckBox from '~ui/atoms/CheckBox/CheckBox';
import { createFarm } from '~services/farm';

type FarmDialogProps = {
  farmer_id: string;
  zones: Zone[];
  onClose(isUpdateTable?: boolean): void;
};

const FarmDialog: React.FC<FarmDialogProps> = (props: FarmDialogProps) => {
  const { farmer_id, zones, onClose } = props;
  const newZones = [{ id: '', description: 'No seleccionar' }, ...zones];

  const initialValues = {
    name: '',
    zone_id: '',
    total_size: 0,
    planting_size: 0,
    is_principal: false
  };

  // validation
  const validationSchema = yup.object().shape({
    name: yup.string().required('Campo requerido.'),
    total_size: yup.number().required('Campo requerido.'),
    planting_size: yup.number().required('Campo requerido.'),
    is_principal: yup.bool(),
    zone_id: yup.string()
  });

  const formik = useFormik({
    initialValues,
    onSubmit: (farm: any) => {
      createFarm({ farmer_id: farmer_id, ...farm })
        .then(() => {
          showMessage('', 'Unidad productiva creada.', 'success');
          onClose(true);
        })
        .catch((err: any) => {
          const errorMessage = 'Problemas al crear la unidad productiva.';
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

  return (
    <Dialog
      open={true}
      title="Registrar unidad productiva"
      subtitle="Para registrar a un unidad productiva ingresa los campos solicitados"
      onClose={() => onClose()}
      actions={
        <>
          <Button onClick={() => onClose()} variant="outlined" disabled={formik.isSubmitting} text="Cancelar" />
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
            id="name"
            name="name"
            type="text"
            label="Nombre de la parcela"
            value={formik.values.name}
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
          <TextField
            id="total_size"
            name="total_size"
            type="number"
            label="Área total (ha)"
            value={formik.values.total_size}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="planting_size"
            name="planting_size"
            type="number"
            label="Área cultivada (ha)"
            value={formik.values.planting_size}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <CheckBox
            id="is_principal"
            name="is_principal"
            label="Es principal"
            checked={formik.values.is_principal}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default FarmDialog;
