import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button } from '@material-ui/core';

type LoadingProps = {
  loading: boolean;
  children?: React.ReactNode;
};
const Loading: React.FC<LoadingProps> = (): any => {
  return (
    <Button color="secondary">
      <CircularProgress />
    </Button>
  );
};

export default React.memo(Loading);
