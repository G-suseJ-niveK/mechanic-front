import React from 'react';
// material
import { alpha, experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }: any) => ({
  '&:before': {
    top: 0,
    zIndex: 9,
    width: '100%',
    content: '""',
    height: '100%',
    position: 'absolute',
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)', // Fix on Mobile
    backgroundColor: alpha(theme.palette.primary.darker, 0.72)
  }
}));

const InfoStyle = styled('div')(({ theme }: any) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(8)
  }
}));

const CoverImgStyle = styled('img')(() => ({
  zIndex: 8,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
}));

// ----------------------------------------------------------------------

type ProfileCoverProps = { fullName?: string; position?: string; src: any };

export default function ProfileCover({ fullName, position, src }: ProfileCoverProps) {
  return (
    <RootStyle>
      <InfoStyle>
        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: 'common.white',
            textAlign: { xs: 'center', md: 'left' }
          }}>
          <Typography variant="h4">{fullName}</Typography>
          <Typography sx={{ opacity: 0.72 }}>{position}</Typography>
        </Box>
      </InfoStyle>
      <CoverImgStyle alt="profile cover" src={src} />
    </RootStyle>
  );
}
