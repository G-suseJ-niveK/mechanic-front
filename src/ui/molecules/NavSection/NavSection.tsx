import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import { alpha, useTheme, experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, List, ListItem, Collapse, ListItemText, ListItemIcon, ListSubheader, BoxProps } from '@material-ui/core';
import MaterialIcon from '@material-ui/core/Icon';
// theme
import typography from '~theme/typography';

// ----------------------------------------------------------------------

const ListSubheaderStyle = styled((props: any) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }: any) => ({
    ...typography.overline,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(5),
    color: theme.palette.text.primary
  })
);

const ListItemStyle = styled(ListItem)(({ theme }: any) => ({
  ...typography.body2,
  height: 48,
  position: 'relative',
  textTransform: 'capitalize',
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(2.5),
  color: theme.palette.text.secondary,
  '&:before': {
    top: 0,
    right: 0,
    width: 3,
    bottom: 0,
    content: '""',
    display: 'none',
    position: 'absolute',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: theme.palette.primary.main
  }
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

// ----------------------------------------------------------------------

type NavItemProps = {
  title: string;
  path: string;
  icon?: string;
  info?: JSX.Element;
  children?: {
    title: string;
    path: string;
  }[];
};

function NavItem({ item }: { item: NavItemProps }) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const { title, path, icon, info, children } = item;
  const isActiveRoot = path ? !!matchPath(path, { path: pathname, exact: true, strict: true }) : false;

  const [open, setOpen] = useState(isActiveRoot);

  const handleOpen = () => {
    setOpen(!open);
  };

  const activeRootStyle = {
    color: 'primary.main',
    fontWeight: 'fontWeightMedium',
    bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    '&:before': { display: 'block' }
  };

  const activeSubStyle = {
    color: 'text.primary',
    fontWeight: 'fontWeightMedium'
  };

  if (children) {
    return (
      <>
        <ListItemStyle
          button
          disableGutters
          onClick={handleOpen}
          sx={{
            ...(isActiveRoot && activeRootStyle)
          }}
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          component={RouterLink}
          to={path}>
          <ListItemIconStyle>{<MaterialIcon>{icon}</MaterialIcon>}</ListItemIconStyle>
          <ListItemText disableTypography primary={title} />
          {info && info}
          <Box
            component={Icon}
            icon={open ? arrowIosDownwardFill : arrowIosForwardFill}
            sx={{ width: 16, height: 16, ml: 1 }}
          />
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((item: any) => {
              const { title, path } = item;
              const isActiveSub = path ? !!matchPath(path, { path: pathname, exact: true, strict: true }) : false;

              return (
                <ListItemStyle
                  button
                  disableGutters
                  key={title}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                  // @ts-ignore
                  component={RouterLink}
                  to={path}
                  sx={{
                    ...(isActiveSub && activeSubStyle)
                  }}>
                  <ListItemIconStyle>
                    <Box
                      component="span"
                      sx={{
                        width: 4,
                        height: 4,
                        display: 'flex',
                        borderRadius: '50%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'text.disabled',
                        transition: (theme: any) => theme.transitions.create('transform'),
                        ...(isActiveSub && {
                          transform: 'scale(2)',
                          bgcolor: 'primary.main'
                        })
                      }}
                    />
                  </ListItemIconStyle>
                  <ListItemText disableTypography primary={title} />
                </ListItemStyle>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <ListItemStyle
      button
      disableGutters
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      component={RouterLink}
      to={path}
      sx={{
        ...(isActiveRoot && activeRootStyle)
      }}>
      <ListItemIconStyle>{<MaterialIcon>{icon}</MaterialIcon>}</ListItemIconStyle>
      <ListItemText disableTypography primary={item.title} />
      {info && info}
    </ListItemStyle>
  );
}

type NavSectionProps = {
  navConfig: {
    subheader: string;
    items: NavItemProps[];
  }[];
} & BoxProps;

export default function NavSection({ navConfig, ...other }: NavSectionProps) {
  return (
    <Box {...other}>
      {navConfig.map((list: any, index: number) => {
        const { subheader, items } = list;
        return (
          <List key={`list_${subheader}_${index}`} disablePadding>
            <ListSubheaderStyle>{subheader}</ListSubheaderStyle>
            {items.map((item: NavItemProps, idx: number) => (
              <NavItem key={`nav_item_${item.title}_${idx}`} item={item} />
            ))}
          </List>
        );
      })}
    </Box>
  );
}
