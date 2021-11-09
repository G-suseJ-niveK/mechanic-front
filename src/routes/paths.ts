// routes
// import { PATH_DASHBOARD } from '../../routes/paths';

const sidebarConfig = [
  {
    subheader: 'Visualización',
    items: [
      {
        title: 'Análisis',
        path: '/dashboard',
        icon: 'timeline'
      }
    ]
  },
  {
    subheader: 'PERFILES',
    items: [
      {
        title: 'Productores',
        path: '/dashboard/farmers',
        icon: 'person',
        children: [
          {
            path: '/dashboard/file_summury',
            title: 'Resumen de archivos'
          }
        ]
      },
      {
        title: 'Promotores de Identidad',
        path: '/dashboard/farm_agent',
        icon: 'group'
      }
    ]
  },
  {
    subheader: 'Recolección de Datos',
    items: [
      {
        title: 'Formularios',
        path: '/dashboard/organization_form',
        icon: 'description',
        children: [
          {
            path: '/dashboard/organization_form_delete',
            title: 'Formularios eliminados'
          }
        ]
      }
    ]
  },
  {
    subheader: 'ASESORÍAS',
    items: [
      {
        title: 'Mis Asesorías',
        path: '/dashboard/more_services',
        icon: 'star-filled'
      }
    ]
  },
  {
    subheader: 'Configuraciones',
    items: [
      {
        title: 'Sobre la organización',
        path: '/dashboard/organization/profile',
        icon: 'settings'
      }
    ]
  }
];

export default sidebarConfig;
