import React from 'react';
import { capitalize } from '~utils/Word';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }: any) => ({
  height: 84,
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  margin: '0px 20px'
}));

// ----------------------------------------------------------------------

type FormItemToolbarProps = {
  formName: string;
  formDate: string;
  handleOnDownload: any;
};

function FormItemToolbar({ formName, formDate, handleOnDownload }: FormItemToolbarProps) {
  return (
    <RootStyle>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box fontSize="1.2em" fontWeight="415">
          {capitalize(formName ?? '')}
        </Box>{' '}
        <Box m="0px 11px" color="#637381" fontSize="0.7em">
          {formDate && format(new Date(formDate), 'dd MMM yyyy', { locale: es })}
        </Box>
      </Box>
      {formName && (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Button variant="contained" onClick={handleOnDownload} startIcon={<ArrowDownwardIcon />}>
            Descargar Excel
          </Button>
        </Box>
      )}
    </RootStyle>
  );
}
export default React.memo(FormItemToolbar);
