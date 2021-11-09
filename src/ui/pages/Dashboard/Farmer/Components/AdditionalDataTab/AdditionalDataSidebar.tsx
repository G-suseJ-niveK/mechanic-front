import React, { useState, useEffect } from 'react';
// material
import { Box, Drawer, Typography, Divider, Chip } from '@material-ui/core';
import Scrollbar from '~ui/atoms/Scrollbar/Scrollbar';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { capitalize } from '~utils/Word';
import { DataAdditionalProducer, DataAdditionalDefault } from '~models/dataAdditionalProducer';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { Icon } from '@iconify/react';
import arrowIosForwardOutline from '@iconify/icons-eva/arrow-ios-forward-outline';
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
  height: '104px',
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
  items: DataAdditionalProducer[];
  handleChangeTab: (item: DataAdditionalProducer) => void;
};

function DataAdditionalSidebar({ items, handleChangeTab }: DataAdditionalSidebarProps) {
  const [currentTab, setCurrentTab] = useState<DataAdditionalProducer>(DataAdditionalDefault);

  const handleChange = (item: DataAdditionalProducer) => {
    setCurrentTab(item);
    handleChangeTab(item);
  };

  useEffect(() => {
    currentTab.id === '-1' && setCurrentTab(items[0]);
    currentTab.id === '-1' && handleChangeTab(items[0]);
  }, [items, handleChangeTab, currentTab]);

  return (
    <Drawer variant="permanent" PaperProps={{ sx: { width: 280, position: 'relative' } }}>
      <Scrollbar>
        <Box sx={{ p: 3 }}>
          <Typography fontSize="1.4em">Archivos</Typography>
        </Box>

        <Divider />

        <TabsWrapperStyle>
          {items.map((tab: DataAdditionalProducer) => (
            <Tab
              key={tab.id}
              onClick={() => {
                handleChange(tab);
              }}
              style={currentTab.id === tab.id ? { background: '#919EAB24' } : {}}>
              <Box width="90%" display="flex" justifyContent="center" flexDirection="column">
                <Box fontSize="0.95em" fontWeight={500}>
                  {capitalize(tab.name)}
                </Box>
                <Box fontSize="0.7em" color="#656565">
                  {tab?.created_at && format(new Date(tab?.created_at), 'dd MMM yyyy', { locale: es })}
                </Box>
                <Box fontSize="0.7em" color="#2196535" mt={1}>
                  <Chip key={capitalize(tab?.category)} color="primary" label={tab?.category} />
                </Box>
              </Box>
              <Box width="10%" display="flex" alignItems="center" mt={1}>
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
