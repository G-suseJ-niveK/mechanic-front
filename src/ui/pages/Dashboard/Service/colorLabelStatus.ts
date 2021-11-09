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

export const getTextColorForSolicitudeStatus = (text: string) => {
  const colorText = '#FFFFFF';
  let colorBox = '';

  switch (text) {
    case 'sent_consult':
      colorBox = '#FFC107';
      break;
    case 'waiting_response':
      colorBox = '#2D9CDB';
      break;
    case 'responded':
      colorBox = '#67AE1C';
      break;
    case 'close':
      colorBox = '#BDBDBD';
      break;
    default:
      break;
  }
  return { colorText, colorBox };
};
