export type SystemTable = {
  id?: string;
  name: string;
  description: string;
};

export const SystemTableDefault: SystemTable = {
  id: '-1',
  name: '',
  description: ''
};
