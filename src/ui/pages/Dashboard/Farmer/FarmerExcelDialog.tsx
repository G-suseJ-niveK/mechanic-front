import React, { useState, useCallback, useRef } from 'react';
import { Grid, Box, Button } from '@material-ui/core';
import Dialog from '~ui/molecules/Dialog/Dialog';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CustomButton from '~ui/atoms/Button/Button';
import { loadFarmers } from '~services/farmer';
import { showMessage } from '~utils/Messages';
import * as XLSX from 'xlsx';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';

type FarmerExcelComponentProps = {
  open: boolean;
  closeAction: any;
};

const FarmerExcelComponent: React.FC<FarmerExcelComponentProps> = (props: FarmerExcelComponentProps) => {
  const { open, closeAction } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isCompMounted = useRef(null);

  const handleSaveFarmers = useCallback(
    (fileName: string, farmers: any[]) => {
      setIsLoading(true);
      loadFarmers({ fileName, farmers })
        .then(() => {
          if (isCompMounted.current) {
            setIsLoading(false);
            closeAction();
            showMessage(
              '',
              `Se ha subido el documento ${fileName} con éxito, por favor revisa el archivo pendiente para editar los datos erróneos.`,
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
              showMessage(
                '',
                `${errorMessage}\n\nVerifique que el archivo tenga sólo los atributos "Nombres"
                "Apellidos" "DNI" "Celular" "WhatsApp", WhatsApp no es obligatorio pero si los demas campos.`,
                'error',
                true
              );
              return;
            }
            showMessage('', errorMessage, 'error', true);
          }
        });
    },
    [closeAction]
  );

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
          const data = XLSX.utils.sheet_to_json(ws, { raw: false });
          // let isHaveErrors = false;
          try {
            const BreakException = {};
            data.forEach((value: any) => {
              const dataKeys = Object.keys(value);
              if (!(dataKeys.includes('DNI') && dataKeys.includes('Nombres') && dataKeys.includes('Apellidos'))) {
                throw BreakException;
              }
            });
          } catch (error) {
            showMessage('', 'Problemas al cargar el archivo. Verifique que tenga todos los atributos', 'error', true);
            setIsLoading(false);
            return;
          }

          if (Array.isArray(data) && data.length > 0) {
            handleSaveFarmers(f?.name, data);
            return;
          }
          setIsLoading(false);
          showMessage('', 'Problemas al cargar el archivo. Verifique se tengan registros.', 'error', true);
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
          <CustomButton onClick={() => closeAction()} variant="outlined" disabled={isLoading} text="Cancelar" />
          <Button
            variant="contained"
            color="primary"
            component="label"
            startIcon={<CloudUploadIcon />}
            disabled={isLoading}>
            cargar excel
            <input type="file" accept=".xlsx,.xls" hidden onChange={handleLoadFile} />
          </Button>
        </>
      }>
      <Grid container={true} ref={isCompMounted}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          {!isLoading ? (
            <Box color="#4F4F4F" display="flex" justifyContent="center">
              Recuerda, el archivo tiene que tener estas características:
              <br />
              &nbsp; - Nombres del productor
              <br />
              &nbsp; - Apellidos del productor
              <br />
              &nbsp; - DNI: Número de 8 dígitos
              <br />
              &nbsp; - Celular: Número de 9 dígitos
              <br />
              &nbsp; - Whatsapp: Número de 9 dígitos
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

export default FarmerExcelComponent;