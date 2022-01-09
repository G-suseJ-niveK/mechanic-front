// eslint-disable-next-line
import React from 'react';

type RootProps = {
  children?: React.ReactNode;
};

const Root: React.FC<RootProps> = (props: any): any => {
  return props.children;
};

export default React.memo(Root);
