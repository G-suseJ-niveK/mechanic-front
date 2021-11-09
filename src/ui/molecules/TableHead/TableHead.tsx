import React from 'react';
import { TableRow, TableCell, TableSortLabel, TableHead } from '@material-ui/core';
import useStyles from './TableHead.css';

/**
 * ITableHeadColumn define los params de cada columna de la tabla
 */
export type TableHeadColumn = {
  sorteable: boolean;
  align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
  padding?: 'checkbox' | 'none' | 'normal' | undefined;
  size?: 'medium' | 'small' | undefined;
  variant?: 'body' | 'footer' | 'head' | undefined;
  text: string;
  value: string;
  render?: (value: any) => void;
};

/**
 * ITableHeadProps
 */
export type TableHeadProps = {
  headers: TableHeadColumn[];
  orderBy: string;
  order: 'asc' | 'desc' | undefined;
  createSortHandler: (column: string) => void;
};

const CustomTableHead: React.FC<TableHeadProps> = (props: TableHeadProps) => {
  const classes = useStyles();
  const { headers, orderBy, order, createSortHandler }: TableHeadProps = props;
  function handleSort(e: React.FormEvent, column: string) {
    createSortHandler(column);
  }

  return (
    <>
      <TableHead>
        <TableRow>
          {headers.map((column: TableHeadColumn, index: number) => {
            const { sorteable, align, padding, size, variant, text, value } = column;
            return (
              <TableCell
                className={classes.rootCell}
                key={`table_column_${index}`}
                align={align}
                padding={padding}
                sortDirection={orderBy === value ? order : false} //esta bien?
                size={size}
                variant={variant}>
                {sorteable ? (
                  <TableSortLabel
                    active={orderBy === value}
                    direction={order}
                    onClick={(e: any) => handleSort(e, value)}>
                    {text}
                  </TableSortLabel>
                ) : (
                  <>{text}</>
                )}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
    </>
  );
};
CustomTableHead.defaultProps = {
  createSortHandler: () => null,
  headers: [],
  order: undefined,
  orderBy: ''
};
export default React.memo(CustomTableHead);
