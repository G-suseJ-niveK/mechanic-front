import React, { useState, useCallback } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { Box, Button, Grid } from '@material-ui/core';
import ExcelDialog from './FarmerExcelDialog';

const CompDashboard = () => {
  const [isGrafic, setIsGrafic] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const handleDialog = useCallback(() => {
    setIsOpenDialog((isOpenFarmerDialog: boolean) => !isOpenFarmerDialog);
  }, []);

  return (
    <Box
      width="100%"
      height="100%"
      position="absolute"
      left={0}
      top={0}
      style={{
        backgroundImage:
          'radial-gradient(circle at 44.29% -15.29%, #00ffff 0, #00f6ff 25%, #09b8ff 50%, #2c7eb0 75%, #284d6b 100%)'
      }}>
      <Grid height="100%" container flexDirection="row" justifyContent="center" alignItems="center">
        <Grid
          item={true}
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          flexDirection="row"
          justifyContent="center"
          alignItems="center">
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Button
              variant="contained"
              onClick={() => handleDialog()}
              startIcon={<AddIcon />}
              style={{
                background: '#F4BC2C',
                color: 'black'
              }}>
              Subir datos
            </Button>
          </Box>
        </Grid>
        {isGrafic && (
          <Grid
            height="100%"
            container
            item
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}>
            <Grid
              item={true}
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              flexDirection="row"
              justifyContent="center"
              alignItems="center">
              Grafica
            </Grid>
            <Grid
              item={true}
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              flexDirection="row"
              justifyContent="center"
              alignItems="center">
              Grafica
            </Grid>
          </Grid>
        )}
      </Grid>
      {isOpenDialog && <ExcelDialog open={isOpenDialog} closeAction={handleDialog} />}
    </Box>
  );
};

export default React.memo(CompDashboard);
