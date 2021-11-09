export const GetTextColorForStatusFarmer = (text: number) => {
  let color = '#56A60A';
  if (text < 40) {
    color = '#D52E0A';
  } else if (text < 90) {
    color = '#FFCB0A';
  }
  return color;
};

export const GetTextColorForStatusTabGeneral = (text: string) => {
  let colorText = '#9E2A2A';
  let ColorBox = '#FFE0E0';

  switch (text) {
    case 'verified':
      colorText = '#007F00';
      ColorBox = '#CDFFCD';
      break;
    case 'waiting_verification_minagri':
      colorText = '#BD9500';
      ColorBox = '#FFF4CD';
      break;
    case 'waiting_verification_agros':
      colorText = '#BD9500';
      ColorBox = '#FFF4CD';
      break;
    case 'pending':
      colorText = '#BD9500';
      ColorBox = '#FFF4CD';
      break;
    default:
      break;
  }
  return { colorText, ColorBox };
};

export const getStatusColorCredentials = (value: string) => {
  let colorText = '';
  let ColorBox = '#FFFFFF';
  switch (value) {
    case 'Ofertado':
      ColorBox = '#2D9CDB';
      break;
    case 'Requerido':
      ColorBox = '#D0F9F1';
      break;
    case 'Emitido':
      ColorBox = '#96C262';
      break;
    case 'Revocado':
      ColorBox = '#828282';
      break;
    case 'Rechazado':
      ColorBox = '#EB5757';
      break;
    case 'solicitado':
      ColorBox = '#f2c94c';
      break;
    default:
      ColorBox = '';
      colorText = '#FFFFFF';
      break;
  }
  return { colorText, ColorBox };
};

export const getStatusColorFarmer = (value: string) => {
  let colorText = '#FFFFFF';
  let colorBox = '#FFFFFF';
  let labelText = '';
  switch (value) {
    case 'unregistered':
      colorBox = '#828282';
      labelText = 'No registrado';
      break;
    case 'unverified':
      colorBox = '#92C1E3';
      labelText = 'Sin verificar';
      break;
    case 'verified':
      colorBox = '#6FCF97';
      labelText = 'Verificado';
      break;
    default:
      colorBox = '';
      colorText = '#FFFFFF';
      break;
  }
  return { colorText, colorBox, labelText };
};

export const getStatusFarmerFileRecord = (value: string) => {
  let colorText = '#FFFFFF';
  let colorBox = '#FFFFFF';
  let labelText = '';
  switch (value) {
    case 'processing':
      colorBox = '#828282';
      labelText = 'Procesando';
      break;
    case 'pending':
      colorBox = '#81945d';
      labelText = 'En espera';
      break;
    case 'error':
      colorBox = '#F68F6E';
      labelText = 'Error';
      break;
    case 'registered':
      colorBox = '#6FCF97';
      labelText = 'Revisado';
      break;
    default:
      colorBox = '';
      colorText = '#FFFFFF';
      break;
  }
  return { colorText, colorBox, labelText };
};
