import React, { useState, useCallback } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { Box, Button, Grid } from '@material-ui/core';
import ExcelDialog from './FarmerExcelDialog';
import AppAreaInstalled from '~ui/components/dashboard/AppAreaInstalled';

const CompDashboard = () => {
  const [isGrafic, setIsGrafic] = useState<boolean>(false);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [data, setData] = useState<any>({});

  const handleDialog = useCallback(() => {
    setIsOpenDialog((isOpenFarmerDialog: boolean) => !isOpenFarmerDialog);
  }, []);

  return (
    <Box
      width="100%"
      height="100%"
      position="absolute"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      left={0}
      top={0}
      style={{
        backgroundImage: '#fff'
      }}>
      <Grid height="100%" container flexDirection="row" justifyContent="center" alignItems="center">
        <Grid
          height="30%"
          item={true}
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          flexDirection="row"
          justifyContent="center"
          alignItems="center">
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
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
            height="70%"
            container
            spacing={5}
            p={8}
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
              <AppAreaInstalled dataY={data?.amplitud} dataX={data?.tiempo} name="datos" title="Tiempo" />
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
              <AppAreaInstalled
                dataY={data?.amplitud_fft}
                dataX={data?.frecuencia}
                name="Amplitud"
                title="Frecuencia"
              />
            </Grid>
          </Grid>
        )}
      </Grid>
      {isOpenDialog && (
        <ExcelDialog open={isOpenDialog} closeAction={handleDialog} setIsGrafic={setIsGrafic} setDataFile={setData} />
      )}
    </Box>
  );
};

export default React.memo(CompDashboard);
