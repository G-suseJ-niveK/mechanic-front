import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Grid, Box, Button, Typography } from '@material-ui/core';
import Dialog from '~ui/molecules/Dialog/Dialog';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CustomButton from '~ui/atoms/Button/Button';
import { AxiosResponse } from 'axios';
import { showMessage } from '~utils/Messages';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import UploadImage from '~ui/components/@material-extend/UploadImage';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import routes from '~routes/routes';
import SelectField from '~ui/atoms/SelectField/SelectField';
import { SystemTable } from '~models/systemTable';

type FarmMediaComponentProps = {
  open: boolean;
  closeAction: any;
  getFarmMediaTypes: any;
  saveAction(data: any): Promise<AxiosResponse<any>>;
};

const FarmMediaComponent: React.FC<FarmMediaComponentProps> = (props: FarmMediaComponentProps) => {
  const history = useHistory();
  const { open, closeAction, saveAction, getFarmMediaTypes } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isCompMounted = useRef(null);
  const [logoUrl, setLogoURL] = useState<string>('');
  const [newImage, setNewImage] = useState<any>(undefined);
  const [mediaTypes, setMediaTypes] = useState<SystemTable[]>([]);

  // validation
  const validationSchema = yup.object().shape({
    farm_type_media_id: yup.string().required('Campo requerido.').nullable()
  });

  const initialValues = {
    farm_type_media_id: undefined
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values: any) => {
      const errors: any = {};

      if (Object.keys(errors).length !== 0) {
        formik.setSubmitting(false);
        formik.setErrors(errors);

        return;
      }

      const formData = new FormData();
      if (newImage !== undefined) {
        formData.append('image', newImage.file);
        formData.append('image_name', newImage.name);
        formData.append('image_type', newImage.type);
      }
      formData.append('farm_type_media_id', values.farm_type_media_id);
      setIsLoading(true);
      saveAction(formData)
        .then((res: any) => {
          setIsLoading(false);
          setNewImage(undefined);
          formik.setSubmitting(false);
          const data = res?.data?.data;
          if (data?.message !== undefined) {
            showMessage('', data?.message, 'success');
            closeAction(true);
            return;
          }

          showMessage('', 'Imagen subida.', 'success');
          closeAction(true);
        })
        .catch((err: any) => {
          formik.setSubmitting(false);
          setIsLoading(false);
          const data = err?.response?.data;
          if (data?.hasOwnProperty('errors')) {
            const errors = {};
            Object.keys(data?.errors)?.forEach((key: any) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              //@ts-ignore
              errors[key] = data.errors[key] || '';
            });
            formik.setErrors(errors);
          }
          if (data?.error?.message !== undefined) {
            showMessage('', data?.error?.message, 'error', true);
            return;
          }
          if (data?.message !== undefined) {
            showMessage('', data?.message, 'error', true);
            return;
          }
          showMessage('', 'Problemas al Subir la imagen.', 'error', true);
        });
    },
    validationSchema
  });

  const onSubmit = useCallback(async () => {
    await formik.setErrors({});

    formik.handleSubmit();
  }, [formik]);

  const handleDropLogo = useCallback((acceptedFiles: any) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size >= 3000000) {
        showMessage('', 'El archivo es muy pesado.', 'error', true);
        return;
      }
      const newFile = {
        file: file,
        file_name: file.name,
        file_type: file.type
      };

      setNewImage(newFile);
      setLogoURL(URL.createObjectURL(file));
    }
  }, []);

  const handleOnChangeSelect = useCallback(
    (value: string, name: string) => {
      formik.setFieldValue(value, name);
    },
    [formik]
  );

  useEffect(() => {
    getFarmMediaTypes()
      .then(async (res: any) => {
        const data = res?.data?.data;
        await setMediaTypes(data);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar los tipos de media.', 'error', true);
        history.push(routes.farmers);
      });
  }, [history, getFarmMediaTypes]);

  return (
    <Dialog
      open={open}
      title="Elige la iamgen a subir"
      onClose={() => closeAction()}
      actions={
        <>
          <CustomButton onClick={() => closeAction()} variant="outlined" disabled={isLoading} text="Cancelar" />
          <Button
            variant="contained"
            color="primary"
            component="label"
            startIcon={<CloudUploadIcon />}
            onClick={() => onSubmit()}
            disabled={isLoading}>
            Guardar
          </Button>
        </>
      }>
      <Grid container={true} ref={isCompMounted}>
        {!isLoading ? (
          <>
            <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
              <Box display="flex" flexDirection="column" justifyContent="center" height="100% " alignItems="center">
                <UploadImage
                  disabled={formik.isSubmitting}
                  accept="image/*"
                  file={logoUrl}
                  onDrop={handleDropLogo}
                  caption={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary'
                      }}>
                      Formato *.jpeg, *.jpg, *.png
                      <br /> Tamaño máximo 3MB
                    </Typography>
                  }
                />
              </Box>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
              <SelectField
                id="farm_type_media_id"
                name="farm_type_media_id"
                label="Tipo de cultivo"
                items={mediaTypes}
                itemText="description"
                itemValue="id"
                value={formik.values.farm_type_media_id ?? ''}
                onChange={handleOnChangeSelect}
                errors={formik.errors}
                touched={formik.touched}
                disabled={formik.isSubmitting}
              />
            </Grid>
          </>
        ) : (
          <Box p={5} width="100%" display="flex" flexDirection="row" justifyContent="center">
            <Box>
              <LinearProgress loading={true} />
            </Box>
            <Box textAlign="center" pt={1}>
              Cargando archivo
            </Box>
          </Box>
        )}
      </Grid>
    </Dialog>
  );
};

export default FarmMediaComponent;
