import React from 'react';
import { Dialog, Divider, DialogActions, DialogContent, DialogTitle, Box } from '@material-ui/core';

type DialogProps = {
  actions?: React.ReactNode;
  children?: React.ReactNode;
  onClose: (value: boolean) => void;
  open: boolean;
  title?: string;
  subtitle?: string;
};

const ComponentDialog: React.FC<DialogProps> = (props: DialogProps) => {
  const { open, title, subtitle, onClose, children, actions } = props;

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog
      // keepMounted
      fullWidth
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      max-width="500px">
      {title && (
        <DialogTitle>
          <Box display="flex" justifyContent="center">
            <span> {title} </span>
          </Box>
          <Box display="flex" justifyContent="center" color="#3D4C63" fontSize="0.9rem">
            <span> {subtitle} </span>
          </Box>
        </DialogTitle>
      )}
      <Divider />
      <DialogContent>{children}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default React.memo(ComponentDialog);
