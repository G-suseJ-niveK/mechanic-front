import React from 'react';

// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Divider, Box, Button } from '@material-ui/core';
import Scrollbar from '~ui/atoms/Scrollbar/Scrollbar';
import { capitalize } from '~utils/Word';
import AdditionalDataQuestion from './AdditionalDataQuestion';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { DataAdditionalProducer, ColumnAttributes } from '~models/dataAdditionalProducer';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column',
  height: '100%'
});

const HeaderStyle = styled('div')(({ theme }: any) => ({
  height: 84,
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  margin: '0px 20px'
}));

// ----------------------------------------------------------------------

type AdditionalDataContentProps = {
  item: DataAdditionalProducer;
  handleCloseDialog: any;
};

function AdditionalDataContent({ item, handleCloseDialog }: AdditionalDataContentProps) {
  return (
    <RootStyle>
      <HeaderStyle>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box fontSize="1.2em" fontWeight="415">
            {capitalize(item.name ?? '')}
          </Box>{' '}
          <Box m="0px 11px" color="#637381" fontSize="0.7em">
            {item?.created_at && format(new Date(item.created_at), 'dd MMM yyyy', { locale: es })}
          </Box>
        </Box>
        <Button
          variant="contained"
          style={{ background: '#F2994A' }}
          startIcon={<ArrowUpwardIcon />}
          onClick={() => handleCloseDialog()}
          component="span">
          Subir archivos
        </Button>
      </HeaderStyle>

      <Divider />

      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': { display: 'flex', flexDirection: 'column' }
        }}>
        {item?.attributes?.map((item: ColumnAttributes) => (
          <AdditionalDataQuestion item={item} />
        ))}
      </Scrollbar>
    </RootStyle>
  );
}

export default React.memo(AdditionalDataContent);
