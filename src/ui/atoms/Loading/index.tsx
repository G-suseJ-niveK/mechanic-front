import React, { ReactNode } from 'react';
import { Box } from '@material-ui/core';

type LoadingProps = {
  figureProgress: ReactNode;
  infoIsData?: ReactNode;
  isLoading: boolean;
  isData: boolean;
  children: ReactNode;
};

const Loading: React.FC<LoadingProps> = ({ figureProgress, isLoading, children, isData, infoIsData }: any) => {
  return (
    <>
      {isLoading ? (
        figureProgress
      ) : isData ? (
        children
      ) : infoIsData ? (
        infoIsData
      ) : (
        <Box height="300px" display="flex" justifyContent="center" alignItems="center">
          No hay datos recopilados
        </Box>
      )}
    </>
  );
};

export default React.memo(Loading);
