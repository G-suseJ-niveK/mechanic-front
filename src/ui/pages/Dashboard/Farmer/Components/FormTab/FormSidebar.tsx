import React, { useState, useEffect } from 'react';
// material
import {
  Box,
  List,
  Drawer,
  Typography,
  Divider,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse
} from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import Scrollbar from '~ui/atoms/Scrollbar/Scrollbar';
import { OrganizationFormProducer, FormMade } from '~models/organizationFormAttribute';
// theme
import typography from '~theme/typography';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
// ----------------------------------------------------------------------
const ListSubheaderStyle = styled((props: any) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }: any) => ({
    ...typography.overline,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    color: theme.palette.text.primary,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    cursor: 'pointer',
    fontSize: '0.64em',
    fontWeight: 900,
    '&:before': {
      backgroundColor: theme.palette.primary.main
    }
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
  justifyContent: 'center',
  margin: '0px 3px'
});
// ----------------------------------------------------------------------

type NavItemProps = {
  label: OrganizationFormProducer;
  index: number;
  handleFormItem: (formMade: FormMade, formName: string) => void;
};

function NavItem({ label, index, handleFormItem }: NavItemProps) {
  const [open, setOpen] = useState(index === 0 ? true : false);

  const handleOpen = () => {
    setOpen(!open);
  };
  useEffect(() => {
    if (index === 0) {
      label?.form_made?.map((item: FormMade, idx: number) => {
        if (idx === 0) {
          handleFormItem(item, label?.display_name);
        }
        return '';
      });
    }
  });

  const activeSubStyle = {
    color: 'text.primary',
    fontWeight: 'fontWeightMedium'
  };

  return (
    <List key={`list_${label?.display_name}_${index}`} disablePadding>
      <ListSubheaderStyle onClick={handleOpen}>
        {label.display_name}{' '}
        <Box color="#637381" mr="24px">
          {label?.form_made?.length}
        </Box>
      </ListSubheaderStyle>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {label?.form_made?.map((item: FormMade) => {
            return (
              <ListItemStyle
                button
                onClick={() => {
                  handleFormItem(item, label?.display_name);
                }}
                disableGutters
                key={item?.created_at}
                sx={{
                  ...(open && activeSubStyle)
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
                      bgcolor: '#212B36',
                      transform: 'scale(2)',
                      transition: (theme: any) => theme.transitions.create('transform')
                    }}
                  />
                </ListItemIconStyle>
                <ListItemText
                  disableTypography
                  style={{ fontWeight: 390 }}
                  primary={item?.created_at && format(new Date(item?.created_at), 'dd MMM yyyy', { locale: es })}
                />
              </ListItemStyle>
            );
          })}
        </List>
      </Collapse>
    </List>
  );
}

type FormSidebarProps = {
  labels: OrganizationFormProducer[];
  handleFormItem: (formMade: FormMade, formName: string) => void;
};

function FormSidebar({ labels, handleFormItem }: FormSidebarProps) {
  const renderContent = (
    <Scrollbar>
      <Box sx={{ p: 3 }}>
        <Typography fontSize="1.4em">Formularios</Typography>
      </Box>

      <Divider />

      <Box>
        {labels?.map((label: OrganizationFormProducer, index: number) => {
          return <NavItem key={`nav_item_form_${index}`} label={label} index={index} handleFormItem={handleFormItem} />;
        })}
      </Box>
    </Scrollbar>
  );

  return (
    <Drawer variant="permanent" PaperProps={{ sx: { width: 280, position: 'relative' } }}>
      {renderContent}
    </Drawer>
  );
}

export default React.memo(FormSidebar);
