import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Paper, Box, Chip, Icon, Tooltip } from '@material-ui/core';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import DataTable from '~ui/organisms/DataTable/ClientSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import { useHistory } from 'react-router-dom';
import { capitalizeAllWords } from '~utils/Word';
import routes from '~routes/routes';
import { getStatusFarmerFileRecord } from '../colorLabelStatus';
import { listAllFarmersFilesLoaded } from '~services/farmer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import RemoveRedEyeOutlinedIcon from '@material-ui/icons/RemoveRedEyeOutlined';

const FarmerComponent = () => {
  const history = useHistory();
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [filesLoaded, setFilesLoaded] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleViewFileLoaded = useCallback(
    (fileLoaded: any) => {
      history.push(`${routes.farmersFileListLoaded}/${fileLoaded.id}`);
    },
    [history]
  );

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
              <RemoveRedEyeOutlinedIcon onClick={() => handleViewFileLoaded(row)} />
            </Tooltip>
          );
        }
      }
    ];
    setHeaders(_setheaders ? _setheaders : []);
  }, [handleViewFileLoaded]);

  useEffect(() => {
    listAllFarmersFilesLoaded()
      .then((res: any) => {
        setFilesLoaded(res?.data?.data?.Items ?? []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box style={{ marginBottom: '20px' }}>
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <Box color="#0E4535" mb="5px" mr="10px" fontSize="1.7em" fontWeight={400}>
                Resumen de archivos
              </Box>
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
                    component: 'Resumen de archivos'
                  }
                ]}
              />
            </Box>
          </Box>
        </Grid>

        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper data-testid="Paper" elevation={2} style={{ padding: '20px' }}>
            <DataTable headers={headers} items={filesLoaded} loading={isLoading} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default React.memo(FarmerComponent);
