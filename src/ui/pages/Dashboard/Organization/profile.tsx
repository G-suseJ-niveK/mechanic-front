import React, { useState } from 'react';
import { Grid, Tab, Box, Tabs, Icon } from '@material-ui/core';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { makeStyles } from '@material-ui/core/styles';
import InformationTab from './InformationTab';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import routes from '~routes/routes';

type OrganizationProfileProps = {};

const useStyles: any = makeStyles((): any => ({
  wrapper: {
    flexDirection: 'row !important',
    display: 'flex !important',
    alignItems: 'center !important'
  },
  labelIcon: {
    marginRight: '5px',
    marginLeft: '5px'
  }
}));

const OrganizationProfile: React.FC<OrganizationProfileProps> = () => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState<number>(0);

  return (
    <Box>
      <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color="#0E4535">
        Configuración de Organización
      </Box>
      <Box>
        <Breadcrumbs
          breadcrumbs={[
            {
              path: routes.dashboard,
              component: <Icon fontSize="small">home</Icon>
            },
            {
              component: 'Configuración '
            }
          ]}
        />
      </Box>

      <Box mt={3}>
        <Tabs
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={(_e: any, value: any) => setCurrentTab(value)}>
          <Tab
            disableRipple
            label="General"
            icon={<AccountBoxIcon className={classes.labelIcon} />}
            value={0}
            classes={{
              wrapper: classes.wrapper
            }}
          />
        </Tabs>
        {currentTab === 0 && <InformationTab />}
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}></Grid>
      </Grid>
    </Box>
  );
};

export default OrganizationProfile;
