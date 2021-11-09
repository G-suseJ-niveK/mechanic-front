import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
import mapIcon from '@iconify/icons-ic/map';
import homeFilled from '@iconify/icons-ant-design/home-filled';
import fileFilled from '@iconify/icons-ant-design/file-filled';
import roundCategory from '@iconify/icons-ic/round-category';
import { useParams, useHistory } from 'react-router-dom';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import Page from '~ui/atoms/Page/Page';
import routes from '~routes/routes';
import { Typography, Box, Tab, Card, Tabs, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getFarmer } from '~services/farmer';
import { Farmer } from '~models/farmer';
import { showMessage } from '~utils/Messages';
import { capitalizeAllWords, capitalize } from '~utils/Word';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import Farm from './FarmTab';
import Profile from './ProfileTab';
import Form from './FormTab';
import AdditionalData from './AdditionalDataTab';
import ProfileCover from '~ui/molecules/ProfileCover/ProfileCover';
import ActionsMenu from '~ui/pages/Dashboard/Farmer/Components/FarmTab/ActionsMenu';
import { getFarmsFromFarmer } from '~services/farmer';
import { Zone } from '~models/zone';
import { selectZones } from '~services/zone';
import FarmDialog from './FarmDialog';

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

type ShowTeleAssistanceProps = {};

const ShowTeleAssistance: React.FC<ShowTeleAssistanceProps> = () => {
  const {
    auth: { organizationTheme }
  }: any = useSelector((state: any) => state);
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const { farmer_id } = useParams();
  const [farmer, setFarmer] = useState<Farmer | undefined>(undefined);
  const [isOpenFarmDialog, setIsOpenFarmDialog] = useState<boolean>(false);
  const [zones, setZones] = useState<Zone[]>([]);

  const [currentTab, setCurrentTab] = useState('Perfil');

  if (!farmer_id) history.push(routes.farmers);

  const farmerId: string = farmer_id !== undefined ? farmer_id : '';
  const classes = useStyles();
  const [farms, setFarms] = useState<any[]>([]);
  const [farm, setFarm] = useState<any>({});

  const handleChangeTab = (newValue: string) => {
    setCurrentTab(newValue);
  };

  const _getFarmer = useCallback(() => {
    getFarmer(farmerId)
      .then((res: any) => {
        setFarmer(res.data.data);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar los datos del productor.', 'error', true);
        history.push(routes.farmers);
      });
  }, [farmerId, history]);

  const _getFarmByFarmer = useCallback(() => {
    getFarmsFromFarmer(farmerId)
      .then((res: any) => {
        const data = res?.data?.data;
        setFarms(data?.items);
        setFarm((prevValue: any) => {
          if (prevValue?.id !== undefined) {
            const currentFarm = data?.items?.find((item: any) => item.id === prevValue.id);
            return currentFarm;
          }
          return {};
        });
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar los datos del productor.', 'error', true);
        history.push(routes.farmers);
      });
  }, [farmerId, history]);

  useEffect(() => {
    _getFarmByFarmer();
  }, [_getFarmByFarmer]);

  useEffect(() => {
    _getFarmer();
  }, [_getFarmer]);

  useEffect(() => {
    selectZones().then((res: any) => {
      setZones(res.data.data);
    });
  }, []);

  const handleOnFormDialog = useCallback(
    (isUpdated?: boolean) => {
      if (isUpdated !== undefined && isUpdated) {
        _getFarmByFarmer();
      }
      setIsOpenFarmDialog((prevValue: boolean) => !prevValue);
    },
    [_getFarmByFarmer]
  );

  const PROFILE_TABS = [
    {
      value: 'Perfil',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <Profile farmer={farmer} onHandle={_getFarmer} onCreateFarm={handleOnFormDialog} />
    },
    {
      value: 'Unidades productivas',
      icon: <Icon icon={mapIcon} width={20} height={20} />,
      component: <Farm farm={farm} onHandle={_getFarmByFarmer} />,
      render_icon: (value: string) => {
        return (
          <ActionsMenu
            farms={farms}
            setFarm={setFarm}
            value={value}
            handleChangeTab={handleChangeTab}
            currentTab={currentTab}
          />
        );
      }
    },
    {
      value: 'Formularios',
      icon: <Icon icon={fileFilled} width={20} height={20} />,
      component: <Form />
    },
    {
      value: 'Datos adicionales',
      icon: <Icon icon={roundCategory} width={20} height={20} />,
      component: <AdditionalData />
    }
  ];

  return (
    <Page title="Productores">
      <Container>
        <Typography className={classes.title} style={{ marginBottom: '15px' }}>
          Productores
        </Typography>
        <Box mb="25px">
          <Breadcrumbs
            breadcrumbs={[
              {
                path: '/dashboard',
                component: <Icon icon={homeFilled} width={20} height={20} />
              },
              {
                path: '/dashboard/farmers',
                component: 'Productores'
              },
              {
                component: capitalizeAllWords((farmer?.first_name ?? '') + ' ' + (farmer?.last_name ?? ''))
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
            fullName={capitalizeAllWords((farmer?.first_name ?? '') + ' ' + (farmer?.last_name ?? ''))}
            position="Productor"
            src={organizationTheme.farmers_profile_path_logo}
          />
          <TabsWrapperStyle>
            <Tabs
              value={currentTab}
              scrollButtons="auto"
              variant="scrollable"
              allowScrollButtonsMobile
              onChange={(e: any, value: any) => handleChangeTab(value)}>
              {PROFILE_TABS.map((tab: any) =>
                tab?.render_icon ? (
                  tab?.render_icon(tab.value)
                ) : (
                  <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={capitalize(tab.value)} />
                )
              )}
            </Tabs>
          </TabsWrapperStyle>
        </Card>

        {PROFILE_TABS.map((tab: any) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
      {isOpenFarmDialog && <FarmDialog farmer_id={farmerId} zones={zones} onClose={handleOnFormDialog} />}
    </Page>
  );
};

export default React.memo(ShowTeleAssistance);
