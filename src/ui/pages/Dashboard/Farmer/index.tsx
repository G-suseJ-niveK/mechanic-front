import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Paper, Box, Button, Icon, Tooltip } from '@material-ui/core';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import DataTable from '~ui/organisms/DataTable/ServerSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import { Farmer } from '~models/farmer';
import { paginateFarmers, DeleteFarmer } from '~services/farmer';
import { useHistory } from 'react-router-dom';
import { capitalize } from '~utils/Word';
import { showYesNoQuestion, showMessage } from '~/utils/Messages';
import routes from '~routes/routes';
import AddIcon from '@material-ui/icons/Add';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ActionsMenu from '~ui/molecules/ActionsMenu/actionsMenu';
import { createFarmer } from '~services/farmer';
import FarmerDialog from './FarmerDialog';
import FarmerExcelDialog from './FarmerExcelDialog';
import AdditionalDataExcelDialog from './FarmerExcelAdditionalDataDialog';
import { format, sub } from 'date-fns';
import { formatToTimeZone } from 'date-fns-timezone';
import { es } from 'date-fns/locale';

const defaultFarmer = {
  first_name: '',
  last_name: '',
  dni: '',
  email: '',
  phone: '',
  certificacion_code: '',
  association_code: '',
  birthday_at: '',
  whatsapp_number: '',
  initial_farming_at: '',
  assigned_advisor_id: undefined,
  association_id: undefined,

  assigned_advisor: undefined,
  association: undefined
};

const FarmerComponent = () => {
  const history = useHistory();
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isOpenDialogFile, setIsOpenDialogFile] = useState<boolean>(false);
  const [isOpenDialogFileAdditionalData, setIsOpenDialogFileAdditionalData] = useState<boolean>(false);
  // eslint-disable-next-line
  const [farmer, setFarmer] = useState<Farmer>(defaultFarmer);
  const [isRefresh, setIsRefresh] = useState<boolean>(true);

  const _paginateFarmers = useCallback(
    (page: number, per_page: number, sort_by: string, order: string, search: string) => {
      return paginateFarmers(page, per_page, sort_by, order, search);
    },
    []
  );

  const handleViewFarmer = useCallback(
    (farmer: Farmer) => {
      history.push(`${routes.farmers}/${farmer.id}`);
    },
    [history]
  );

  const handleDeleteFarmer = useCallback(async (farmer: Farmer) => {
    const result: boolean = await showYesNoQuestion(
      '¿Está seguro de eliminar al productor?',
      'Una vez eliminado, no podrá recuperarlo.'
    );
    if (result) {
      if (farmer.id) {
        DeleteFarmer(farmer.id)
          .then((res: any) => {
            const { message } = res.data;
            showMessage('', message, 'success');
            setIsRefresh((prevValue: boolean) => !prevValue);
          })
          .catch(() => {
            showMessage('Problemas al eliminar.', '', 'error', true);
          });
      }
    }
  }, []);

  const handleDialog = useCallback((isUpdateDataTable?: boolean) => {
    setIsOpenDialog((prevValue: boolean) => !prevValue);
    if (typeof isUpdateDataTable !== 'object' && isUpdateDataTable) {
      setIsRefresh((prevValue: boolean) => !prevValue);
    }
  }, []);

  const handleOpenLoadFile = useCallback(() => {
    setIsOpenDialogFile(true);
  }, []);

  const handleOpenLoadFileAdditionalData = useCallback(() => {
    setIsOpenDialogFileAdditionalData(true);
  }, []);

  const handleOnLoadFileAdditionalData = useCallback(() => {
    setIsOpenDialogFileAdditionalData(false);
  }, []);

  const handleOnLoadFile = useCallback(() => {
    setIsOpenDialogFile(false);
  }, []);

  const handleSave = useCallback((farmer: Farmer) => {
    return createFarmer(farmer);
  }, []);

  useEffect(() => {
    const _setheaders: any = [
      {
        sorteable: true,
        align: 'left',
        text: 'Productor',
        value: 'first_name',
        padding: 'none',
        render: (row: Farmer) => {
          return <div>{capitalize(`${row.first_name} ${row.last_name}`)}</div>;
        }
      },
      {
        sorteable: true,
        align: 'left',
        text: 'DNI',
        padding: 'none',
        value: 'dni'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Telefono',
        padding: 'none',
        value: 'phone'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Estado',
        padding: 'none',
        value: 'updated_at',
        render: (row: Farmer) =>
          row?.data_status === 'verified'
            ? 'Activado'
            : row?.data_status === 'unverified'
            ? 'No activado'
            : 'No registrado'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Ultima actualizacion',
        padding: 'none',
        value: 'updated_at',
        render: (row: Farmer) => {
          if (row?.updated_at !== undefined) {
            const updated_at = sub(new Date(row?.updated_at), { hours: 5 });
            return (
              <Box>
                {format(new Date(updated_at), 'dd MMM yyyy', { locale: es })}
                <Box fontSize="12px" color="#9FA2B4">
                  {formatToTimeZone(updated_at, 'hh:mm aa', {
                    timeZone: 'America/Lima'
                  })}
                </Box>
              </Box>
            );
          }
        }
      },
      {
        sorteable: false,
        align: 'center',
        text: 'Acción',
        value: '',
        render: (row: Farmer) => {
          return (
            <Box display="flex" flexDirection="row" justifyContent="space-around">
              <Tooltip title="Ver certificados" arrow style={{ cursor: 'pointer' }}>
                <Icon onClick={() => handleViewFarmer(row)}>visibility</Icon>
              </Tooltip>
              <Tooltip title="Eliminar" arrow style={{ cursor: 'pointer' }}>
                <Icon onClick={() => handleDeleteFarmer(row)}>delete</Icon>
              </Tooltip>
            </Box>
          );
        }
      }
    ];
    setHeaders(_setheaders ? _setheaders : []);
  }, [handleViewFarmer, handleDeleteFarmer]);

  return (
    <>
      <Grid container={true} spacing={1}>
        <Grid
          item={true}
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
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
                Productores
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
                    component: 'Productores'
                  }
                ]}
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="row">
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mr="10px">
              <Button variant="contained" onClick={() => handleDialog()} startIcon={<AddIcon />}>
                Nuevo productor
              </Button>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <ActionsMenu
                icon={
                  <Button
                    variant="contained"
                    style={{ background: '#F2994A' }}
                    startIcon={<ArrowUpwardIcon />}
                    component="span">
                    Subir archivo
                  </Button>
                }
                listItems={[
                  {
                    onClick: () => handleOpenLoadFile(),
                    icon: '',
                    text: 'Lista de productores'
                  },
                  {
                    onClick: () => handleOpenLoadFileAdditionalData(),
                    icon: '',
                    text: 'Información adicional'
                  }
                ]}
              />
            </Box>
          </Box>
        </Grid>

        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper data-testid="Paper" elevation={2} style={{ padding: '20px' }}>
            <DataTable headers={headers} stickyHeader={false} onLoad={_paginateFarmers} refresh={isRefresh} />
          </Paper>
        </Grid>
      </Grid>
      {isOpenDialog && (
        <FarmerDialog open={isOpenDialog} farmer={farmer} closeAction={handleDialog} saveAction={handleSave} />
      )}
      {isOpenDialogFile && <FarmerExcelDialog open={isOpenDialogFile} closeAction={handleOnLoadFile} />}
      {isOpenDialogFileAdditionalData && (
        <AdditionalDataExcelDialog open={isOpenDialogFileAdditionalData} closeAction={handleOnLoadFileAdditionalData} />
      )}
    </>
  );
};

export default React.memo(FarmerComponent);
