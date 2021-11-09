import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Breadcrumbs, Link } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Theme, makeStyles } from '@material-ui/core';

export type BreadcrumbItem = {
  component: string | React.ReactNode;
  path?: string;
};

type BreadcrumbsComponentProps = {
  breadcrumbs?: BreadcrumbItem[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles((theme: Theme) => ({
  textActive: {
    display: 'flex',
    alignItems: 'center',
    color: '#0E4535',
    fontSize: '14px'
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    color: '#0E4535',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none !important'
  }
}));

const BreadcrumbsComponent: React.FC<BreadcrumbsComponentProps> = (props: BreadcrumbsComponentProps) => {
  const history = useHistory();
  const classes = useStyles();
  const { breadcrumbs } = props;

  const handleOnClick = useCallback(
    (event: React.SyntheticEvent, path?: string) => {
      event.preventDefault();
      if (path !== undefined) history.push(path);
    },
    [history]
  );

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
        {breadcrumbs?.map((breadcrumbItem: BreadcrumbItem, index: number) => {
          if (breadcrumbItem.path !== undefined) {
            return (
              <Link
                key={`${index}_breadcrumb`}
                color="inherit"
                href="#"
                className={classes.textActive}
                onClick={(event: React.SyntheticEvent) => handleOnClick(event, breadcrumbItem.path)}>
                {breadcrumbItem.component}
              </Link>
            );
          }
          return (
            <Link color="inherit" key={`${index}_breadcrumb`} className={classes.text} variant="inherit">
              {breadcrumbItem.component}
            </Link>
          );
        })}
      </Breadcrumbs>
    </>
  );
};

export default React.memo(BreadcrumbsComponent);
