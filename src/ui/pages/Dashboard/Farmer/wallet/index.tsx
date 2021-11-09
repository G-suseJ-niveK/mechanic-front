import React from 'react';
import CredentialTab from './Credential';

type WalletComponentProps = {
  farmerId: string;
};

type TabPanelProps = {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
};

const WalletComponent: React.FC<WalletComponentProps> = (props: WalletComponentProps) => {
  const { farmerId } = props;

  return (
    <>
      <CredentialTab farmerId={farmerId} />
    </>
  );
};

export default WalletComponent;
