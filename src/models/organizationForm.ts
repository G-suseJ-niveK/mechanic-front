import { OrganizationFormAttribute } from './organizationFormAttribute';

export type OrganizationForm = {
  id?: string;
  name: string;
  display_name: string;
  description: string;
  form_type?: string;
  organization_form_attributes?: OrganizationFormAttribute[];
  created_at?: Date;
  updated_at?: Date;
  disabled_at?: Date;
};
