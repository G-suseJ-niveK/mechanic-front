import React, { useState, useEffect, useCallback } from 'react';
import MaterialAutocomplete from '@material-ui/lab/Autocomplete';
import { TextField, FormHelperText, FormControl, FormGroup, CircularProgress } from '@material-ui/core';
import useStyles from './Autocomplete.css';
import clsx from 'clsx';
import { Waypoint } from 'react-waypoint';

type AutocompleteProps = {
  id: string;
  label: string;
  name: string;
  items: any[];
  value: any;
  selectedValue?: any;
  defaultValue: any;
  itemText?: string;
  itemValue?: string;
  fullWidth?: boolean;
  onChange?(name: string, value: any): void;
  onBlur?(name: string, value: any): void;
  onInputChange?(value: string): Promise<boolean>;
  errors?: any;
  touched?: any;
  disabled?: boolean;
};

const Autocomplete: React.FC<AutocompleteProps> = (props: AutocompleteProps) => {
  const {
    id,
    name,
    value,
    selectedValue,
    defaultValue,
    label,
    items,
    disabled,
    onChange,
    onInputChange,
    itemText,
    itemValue,
    errors,
    touched
  } = props;
  const [currentValue, setCurrentValue] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const classes = useStyles();

  const handleOnEnter = useCallback((args: Waypoint.CallbackArgs) => {
    if (args.previousPosition === 'below') {
    }
  }, []);

  useEffect(() => {
    let newValue = null;
    if (selectedValue === null) {
      // if itemValue exist, maybe items is a array object
      if (itemValue) {
        // find value
        newValue = items.filter((item: any) => item[itemValue] === value)[0];
      } else {
        newValue = value;
      }
    } else {
      newValue = selectedValue;
    }
    setCurrentValue(newValue || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _onChange = useCallback(
    (event: any, newValue: any) => {
      setCurrentValue(newValue);
      const value = newValue !== null ? (itemValue ? newValue?.[itemValue] : String(newValue)) : defaultValue;
      onChange && onChange(name, value);
    },
    [name, onChange, itemValue, defaultValue]
  );

  const _onInputChange = useCallback(
    (event: object, value: string) => {
      if (onInputChange) {
        setIsLoading(true);
        onInputChange(value)
          .then(() => {
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
    },
    [onInputChange]
  );

  return (
    <FormGroup row>
      <FormControl fullWidth>
        <MaterialAutocomplete
          clearOnEscape
          autoComplete
          loading={isLoading}
          disabled={disabled}
          options={items}
          getOptionLabel={(option: any) => {
            if (option) return itemText ? option[itemText] : String(option);
            return '';
          }}
          id={id}
          value={currentValue}
          onChange={_onChange}
          onInputChange={_onInputChange}
          renderOption={(option: any) => {
            return (
              <Waypoint onEnter={handleOnEnter}>
                <div>{itemText ? option[itemText] : String(option)} </div>
              </Waypoint>
            );
          }}
          renderInput={(params: any) => (
            <TextField
              {...params}
              name={name}
              label={label}
              margin="normal"
              variant="standard"
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
          noOptionsText="No se encontraron coincidencias"
          loadingText="Cargando..."
          className={clsx(errors?.[name] && touched?.[name] && Boolean(errors[name]) && classes.error)}
        />
        <FormHelperText error={errors?.[name] && touched?.[name] && Boolean(errors[name])} style={{ marginTop: '0px' }}>
          {errors?.[name] && touched?.[name] ? errors[name] : ''}
        </FormHelperText>
      </FormControl>
    </FormGroup>
  );
};

export default React.memo(Autocomplete);
