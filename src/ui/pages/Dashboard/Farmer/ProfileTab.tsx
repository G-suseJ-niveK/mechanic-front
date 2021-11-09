import React, { useState, useCallback } from 'react';
import { Typography, Paper, Grid, Stack, Card, Box, Button } from '@material-ui/core';
import { Farmer, FarmerDefault } from '~models/farmer';
import { capitalizeAllWords } from '~utils/Word';
import { MAvatar } from '~ui/components/@material-extend';
import routes from '~routes/routes';
import { Icon as IconFy } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
import SaveFill from '@iconify/icons-eva/save-outline';
import { AxiosResponse } from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import FarmerEditDialog from './FarmerEditDialog';
import { updateFarmer } from '~services/farmer';
import FarmerLocationDialog from './FarmerLocationDialog';

type TabProfileProps = { farmer?: Farmer; onHandle?: any; onCreateFarm(): void };

const TabProfile: React.FC<TabProfileProps> = ({ farmer, onHandle, onCreateFarm }: TabProfileProps) => {
  const history = useHistory();

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const { farmer_id } = useParams();
  if (!farmer_id) history.push(routes.farmers);
  const farmerId: string = farmer_id !== undefined ? farmer_id : '';

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isOpenDialogLocation, setIsOpenDialogLocation] = useState(false);

  const handleCloseDialog = useCallback(() => {
    onHandle();
    setIsOpenDialog((prevValue: boolean) => !prevValue);
  }, [onHandle]);

  const handleCloseDialogLocation = useCallback(
    (isRefresh?: boolean) => {
      setIsOpenDialogLocation((prevValue: boolean) => !prevValue);
      if (isRefresh !== undefined && isRefresh) {
        onHandle();
      }
    },
    [onHandle]
  );

  const handleSaveDialog = useCallback(
    (data: Farmer): Promise<AxiosResponse<any>> => {
      return updateFarmer(farmerId, data);
    },
    [farmerId]
  );
  return (
    <>
      <Grid container spacing={3} direction="row" alignItems="stretch">
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center', height: '100% ' }}>
            <Box display="flex" flexDirection="row" justifyContent="center" height="100% " alignItems="center">
              <MAvatar
                src="user"
                alt="user"
                color="primary"
                style={{ width: '128px', height: '128px', fontSize: '2.5em' }}>
                {farmer?.first_name[0]}
              </MAvatar>
            </Box>
          </Card>
        </Grid>
        <Grid container item xs={12} md={8} spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} alignItems="flex-start">
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                  Información Personal
                </Typography>
                <Paper
                  key="info_personal"
                  sx={{
                    p: 3,
                    width: 1,
                    bgcolor: 'background.neutral'
                  }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {capitalizeAllWords((farmer?.first_name ?? '') + ' ' + (farmer?.last_name ?? ''))}
                  </Typography>

                  <Typography variant="body2" gutterBottom>
                    <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                      Dni: &nbsp;
                    </Typography>
                    {farmer?.dni}
                  </Typography>
                </Paper>
                <Button
                  startIcon={<IconFy icon={SaveFill} />}
                  onClick={() => {
                    onCreateFarm();
                  }}>
                  Crear parcela
                </Button>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} alignItems="flex-start">
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                  Información de comunicación
                </Typography>
                <Paper
                  key="info_pcommunication"
                  sx={{
                    p: 3,
                    width: 1,
                    bgcolor: 'background.neutral'
                  }}>
                  <Typography variant="body2" gutterBottom>
                    <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                      Celular: &nbsp;
                    </Typography>
                    {farmer?.phone}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                      Whatsapp: &nbsp;
                    </Typography>
                    {farmer?.whatsapp_number}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                      Operador: &nbsp;
                    </Typography>
                    {farmer?.phone_carrier}
                  </Typography>

                  <Box sx={{ mt: 1 }}>
                    {/* eslint-disable-next-line @typescript-eslint/no-empty-function*/}
                    <Button
                      startIcon={<IconFy icon={editFill} />}
                      onClick={() => {
                        handleCloseDialog();
                      }}>
                      Edit
                    </Button>
                  </Box>
                </Paper>
              </Stack>
            </Card>
          </Grid>

          {/* LOCATION */}
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} alignItems="flex-start">
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                  Información de Ubicación
                </Typography>
                <Paper
                  key="info_ubicacion"
                  sx={{
                    p: 3,
                    width: 1,
                    bgcolor: 'background.neutral'
                  }}>
                  <Typography variant="body2" gutterBottom>
                    <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                      Distrito: &nbsp;
                    </Typography>
                    {farmer?.district?.description ?? ''}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                      Caserio: &nbsp;
                    </Typography>
                    {farmer?.hamlet}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                      Referencia: &nbsp;
                    </Typography>
                    {farmer?.reference}
                  </Typography>

                  <Box sx={{ mt: 1 }}>
                    <Button
                      startIcon={<IconFy icon={editFill} />}
                      onClick={() => {
                        handleCloseDialogLocation();
                      }}>
                      Edit
                    </Button>
                  </Box>
                </Paper>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      {isOpenDialog && (
        <FarmerEditDialog
          closeAction={handleCloseDialog}
          saveAction={handleSaveDialog}
          farmer={farmer ?? FarmerDefault}
        />
      )}
      {isOpenDialogLocation && (
        <FarmerLocationDialog closeAction={handleCloseDialogLocation} saveAction={handleSaveDialog} farmer={farmer} />
      )}
    </>
  );
};

export default TabProfile;
