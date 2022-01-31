import React, { useState, useCallback, useRef } from 'react';
import { Grid, Box, Button } from '@material-ui/core';
import Dialog from '~ui/molecules/Dialog/Dialog';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CustomButton from '~ui/atoms/Button/Button';
import { getFourier } from '~services/fourier';
import { showMessage } from '~utils/Messages';
import * as XLSX from 'xlsx';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import TextField from '~ui/atoms/TextField/TextField';
import * as yup from 'yup';
import { useFormik } from 'formik';

type AdditionalDataExcelComponentProps = {
  open: boolean;
  closeAction: any;
  setIsGrafic: any;
  setDataFile: any;
};

const AdditionalDataExcelComponent: React.FC<AdditionalDataExcelComponentProps> = (
  props: AdditionalDataExcelComponentProps
) => {
  const { open, closeAction, setIsGrafic, setDataFile } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(undefined);
  const [fileName, setFileName] = useState<any>(undefined);

  const isCompMounted = useRef(null);

  const newFourrier = {
    time: '',
    count: ''
  };

  // validation
  const validationSchema = yup.object().shape({
    time: yup.string().required('Campo requerido.'),
    count: yup.string().required('Campo requerido.')
  });

  const formik = useFormik({
    initialValues: newFourrier,
    onSubmit: (dataNumber: any) => {
      //Verifica Phone

      const errors: any = {};

      if (Object.keys(errors).length !== 0) {
        formik.setSubmitting(false);
        formik.setErrors(errors);
        return;
      }

      const prevFourier = Object.assign({}, dataNumber);

      getFourier({ ...prevFourier, data })
        .then((res: any) => {
          if (isCompMounted.current) {
            const dataFile = res.data.data;
            setDataFile(dataFile);
            setIsLoading(false);
            setIsGrafic(true);
            closeAction();
            showMessage(
              '',
              `Se ha subido el documento con éxito, por favor revisa el archivo pendiente para editar los datos erróneos.`,
              'success',
              false
            );
          }
        })
        .catch((err: any) => {
          if (isCompMounted.current) {
            setIsLoading(false);
            const errorMessage = 'Problemas al registrar a los productores.';
            setIsLoading(false);
            const data = err?.response?.data;
            if (data?.hasOwnProperty('error')) {
              showMessage('', data?.error?.message ?? errorMessage, 'error', true);
              return;
            } else if (data?.hasOwnProperty('errors')) {
              showMessage('', `${errorMessage}\n\nVerifique que el archivo tenga el atributo "DNI"`, 'error', true);
              return;
            }
            showMessage('', errorMessage, 'error', true);
          }
        });
    },
    validationSchema
  });

  const handleSaveFarmers = useCallback((FileName: string, datos: any[]) => {
    setData(datos);
    setFileName(FileName);
    setIsLoading(false);
  }, []);

  const onSubmit = useCallback(async () => {
    await formik.setErrors({});
    formik.handleSubmit();
  }, [formik]);

  const handleLoadFile = useCallback(
    (e: any) => {
      setIsLoading(true);
      e.preventDefault();
      const files = e.target.files,
        f = files[0];
      if (f !== undefined && f !== null) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          /* Parse data */
          const bstr = e?.target?.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_json(ws);
          if (Array.isArray(data) && data.length > 0) {
            handleSaveFarmers(f?.name, data);
            return;
          }
          showMessage('', 'Problemas al cargar el archivo', 'error', true);
        };
        reader.readAsBinaryString(f);
        e.target.value = '';
      }
    },
    [handleSaveFarmers]
  );

  return (
    <Dialog
      open={open}
      title="Elige el archivo a subir"
      subtitle="Por favor suba el archivo en formato  XLS"
      onClose={() => 0}
      actions={
        <>
          <CustomButton
            onClick={() => closeAction()}
            variant="outlined"
            sx={{ background: 'red', color: '#fff' }}
            disabled={isLoading}
            text="Cancelar"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSubmit()}
            component="label"
            style={{ background: 'green' }}
            disabled={isLoading}>
            Transformar
          </Button>
        </>
      }>
      <Grid container={true} ref={isCompMounted}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          {!isLoading ? (
            <Box>
              <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                  id="time"
                  name="time"
                  type="number"
                  label="Tiempo que duro los datos"
                  value={formik.values.time}
                  onChange={formik.handleChange}
                  disabled={formik.isSubmitting}
                  errors={formik.errors}
                  touched={formik.touched}
                />
              </Grid>
              <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginBottom: '30px' }}>
                <TextField
                  id="count"
                  name="count"
                  type="number"
                  label="Cantidad de datos"
                  value={formik.values.count}
                  onChange={formik.handleChange}
                  disabled={formik.isSubmitting}
                  errors={formik.errors}
                  touched={formik.touched}
                />
              </Grid>
              <Box color="#4F4F4F" display="flex" flexDirection="column" justifyContent="center" mb={3}>
                <Box color="#4F4F4F" display="flex" justifyContent="center" mb={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    style={{ background: 'green' }}
                    disabled={isLoading}>
                    Cargar excel
                    <input type="file" accept=".xlsx,.xls" hidden onChange={handleLoadFile} />
                  </Button>
                </Box>
                <Box fontSize="0.8em" display="flex" justifyContent="center">
                  {fileName && fileName}
                </Box>
              </Box>
              <Box>
                <br />
                &nbsp; Recuerda, el archivo tiene que tener estas columnas:
                <br />
                <br />
                &nbsp; - VALOR: columna que tine los datos a transformar
              </Box>
            </Box>
          ) : (
            <Box p={5}>
              <Box>
                <LinearProgress loading={true} />
              </Box>
              <Box textAlign="center" pt={1}>
                Cargando archivo
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default AdditionalDataExcelComponent;
