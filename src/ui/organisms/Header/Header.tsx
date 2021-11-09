import React, { useState, useCallback, useRef } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Button, Stack } from '@material-ui/core';
import { alpha, experimentalStyled as styled } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import peopleFill from '@iconify/icons-eva/people-fill';
import ReorderIcon from '@material-ui/icons/Reorder';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '~redux-store/actions/authActions';
import { MHidden } from '~ui/components/@material-extend';
import MIconButton from '~ui/components/@material-extend/MIconButton';
import MenuPopover from '~ui/atoms/MenuPopover/MenuPopover';

const DRAWER_WIDTH = 280;
const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }: any) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }: any) => ({
  minHeight: APP_BAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APP_BAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

export type HeaderProps = {
  activeDrawer?: boolean;
  handleActiveDrawer?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children?: React.ReactNode;
};

const CustomHeader: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { handleActiveDrawer }: HeaderProps = props;
  const anchorRef = useRef(null);
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { auth }: any = useSelector((state: any) => state);

  const handleClose = useCallback((): void => {
    setOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleLogOut = useCallback(() => {
    dispatch(logOut());
  }, [dispatch]);

  return (
    <RootStyle>
      <ToolbarStyle>
        <MHidden width="lgUp">
          <Box position="absolute" color="white" top="25%" left={10}>
            <IconButton aria-controls="customized-menu" aria-haspopup="true" onClick={handleActiveDrawer} size="small">
              <ReorderIcon />
            </IconButton>
          </Box>
        </MHidden>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={{ xs: 0.5, sm: 1.5 }}>
          <MIconButton
            ref={anchorRef}
            onClick={handleOpen}
            color={open ? 'primary' : 'default'}
            sx={{
              ...(open && {
                bgcolor: (theme: any) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
              })
            }}>
            <Icon icon={peopleFill} width={20} height={20} />
          </MIconButton>
          <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ width: 220 }}>
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle1" noWrap>
                Usuario
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {auth?.user?.payload.name} {auth?.user?.payload?.family_name}
              </Typography>
            </Box>

            <Box sx={{ p: 2, pt: 1.5 }}>
              <Button fullWidth color="inherit" variant="outlined" onClick={handleLogOut}>
                Cerrar sesión
              </Button>
            </Box>
          </MenuPopover>
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
};

CustomHeader.defaultProps = {
  handleActiveDrawer: () => null
};

export default React.memo(CustomHeader);
