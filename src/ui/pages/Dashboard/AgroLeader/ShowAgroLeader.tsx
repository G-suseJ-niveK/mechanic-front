import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Container, Card, Icon, Box, Tabs, Tab } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import routes from '~routes/routes';
import { capitalize } from '~utils/Word';
import { AgroLeader } from '~models/agroLeader';
import { showMessage } from '~utils/Messages';
import { capitalizeAllWords } from '~utils/Word';
import { getAgroLeader } from '~services/agro_leaders';
import { selectFarmer } from '~services/farmer';
import TabProducer from './TabProducer';
import TabProfile from './TabProfile';
import Page from '~ui/atoms/Page/Page';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import ProfileCover from '~ui/molecules/ProfileCover/ProfileCover';

import cover from '~assets/img/farmer_banner.png';

const TabsWrapperStyle = styled('div')(({ theme }: any) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center'
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3)
  }
}));

const useStyles = makeStyles(() => ({
  root: {
    padding: '10px'
  },
  media: {
    height: 140
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '10px',
    fontSize: '1.7em',
    fontWeight: 500,
    color: '#212B36'
  }
}));
type ShowAgroLeaderComponentProps = {};

const ShowAgroLeaderComponent: React.FC<ShowAgroLeaderComponentProps> = () => {
  const history = useHistory();
  const classes = useStyles();
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const { agro_leader_id } = useParams();

  const [agroLeader, setAgroLeader] = useState<AgroLeader | undefined>(undefined);
  const [currentTab, setCurrentTab] = useState('Perfil');

  if (!agro_leader_id) history.push(routes.agroLeader);

  const agroLeaderId: string = agro_leader_id !== undefined ? agro_leader_id : '';

  const handleChangeTab = (newValue: string) => {
    setCurrentTab(newValue);
  };

  const _getAgroLeader = useCallback(() => {
    getAgroLeader(agroLeaderId)
      .then((res: any) => {
        setAgroLeader(res.data.data);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar los datos del productor.', 'error', true);
        history.push(routes.farmers);
      });
  }, [agroLeaderId, history]);

  useEffect(() => {
    _getAgroLeader();
  }, [_getAgroLeader]);

  useEffect(() => {
    selectFarmer();
  }, []);

  const PROFILE_TABS = [
    {
      value: 'Perfil',
      icon: (
        <Box width={20} height={20}>
          <Icon>account_box</Icon>
        </Box>
      ),
      component: <TabProfile agroLeader={agroLeader} onHandle={_getAgroLeader} />
    },
    {
      value: 'Productores asignados',
      icon: (
        <Box width={20} height={20}>
          <Icon>map</Icon>
        </Box>
      ),
      component: <TabProducer agroLeaderId={agroLeaderId} />
    }
  ];

  return (
    <Page title="Promotores de Identidad">
      <Container>
        <Typography className={classes.title} style={{ marginBottom: '15px' }}>
          Promotores de Identidad
        </Typography>
        <Box mb="25px">
          <Breadcrumbs
            breadcrumbs={[
              {
                path: '/dashboard',
                component: <Icon fontSize="small">home</Icon>
              },
              {
                path: '/dashboard/farm_agent',
                component: 'Promotores de Identidad'
              },
              {
                component: capitalizeAllWords((agroLeader?.first_name ?? '') + ' ' + (agroLeader?.last_name ?? ''))
              }
            ]}
          />
        </Box>

        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative'
          }}>
          <ProfileCover
            fullName={capitalizeAllWords((agroLeader?.first_name ?? '') + ' ' + (agroLeader?.last_name ?? ''))}
            position="Promotores de Identidad"
            src={cover}
          />
          <TabsWrapperStyle>
            <Tabs
              value={currentTab}
              scrollButtons="auto"
              variant="scrollable"
              allowScrollButtonsMobile
              onChange={(e: any, value: any) => handleChangeTab(value)}>
              {PROFILE_TABS.map((tab: any) => (
                <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={capitalize(tab.value)} />
              ))}
            </Tabs>
          </TabsWrapperStyle>
        </Card>

        {PROFILE_TABS.map((tab: any) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
};

export default ShowAgroLeaderComponent;
