import React from 'react';
import { Box, Typography } from '@material-ui/core';
import Scrollbar from '~ui/atoms/Scrollbar/Scrollbar';
import NavSection from '~molecules/NavSection/NavSection';
import { MAvatar } from '~ui/components/@material-extend';
import Skeleton from '@material-ui/lab/Skeleton';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import paths from '~routes/paths';

type SideBarContentProps = {
  loadingLogo: boolean;
  classes: any;
  logo: any;
  auth: any;
};

const AccountStyle = styled('div')(({ theme }: any) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[500_12]
}));

const SideBarContent: React.FC<SideBarContentProps> = (props: SideBarContentProps) => {
  const { loadingLogo, classes, logo, auth }: SideBarContentProps = props;
  return (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}>
      <Box sx={{ px: 2.5, py: 3 }}>
        {loadingLogo ? (
          <div className={classes.toolbarIcon}>
            <Skeleton animation="wave" variant="circular" width={70} height={70} />
            <Skeleton animation="wave" variant="text" width="80%" />
            <Skeleton animation="wave" variant="text" width={120} />
          </div>
        ) : (
          <div className={classes.toolbarLogo}>
            <img
              src={logo}
              alt="agros"
              style={{
                height: '80px',
                width: 'auto'
              }}
            />
          </div>
        )}
      </Box>
      <Box>
        <AccountStyle>
          <MAvatar src="user" alt="user" color="primary">
            U
          </MAvatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              {auth?.user?.payload?.name} {auth?.user?.payload?.family_name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Admin
            </Typography>
          </Box>
        </AccountStyle>
      </Box>
      <NavSection navConfig={paths} />
    </Scrollbar>
  );
};

export default React.memo(SideBarContent);
