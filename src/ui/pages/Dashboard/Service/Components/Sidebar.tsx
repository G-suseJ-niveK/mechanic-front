import React, { useState, useEffect, useCallback } from 'react';
// material
import { Box, Drawer, Divider, Chip, Button } from '@material-ui/core';
import Scrollbar from '~ui/atoms/Scrollbar/Scrollbar';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { capitalize } from '~utils/Word';
import { OrganizationService, OrganizationServiceDefault } from '~models/organizationService';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { Icon } from '@iconify/react';
import AddIcon from '@material-ui/icons/Add';
import mailFilled from '@iconify/icons-ant-design/mail-filled';
import arrowIosForwardOutline from '@iconify/icons-eva/arrow-ios-forward-outline';
import { getTextColorForSolicitudeStatus } from '../colorLabelStatus';
// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }: any) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: '5px',
  backgroundColor: theme.palette.background.paper
}));

const Tab = styled('div')(({ theme }: any) => ({
  width: '100%',
  height: '144px',
  cursor: 'pointer',
  display: 'flex',
  padding: '0px 16px',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: '#d8d8d833'
  }
}));

type DataAdditionalSidebarProps = {
  isRefresh: boolean;
  items: OrganizationService[];
  handleChangeTab: (item: OrganizationService) => void;
  handleOnSolicitude: () => void;
};

function DataAdditionalSidebar({ isRefresh, items, handleChangeTab, handleOnSolicitude }: DataAdditionalSidebarProps) {
  const [currentTab, setCurrentTab] = useState<OrganizationService>(OrganizationServiceDefault);

  const handleChange = (item: OrganizationService) => {
    setCurrentTab(item);
    handleChangeTab(item);
  };

  useEffect(() => {
    currentTab.id === '-1' && items.length > 0 && setCurrentTab(items[0]);
    currentTab.id === '-1' && items.length > 0 && handleChangeTab(items[0]);
  }, [items, handleChangeTab, currentTab]);

  useEffect(() => {
    if (items.length !== 0) {
      setCurrentTab(items[0]);
      handleChangeTab(items[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefresh, handleChangeTab]);

  const getStatus = useCallback((status: string) => {
    const { colorText, colorBox } = getTextColorForSolicitudeStatus(status);
    return { borderRadius: '12px', color: colorText, background: colorBox, height: '26px' };
  }, []);

  return (
    <Drawer variant="permanent" PaperProps={{ sx: { width: 280, position: 'relative' } }}>
      <Box sx={{ p: '24px 40px' }} display="flex" alignItems="center" justifyContent="center">
        <Button
          variant="contained"
          onClick={() => {
            handleOnSolicitude();
          }}
          startIcon={<AddIcon />}
          sx={{ width: '100%' }}>
          Nueva solicitud
        </Button>
      </Box>

      <Divider />
      <Scrollbar>
        <TabsWrapperStyle>
          <Box
            height="48px"
            px={3}
            mb={2}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            style={{ background: '#919EAB20' }}>
            <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
              <Box display="flex" alignItems="center" mr={2}>
                <Icon icon={mailFilled} width={20} height={20} />
              </Box>
              <Box fontSize="0.95em" fontWeight={500}>
                Total solicitudes
              </Box>
            </Box>
            <Box
              fontSize="0.95em"
              fontWeight={500}
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center">
              {items?.length}
            </Box>
          </Box>
          {items.map((tab: OrganizationService) => (
            <Tab
              key={tab.id}
              onClick={() => {
                handleChange(tab);
              }}
              style={currentTab.id === tab.id ? { background: '#919EAB24' } : {}}>
              <Box width="90%" display="flex" justifyContent="center" flexDirection="column">
                <Box fontSize="0.95em" fontWeight={500}>
                  {capitalize(tab?.organization_service_type?.description)}
                </Box>
                <Box fontSize="0.7em" color="#656565">
                  {capitalize(tab?.organization_service_category?.description)}
                </Box>
                <Box fontSize="0.7em" color="#656565">
                  {tab?.created_at && format(new Date(tab?.created_at), 'dd MMM yyyy', { locale: es })}
                </Box>
                <Box fontSize="0.7em" color="#656565" mt={2}>
                  <Chip
                    label={capitalize(tab.organization_service_status_issuer?.description)}
                    style={getStatus(tab.organization_service_status_issuer?.name)}
                  />
                </Box>
              </Box>
              <Box width="10%" display="flex" alignItems="center">
                <Icon icon={arrowIosForwardOutline} width={20} height={20} />
              </Box>
            </Tab>
          ))}
        </TabsWrapperStyle>
      </Scrollbar>
    </Drawer>
  );
}

export default React.memo(DataAdditionalSidebar);
