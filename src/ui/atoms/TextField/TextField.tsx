import React, { useEffect, useRef, useCallback } from 'react';
import TextFieldMaterial from '@material-ui/core/TextField';
import { InputProps as StandardInputProps } from '@material-ui/core/Input';
import useStyles from './TextField.css';
import clsx from 'clsx';

type TextFieldProps = {
  id: string;
  label: string;
  name: string;
  placeholder?: string;
  margin?: 'none' | 'dense' | 'normal';
  variant?: 'standard' | 'outlined' | 'filled' | undefined;
  fullWidth?: boolean;
  value: any;
  autoComplete?: string;
  onChange?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyPress?: (event: any) => void;
  InputProps?: Partial<StandardInputProps>;
  errors?: any;
  touched?: any;
  type?: string;
  disabled?: boolean;
  multiline?: boolean;
  rowsMax?: number;
  style?: any;
};

const TextField: React.FC<TextFieldProps> = (props: TextFieldProps) => {
  const classes = useStyles();
  const inputRef = useRef<any>(null);
  const {
    id,
    label,
    name,
    margin,
    fullWidth,
    value,
    onChange,
    onBlur,
    onKeyPress,
    errors,
    touched,
    type,
    disabled,
    multiline,
    variant,
    rowsMax,
    style,
    InputProps,
    autoComplete,
    placeholder
  } = props;

  const scrollToRef = useCallback((ref: any) => {
    window.scrollTo(0, ref.current.offsetTop);
  }, []);

  useEffect(() => {
    if (Object.keys(errors)[0] === name) {
      scrollToRef(inputRef);
    }
  }, [errors, name, scrollToRef]);

  return (
    <TextFieldMaterial
      data-testid="TextField"
      inputRef={inputRef}
      placeholder={placeholder}
      className={clsx(classes.root, !(errors[name] && touched[name] && Boolean(errors[name])) ? classes.default : null)}
      id={id}
      style={style}
      name={name}
      type={type}
      label={label}
      margin={margin}
      variant={variant}
      fullWidth={fullWidth}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      onBlur={onBlur}
      onKeyPress={onKeyPress}
      multiline={multiline}
      rows={rowsMax}
      error={errors[name] && touched[name] && Boolean(errors[name])}
      helperText={errors[name] && touched[name] ? errors[name] : ''}
      disabled={disabled}
      InputProps={InputProps}
      InputLabelProps={
        type === 'date'
          ? {
              shrink: true
            }
          : {}
      }
    />
  );
};

TextField.defaultProps = {
  disabled: false,
  multiline: false,
  rowsMax: 0,
  errors: {},
  InputProps: {},
  fullWidth: true,
  id: '',
  label: '',
  margin: 'normal',
  onBlur: (e: any) => e,
  onChange: (e: any) => e,
  onKeyPress: (e: any) => e,
  touched: {},
  type: 'text',
  value: '',
  variant: 'standard',
  style: {}
};

export default React.memo(TextField);
