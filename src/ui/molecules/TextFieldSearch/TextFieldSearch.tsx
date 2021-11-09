import React, { useState } from 'react';
import { Box, InputAdornment, OutlinedInput } from '@material-ui/core';
import searchFill from '@iconify/icons-eva/search-fill';
import { styled } from '@material-ui/styles';
import { Icon } from '@iconify/react';

type TextFieldSearchProps = {
  label?: string;
  isAnimated?: boolean;
  onChange: (value: string) => void;
};

const SearchStyle = styled(OutlinedInput)(({ theme }: any) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: '1px !important',
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

const CompTextFieldSearch: React.FC<TextFieldSearchProps> = (props: TextFieldSearchProps) => {
  const { label, onChange, isAnimated } = props;
  const [textValue, setTextValue] = useState<string>('');
  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setTextValue(value);
    onChange(value);
  }

  if (!isAnimated) {
    return (
      <>
        <OutlinedInput
          value={textValue}
          onChange={handleOnChange}
          placeholder={label}
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      </>
    );
  }

  return (
    <>
      <SearchStyle
        value={textValue}
        onChange={handleOnChange}
        placeholder={label}
        startAdornment={
          <InputAdornment position="start">
            <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        }
      />
    </>
  );
};
CompTextFieldSearch.defaultProps = {
  label: 'Buscar',
  isAnimated: true,
  onChange: () => null
};

export default React.memo(CompTextFieldSearch);
