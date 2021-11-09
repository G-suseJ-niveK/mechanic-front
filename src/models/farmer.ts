import { Association, AssociationDefault } from './association';
import { Farm } from './farm';

export type Farmer = {
  id?: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  dni: string;
  email: string;
  phone: string | null;
  phone_carrier?: string | null;
  certificacion_code: string;
  association_code: string;
  birthday_at: string;
  whatsapp_number: string | null;
  initial_farming_at: string;
  assigned_advisor_id?: string;
  association_id?: string;
  farms?: Farm[];
  association?: Association;
  percentage_status?: number;
  hamlet?: string | null;
  reference?: string | null;
  country_id?: string | null;
  department_id?: string | null;
  province_id?: string | null;
  district_id?: string | null;
  country?: any | null;
  department?: any | null;
  province?: any | null;
  district?: any | null;
  data_status?: string;
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
};

export const FarmerDefault: Farmer = {
  id: '',
  first_name: '',
  last_name: '',
  full_name: '',
  dni: '',
  email: '',
  phone: '',
  phone_carrier: '',
  certificacion_code: '',
  association_code: '',
  birthday_at: '',
  whatsapp_number: '',
  initial_farming_at: '',
  assigned_advisor_id: '',
  association_id: '',
  farms: [],
  association: AssociationDefault,
  percentage_status: 0,
  data_status: '',
  created_at: '',
  updated_at: '',
  disabled_at: ''
};
