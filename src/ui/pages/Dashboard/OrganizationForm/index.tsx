import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Paper, Box, Icon, Stack, IconButton, Tooltip } from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import DataTable from '~ui/organisms/DataTable/ClientSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import { listOrganizationForm, deleteOrganizationForm } from '~services/organization/form';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import EmptyFormImg from '~ui/assets/img/empty_form.png';
import { useHistory } from 'react-router-dom';
import { showDeleteQuestion, showMessage } from '~utils/Messages';
import Button from '~atoms/Button/Button';
import FormDialog from './FormDialog';
import routes from '~routes/routes';
import { es } from 'date-fns/locale';
import { format, sub } from 'date-fns';
import { formatToTimeZone } from 'date-fns-timezone';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';

type FormComponentProps = {};

const ProductImgStyle = styled('img')(() => ({
  top: 0,
  width: 'auto',
  height: 'auto',
  objectFit: 'cover'
}));

const FormComponent: React.FC<FormComponentProps> = () => {
  const history = useHistory();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [items, setItems] = useState<any[]>([]);

  const handleOnDialog = useCallback(() => {
    setIsDialogOpen((prevValue: boolean) => !prevValue);
  }, []);

  const handleEditOrganizationForm = useCallback(
    (row: any) => {
      history.push(`${routes.organizationForm}/${row.id}`);
    },
    [history]
  );

  const listAllOrganizationForm = useCallback(() => {
    listOrganizationForm()
      .then((res: any) => {
        setItems(res.data.data);
        setIsLoading(false);
      })
      .catch((err: any) => {
        setIsLoading(false);
        const errorMessage = 'Problemas al cargar los formularios.';
        const data = err?.response?.data;
        if (data?.hasOwnProperty('error')) {
          showMessage('', data?.error?.message ?? errorMessage, 'error', true);
        } else {
          showMessage('', errorMessage, 'error', true);
        }
      });
  }, []);
  const handleRemoveOrganizationForm = useCallback(
    (row: any) => {
      showDeleteQuestion('ADVERTENCIA', 'Está seguro de eliminar el formulario').then((response: any) => {
        if (response) {
          deleteOrganizationForm(row.id)
            .then(() => {
              showMessage('', 'Formulario eliminado.', 'success');
              listAllOrganizationForm();
            })
            .catch(() => {
              showMessage('', 'Problemas al eliminar el Formulario.', 'error', true);
            });
        }
      });
    },
    [listAllOrganizationForm]
  );

  const handleViewDataOrganizationForm = useCallback(
    (row: any) => {
      history.push(`${routes.organizationForm}/${row.id}/data`);
    },
    [history]
  );

  useEffect(() => {
    const _setheaders: any = [
      {
        sorteable: true,
        align: 'left',
        text: 'Nombre del formulario',
        value: 'display_name',
        padding: 'none'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Nombre del formulario en excel',
        value: 'name',
        padding: 'none'
      },
      {
        sorteable: true,
        align: 'left',
        text: 'Descripción',
        value: 'description',
        padding: 'none'
      },

      {
        sorteable: true,
        align: 'left',
        text: 'Fecha de creación',
        value: 'created_at',
        padding: 'none',
        render: (row: any) => {
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
        sorteable: true,
        align: 'left',
        text: 'Última fecha de actualización',
        value: 'updated_at',
        padding: 'none',
        render: (row: any) => {
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
        render: (row: any) => {
          return (
            <Box display="flex">
              <Tooltip title="Editar">
                <IconButton onClick={() => handleEditOrganizationForm(row)} component="span" size="small">
                  <Icon sx={{ color: '#2D9CDB' }}>edit</Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Respuestas">
                <IconButton onClick={() => handleViewDataOrganizationForm(row)} component="span" size="small">
                  <Icon sx={{ color: '#67AE1C' }}>visibility</Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton onClick={() => handleRemoveOrganizationForm(row)} component="span" size="small">
                  <Icon sx={{ color: '#EB5757' }}>delete</Icon>
                </IconButton>
              </Tooltip>
            </Box>
          );
        }
      }
    ];
    setHeaders(_setheaders);
  }, [handleEditOrganizationForm, handleViewDataOrganizationForm, handleRemoveOrganizationForm]);

  useEffect(() => {
    listAllOrganizationForm();
  }, [listAllOrganizationForm]);

  return (
    <>
      <Grid container={true} spacing={1}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box mb="20px">
            <Grid container>
              <Grid item={true} xs={12} sm={12} md={12} lg={6} xl={6}>
                <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color="#0E4535">
                  Formularios
                </Box>
                <Box>
                  <Breadcrumbs
                    breadcrumbs={[
                      {
                        path: routes.dashboard,
                        component: <Icon fontSize="small">home</Icon>
                      },
                      {
                        component: 'Formularios '
                      }
                    ]}
                  />
                </Box>
              </Grid>

              <Grid
                item={true}
                xs={12}
                sm={12}
                md={12}
                lg={6}
                xl={6}
                sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Box>
                  <Button
                    text="Crear Formulario"
                    variant="contained"
                    onClick={handleOnDialog}
                    startIcon={<Icon>add</Icon>}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          {isLoading ? (
            <LinearProgress loading={true} />
          ) : items.length === 0 ? (
            <Stack direction="column" justifyContent="center" alignItems="center" spacing={3}>
              <Box fontWeight={700} fontSize="1.1rem">
                Aún no tiene creado sus formularios
              </Box>
              <Box>
                <ProductImgStyle alt="formularios" src={EmptyFormImg} />
              </Box>
              <Button text="Crear Formulario" variant="contained" onClick={handleOnDialog} />
            </Stack>
          ) : (
            <Paper data-testid="Paper" elevation={3} style={{ padding: '20px' }}>
              <DataTable headers={headers} items={items} />
            </Paper>
          )}
        </Grid>
      </Grid>
      {isDialogOpen && <FormDialog onClose={handleOnDialog} />}
    </>
  );
};

export default FormComponent;
