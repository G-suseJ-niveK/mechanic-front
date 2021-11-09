import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Paper, Box, Button, Icon, Tooltip } from '@material-ui/core';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import DataTable from '~ui/organisms/DataTable/ServerSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import { showYesNoQuestion, showMessage } from '~/utils/Messages';
import { useHistory } from 'react-router-dom';
import { capitalizeAllWords } from '~utils/Word';
import routes from '~routes/routes';
import AddIcon from '@material-ui/icons/Add';
import AgroLeaderDialog from './AgroLeaderDialog';
import { AgroLeader } from '~models/agroLeader';
import { createAgroLeader, paginateAgroLeaders, updateAgroLeader, deleteAgroLeader } from '~services/agro_leaders';
import { AxiosResponse } from 'axios';
import { Zone } from '~models/zone';
import { selectZones } from '~services/zone';

type AgroLeadersComponentProps = {};

const AgroLeadersComponent: React.FC<AgroLeadersComponentProps> = () => {
  const history = useHistory();
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [agroLeader, setAgroLeader] = useState<AgroLeader | undefined>(undefined);

  // const [agroLeader, setAgroLeader] = useState<AgroLeader | undefined>(undefined);
  const [zones, setZones] = useState<Zone[]>([]);
  const [isRefresh, setIsRefresh] = useState<boolean>(true);

  const _paginateAgroLeaders = useCallback(
    (page: number, per_page: number, sort_by: string, order: string, search: string) => {
      return paginateAgroLeaders(page, per_page, sort_by, order, search);
    },
    []
  );
  const handleViewAgroLeader = useCallback(
    (leader: AgroLeader) => {
      history.push(`${routes.agroLeader}/${leader.id}`);
    },
    [history]
  );

  const handleDeleteLeader = useCallback(async (leader: AgroLeader) => {
    const result: boolean = await showYesNoQuestion(
      '¿Está seguro de eliminar al promotor?',
      'Una vez eliminado, no podrá recuperarlo.'
    );
    if (result) {
      if (leader.id) {
        deleteAgroLeader(leader.id)
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

  // const handleEditAgroLeader = useCallback((leader: AgroLeader) => {
  //   setAgroLeader(leader);
  //   setIsOpenDialog(true);
  // }, []);

  const handleCloseAction = useCallback((isUpdateDataTable?: boolean) => {
    setIsOpenDialog((open: boolean) => !open);
    if (typeof isUpdateDataTable !== 'object' && isUpdateDataTable) {
      setIsRefresh((prevValue: boolean) => !prevValue);
    }
    setAgroLeader(undefined);
  }, []);

  const handleSaveAction = useCallback((data: AgroLeader): Promise<AxiosResponse<any>> => {
    if (data?.id !== undefined) {
      return updateAgroLeader(data.id, data);
    }
    return createAgroLeader(data);
  }, []);

  useEffect(() => {
    const _setheaders: any = [
      {
        sorteable: true,
        align: 'left',
        text: 'Agente de campo',
        value: 'first_name',
        padding: 'none',
        render: (row: AgroLeader) => {
          return <div>{capitalizeAllWords(`${row.first_name} ${row.last_name}`)}</div>;
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
        text: 'Teléfono',
        padding: 'none',
        value: 'phone'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Usuario',
        padding: 'none',
        value: 'username'
      },
      {
        sorteable: false,
        align: 'center',
        text: 'Acción',
        value: '',
        render: (row: AgroLeader) => {
          return (
            <Box display="flex" flexDirection="row" justifyContent="space-around">
              <Tooltip title="Ver promotor" arrow style={{ cursor: 'pointer' }}>
                <Icon onClick={() => handleViewAgroLeader(row)}>visibility</Icon>
              </Tooltip>
              <Tooltip title="Eliminar" arrow style={{ cursor: 'pointer' }}>
                <Icon onClick={() => handleDeleteLeader(row)}>delete</Icon>
              </Tooltip>
            </Box>
          );
        }
      }
    ];
    setHeaders(_setheaders ? _setheaders : []);
  }, [handleViewAgroLeader, handleDeleteLeader]);

  useEffect(() => {
    selectZones().then((res: any) => {
      setZones(res.data.data);
    });
  }, []);

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
                Promotores de identidad
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
                    component: 'Promotores de identidad'
                  }
                ]}
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Button variant="contained" onClick={() => handleCloseAction()} startIcon={<AddIcon />}>
              Nuevo promotor
            </Button>
          </Box>
        </Grid>

        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper elevation={2} style={{ padding: '20px' }}>
            <DataTable headers={headers} stickyHeader={false} onLoad={_paginateAgroLeaders} refresh={isRefresh} />
          </Paper>
        </Grid>
      </Grid>
      {isOpenDialog && (
        <AgroLeaderDialog
          zones={zones}
          closeAction={handleCloseAction}
          saveAction={handleSaveAction}
          agroLeader={agroLeader}
        />
      )}
    </>
  );
};

export default AgroLeadersComponent;
