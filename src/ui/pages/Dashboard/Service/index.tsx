import React, { useState, useEffect, useCallback } from 'react';
import routes from '~routes/routes';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import { Card, Grid, Box, Icon } from '@material-ui/core';
import { showMessage } from '~utils/Messages';
import { OrganizationService, OrganizationServiceDefault } from '~models/organizationService';
import { Sidebar, Content } from './Components';
import { listServices, listServiceInteractionsByServiceId } from '~services/service';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';

const MoreServices = () => {
  const [isOpenSolicitude, setIsOpenSolicitude] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefresh, setIsRefresh] = useState<boolean>(true);

  const [organizationServices, setOrganizationServices] = useState<OrganizationService[]>([]);
  const [organizationService, setOrganizationService] = useState<OrganizationService>(OrganizationServiceDefault);

  const handleChangeTab = useCallback((item: OrganizationService) => {
    setOrganizationService(item);
    setIsOpenSolicitude(false);
  }, []);

  const handleRefreshInteraction = useCallback((serviceId: string) => {
    setIsLoading(true);
    listServiceInteractionsByServiceId(serviceId)
      .then((res: any) => {
        setIsLoading(false);
        const data = res?.data?.data;
        setOrganizationServices((prevValues: OrganizationService[]) => {
          const newValues = prevValues?.map((element: OrganizationService) => {
            if (element?.id === serviceId) {
              const newElement = Object.assign({}, element);
              newElement.organization_service_interactions = data;
              setOrganizationService(newElement);
              return newElement;
            }
            return element;
          });
          return newValues;
        });
      })
      .catch(() => {
        setIsLoading(false);
        showMessage('', 'Problemas al cargar los mensajes', 'error', true);
      });
  }, []);

  const handleOnSolicitude = () => {
    setIsOpenSolicitude(true);
  };

  const loadOrganizationServices = useCallback(() => {
    setIsLoading(true);
    listServices()
      .then((res: any) => {
        const data = res?.data?.data;
        setOrganizationServices(data);
        setIsLoading(false);
        setIsOpenSolicitude(false);
        setIsRefresh((prevValue: boolean) => !prevValue);
        if (data.length !== 0) {
          setOrganizationService(data[0]);
        }
      })
      .catch(() => {
        setIsLoading(false);
        showMessage('', 'Problemas al cargar los tipos de servicios', 'error', true);
      });
  }, []);

  useEffect(() => {
    listServices()
      .then((res: any) => {
        const data = res?.data?.data;
        setOrganizationServices(data);
        setIsLoading(false);
        setIsOpenSolicitude(false);
      })
      .catch(() => {
        setIsLoading(false);
        showMessage('', 'Problemas al cargar los tipos de servicios', 'error', true);
      });
  }, []);

  return (
    <Grid container={true} spacing={1} flexDirection="row" justifyContent="center">
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
              Mis Asesorías
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
                  component: 'Mis Asesorías'
                }
              ]}
            />
          </Box>
        </Box>
      </Grid>
      <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={10}>
        <Box px={2}>
          <LinearProgress loading={isLoading} />
        </Box>
        <Card sx={{ height: { md: '73vh' }, display: 'flex' }}>
          <Sidebar
            isRefresh={isRefresh}
            items={organizationServices}
            handleChangeTab={handleChangeTab}
            handleOnSolicitude={handleOnSolicitude}
          />
          <Content
            item={organizationService}
            isOpenSolicitude={isOpenSolicitude}
            handleRefreshInteraction={handleRefreshInteraction}
            handleRefreshServices={loadOrganizationServices}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default React.memo(MoreServices);
