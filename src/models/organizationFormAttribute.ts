export type OrganizationFormAttributeType =
  | 'number'
  | 'string'
  | 'date'
  | 'photo'
  | 'signature'
  | 'gps_point'
  | 'georeference'
  | 'list_options'
  | 'boolean';

export type OrganizationFormAttribute = {
  id?: string;
  name: string;
  display_name: string;
  description: string;
  attribute_type: OrganizationFormAttributeType;
  possible_values: string[];
  is_required: boolean;
  is_public: boolean;
  created_at?: Date;
  updated_at?: Date;
  disabled_at?: Date;
};

export type ColumnAttributes = {
  description?: string;
  value: string;
  type: OrganizationFormAttributeType;
  name: string;
  display_name: string;
};

export type FormMade = {
  id: string;
  attributes: ColumnAttributes[];
  created_at: string;
};

export type OrganizationFormProducer = {
  description?: string;
  form_type?: string;
  form_made: FormMade[];
  name: string;
  display_name: string;
};

// ----------------------------------------------------------------------

export const ColumnAttributesDefault: ColumnAttributes = {
  description: '',
  value: '',
  type: 'string',
  name: '',
  display_name: ''
};

export const FormMadeDefault: FormMade = {
  id: '',
  created_at: '10/20/20',
  attributes: []
};

export const OrganizationFormProducerDefault: OrganizationFormProducer = {
  description: '',
  form_type: '',
  form_made: [],
  name: '',
  display_name: ''
};
