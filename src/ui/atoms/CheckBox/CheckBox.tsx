import React, { useCallback } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { SwitchBaseProps } from '@material-ui/core/internal/SwitchBase';

type CheckBoxComponentProps = {
  id: string;
  label: string;
  name: string;
  checked: boolean;
  onChange?: (event: any) => void;
  onBlur?: (event: any) => void;
  errors?: any;
  touched?: any;
  disabled?: boolean;
  InputProps?: SwitchBaseProps['inputProps'];
};

const CheckBoxComponent: React.FC<CheckBoxComponentProps> = (props: CheckBoxComponentProps) => {
  const { id, label, name, checked, onChange, disabled, InputProps } = props;

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange && onChange({ target: { name: event.target.name, value: event.target.checked } });
    },
    [onChange]
  );

  return (
    <FormControl component="fieldset">
      <FormControlLabel
        sx={{ marginLeft: '0px' }}
        id={id}
        name={name}
        control={
          <Checkbox
            color="primary"
            inputProps={{ id, name, ...InputProps }}
            checked={checked}
            onChange={handleOnChange}
          />
        }
        label={label}
        labelPlacement="start"
        disabled={disabled}
      />
    </FormControl>
  );
};

export default CheckBoxComponent;
