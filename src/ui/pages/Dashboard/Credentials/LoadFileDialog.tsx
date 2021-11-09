import React, { useCallback } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid, Box, Button } from '@material-ui/core';
import { loadCredentialsFile } from '~services/digital_identity/credential/credential';
import CustomButton from '~ui/atoms/Button/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { showMessage } from '~utils/Messages';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import * as XLSX from 'xlsx';
import CredentialAttributeUtils from '~utils/credential/credential_attribute';

type LoadFileDialogProps = {
  open: boolean;
  credentialDefinition: any;
  closeAction(): void;
};

const LoadFileDialog: React.FC<LoadFileDialogProps> = (props: LoadFileDialogProps) => {
  const { open, credentialDefinition, closeAction } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleLoadFile = useCallback(
    (e: any) => {
      e.preventDefault();
      const files = e.target.files,
        f = files[0];
      if (f !== undefined && f !== null) {
        setIsLoading(true);
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
          if (Array.isArray(data) && data.length > 0) {
            // handleSaveFarmers(f?.name, data);
            const credentials: any[] = [];
            const BreakException = {};
            try {
              data?.forEach((val: any) => {
                const auxVal = Object.assign({}, val);
                const currentValues: any = {};
                currentValues['Nombres'] = auxVal['Nombres'];
                currentValues['Apellidos'] = auxVal['Apellidos'];
                currentValues['DNI'] = auxVal['DNI']?.toString();
                delete auxVal['Nombres'];
                delete auxVal['Apellidos'];
                delete auxVal['DNI'];
                const attributes_off = credentialDefinition?.credential_attributes?.filter(
                  (attr: any) => !Object.keys(auxVal).includes(attr?.name)
                );
                // Verifica que los atributos del certificado que no fueron registrados sean registrados vacios
                attributes_off.forEach((attr: any) => {
                  auxVal[attr.name] = '';
                });
                //Se verifican todos los atributos
                let isError = false;
                credentialDefinition?.credential_attributes.forEach((credentialAttrib: any) => {
                  const result = CredentialAttributeUtils.verify_attributes(
                    credentialAttrib,
                    credentialAttrib['name'],
                    auxVal[credentialAttrib['name']]
                  );
                  if (result.validation !== undefined) isError = true;
                });
                if (isError) throw BreakException;
                currentValues['credential_attributes'] = Object.assign({}, auxVal);
                credentials.push(currentValues);
              });
            } catch (error) {
              showMessage(
                '',
                'El archivo cargado no cumple con el certificado, verifique que todos los datos se encuentren bien registrados.',
                'error',
                true
              );
              setIsLoading(false);
              return;
            }
            setIsLoading(false);
            loadCredentialsFile({
              file_name: f.name,
              credential_id: credentialDefinition?.id,
              credential_name: credentialDefinition?.name,
              credential_version: credentialDefinition?.version,
              credential_attributes: credentialDefinition?.credential_attributes,
              credential_count: credentials.length,
              credentials
            })
              .then(() => {
                showMessage('', 'Archivo cargado.', 'success');
                closeAction();
              })
              .catch(() => {
                showMessage('', 'Problemas al cargar el archivo.', 'error', true);
                setIsLoading(false);
              });
            return;
          }
          showMessage('', 'Problemas al cargar el archivo.', 'error', true);
        };
        reader.readAsBinaryString(f);
        e.target.value = '';
      }
    },
    [credentialDefinition, closeAction]
  );

  const getAttributeType = useCallback((attrb: any): string => {
    switch (attrb.attribute_type) {
      case 'boolean':
        return 'Si/No';

      case 'number':
        return 'Número';

      case 'enum':
        return attrb.possible_values.join(' o ');

      case 'date':
        return 'Fecha';

      case 'string':
        return 'Texto';

      default:
        return '';
    }
  }, []);

  return (
    <Dialog
      open={open}
      title="Elige el archivo a subir"
      subtitle="Por favor suba el archivo en formato excel"
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
      <Grid container={true}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          {!isLoading ? (
            <>
              <Box fontWeight="bold" fontSize="16px">
                Certificado: {credentialDefinition?.name}
              </Box>
              <Box fontWeight="bold" fontSize="14px" py="5px">
                Datos del productor
              </Box>
              <Box> Nombres</Box>
              <Box>Apellidos</Box>
              <Box>DNI</Box>
              <Box fontWeight="bold" fontSize="14px" py="5px">
                Datos del certificado
              </Box>
              {credentialDefinition?.credential_attributes?.map((attr: any, idx: number) => (
                <>
                  <Box key={`definition_attr_${idx}`}>
                    {attr.required === true && <> *</>}
                    {attr.name} -{getAttributeType(attr)}
                  </Box>
                </>
              ))}
              <Box fontSize="12px" pt="15px" color="#828282">
                Nota: El archivo debe tener todos los atributos
              </Box>
            </>
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

export default React.memo(LoadFileDialog);
