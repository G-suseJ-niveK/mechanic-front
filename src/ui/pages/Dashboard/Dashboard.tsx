import React from 'react';
import Page from '~atoms/Page/Page';
import { Box } from '@material-ui/core';
const CompDashboard = () => {
  return (
    <Page title="Dashboard: App">
      <Box width="100%" height="100%">
        hola
      </Box>
    </Page>
  );
};

export default React.memo(CompDashboard);
