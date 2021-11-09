import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import useStyles from './DataTable.css';
import { Table, TableContainer, Paper, Box, Divider } from '@material-ui/core';
import TableHead, { TableHeadColumn } from '~molecules/TableHead/TableHead';
import TableBody from '~molecules/TableBody/TableBody';
import TextFieldSearch from '~molecules/TextFieldSearch/TextFieldSearch';
import TablePagination from '~ui/molecules/TablePagination/TablePagination';
import { AxiosResponse } from 'axios';
import { datatableReducer, initialState } from './datatableReducer';

/**
 *
 */
type DataTableProps = {
  headComponent?: React.ReactChild;
  headers: TableHeadColumn[];
  onLoad(page: number, perPage: number, orderBy: string, order: string, search: string): Promise<AxiosResponse<any>>;
  stickyHeader?: boolean;
  refresh?: boolean;
  textNoItems?: string;
};

const DataTable: React.FC<DataTableProps> = (props: DataTableProps) => {
  const isCompMounted = useRef(null);
  const { headComponent, headers, stickyHeader, refresh, textNoItems, onLoad }: DataTableProps = props;
  const [state, dispatch] = useReducer(datatableReducer, initialState);
  const classes = useStyles();

  const handleLoadDataTable = useCallback(() => {
    dispatch({ type: 'setIsLoading', payload: { isLoading: true } });
    onLoad(state.page, state.perPage, state.orderBy, state.order ?? '', state.search)
      .then((res: any) => {
        const {
          data: { total, items }
        } = res.data;
        if (isCompMounted.current) {
          dispatch({ type: 'setIsLoading', payload: { isLoading: false } });
          dispatch({ type: 'setItems', payload: { items, total } });
        }
      })
      .catch(() => {
        if (isCompMounted.current) {
          dispatch({ type: 'setIsLoading', payload: { isLoading: false } });
          dispatch({ type: 'setItems', payload: { items: [], total: 0 } });
        }
      });
  }, [onLoad, state.page, state.perPage, state.orderBy, state.order, state.search]);

  const handleSort = useCallback(
    (column: any) => {
      const isDesc: boolean = state.orderBy === column && state.order === 'desc';
      dispatch({ type: 'setOrder', payload: { order: isDesc ? 'asc' : 'desc', orderBy: column } });
    },
    [state.orderBy, state.order]
  );

  const handleOnChangeSearch = useCallback((value: any) => {
    dispatch({ type: 'setSearch', payload: { search: value } });
  }, []);

  const _onChangePage = useCallback((_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    dispatch({ type: 'setPage', payload: { auxPage: newPage, page: ++newPage } });
  }, []);

  const _onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;
    dispatch({ type: 'setPerPage', payload: { perPage: Number(value) } });
  }, []);

  useEffect(() => {
    handleLoadDataTable();
  }, [handleLoadDataTable, refresh]);

  return (
    <>
      <Box display="flex" justifyContent="space-between" px={1} pb={1}>
        {headComponent}
        <TextFieldSearch onChange={handleOnChangeSearch} />
      </Box>
      <Divider />
      <Paper ref={isCompMounted}>
        <TableContainer>
          <Table
            className={classes.table}
            stickyHeader={stickyHeader}
            // eslint-disable-next-line no-constant-condition
            size={'medium'}
            aria-label="table">
            <TableHead headers={headers} orderBy={state.orderBy} order={state.order} createSortHandler={handleSort} />
            <TableBody headers={headers} items={state.items} loading={state.isLoading} textNoItems={textNoItems} />
          </Table>
        </TableContainer>
        <TablePagination
          currentCount={state?.totalItems}
          rowsPerPage={state?.rowsPerPage}
          page={state?.auxPage}
          onChangePage={_onChangePage}
          onChangeRowsPerPage={_onChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};
DataTable.defaultProps = {
  headComponent: <div></div>,
  headers: [], // { text. value, sortable, align, disablePadding}
  stickyHeader: false,
  textNoItems: 'No se encontraron resultados.'
};
export default React.memo(DataTable);
