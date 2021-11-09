import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// material
import { Dialog, Box, Paper, DialogProps } from '@material-ui/core';
//
import { varFadeInUp } from './variants';

// ----------------------------------------------------------------------

type DialogAnimateProps = {
  animate?: object;
  onClose?: VoidFunction;
} & DialogProps;

export default function DialogAnimate({ open = false, animate, onClose, children, ...other }: DialogAnimateProps) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          fullWidth
          maxWidth="xs"
          open={open}
          onClose={onClose}
          PaperComponent={(props: any) => (
            <Box
              component={motion.div}
              {...(animate || varFadeInUp)}
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Box onClick={onClose} sx={{ width: '100%', height: '100%', position: 'fixed' }} />
              <Paper {...props}>{props.children}</Paper>
            </Box>
          )}
          {...other}>
          {children}
        </Dialog>
      )}
    </AnimatePresence>
  );
}
