import React from 'react';
import { Grid, Paper, Box, Typography, Avatar, IconButton, Icon, Divider } from '@material-ui/core';
import { Farmer } from '~models/farmer';
import { capitalize } from '~utils/Word';

type InfoGeneralProps = {
  farmer: Farmer;
};

const TabInfoGeneral: React.FC<InfoGeneralProps> = (props: InfoGeneralProps) => {
  const { farmer }: InfoGeneralProps = props;

  return (
    <>
      <Grid container={true}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper data-testid="Paper" elevation={2} style={{ padding: '20px' }}>
            {/* AVATAR */}
            <Box position="relative">
              <Box display="flex" py={2} flexDirection="column" justifyContent="center" alignItems="center">
                <Avatar style={{ width: '50px', height: '50px' }} />
                <Box>
                  <Typography align="center" style={{ fontWeight: 550 }}>
                    {`${farmer?.first_name ?? ''} ${farmer?.last_name ?? ''}`}
                  </Typography>
                  <Typography align="center" style={{ fontSize: '0.9em' }}>
                    {farmer?.birthday_at ?? ''}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* IMFORMACION ADICIONAL DEL USUARIO */}
            <Box my={3}>
              <Grid container direction="row" spacing={5}>
                <MemoAttributesUser nameIcon="phone_android" description="Celular" values={farmer?.phone} />
              </Grid>
            </Box>
            <Divider />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

const CustonAttributesUser = (props: any) => {
  const { nameIcon, description, values } = props;

  return (
    <Grid container alignItems="center" direction="column" style={{ width: '20%' }}>
      <Grid item>
        <IconButton size="small">
          <Icon style={{ color: '#446125' }}>{nameIcon}</Icon>
        </IconButton>
      </Grid>

      <Grid item>
        <Typography align="center" style={{ color: '#b0d189' }}>
          {capitalize(description)}
        </Typography>
        <Typography align="center" style={{ color: '#667356' }}>
          {capitalize(values)}
        </Typography>
      </Grid>
    </Grid>
  );
};

const MemoAttributesUser = React.memo(CustonAttributesUser);

export default TabInfoGeneral;
