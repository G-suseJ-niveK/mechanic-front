import React from 'react';
import { Popover, Box } from '@material-ui/core';
import { Icon } from '@iconify/react';
import infoCircleFilled from '@iconify/icons-ant-design/info-circle-filled';

function SimplePopover() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-Popover' : undefined;

  return (
    <div>
      <Box fontSize="1.4em" display="flex" flexDirection="row" justifyContent="center" alignItems="center" mt={2}>
        <Box mr={1}>Ubicación de Parcelas</Box>{' '}
        <Box mr={1} onClick={handleClick}>
          <Icon icon={infoCircleFilled} color="red" />
        </Box>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}>
        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper', borderRadius: '10px' }} fontSize="1.2em">
          Para mostrar las parcelas de sus productores
          <br /> envíe sus archivos KMZ a hola@agros.tech.
        </Box>
      </Popover>
    </div>
  );
}

export default React.memo(SimplePopover);
