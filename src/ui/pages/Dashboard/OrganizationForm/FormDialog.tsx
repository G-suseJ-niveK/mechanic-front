import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TextField from '~ui/atoms/TextField/TextField';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { OrganizationForm } from '~models/organizationForm';
import { showMessage } from '~utils/Messages';
import Button from '~atoms/Button/Button';
import { Grid, Checkbox, FormControlLabel } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { createOrganizationForm } from '~services/organization/form';
import SelectField from '~ui/atoms/SelectField/SelectField';
import { inputPermiteASCII } from '~utils/inputs';
import routes from '~routes/routes';

type FormDialogProps = {
  onClose(): void;
};

const formTypes: any[] = [
  { name: 'farm', description: 'Información del predio' },
  { name: 'general', description: 'Información general' }
];

const FormDialog: React.FC<FormDialogProps> = (props: FormDialogProps) => {
  const history = useHistory();
  const [isSameName, setIsSameName] = useState<boolean>(true);
  const { onClose } = props;

  const initialValues: OrganizationForm = {
    name: '',
    display_name: '',
    description: '',
    form_type: ''
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required('Campo requerido.'),
    display_name: yup.string().required('Campo requerido.'),
    form_type: yup.string().required('Campo requerido.')
  });

  const handleOnSave = useCallback((value: OrganizationForm) => {
    return createOrganizationForm(value);
  }, []);

  const formik = useFormik({
    initialValues,
    onSubmit: (value: OrganizationForm) => {
      handleOnSave(value)
        .then((res: any) => {
          const { organization_form_id, message } = res?.data?.data;
          showMessage('', message, 'success');
          history.push(`${routes.organizationForm}/${organization_form_id}`);
        })
        .catch((err: any) => {
          const errorMessage = 'Problemas al rechazar el certificado.';
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

  const handleOnChangeFormType = useCallback(
    (name: any, value: any) => {
      formik.setFieldValue(name, value);
    },
    [formik]
  );

  const handleOnChangeTextField = useCallback(
    (event: any) => {
      const { name, value } = event.target;
      formik.setFieldValue(name, value);
      if (isSameName) {
        formik.setFieldValue('name', inputPermiteASCII(value));
      }
    },
    [formik, isSameName]
  );

  const handleOnChangeNameTextField = useCallback(
    (event: any) => {
      const { value } = event.target;
      formik.setFieldValue('name', inputPermiteASCII(value));
    },
    [formik]
  );

  const handleOnChangeSameName = useCallback((_event: any) => {
    setIsSameName((prevValue: boolean) => !prevValue);
  }, []);

  return (
    <Dialog
      open
      title="Crear formulario"
      subtitle=""
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
            id="display_name"
            name="display_name"
            type="text"
            label="Nombre del formulario *"
            value={formik.values.display_name}
            onChange={handleOnChangeTextField}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="name"
            name="name"
            type="text"
            label="Nombre del formulario en excel *"
            value={formik.values.name}
            onChange={handleOnChangeNameTextField}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FormControlLabel
            label="Usar el mismo nombre"
            control={<Checkbox checked={isSameName} />}
            onChange={handleOnChangeSameName}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <SelectField
            id="form_type"
            name="form_type"
            label="Categoría de Formulario *"
            value={formik.values.form_type}
            items={formTypes}
            itemText="description"
            itemValue="name"
            onChange={handleOnChangeFormType}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="description"
            name="description"
            type="text"
            label="Descripción"
            value={formik.values.description}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            rowsMax={4}
            touched={formik.touched}
            multiline
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default FormDialog;
