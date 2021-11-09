import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, Box, Divider, Icon, Chip, Card, IconButton, Button } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { capitalizeAllWords } from '~utils/Word';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import { showMessage, showYesNoQuestion } from '~utils/Messages';
import routes from '~routes/routes';
import {
  getCredentialsFileLoadedRecords,
  issuedRecordCredential,
  updateRecordCredential
} from '~services/digital_identity/credential/credential';
import CustomButton from '~ui/atoms/Button/Button';
import EditCredentialRecordDialog from './EditCredentialRecordDialog';

type ShowFiledLoadedComponentProps = {};

const ShowFiledLoadedComponent: React.FC<ShowFiledLoadedComponentProps> = () => {
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const { file_loaded_id } = useParams();
  const [records, setRecords] = useState<any[]>([]);
  const [credentialRecord, setCredentialRecord] = useState<any>({});
  const [recordsIssued, setRecordsIssued] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

  const handleIssuedCredential = useCallback((record: any) => {
    showYesNoQuestion('¿Esta seguro de emitir el certificado?', '', 'warning').then((res: any) => {
      if (res) {
        setRecordsIssued((prev: any[]) => [...prev, record.id]);
        issuedRecordCredential({
          credential_values: record.credential_attributes,
          farmer_id: record.farmer_id,
          credential_id: record.credential_id,
          record_id: record.id,
          record_created_at: parseInt(record?.created_at)
        })
          .then(() => {
            showMessage('', 'Certificado con éxito.', 'success');
            setRecordsIssued((prev: any[]) => prev?.filter((val: any) => val !== record.id));
            setRecords((prevValue: any) => {
              const newValues = prevValue.map((attr: any) => {
                if (attr?.id === record.id) {
                  const newValues: any = Object.assign({}, attr);
                  newValues['status'] = 'issued';
                  return newValues;
                }
                return attr;
              });
              return newValues;
            });
          })
          .catch((err: any) => {
            setRecordsIssued((prev: any[]) => prev?.filter((val: any) => val !== record.id));
            const data = err?.response?.data;
            if (data?.error?.message !== undefined) {
              showMessage('', data?.error?.message, 'error', true);
              return;
            }
            if (data?.message !== undefined) {
              showMessage('', data?.message, 'error', true);
              return;
            }
            showMessage('', 'Problemas al emitir el certificado.', 'error', true);
          });
      }
    });
  }, []);

  const loadCredentialsFilesLoadedRecords = useCallback(() => {
    setIsLoading(true);
    getCredentialsFileLoadedRecords(file_loaded_id)
      .then((res: any) => {
        setRecords(res.data?.data?.Items ?? []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        showMessage('', 'Problemas al cargar los datos.', 'error', true);
        history.push(routes.digitalIdentityCredentialsFiles);
      });
  }, [file_loaded_id, history]);

  useEffect(() => {
    loadCredentialsFilesLoadedRecords();
  }, [loadCredentialsFilesLoadedRecords]);

  const handleOnEditCredentialRecord = useCallback((value: any) => {
    setCredentialRecord(value);
    setIsEditDialogOpen(true);
  }, []);

  const handleOnClose = useCallback(
    (isRefresh: boolean) => {
      setCredentialRecord({});
      setIsEditDialogOpen(false);
      if (isRefresh) {
        loadCredentialsFilesLoadedRecords();
      }
    },
    [loadCredentialsFilesLoadedRecords]
  );

  const handleOnSave = useCallback((id: string, values: any) => {
    return updateRecordCredential(id, values);
  }, []);

  return (
    <>
      <Grid container={true}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box style={{ marginBottom: '20px' }}>
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: '10px',
                  fontSize: '1.7em',
                  fontWeight: 400,
                  color: '#0E4535',
                  marginBottom: '5px'
                }}>
                Resumen de archivos
              </div>
            </Box>
            <Box>
              <Breadcrumbs
                breadcrumbs={[
                  {
                    path: routes.dashboard,
                    component: <Icon fontSize="small">home</Icon>
                  },
                  {
                    path: routes.digitalIdentityCredentialsFiles,
                    component: 'Certificados'
                  },
                  {
                    component: 'Resumen de archivos'
                  }
                ]}
              />
            </Box>
          </Box>
        </Grid>

        <Box mt={1} mb={2}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<RefreshIcon />}
            disabled={isLoading}
            onClick={loadCredentialsFilesLoadedRecords}>
            Actualizar
          </Button>
        </Box>

        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <LinearProgress loading={isLoading} />
          <Grid container spacing={2}>
            {records?.length === 0 ? (
              <>{!isLoading && <Box my={2}>No se encontraron registros</Box>}</>
            ) : (
              records?.map((record: any, index: number) => (
                <Grid item={true} xs={6} sm={6} md={4} lg={4} xl={4} key={`record_${index}`}>
                  <Card>
                    <Box display="flex" p="10px">
                      <Box width="100%">
                        <Box fontWeight="bold" pb="5px" color="#4F4F4F" fontSize="16px">
                          {capitalizeAllWords(record.first_name + ' ' + record.last_name)}
                        </Box>
                        <Box fontWeight="bold" pb="5px" color="#908F8F" fontSize="13px">
                          DNI: {record.dni}
                        </Box>
                      </Box>
                      {record.status === 'error' && (
                        <Box>
                          <IconButton
                            aria-label="save"
                            style={{ margin: '4px' }}
                            onClick={() => handleOnEditCredentialRecord(record)}>
                            <Icon fontSize="small" style={{ color: 'green' }}>
                              edit
                            </Icon>
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                    <Divider style={{ backgroundColor: '#3F860C' }} />
                    <Box p="10px">
                      {Object.keys(record?.credential_attributes)?.map((attr: any, idx: number) => (
                        <Box
                          key={`record_${index}_attrib_${idx}`}
                          fontSize="14px"
                          color="#828282"
                          pt="10px"
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center">
                          <Box px="5px">{attr}</Box>
                          <Box px="5px">{record?.credential_attributes[attr]}</Box>
                        </Box>
                      ))}
                      {record?.status === 'awaits_approval_to_issue' && (
                        <Box display="flex" justifyContent="center" mt={1}>
                          <CustomButton
                            text="Emitir certificado"
                            color="primary"
                            variant="contained"
                            disabled={recordsIssued?.some((val: any) => val === record.id)}
                            isLoading={recordsIssued?.some((val: any) => val === record.id)}
                            onClick={() => handleIssuedCredential(record)}
                          />
                        </Box>
                      )}
                      {record?.status === 'error' && (
                        <Box display="flex" justifyContent="flex-end" mt={1}>
                          <Chip
                            label="Problemas en el certificado"
                            style={{ color: '#FFFFFF', background: '#F68F6E' }}
                          />
                        </Box>
                      )}
                      {record?.status === 'issued' && (
                        <Box display="flex" justifyContent="flex-end" mt={1}>
                          <Chip label="Certificado emitido" style={{ color: '#FFFFFF', background: '#96C262' }} />
                        </Box>
                      )}

                      {record?.status === 'processing' && (
                        <Box display="flex" justifyContent="flex-end" mt={1}>
                          <Chip label="Procesando" style={{ color: '#FFFFFF', background: '#2D9CDB' }} />
                        </Box>
                      )}
                    </Box>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      </Grid>
      {isEditDialogOpen && (
        <EditCredentialRecordDialog
          open={isEditDialogOpen}
          credentialRecord={credentialRecord}
          onClose={handleOnClose}
          onSave={handleOnSave}
        />
      )}
    </>
  );
};

export default ShowFiledLoadedComponent;
