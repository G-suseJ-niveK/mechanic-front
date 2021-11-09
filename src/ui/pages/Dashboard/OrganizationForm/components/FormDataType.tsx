import React from 'react';
import { OrganizationFormAttributeType } from '~models/organizationFormAttribute';
import { Box } from '@material-ui/core';
import Image from './Image';

type FormDataTypeProps = {
  type?: OrganizationFormAttributeType;
  attribute: any;
};

const FormDataType: React.FC<FormDataTypeProps> = (props: FormDataTypeProps) => {
  const { type, attribute }: FormDataTypeProps = props;
  switch (type) {
    case 'number':
      return <Box>{attribute || ''}</Box>;
    case 'string':
      return <Box>{attribute || ''}</Box>;
    case 'date':
      return <Box>{attribute || ''}</Box>;
    case 'photo':
      return <Image image={attribute?.image || ''} />;
    case 'signature':
      return <Image image={attribute || ''} />;
    case 'gps_point':
      return (
        <Box display="flex" alignItems="center">
          {attribute || ''}
        </Box>
      );
    case 'georeference':
      return (
        <Box display="flex" alignItems="center">
          {attribute}
        </Box>
      );
    case 'list_options':
      return (
        <Box display="flex" alignItems="center">
          {attribute}
        </Box>
      );
    case 'boolean':
      return <>Text</>;
    default:
      return <>{attribute}</>;
  }
};

export default FormDataType;
