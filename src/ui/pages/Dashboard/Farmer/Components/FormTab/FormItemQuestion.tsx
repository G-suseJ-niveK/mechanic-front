import React from 'react';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

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

type FormItemProps = {
  varKey: string;
  varValue: any;
  varType: string;
};

function FormItem({ varKey, varValue, varType }: FormItemProps) {
  return (
    <RootStyle>
      <Box color="#637381" mb="6px" fontWeight="400"></Box>
      <Box color="#637381" mb="6px" fontWeight="400">
        {varKey}
      </Box>
      {varType === 'signature' ? (
        <LargeItem key={varValue} item={varValue} />
      ) : varType === 'photo' ? (
        <LargeItem key="photo" item={varValue?.image} />
      ) : (
        <>
          <Box color="#333333" fontWeight="370" fontSize="0.9em">
            {varValue}
          </Box>
        </>
      )}
    </RootStyle>
  );
}
export default React.memo(FormItem);
