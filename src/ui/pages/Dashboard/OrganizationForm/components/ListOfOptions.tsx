/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { Table, Icon, TableRow, IconButton } from '@material-ui/core';
import { Paper, Box, TableBody, TableCell } from '@material-ui/core';
import TextField from '~ui/atoms/TextField/TextField';
import TableHead, { TableHeadColumn } from '~molecules/TableHead/TableHead';
import Button from '~atoms/Button/Button';

type ListOfOptionsComponentProps = {
  onSave: (possible_values?: any[]) => void;
  currentItems: any[];
};

const ListOfOptionsComponent: React.FC<ListOfOptionsComponentProps> = (props: ListOfOptionsComponentProps) => {
  const { onSave, currentItems } = props;
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [items, setItems] = useState<string[]>(currentItems);

  const handleSort = useCallback((column: any) => {}, []);

  const handleAddItem = useCallback(() => {
    setItems((prevValue: any[]) => {
      return [...prevValue, ''];
    });
  }, []);

  const handleRemoveItem = useCallback((index: number) => {
    setItems((prevValue: any[]) => {
      const newValues = prevValue.filter((attribute: any, idx: number) => idx !== index);
      return newValues;
    });
  }, []);

  const handleOnChangeField = useCallback((e: any, index: number) => {
    const { name, value } = e.target;
    setItems((prevValue: string[]) => {
      const newValues = prevValue.map((attribute: string, idx: number) => {
        if (idx === index) {
          return value;
        }
        return attribute;
      });

      return newValues;
    });
  }, []);

  const handleOnSaveAttribute = useCallback(() => {
    onSave(items);
  }, [onSave, items]);

  useEffect(() => {
    setHeaders([
      {
        sorteable: false,
        align: 'left',
        text: 'Descripción',
        padding: 'none',
        value: 'description'
      },
      {
        sorteable: false,
        align: 'left',
        text: 'Acción',
        padding: 'none',
        value: 'action'
      }
    ]);
  }, []);

  return (
    <>
      <Paper elevation={3} sx={{ p: '20px' }}>
        <Box py={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box fontWeight={700} fontSize="1.2rem">
            Listado de opciones
          </Box>
          <Button text="Agregar opción" startIcon={<Icon>add</Icon>} variant="contained" onClick={handleAddItem} />
        </Box>
        <Box>
          <Table stickyHeader={true} size={true ? 'small' : 'medium'} aria-label="table">
            <TableHead headers={headers} orderBy="" order="asc" createSortHandler={handleSort} />
            <TableBody>
              {items?.map((value: any, index: number) => {
                return (
                  <TableRow key={`row_${index}_option`}>
                    <TableCell align="left">
                      <TextField
                        fullWidth
                        id="value"
                        name="value"
                        type="text"
                        autoComplete="off"
                        label=""
                        value={value}
                        onChange={(e: any) => handleOnChangeField(e, index)}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <IconButton onClick={() => handleRemoveItem(index)} size="small">
                        <Icon sx={{ color: '#ea0d0d8a' }}>delete</Icon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Paper>
      <Box pt={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button text="Guardar" variant="contained" onClick={handleOnSaveAttribute} />
      </Box>
    </>
  );
};

export default React.memo(ListOfOptionsComponent);
