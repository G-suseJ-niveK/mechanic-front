/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useCallback } from 'react';
import MaterialAutocomplete from '@material-ui/lab/Autocomplete';
import { createFilterOptions } from '@material-ui/core/Autocomplete';
import { TextField, FormHelperText, FormControl, FormGroup, CircularProgress, Checkbox } from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import useStyles from './MultiAutocompleteTag.css';
import clsx from 'clsx';

type MultiAutocompleteTagProps = {
  id: string;
  label: string;
  name: string;
  items: any[];
  defaultValue: any;
  itemText?: string;
  itemValue?: string;
  fullWidth?: boolean;
  limitTags?: number;
  isChecked?: boolean;
  onChange?(name: string, value: any): void;
  onBlur?(name: string, value: any): void;
  onInputChange?(value: string): Promise<boolean>;
  errors?: any;
  touched?: any;
  disabled?: boolean;
  refresh?: boolean;
};

const MultiAutocompleteTag: React.FC<MultiAutocompleteTagProps> = (props: MultiAutocompleteTagProps) => {
  const { id, name, label, items, disabled, onChange, onInputChange, itemText, limitTags, isChecked, errors, touched } =
    props;

  const [selectedOptions, setSelectedOptions] = useState<any>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const classes = useStyles();

  // useEffect(() => {

  //   let newValue: any = null;

  //   if (defaultValue === null) {
  //     // if itemValue exist, maybe items is a array object
  //     if (itemValue) {
  //       // find value
  //       newValue = items.filter((item: any) => item[itemValue] === defaultValue[itemValue])[0];
  //     } else {
  //       newValue = defaultValue;
  //     }
  //   } else {
  //     newValue = defaultValue;
  //   }
  //   setSelectedOptions(newValue || null);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const allSelected = items.length === selectedOptions.length;

  const _onChange = (event: any, selectedOptions: any, reason: any) => {
    if (reason === 'select-option' || reason === 'remove-option') {
      if (selectedOptions.find((option: any) => option.value === 'select-all')) {
        handleSelectAll(!allSelected);
      } else {
        setSelectedOptions(selectedOptions);
        onChange && onChange(name, selectedOptions);
      }
    } else if (reason === 'clear') {
      setSelectedOptions([]);
      onChange && onChange(name, []);
    }
  };

  const handleSelectAll = (isSelected: any) => {
    if (isSelected) {
      setSelectedOptions(items);
      onChange && onChange(name, items);
    } else {
      setSelectedOptions([]);
      onChange && onChange(name, []);
    }
  };

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

  const filter = createFilterOptions();
  return (
    <FormGroup row>
      <FormControl fullWidth>
        <MaterialAutocomplete
          multiple
          id={id}
          size="small"
          limitTags={limitTags}
          options={items}
          disabled={disabled}
          value={selectedOptions}
          disableCloseOnSelect
          getOptionLabel={(option: any) => {
            if (option) return itemText ? option[itemText] || '' : String(option);
            return '';
          }}
          filterOptions={(options: any, params: any) => {
            const filtered = filter(options, params);
            return [{ [itemText ? itemText : 'description']: 'Selecionar Todos', value: 'select-all' }, ...filtered];
          }}
          autoHighlight
          onChange={_onChange}
          renderOption={(option: any, { selected }: any) => {
            const selectAllProps = option.value === 'select-all' ? { checked: allSelected } : {};
            return (
              <React.Fragment>
                {isChecked ? (
                  <Checkbox
                    color="primary"
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    checked={selected}
                    {...selectAllProps}
                  />
                ) : (
                  ''
                )}
                {/* {option[String(itemText)]} */}
                {itemText ? option[itemText] || '' : String(option)}
              </React.Fragment>
            );
          }}
          onInputChange={_onInputChange}
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
          className={clsx(errors?.[name] && touched?.[name] && Boolean(errors[name]) && classes.error)}
        />
        <FormHelperText error={errors?.[name] && touched?.[name] && Boolean(errors[name])} style={{ marginTop: '0px' }}>
          {errors?.[name] && touched?.[name] ? errors[name] : ''}
        </FormHelperText>
      </FormControl>
    </FormGroup>
  );
};

MultiAutocompleteTag.defaultProps = {
  // disableClearable: false
  isChecked: false,
  limitTags: 20
};

export default React.memo(MultiAutocompleteTag);
