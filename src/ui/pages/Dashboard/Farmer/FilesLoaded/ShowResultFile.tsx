import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Box, Paper, IconButton, Icon, Chip, Tooltip } from '@material-ui/core';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import { useParams, useHistory } from 'react-router-dom';
import routes from '~routes/routes';
import DataTable from '~ui/organisms/DataTable/ClientSide/DataTable';
import { loadAllFarmersRecords } from '~services/farmer';
import { showMessage } from '~utils/Messages';
import { getStatusFarmerFileRecord } from '../colorLabelStatus';
import { getErrorMessageFileRecord } from './LabelErrorsMessages';
import TextField from '~ui/atoms/TextField/TextField';
import DialogRecord from './DialogRecord';

type ShowResultFileComponentProps = {};

const ShowResultFileComponent: React.FC<ShowResultFileComponentProps> = () => {
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const { file_loaded_id } = useParams();
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [records, setRecords] = useState<any[]>([]);
  const [record, setRecord] = useState<any>(undefined);

  const handleOnChange = useCallback((id: string, name: string, value: string) => {
    setRecords((prevValue: any[]) => {
      const newValues = prevValue.map((attribute: any) => {
        if (attribute?.id === id) {
          const newValues: any = Object.assign({}, attribute);
          newValues[name] = value;
          return newValues;
        }
        return attribute;
      });
      return newValues;
    });
  }, []);

  const handleOnEdit = useCallback((id: string, isActive: boolean) => {
    setRecords((prevValue: any[]) => {
      const newValues = prevValue.map((attribute: any) => {
        if (attribute?.id === id) {
          let newValues: any = Object.assign({}, attribute);
          if (isActive) {
            delete newValues['oldValues'];
            newValues['oldValues'] = Object.assign({}, newValues);
            newValues['isEdit'] = isActive;
          } else {
            newValues = Object.assign({}, newValues['oldValues']);
            newValues['isEdit'] = isActive;
            delete newValues['oldValues'];
            delete newValues['no_mames'];
          }
          return newValues;
        }
        return attribute;
      });
      return newValues;
    });
  }, []);

  const handleOnSave = useCallback((record: any) => {
    setIsDialogOpen(true);
    setRecord(record);
  }, []);

  const handleOnSaveDialog = useCallback((record: any) => {
    setIsDialogOpen(false);
    setRecord(undefined);
    setRecords((prevValue: any[]) => {
      const newValues = prevValue.map((attribute: any) => {
        if (attribute?.id === record?.id) {
          const newValues: any = Object.assign({}, attribute);
          delete newValues['oldValues'];
          newValues['isEdit'] = false;
          newValues['status'] = 'processing';
          newValues['error_message'] = '';
          return newValues;
        }
        return attribute;
      });
      return newValues;
    });
  }, []);

  const handleOnCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setRecord(undefined);
  }, []);

  useEffect(() => {
    const _setheaders: any = [
      {
        sorteable: true,
        align: 'left',
        text: 'Nombres',
        value: 'first_name',
        padding: 'none',
        render: (row: any) => {
          if (row?.isEdit === true)
            return (
              <TextField
                id="first_name"
                name="first_name"
                label=""
                value={row.first_name}
                autoComplete="off"
                onChange={(e: any) => handleOnChange(row?.id, e.target.name, e.target.value)}
              />
            );
          return (
            <Box display="flex" alignItems="center">
              <Box whiteSpace="nowrap">{row?.first_name}</Box>
              {['error', 'name_not_found_in_dni', 'name_last_name_dni_not_found'].some(
                (val: string) => val === row?.error_message
              ) && (
                <Tooltip title={getErrorMessageFileRecord(row?.error_message)} arrow>
                  <Icon style={{ color: '#BBBBBB' }}>error_outline</Icon>
                </Tooltip>
              )}
            </Box>
          );
        }
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Apellidos',
        padding: 'none',
        value: 'last_name',
        render: (row: any) => {
          if (row?.isEdit === true)
            return (
              <TextField
                id="last_name"
                name="last_name"
                label=""
                value={row.last_name}
                autoComplete="off"
                onChange={(e: any) => handleOnChange(row?.id, e.target.name, e.target.value)}
              />
            );
          return (
            <Box display="flex" alignItems="center">
              <Box whiteSpace="nowrap">{row?.last_name}</Box>
              {['error', 'last_name_not_found_in_dni', 'name_last_name_dni_not_found'].some(
                (val: string) => val === row?.error_message
              ) && (
                <Tooltip title={getErrorMessageFileRecord(row?.error_message)} arrow>
                  <Icon style={{ color: '#BBBBBB' }}>error_outline</Icon>
                </Tooltip>
              )}
            </Box>
          );
        }
      },
      {
        sorteable: true,
        align: 'left',
        text: 'DNI',
        padding: 'none',
        value: 'dni',
        render: (row: any) => {
          if (row?.isEdit === true)
            return (
              <TextField
                id="dni"
                name="dni"
                label=""
                value={row.dni}
                autoComplete="off"
                onChange={(e: any) => handleOnChange(row?.id, e.target.name, e.target.value)}
              />
            );
          return (
            <Box display="flex" alignItems="center">
              <Box whiteSpace="nowrap">{row?.dni}</Box>
              {['error', 'dni_not_found', 'name_last_name_dni_not_found', 'dni_already_registered'].some(
                (val: string) => val === row?.error_message
              ) && (
                <Tooltip title={getErrorMessageFileRecord(row?.error_message)} arrow>
                  <Icon style={{ color: '#BBBBBB' }}>error_outline</Icon>
                </Tooltip>
              )}
            </Box>
          );
        }
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Celular',
        padding: 'none',
        value: 'phone',
        render: (row: any) => {
          if (row?.isEdit === true)
            return (
              <TextField
                id="phone"
                name="phone"
                label=""
                value={row.phone ?? ''}
                autoComplete="off"
                onChange={(e: any) => handleOnChange(row?.id, e.target.name, e.target.value)}
              />
            );
          return (
            <Box display="flex" alignItems="center">
              <Box whiteSpace="nowrap">{row?.phone}</Box>
              {['error', 'phone_already_registered', 'phone_not_have_9_digits', 'not_have_contact_media'].some(
                (val: string) => val === row?.error_message
              ) && (
                <Tooltip title={getErrorMessageFileRecord(row?.error_message)} arrow>
                  <Icon style={{ color: '#BBBBBB' }}>error_outline</Icon>
                </Tooltip>
              )}
            </Box>
          );
        }
      },
      {
        sorteable: true,
        align: 'left',
        text: 'WhatsApp',
        padding: 'none',
        value: 'whatsapp_number',
        render: (row: any) => {
          if (row?.isEdit === true)
            return (
              <TextField
                id="whatsapp_number"
                name="whatsapp_number"
                label=""
                value={row.whatsapp_number ?? ''}
                autoComplete="off"
                onChange={(e: any) => handleOnChange(row?.id, e.target.name, e.target.value)}
              />
            );
          return (
            <Box display="flex" alignItems="center">
              <Box whiteSpace="nowrap">{row?.whatsapp_number}</Box>
              {['error', 'whatsapp_already_registered', 'whatsapp_not_have_9_digits', 'not_have_contact_media'].some(
                (val: string) => val === row?.error_message
              ) && (
                <Tooltip title={getErrorMessageFileRecord(row?.error_message)} arrow>
                  <Icon style={{ color: '#BBBBBB' }}>error_outline</Icon>
                </Tooltip>
              )}
            </Box>
          );
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
        text: 'Acciones',
        value: '',
        render: (row: any) => {
          if (row?.status !== 'error') return <></>;
          if (row?.attempts > 2) return <></>;
          if (row?.isEdit === false || row?.isEdit === undefined)
            return (
              <IconButton aria-label="save" style={{ margin: '4px' }} onClick={() => handleOnEdit(row?.id, true)}>
                <Icon fontSize="small" style={{ color: 'green' }}>
                  edit
                </Icon>
              </IconButton>
            );
          return (
            <Box display="flex" justifyContent="center" alignItems="center">
              <Box display="flex" justifyContent="center" alignItems="center">
                <IconButton aria-label="save" style={{ margin: '4px' }} onClick={() => handleOnSave(row)}>
                  <Icon fontSize="small" style={{ color: 'blue' }}>
                    save
                  </Icon>
                </IconButton>
              </Box>
              <IconButton aria-label="cancel" style={{ margin: '4px' }} onClick={() => handleOnEdit(row?.id, false)}>
                <Icon fontSize="small" style={{ color: 'red' }}>
                  close
                </Icon>
              </IconButton>
            </Box>
          );
        }
      }
    ];
    setHeaders(_setheaders ? _setheaders : []);
  }, [handleOnChange, handleOnEdit, handleOnSave]);

  useEffect(() => {
    loadAllFarmersRecords(file_loaded_id)
      .then((res: any) => {
        setRecords(res.data?.data?.Items ?? []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        showMessage('', 'Problemas al cargar los datos del productor.', 'error', true);

        history.push(routes.farmersFileListLoaded);
      });
  }, [file_loaded_id, history]);

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
                    path: routes.farmers,
                    component: 'Productores'
                  },
                  {
                    path: routes.farmersFileListLoaded,
                    component: 'Resumen de archivos'
                  }
                ]}
              />
            </Box>
          </Box>
        </Grid>

        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper data-testid="Paper" elevation={2} style={{ padding: '20px' }}>
            <Grid container={true}>
              <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                <DataTable headers={headers} items={records} loading={isLoading} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      {isDialogOpen && (
        <DialogRecord
          open={isDialogOpen}
          record={record}
          saveAction={handleOnSaveDialog}
          closeAction={handleOnCloseDialog}
        />
      )}
    </>
  );
};

export default ShowResultFileComponent;
