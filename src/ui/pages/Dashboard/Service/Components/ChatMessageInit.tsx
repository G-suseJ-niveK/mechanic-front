import React, { useCallback, useRef, useState, useEffect } from 'react';

import { Divider, Box, Grid, Button } from '@material-ui/core';
import Scrollbar from '~ui/atoms/Scrollbar/Scrollbar';
import { Icon } from '@iconify/react';
import UploadIcon from '@iconify/icons-ic/cloud-upload';
import SelectField from '~ui/atoms/SelectField/SelectField';
import TextField from '~ui/atoms/TextField/TextField';
import FileUploaded from './FileUploaded';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { showMessage } from '~utils/Messages';
import { listServiceCategories, listServiceTypes } from '~services/service';
import { OrganizationServiceCreate } from '~models/organizationService';
import { SystemTable } from '~models/systemTable';

type MessageWindowProps = {
  closeAction(isRefresh: boolean): void;
  saveAction(data: any): Promise<any>;
};

function MessageWindow({ closeAction, saveAction }: MessageWindowProps) {
  const [serviceTypes, setServiceTypes] = useState<SystemTable[]>([]);
  const [serviceCategories, setServiceCategories] = useState<SystemTable[]>([]);
  const [currentFiles, setCurrentFiles] = useState<any[]>([]);
  const refInputFile = useRef<HTMLInputElement>(null);

  const newService: OrganizationServiceCreate = {
    organization_service_category_id: '',
    organization_service_type_id: '',
    files: [],
    description: ''
  };

  // validation
  const validationSchema = yup.object().shape({});

  const formik = useFormik({
    initialValues: newService,
    onSubmit: (value: OrganizationServiceCreate) => {
      //Verifica Phone

      const errors: any = {};
      if (formik?.values?.organization_service_category_id === '') {
        errors['organization_service_category_id'] = 'Sin categoria de consulta';
      }
      if (formik?.values?.organization_service_type_id === '') {
        errors['organization_service_type_id'] = 'Sin tipo de consulta';
      }
      if (formik?.values?.description === '') {
        errors['description'] = 'No describio la consulta';
      }

      if (Object.keys(errors).length !== 0) {
        formik.setSubmitting(false);
        formik.setErrors(errors);
        return;
      }

      const prevCreateService = Object.assign({}, value);

      const formData = new FormData();

      formData.append('organization_service_category_id', prevCreateService.organization_service_category_id);
      formData.append('organization_service_type_id', prevCreateService.organization_service_type_id);
      formData.append('description', prevCreateService.description);
      formData.append('files_count', currentFiles.length.toString());
      currentFiles?.forEach((newFile: any) => {
        formData.append('files', newFile.file);
        formData.append('files_names', newFile.file_name);
        formData.append('files_types', newFile.file_type);
      });

      saveAction(formData)
        .then((res: any) => {
          const message = res?.data?.data?.message;
          showMessage('', message, 'success');
          formik.resetForm({});
          setCurrentFiles([]);
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

  const handleOnChange = useCallback(
    (value: string, name: string) => {
      formik.setFieldValue(value, name);
    },
    [formik]
  );

  useEffect(() => {
    listServiceTypes()
      .then((res: any) => {
        const data = res?.data?.data;
        setServiceTypes(data);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar los tipos de servicios', 'error', true);
      });
  }, []);

  useEffect(() => {
    listServiceCategories()
      .then((res: any) => {
        const data = res?.data?.data;
        setServiceCategories(data);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar las categorías de servicios', 'error', true);
      });
  }, []);

  const onSubmit = useCallback(async () => {
    await formik.setErrors({});
    formik.handleSubmit();
  }, [formik]);

  const handleOnRemoveFile = useCallback((index: number) => {
    setCurrentFiles((prevValues: any[]) => {
      const newValues = prevValues.filter((values: any, idx: number) => idx !== index);
      return newValues;
    });
  }, []);

  const handleOnFileName = useCallback((e: any) => {
    const { files } = e.target;
    if (files.length === 1) {
      if (files[0].size >= 25000000) {
        showMessage('', 'El archivo es muy pesado.', 'error', true);
        return;
      }

      const file = {
        file: files[0],
        file_name: files[0].name,
        file_type: files[0].type
      };
      setCurrentFiles((prevValues: any[]) => {
        return [...prevValues, file];
      });

      e.target.value = null;
    }
  }, []);

  const handleOnClickFile = useCallback(() => {
    refInputFile?.current?.click();
  }, []);

  return (
    <Scrollbar sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column', padding: '20px 80px' }}>
        <Grid container spacing={1}>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box textAlign="center" pb={3} px={3}>
              Ingrese los detalles de su consulta para que sea revisada por el especialista
            </Box>
            <Divider />
          </Grid>

          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box fontSize="0.9em" pt={2}>
              Seleccione la categoría de la consulta
            </Box>
            <SelectField
              variant="standard"
              id="organization_service_category_id"
              name="organization_service_category_id"
              label="Categoría de la consulta"
              items={serviceCategories}
              itemText="description"
              itemValue="id"
              value={formik.values.organization_service_category_id}
              onChange={handleOnChange}
              errors={formik.errors}
              touched={formik.touched}
              disabled={formik.isSubmitting}
            />
          </Grid>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box fontSize="0.9em" pt={2}>
              Seleccione el tipo de la consulta
            </Box>
            <SelectField
              id="organization_service_type_id"
              name="organization_service_type_id"
              label="Seleccione el tipo de la consulta"
              items={serviceTypes}
              itemText="description"
              itemValue="id"
              value={formik.values.organization_service_type_id}
              onChange={handleOnChange}
              errors={formik.errors}
              touched={formik.touched}
              disabled={formik.isSubmitting}
            />
          </Grid>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box fontSize="0.9em" pt={2}>
              Describa su consulta
            </Box>
            <TextField
              id="description"
              name="description"
              type="text"
              label="Descripción de la consulta"
              value={formik.values.description}
              onChange={formik.handleChange}
              disabled={formik.isSubmitting}
              errors={formik.errors}
              multiline={true}
              rowsMax={4}
              touched={formik.touched}
            />
          </Grid>

          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box>
              Adjunte la siguiente información para que sea revisada por los asesores: <strong>1.</strong> Estatuto,
              <strong> 2.</strong> Copia literal actualizada, <strong>3.</strong> Copia de Libro de Actas,
              <strong> 4.</strong> Copia de DNI de las personas que ocupan los cargos directivos.
            </Box>
            <Box
              mt={1}
              width="100%"
              height="92px"
              onClick={handleOnClickFile}
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ cursor: 'pointer', backgroundColor: '#F2F2F2' }}>
              <Box>
                <Box display="flex" justifyContent="center">
                  <Icon icon={UploadIcon} width={24} height={24} />
                </Box>
                <Box textAlign="center">Subir archivos</Box>
              </Box>
              <input ref={refInputFile} type="file" hidden onChange={handleOnFileName} />
            </Box>
          </Grid>
          <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
            {currentFiles?.map((currentFile: any, index: number) => {
              return (
                <React.Fragment key={`file_${index}`}>
                  <FileUploaded index={index} file={currentFile} onDelete={handleOnRemoveFile} />
                </React.Fragment>
              );
            })}
          </Grid>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box display="flex" flexDirection="row-reverse" mt={3}>
            <Button
              variant="contained"
              onClick={() => onSubmit()}
              sx={{ width: '200px' }}
              disabled={formik.isSubmitting}>
              Enviar
            </Button>
          </Box>
        </Grid>
      </Box>
    </Scrollbar>
  );
}

export default React.memo(MessageWindow);
