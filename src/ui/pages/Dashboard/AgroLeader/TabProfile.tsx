import React, { useState, useCallback } from 'react';
import { Typography, Paper, Grid, Stack, Card, Box, Button } from '@material-ui/core';
import { AgroLeader } from '~models/agroLeader';
import { capitalizeAllWords } from '~utils/Word';
import { MAvatar } from '~ui/components/@material-extend';
import { Icon as IconFy } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
import AgroLeaderEdit from './AgroLeaderEditDialog';
import { AxiosResponse } from 'axios';
import { updateAgroLeader } from '~services/agro_leaders';

type TabProfileProps = { agroLeader?: AgroLeader; onHandle?: any };

const TabProfile: React.FC<TabProfileProps> = ({ agroLeader, onHandle }: TabProfileProps) => {
  const [isOpenAgroLeaderDialog, setIsOpenAgroLeaderDialog] = useState(false);

  const handleCloseDialog = useCallback(() => {
    onHandle();
    setIsOpenAgroLeaderDialog((prevValue: boolean) => !prevValue);
  }, [onHandle]);

  const handleSaveDialog = useCallback((data: AgroLeader): Promise<AxiosResponse<any>> => {
    return updateAgroLeader(data.id, data);
  }, []);
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
                {agroLeader?.first_name[0]}
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
                    {capitalizeAllWords((agroLeader?.first_name ?? '') + ' ' + (agroLeader?.last_name ?? ''))}
                  </Typography>

                  <Typography variant="body2" gutterBottom>
                    <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                      Dni: &nbsp;
                    </Typography>
                    {agroLeader?.dni}
                  </Typography>
                </Paper>
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
                      Usuario: &nbsp;
                    </Typography>
                    {agroLeader?.username}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                      Celular: &nbsp;
                    </Typography>
                    {agroLeader?.phone}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                      Whatsapp: &nbsp;
                    </Typography>
                    {agroLeader?.whatsapp_number}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                      Operador: &nbsp;
                    </Typography>
                    {agroLeader?.phone_carrier}
                  </Typography>

                  <Box sx={{ mt: 1 }}>
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
        </Grid>
      </Grid>
      {isOpenAgroLeaderDialog && (
        <AgroLeaderEdit closeAction={handleCloseDialog} saveAction={handleSaveDialog} agroLeader={agroLeader} />
      )}
    </>
  );
};

export default TabProfile;
