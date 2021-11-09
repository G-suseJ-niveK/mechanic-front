export const getErrorMessageFileRecord = (value: string): string => {
  let labelText = '';
  switch (value) {
    case 'error':
      labelText = 'Problemas al registrar al productor.';
      break;
    case 'dni_already_registered':
      labelText = 'El DNI ya se encuentra registrado.';
      break;
    case 'phone_already_registered':
      labelText = 'El celular ya se encuentra registrado.';
      break;
    case 'whatsapp_already_registered':
      labelText = 'El numero WhatsApp ya se encuentra registrado.';
      break;
    case 'not_have_contact_media':
      labelText = 'El productor debe poseer un número de contacto.';
      break;
    case 'phone_not_have_9_digits':
      labelText = 'El número de celular debe tener 9 digitos.';
      break;
    case 'whatsapp_not_have_9_digits':
      labelText = 'El número de WhatsApp debe tener 9 digitos.';
      break;
    case 'dni_not_found':
      labelText = 'DNI no encontrado.';
      break;
    case 'name_not_found_in_dni':
      labelText = 'No se encontró el nombre del productor en el DNI registrado.';
      break;
    case 'last_name_not_found_in_dni':
      labelText = 'No se encontró el apellido del productor en el DNI registrado.';
      break;
    case 'name_last_name_dni_not_found':
      labelText = 'Problemas con el nombre, apellido o DNI del productor.';
      break;
    default:
      labelText = 'Problemas al registrar al productor';
      break;
  }
  return labelText;
};
