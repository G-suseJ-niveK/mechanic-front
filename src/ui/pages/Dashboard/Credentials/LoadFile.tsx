import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Card, Box, Chip, Icon, Tooltip, Button, Divider } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import DataTable from '~ui/organisms/DataTable/ClientSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import RefreshIcon from '@material-ui/icons/Refresh';
import { capitalizeAllWords } from '~utils/Word';
import { getStatusFarmerFileRecord } from './colorLabelStatus';
import routes from '~routes/routes';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getCredentialsFileLoaded } from '~services/digital_identity/credential/credential';
import { selectCredentialsDefinitions } from '~services/digital_identity/credential/credential';
import { showMessage } from '~utils/Messages';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import DialogLoadFile from './LoadFileDialog';
import * as XLSX from 'xlsx';

const LoadFileComponent: React.FC<{}> = () => {
  const history = useHistory();
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [isDefinitionsLoading, setIsDefinitionsLoading] = useState<boolean>(true);
  const [filesLoaded, setFilesLoaded] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [definitions, setDefinitions] = useState<any[]>([]);
  const [definition, setDefinition] = useState<any>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleViewFileLoaded = useCallback(
    (fileLoaded: any) => {
      history.push(`${routes.digitalIdentityCredentialsFiles}/${fileLoaded.id}`);
    },
    [history]
  );

  const handleLoadFile = useCallback((credential_definition: any) => {
    setDefinition(credential_definition);
    setIsDialogOpen(true);
  }, []);

  const handleOnCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setDefinition(undefined);
  }, []);

  useEffect(() => {
    const _setheaders: any = [
      {
        sorteable: true,
        align: 'left',
        text: 'Subido por',
        value: 'user',
        padding: 'none',
        render: (row: any) => {
          return <div>{capitalizeAllWords(row.user)}</div>;
        }
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Archivo',
        padding: 'none',
        value: 'file_name'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Fecha',
        padding: 'none',
        value: 'created_at',
        render: (row: any) => {
          if (row?.created_at !== undefined) {
            return (
              <Box>
                {format(new Date(parseInt(row?.created_at) * 1000), 'dd MMM yyyy', { locale: es })}
                <Box fontSize="12px" color="#9FA2B4">
                  {format(new Date(parseInt(row?.created_at) * 1000), 'hh:mm aa', { locale: es })}
                </Box>
              </Box>
            );
          }
        }
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Estado',
        padding: 'none',
        value: 'status',
        render: (row: any) => {
          const { labelText, colorText, colorBox } = getStatusFarmerFileRecord(row?.status ?? '');
          return <Chip label={labelText} style={{ background: colorBox, color: colorText }} />;
        }
      },
      {
        sorteable: false,
        align: 'center',
        text: 'Acción',
        value: '',
        render: (row: any) => {
          return (
            <Tooltip title="Ver lista" arrow>
              <Icon onClick={() => handleViewFileLoaded(row)}>arrow_forward_ios</Icon>
            </Tooltip>
          );
        }
      }
    ];
    setHeaders(_setheaders ? _setheaders : []);
  }, [handleViewFileLoaded]);

  useEffect(() => {
    selectCredentialsDefinitions()
      .then((res: any) => {
        setDefinitions(res.data.data);
        setIsDefinitionsLoading(false);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar los certificados disponibles.', 'error', true);
        setIsDefinitionsLoading(false);
      });
  }, []);

  const handleCredentialesFileLoaded = useCallback(() => {
    setIsLoading(true);
    getCredentialsFileLoaded()
      .then((res: any) => {
        const data = res?.data?.data;
        setFilesLoaded(data.Items);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        showMessage('', 'Problemas al cargar la lista de archivos.', 'error', true);
      });
  }, []);

  useEffect(() => {
    handleCredentialesFileLoaded();
  }, [handleCredentialesFileLoaded]);

  const dowloadExcel = useCallback((s: any) => {
    const buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    const view = new Uint8Array(buf); //create uint8array as viewer
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
    return buf;
  }, []);

  const saveAs = useCallback((blob: any, fileName: any) => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }, []);

  const handleDownloadExcel = useCallback(
    (credential_name: string, credential_select: any) => {
      const wb = XLSX.utils.book_new();
      wb.Props = {
        Title: credential_name,
        Subject: ''
      };
      wb.SheetNames.push(credential_name);
      const colsWch: any[] = [];
      const ws_data: any[] = credential_select?.map((value: any) => {
        colsWch.push({ wch: value?.name?.length + 5 });
        return value.name;
      });
      const ws = XLSX.utils.aoa_to_sheet([['Nombres', 'Apellidos', 'DNI', ...ws_data]]);
      ws['!cols'] = [{ wch: 18 }, { wch: 18 }, { wch: 10 }, ...colsWch];
      wb.Sheets[credential_name] = ws;
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
      saveAs(new Blob([dowloadExcel(wbout)], { type: 'application/octet-stream' }), `${credential_name}.xlsx`);
    },
    [dowloadExcel, saveAs]
  );

  return (
    <>
      <Grid container={true} spacing={1}>
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
                Certificados
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
                    component: 'Certificados'
                  }
                ]}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box style={{ backgroundColor: '#FFFFFF' }} color="#0E4535" py={2} pl={1} fontWeight="bold" fontSize="16px">
            Certificados disponibles
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <LinearProgress loading={isDefinitionsLoading} />
          <Box mb={1}>
            <Grid container={true} spacing={2}>
              {definitions?.length > 0 ? (
                definitions?.map((definition: any, index: number) => (
                  <Grid key={`definition_${index}`} item xs={12} sm={4} md={4} lg={3} xl={3}>
                    <Card>
                      <Box p="10px">
                        <Box display="flex" alignItems="center" color="#2F80ED">
                          <Box
                            style={{ textDecoration: 'underline', cursor: 'pointer' }}
                            fontWeight="bold"
                            fontSize="16px"
                            onClick={() => handleDownloadExcel(definition?.name, definition?.credential_attributes)}>
                            {definition?.name}
                          </Box>
                          <CloudDownloadIcon style={{ marginLeft: '8px', marginRight: '8px' }} />
                        </Box>
                        <Box fontWeight="bold" color="#908F8F" fontSize="12px">
                          Versión {definition?.version}
                        </Box>
                      </Box>
                      <Divider style={{ backgroundColor: '#3F860C' }} />
                      <Box px="10px">
                        {/* {JSON.stringify(definition.credential_attributes)} */}
                        {definition?.credential_attributes?.map((attr: any, idx: number) => (
                          <Box key={`definition_${index}_attr_${idx}`} fontSize="14px" color="#828282" pt="10px">
                            {attr.name}
                          </Box>
                        ))}
                      </Box>
                      <Box p="10px" display="flex" justifyContent="center">
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<CloudUploadIcon />}
                          onClick={() => handleLoadFile(definition)}>
                          Subir lista
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))
              ) : (
                <>
                  {!isDefinitionsLoading && (
                    <Box py={1} pl={1} fontSize="14px">
                      No se encontraron certificados disponibles
                    </Box>
                  )}
                </>
              )}
            </Grid>
          </Box>
        </Grid>

        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box style={{ backgroundColor: '#FFFFFF' }} color="#0E4535" py={2} pl={1} fontWeight="bold" fontSize="16px">
            Archivos subidos
          </Box>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <DataTable
            headerActions={
              <Box mr={1}>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<RefreshIcon />}
                  disabled={isLoading}
                  onClick={handleCredentialesFileLoaded}>
                  Actualizar
                </Button>
              </Box>
            }
            headers={headers}
            items={filesLoaded}
            loading={isLoading}
          />
        </Grid>
      </Grid>

      {isDialogOpen && (
        <DialogLoadFile open={isDialogOpen} credentialDefinition={definition} closeAction={handleOnCloseDialog} />
      )}
    </>
  );
};

export default React.memo(LoadFileComponent);
