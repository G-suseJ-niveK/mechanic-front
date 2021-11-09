import React from 'react';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { ColumnAttributes } from '~models/dataAdditionalProducer';
import { Icon } from '@iconify/react';
import sharpFilePresent from '@iconify/icons-ic/sharp-file-present';
// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }: any) => ({
  boxSizing: 'border-box',
  backgroundColor: theme.palette.background.neutral,
  margin: '16px 24px',
  padding: '15px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  fontSize: '1em'
}));

// ----------------------------------------------------------------------

type FormItemProps = {
  item: ColumnAttributes;
};

const LargeImgStyle = styled('img')(() => ({
  top: 0,
  width: '150px',
  height: '150px',
  padding: '5px',
  objectFit: 'cover'
}));

type LargeItemProps = {
  item: string;
};

function LargeItem({ item }: LargeItemProps) {
  return (
    <Box sx={{ cursor: 'zoom-in', position: 'relative' }}>
      <LargeImgStyle alt="large image" src={item} />
    </Box>
  );
}

function FormItem({ item }: FormItemProps) {
  function download(url: string, filename: string) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = filename;
    link.rel = 'noopener noreferrer';
    link.download = 'download';
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  return (
    <RootStyle>
      {item.type === 'signature' || item.name === 'signature' || item.type === 'photo' ? (
        <>
          <Box color="#637381" mb="6px" fontWeight="400">
            Imagen
          </Box>
          <LargeItem key={item.value} item={item.value} />
        </>
      ) : item.type === 'file' ? (
        <>
          <Box color="#637381" mb="6px" fontWeight="400">
            Archivo
          </Box>
          <Box
            display="flex"
            style={{ cursor: 'pointer', color: '#6B767F' }}
            onClick={() => {
              download(item.value, item?.name);
            }}>
            <Box display="flex" alignItems="center" mr={2}>
              <Icon icon={sharpFilePresent} width={84} height={84} />
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Box color="#637381" mb="6px" fontWeight="400">
            {item.display_name}
          </Box>
          <Box color="#333333" fontWeight="370" fontSize="0.9em">
            {item.value}
          </Box>
        </>
      )}
    </RootStyle>
  );
}
export default React.memo(FormItem);
