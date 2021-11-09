import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MaterialLinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles(() => ({
  colorPrimary: {
    backgroundColor: '#b2dfdb'
  }
}));

type LinearProgressProps = {
  loading: boolean;
};

const LinearProgress: React.FC<LinearProgressProps> = (props: LinearProgressProps) => {
  const classes = useStyles();
  const { loading } = props;

  return <>{loading && <MaterialLinearProgress classes={classes} />}</>;
};

export default LinearProgress;
