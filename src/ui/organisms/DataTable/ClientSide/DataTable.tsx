import React, { useState, useCallback } from 'react';
import useStyles from './DataTable.css';
import { Table, TableContainer, Paper, Box, Divider } from '@material-ui/core';

import TableHead, { TableHeadProps, TableHeadColumn } from '~molecules/TableHead/TableHead';
import TableBody from '~molecules/TableBody/TableBody';
import TextFieldSearch from '~molecules/TextFieldSearch/TextFieldSearch';
import TablePagination from '~ui/molecules/TablePagination/TablePagination';

/**
 *
 */
type DataTableProps = {
  headers: TableHeadColumn[];
  headerActions?: React.ReactNode;
  items: any[];
  stickyHeader?: boolean;
  loading?: boolean;
  isSearch?: boolean;
  textNoItems?: string;
};

const DataTable: React.FC<DataTableProps> = (props: DataTableProps) => {
  const { headers, items, stickyHeader, isSearch, loading, textNoItems, headerActions }: DataTableProps = props;
  const classes = useStyles();
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<TableHeadProps['order']>('asc');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [search, setSearch] = useState<string>('');

  const desc = (a: any[], b: any[], orderby: any) => {
    if (b[orderby] < a[orderby]) {
      return -1;
    }
    if (b[orderby] > a[orderby]) {
      return 1;
    }
    return 0;
  };

  const stableSort = (array: any[], cmp: any) => {
    const stabilizedThis = array.map((element: any, index: any) => [element, index]);
    stabilizedThis.sort((a: any, b: any) => {
      const valueOrder = cmp(a[0], b[0]);
      if (valueOrder !== 0) {
        return valueOrder;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((element: any) => element[0]);
  };

  const getSorting = (currentOrder: any, currentOrderBy: any) => {
    //no sale 1 de todas maneras, y como se ingresa los valores a y b
    return currentOrder === 'desc'
      ? (a: any, b: any) => desc(a, b, currentOrderBy)
      : (a: any, b: any) => -desc(a, b, currentOrderBy);
  };

  const filterItems = (array: any, valueSearch: string) => {
    if (valueSearch === '') {
      return array;
    }
    const newArray = array.filter((arr: any) => {
      for (const key in arr) {
        if (String(arr[key]).includes(search)) {
          return true;
        }
      }
      return false;
    });
    return newArray;
  };

  const getDataItems = () => {
    return stableSort(filterItems(items, search), getSorting(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  };

  const handleSort = useCallback(
    (column: any) => {
      const isDesc: boolean = orderBy === column && order === 'desc';
      setOrder(isDesc ? 'asc' : 'desc');
      setOrderBy(column);
    },
    [orderBy, order, setOrder, setOrderBy]
  );

  const handleOnChangeSearch = useCallback(
    (value: any) => {
      setSearch(value);
    },
    [setSearch]
  );

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setRowsPerPage(Number(value));
    },
    [setRowsPerPage]
  );

  const currentItems = getDataItems();

  return (
    <>
      <TableContainer component={Paper}>
        {isSearch && (
          <Box display="flex" justifyContent="flex-end" px={1} pb={1} alignItems="center">
            {headerActions}
            <TextFieldSearch onChange={handleOnChangeSearch} />
          </Box>
        )}
        <Divider />
        <Table
          className={classes.table}
          stickyHeader={stickyHeader}
          size={true ? 'small' : 'medium'}
          aria-label="table">
          <TableHead headers={headers} orderBy={orderBy} order={order} createSortHandler={handleSort} />
          <TableBody headers={headers} items={currentItems} loading={loading} textNoItems={textNoItems} />
        </Table>
        {/* {loading ? (
          <CircularProgress size={14} style={{ textAlign: 'center' }} />
        ) : currentItems.length > 0 ? (
          ''
        ) : (
          <div style={{ textAlign: 'center' }}>No existen datos que mostrar</div>
        )} */}
        <TablePagination
          currentCount={items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
};
DataTable.defaultProps = {
  // activeActions: true,
  headers: [], // { text. value, sortable, align, disablePadding}
  items: [],
  stickyHeader: false,
  loading: false,
  textNoItems: 'No se encontraron resultados.',
  isSearch: true
  // onEdit: (e: any) => {},
  // onDelete: (e: any) => {}
};
export default React.memo(DataTable);
