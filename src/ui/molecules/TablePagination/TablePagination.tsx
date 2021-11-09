import React from 'react';
import useStyles from './TablePagination.css';
import MaterialTablePagination from '@material-ui/core/TablePagination';
import { IconButton } from '@material-ui/core';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

type TablePaginaton = {
  currentCount: number;
  rowsPerPage: number;
  page: number;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onChangeRowsPerPage?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const CompTablePagination: React.FC<TablePaginaton> = (props: TablePaginaton) => {
  const { currentCount, rowsPerPage, page, onChangePage, onChangeRowsPerPage }: TablePaginaton = props;
  return (
    <MaterialTablePagination
      component="div"
      count={currentCount}
      onPageChange={onChangePage}
      page={page}
      rowsPerPage={rowsPerPage}
      ActionsComponent={CustomTablePaginationActions}
      onRowsPerPageChange={onChangeRowsPerPage}
      SelectProps={{
        inputProps: { 'aria-label': 'rows per page' },
        native: false
      }}
      labelRowsPerPage="Filas por página: "
      backIconButtonProps={{
        'aria-label': 'previous page'
      }}
      nextIconButtonProps={{
        'aria-label': 'next page'
      }}
      labelDisplayedRows={({ from, to, count }: any) => `${from}-${to} de ${count}`}
    />
  );
};

type TablePaginationActionsProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
};

const CustomTablePaginationActions = (props: TablePaginationActionsProps) => {
  const classes = useStyles();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page">
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page">
        <LastPageIcon />
      </IconButton>
    </div>
  );
};

export default React.memo(CompTablePagination);
