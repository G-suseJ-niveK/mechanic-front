import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FormGroup, FormControl, FormHelperText, InputLabel, Select, Input, MenuItem } from '@material-ui/core';
import { CircularProgress, Box } from '@material-ui/core';
import clsx from 'clsx';
import useStyles from './SelectField.css';

type SelectFieldProps = {
  id: string;
  label: string;
  name: string;
  items: any[];
  value: any;
  variant?: 'filled' | 'standard' | 'outlined';
  itemText?: string;
  itemValue?: string;
  fullWidth?: boolean;
  onChange?: (name: any, value: any) => void;
  onBlur?: (name: string, value: any) => void;
  errors?: any;
  touched?: any;
  disabled?: boolean;
  loading?: boolean;
};

const SelectField: React.FC<SelectFieldProps> = (props: SelectFieldProps) => {
  const { id, name, value, label, items, onChange, itemText, itemValue, disabled, errors, touched, loading, variant } =
    props;
  const [currentValue, setCurrentValue] = useState<any>('');
  const selectRef = useRef<any>(null);
  const classes = useStyles();

  useEffect(() => {
    let selectedValue = '';
    // if itemValue exist, maybe items is a array object
    if (itemValue) {
      // find value
      selectedValue = items.filter((item: any) => item[itemValue] === value)[0];
    } else {
      selectedValue = value;
    }
    setCurrentValue(selectedValue || '');
  }, [itemValue, items, value]);

  const _onChange = useCallback(
    (event: any) => {
      const { value } = event.target;
      setCurrentValue(value);
      // valida onChange porque puede ser undefined
      onChange !== undefined && onChange(name, itemValue ? value[itemValue] : String(value));
    },
    [itemValue, name, onChange]
  );

  return (
    <div style={{ paddingTop: '8px', paddingBottom: '8px' }}>
      <FormGroup row>
        <FormControl
          fullWidth
          variant={variant}
          className={clsx(classes.root, errors?.[name] && touched?.[name] && Boolean(errors[name]) && classes.error)}>
          <InputLabel id={id} className={classes.label}>
            {label}
          </InputLabel>
          <Select
            variant={variant}
            inputRef={selectRef}
            labelId={`${id}_label`}
            id={id}
            name={name}
            value={currentValue}
            onChange={_onChange}
            input={<Input />}
            renderValue={(selected: any) => (itemText ? selected[itemText] : String(selected))}
            disabled={disabled}
            endAdornment={
              loading && (
                <Box mr="20px" position="absolute" top="0" right="0">
                  <CircularProgress color="primary" size={25} />
                </Box>
              )
            }>
            {items.map((item: any, index: number) => (
              <MenuItem
                value={item}
                key={`select_item_${name}_${index}`}
                className={classes.item}
                classes={{ selected: classes.selected }}>
                {itemText ? item[itemText] : String(item)}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText
            error={errors?.[name] && touched?.[name] && Boolean(errors[name])}
            style={{ marginTop: '0px', marginLeft: '0px' }}>
            {errors?.[name] && touched?.[name] ? errors[name] : ''}
          </FormHelperText>
        </FormControl>
      </FormGroup>
    </div>
  );
};

SelectField.defaultProps = {
  loading: false,
  variant: 'filled'
};

export default React.memo(SelectField);
