import { SystemTable } from './systemTable';

export type Plantings = {
  id: string;
  name: string;
  crop: SystemTable[];
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
};

export type PlantingsEdit = {
  crop_type: string;
  is_principal: boolean;
  crop_id: string;
  irrigation_frequency_id: string;
  commentary: string;
  created_at?: string;
  updated_at?: string;
  disabled_at?: string;
};

export const PlantingsEditDefault: PlantingsEdit = {
  crop_type: '',
  is_principal: true,
  crop_id: '',
  irrigation_frequency_id: '',
  commentary: '',
  created_at: '',
  updated_at: '',
  disabled_at: ''
};

export const PlantingDefault: Plantings = {
  id: '',
  name: '',
  crop: [],
  created_at: '',
  updated_at: '',
  disabled_at: ''
};
