// eslint-disable-next-line
import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { verifyToken } from '~redux-store/actions/authActions';

type RootProps = {
  children?: React.ReactNode;
};

const Root: React.FC<RootProps> = (props: any): any => {
  const { auth }: any = useSelector((state: any) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyToken());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!auth.authReady) {
    return (
      <div className="load">
        <div className="loader">Loading...</div>
      </div>
    );
  }
  return props.children;
};

export default React.memo(Root);
