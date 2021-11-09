import React from 'react';
import { OrganizationFormAttributeType } from '~models/organizationFormAttribute';
import { Box, Icon } from '@material-ui/core';

type TypeItemProps = {
  type?: OrganizationFormAttributeType;
};

const TypeItem: React.FC<TypeItemProps> = (props: TypeItemProps) => {
  const { type }: TypeItemProps = props;

  switch (type) {
    case 'number':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">visibility</Icon>
          <Box>Números</Box>
        </Box>
      );
    case 'string':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">text_fields</Icon>
          <Box>Campo de texto</Box>
        </Box>
      );
    case 'date':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">calendar_today</Icon>
          <Box>Fecha</Box>
        </Box>
      );
    case 'photo':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">add_a_photo</Icon>
          <Box>Fotografía</Box>
        </Box>
      );
    case 'signature':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">edit</Icon>
          <Box>Firma</Box>
        </Box>
      );
    case 'gps_point':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">room</Icon>
          <Box>Punto GPS</Box>
        </Box>
      );
    case 'georeference':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">map</Icon>
          <Box>Georreferencia</Box>
        </Box>
      );
    case 'list_options':
      return (
        <Box display="flex" alignItems="center">
          <Icon fontSize="small">list</Icon>
          <Box>Lista de opciones</Box>
        </Box>
      );
    case 'boolean':
      return <>Text</>;
    default:
      return <>Text</>;
  }
};

export default TypeItem;
