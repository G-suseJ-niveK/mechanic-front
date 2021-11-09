import React from 'react';
import { OrganizationFormAttribute } from '~models/organizationFormAttribute';
import { Box, Icon, Divider } from '@material-ui/core';
import { Draggable } from 'react-beautiful-dnd';
import TypeItem from './TypeItem';

type FormItemProps = {
  index: number;
  position: number;
  attribute: OrganizationFormAttribute;
  sx?: any;
  onClick(): void;
  onDelete(): void;
  onDuplicate(): void;
};

const FormItem: React.FC<FormItemProps> = (props: FormItemProps) => {
  const { attribute, onClick, onDelete, onDuplicate, index, position, ...rest }: FormItemProps = props;
  return (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided: any) => (
        <Box
          px={1}
          pt={2}
          onClick={onClick}
          ref={provided?.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          {attribute.display_name !== '' ? (
            <Box>
              {position}. {attribute.display_name}
            </Box>
          ) : (
            <Box sx={{ color: 'red' }}>{position}. Sin pregunta</Box>
          )}
          <Divider sx={attribute.display_name === '' ? { background: 'red' } : {}} />
          <Box display="flex" justifyContent="space-between" py={1.2} px={1.2} {...rest}>
            <TypeItem type={attribute.attribute_type} />
            <Box>
              <Icon onClick={onDelete} sx={{ cursor: 'pointer' }}>
                delete
              </Icon>
              <Icon onClick={onDuplicate} sx={{ cursor: 'pointer' }}>
                filter_none
              </Icon>
            </Box>
          </Box>
          <Divider sx={attribute.display_name === '' ? { background: 'red' } : {}} />
        </Box>
      )}
    </Draggable>
  );
};

export default FormItem;
