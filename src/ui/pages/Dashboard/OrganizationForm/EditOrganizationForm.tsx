import React, { useCallback, useState, useEffect } from 'react';
import { OrganizationFormAttribute, OrganizationFormAttributeType } from '~models/organizationFormAttribute';
import { Box, Icon, Stack, Grid } from '@material-ui/core';
import { Switch, Paper, FormControlLabel, Checkbox } from '@material-ui/core';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import {
  createOrganizationFormAttributes,
  getOrganizationForm,
  deleteOrganizationForm
} from '~services/organization/form';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import { OrganizationForm } from '~models/organizationForm';
import { useParams, useHistory } from 'react-router-dom';
import TextField from '~ui/atoms/TextField/TextField';
import Scrollbar from '~ui/atoms/Scrollbar/Scrollbar';
import { showMessage, showDeleteQuestion } from '~utils/Messages';
import FormItem from './components/FormItem';
import routes from '~routes/routes';
import Button from '~atoms/Button/Button';
import ListOfOptionsComponent from './components/ListOfOptions';
import { inputPermiteASCII } from '~utils/inputs';
import { Droppable, DragDropContext, DropResult } from 'react-beautiful-dnd';
import SelectField from '~ui/atoms/SelectField/SelectField';
import { Prompt } from 'react-router-dom';

type ShowOrganizationFormComponentProps = {};

const categories = [
  { id: '', description: 'Seleccionar categoria' },
  { id: 'personal', description: 'Información personal' },
  { id: 'productive', description: 'Información productiva' },
  { id: 'economic', description: 'Información económica' }
];

const fieldsPlaceholders: any = {
  number: 'Ingrese la pregunta. Ejemplo: ¿Cuántas plantas hay en la parcela?',
  string: 'Ingrese la pregunta. Ejemplo: Describa el estado de la parcela.',
  date: 'Ingrese la pregunta. Ejemplo: Fecha de último abono.',
  photo: 'Ingrese la pregunta. Ejemplo: Fotografía del campo.',
  signature: 'Ingrese la pregunta. Ejemplo: Firma del productor.',
  gps_point: 'Ingrese la pregunta. Ejemplo: GPS de la parcela.',
  georeference: 'Ingrese la pregunta. Ejemplo: Georreferencia de la parcela.',
  list_options: 'Ingrese la pregunta. Ejemplo: Seleccione  la opción.'
};

const ShowOrganizationFormComponent: React.FC<ShowOrganizationFormComponentProps> = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPreventExit, setIsPreventExit] = useState<boolean>(true);
  const [isCreateSave, setIsCreateSave] = useState<boolean>(false);
  const [isDeleteSave, setIsDeleteSave] = useState<boolean>(false);
  const [isSameName, setIsSameName] = useState<boolean>(true);
  const [errors, setErrors] = useState<any>();
  const [textFieldPlaceholder, setTextFieldPlaceholder] = useState<string>('');
  const [organizationForm, setOrganizationForm] = useState<OrganizationForm | undefined>(undefined);
  const [currentAttribute, setCurrentAttribute] = useState<any | undefined>(undefined);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [attributes, setAttributes] = useState<OrganizationFormAttribute[]>([]);
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const { organization_form_id } = useParams();
  if (!organization_form_id) history.push(routes.organizationForm);
  const organizationFormId: string = organization_form_id !== undefined ? organization_form_id : '';

  const loadOrganizationForm = useCallback(() => {
    setIsLoading(true);
    getOrganizationForm(organizationFormId)
      .then((res: any) => {
        setOrganizationForm(res.data.data);
        setAttributes(res.data?.data?.organization_form_attributes ?? []);
        setIsLoading(false);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar el formulario.', 'error', true);
        setIsLoading(false);
        history.push(routes.organizationForm);
      });
  }, [organizationFormId, history]);

  const handleAddAttribute = useCallback((type: OrganizationFormAttributeType) => {
    setTextFieldPlaceholder(fieldsPlaceholders[type]);
    setAttributes((prevValues: OrganizationFormAttribute[]) => {
      const newAttribute = {
        name: '',
        display_name: '',
        description: '',
        attribute_type: type,
        category: '',
        possible_values: [],
        is_required: true,
        is_public: false
      };
      prevValues.push(newAttribute);
      setCurrentAttribute(() => {
        return Object.assign({}, { ...newAttribute, index: prevValues.length - 1 });
      });
      setCurrentIndex(prevValues.length - 1);
      return [...prevValues];
    });
  }, []);

  const handleOnDuplicateAttribute = useCallback(async (attribute: OrganizationFormAttribute) => {
    await setAttributes((prevValues: OrganizationFormAttribute[]) => {
      const duplicateAttribute = Object.assign({}, attribute);
      duplicateAttribute.name = '';
      prevValues.push(duplicateAttribute);
      return [...prevValues];
    });
    setCurrentAttribute(undefined);
    setCurrentIndex(-1);
  }, []);

  const handleRemoveAttribute = useCallback((index: number) => {
    showDeleteQuestion('ADVERTENCIA', 'Está seguro de eliminar el componente').then(async (result: any) => {
      if (result) {
        setAttributes((prevValue: OrganizationFormAttribute[]) => {
          const newValues = prevValue.filter((_attribute: OrganizationFormAttribute, idx: number) => idx !== index);
          return newValues;
        });
        setCurrentAttribute(undefined);
        setCurrentIndex(-1);
      }
    });
  }, []);

  const handleOnChangeField = useCallback(
    (e: any) => {
      const { name, value } = e.target;
      setCurrentAttribute((prevValue: OrganizationFormAttribute | undefined) => {
        const newValue: any = Object.assign({}, prevValue);
        if (name === 'name') {
          newValue['name'] = inputPermiteASCII(value);
        } else {
          newValue[name] = value;
          if (name === 'display_name' && isSameName) {
            newValue['name'] = inputPermiteASCII(value);
          }
        }
        return newValue;
      });
    },
    [isSameName]
  );

  const handleOnChangeSelectField = useCallback(
    (name: any, value: any) => {
      setCurrentAttribute((prevValue: OrganizationFormAttribute | undefined) => {
        const newValue: any = Object.assign({}, prevValue);
        if (name === 'name') {
          newValue['name'] = inputPermiteASCII(value);
        } else {
          newValue[name] = value;
          if (name === 'display_name' && isSameName) {
            newValue['name'] = inputPermiteASCII(value);
          }
        }
        return newValue;
      });
    },
    [isSameName]
  );

  const handleOnSaveAttribute = useCallback(
    (possible_values?: any[]) => {
      if (currentAttribute?.display_name === '') {
        setErrors({ display_name: 'Ingrese la pregunta.' });
        showMessage('', 'Ingrese la pregunta.', 'error', true);
        return;
      }
      if (currentAttribute?.name === '') {
        setErrors({ name: 'Ingrese el nombre interno.' });
        showMessage('', 'Ingrese el nombre interno.', 'error', true);
        return;
      }
      if (currentAttribute?.attribute_type === 'list_options') {
        const verifyPossibleValues = possible_values?.some((prevValue: string) => prevValue === '');
        if (verifyPossibleValues) {
          showMessage('', 'Complete la lista de opciones.', 'error', true);
          return;
        }
        if (possible_values?.length === 0) {
          showMessage('', 'Ingrese la lista de opciones.', 'error', true);
          return;
        }
      }

      const result = attributes?.some(
        (attrib: OrganizationFormAttribute, index: number) =>
          attrib.name === currentAttribute?.name && index !== currentAttribute.index
      );
      if (result) {
        setErrors({ name: 'El nombre interno ya se encuentra registrado.' });
        showMessage('', 'El nombre interno ya se encuentra registrado.', 'error', true);
        return;
      }

      setErrors({});
      setAttributes((prevValue: any[]) => {
        const newValues = prevValue.map((attribute: any, idx: number) => {
          if (idx === currentAttribute.index) {
            const newCurrentAttribute: any = Object.assign({}, currentAttribute);
            delete newCurrentAttribute.index;
            if (possible_values !== undefined) {
              newCurrentAttribute.possible_values = possible_values;
            }
            const newValues: any = Object.assign({}, newCurrentAttribute);
            return newValues;
          }
          return attribute;
        });
        return newValues;
      });
      showMessage('', 'Pregunta registrada.', 'success');
    },
    [currentAttribute, attributes]
  );

  const handleOnChange = useCallback((value: OrganizationFormAttribute, index: number) => {
    setCurrentIndex(index);
    setCurrentAttribute({ ...value, index });
    setTextFieldPlaceholder(fieldsPlaceholders[value.attribute_type]);
  }, []);

  const handleRemoveOrganizationForm = useCallback(() => {
    showDeleteQuestion('ADVERTENCIA', 'Está seguro de eliminar el formulario').then(async (result: any) => {
      if (result) {
        setIsDeleteSave(true);
        deleteOrganizationForm(organizationFormId)
          .then(() => {
            setIsPreventExit(false);
            showMessage('', 'Formulario eliminado.', 'success');
            history.push(routes.organizationForm);
          })
          .catch(() => {
            setIsDeleteSave(false);
            showMessage('', 'Problemas al eliminar el Formulario.', 'error', true);
          });
      }
    });
  }, [organizationFormId, history]);

  const handleSaveOrganizationForm = useCallback(() => {
    const verify = attributes?.some((attrib: OrganizationFormAttribute) => attrib.name === '');
    if (verify) {
      showMessage('', 'Verifique que todos los atributos tengan nombre interno.', 'error', true);
      return;
    }
    setIsCreateSave(true);
    const values: OrganizationForm = Object.assign({}, organizationForm);
    values.organization_form_attributes = attributes;
    createOrganizationFormAttributes(values)
      .then(() => {
        setIsCreateSave(false);
        setIsPreventExit(false);
        showMessage('', 'Formulario actualizado.', 'success');
        history.push(`${routes.organizationForm}`);
      })
      .catch((err: any) => {
        setIsCreateSave(false);
        const errorMessage = 'Problemas al registrar los atributos.';
        const data = err?.response?.data;
        if (data?.hasOwnProperty('error')) {
          showMessage('', data?.error?.message ?? errorMessage, 'error', true);
        } else {
          showMessage('', errorMessage, 'error', true);
        }
      });
  }, [organizationForm, attributes, history]);

  const handleOnChangeSameName = useCallback((_event: any) => {
    setIsSameName((prevValue: boolean) => !prevValue);
  }, []);

  useEffect(() => {
    loadOrganizationForm();
  }, [loadOrganizationForm]);

  const handleOnDragEnd = useCallback((result: DropResult): void => {
    const { source, destination } = result;
    if (destination === undefined || destination === null) return;
    if (destination.index === source.index) return;
    setAttributes((attribute: OrganizationFormAttribute[]) => {
      const auxValue = Object.assign({}, attribute[source.index]);
      // eslint-disable-next-line @typescript-eslint/typedef
      const prevValues = attribute.filter((_, index: number) => index !== source.index);
      prevValues.splice(destination.index, 0, auxValue);
      return prevValues;
    });
  }, []);

  return (
    <>
      {isPreventExit && <Prompt message="¿Estás seguro de salir?" when={true} />}
      <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color="#0E4535">
        Formulario
      </Box>
      <Breadcrumbs
        breadcrumbs={[
          {
            path: routes.dashboard,
            component: <Icon fontSize="small">home</Icon>
          },
          {
            path: routes.organizationForm,
            component: 'Formularios'
          },
          {
            component: organizationForm?.display_name
          }
        ]}
      />
      <Box mt={1} p={1.5} display="flex" justifyContent="flex-end">
        <Button
          text="Eliminar"
          variant="contained"
          disabled={isDeleteSave || isCreateSave}
          isLoading={isDeleteSave}
          sx={{
            bgcolor: '#EB5757',
            '&:hover': {
              bgcolor: '#eb5757e6'
            }
          }}
          endIcon={<Icon>delete</Icon>}
          onClick={handleRemoveOrganizationForm}
        />
        <Button
          text="Guardar"
          disabled={isCreateSave || isDeleteSave}
          isLoading={isCreateSave}
          variant="contained"
          sx={{
            bgcolor: '#2D9CDB',
            '&:hover': {
              bgcolor: '#2D9CDBe6'
            }
          }}
          endIcon={<Icon>save</Icon>}
          onClick={handleSaveOrganizationForm}
        />
      </Box>
      {isLoading && <LinearProgress loading={true} />}

      {/* LIST OPTIONS */}
      <Box mt={1} p={1.5} style={{ background: '#F8F4F4' }}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Box
            display="flex"
            alignItems="center"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleAddAttribute('number')}>
            <Icon fontSize="small">category</Icon>
            <Box>Números</Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleAddAttribute('string')}>
            <Icon fontSize="small">text_fields</Icon>
            <Box>Campo de texto</Box>
          </Box>
          <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => handleAddAttribute('date')}>
            <Icon fontSize="small">calendar_today</Icon>
            <Box>Fecha</Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleAddAttribute('photo')}>
            <Icon fontSize="small">add_a_photo</Icon>
            <Box>Fotografía</Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleAddAttribute('signature')}>
            <Icon fontSize="small">edit</Icon>
            <Box>Firma</Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleAddAttribute('gps_point')}>
            <Icon fontSize="small">room</Icon>
            <Box>Punto GPS</Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleAddAttribute('georeference')}>
            <Icon fontSize="small">map</Icon>
            <Box>Georreferencia</Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleAddAttribute('list_options')}>
            <Icon fontSize="small">list</Icon>
            <Box>Lista de opciones</Box>
          </Box>
        </Stack>
      </Box>

      <Box p={1} mt={3}>
        <Grid container spacing={1}>
          {/* PHONE */}
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6} style={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              width="20em"
              height="39em"
              maxHeight="45em"
              borderRadius="66px"
              borderColor="#ACCCF8"
              position="relative"
              style={{
                borderStyle: 'solid',
                borderWidth: '5px',
                background: '#fdfdfd'
              }}>
              <Box
                style={{
                  position: 'absolute',
                  width: '210px',
                  height: '25px',
                  left: '3em',
                  zIndex: 4,
                  background: '#ACCCF8',
                  borderBottomLeftRadius: '24px',
                  borderBottomRightRadius: '24px'
                }}
              />

              <Box mt="40px">
                <Box sx={{ textAlign: 'center' }} fontWeight={700} fontSize="1.2em">
                  {organizationForm?.display_name}
                </Box>
                <Scrollbar
                  sx={{
                    height: '31em',
                    maxHeight: '38em',
                    '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
                  }}>
                  <Box p={0.2} mt={2}>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                      <Droppable droppableId="0">
                        {(provided: any) => (
                          <div ref={provided?.innerRef}>
                            {attributes?.map((attribute: OrganizationFormAttribute, idx: number) => (
                              <FormItem
                                index={idx}
                                sx={{ bgcolor: idx === currentIndex && '#c4c4c46e' }}
                                onClick={() => handleOnChange(attribute, idx)}
                                key={`form_item_${idx}`}
                                attribute={attribute}
                                onDelete={() => handleRemoveAttribute(idx)}
                                onDuplicate={() => handleOnDuplicateAttribute(attribute)}
                                position={idx + 1}
                              />
                            ))}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </Box>
                </Scrollbar>
              </Box>
            </Box>
          </Grid>

          {/* ATTRIBUTES */}
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            {currentAttribute !== undefined && (
              <Paper elevation={4} sx={{ p: '10px' }}>
                <Grid container={true} spacing={2}>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      id="display_name"
                      name="display_name"
                      type="text"
                      autoComplete="off"
                      label="Pregunta"
                      placeholder={textFieldPlaceholder}
                      value={currentAttribute?.display_name}
                      onChange={(e: any) => handleOnChangeField(e)}
                      errors={errors}
                      touched={errors}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="off"
                      label="Nombre Interno"
                      placeholder="Ingrese el nombre interno"
                      value={currentAttribute?.name}
                      onChange={(e: any) => handleOnChangeField(e)}
                      errors={errors}
                      touched={errors}
                    />
                  </Grid>

                  <Grid
                    item={true}
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <FormControlLabel
                      label="Usar el mismo nombre"
                      control={<Checkbox checked={isSameName} />}
                      onChange={handleOnChangeSameName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <SelectField
                      id="category"
                      name="category"
                      label="Categoria de la pregunta"
                      items={categories}
                      value={currentAttribute?.category}
                      onChange={handleOnChangeSelectField}
                      itemText="description"
                      itemValue="id"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      id="description"
                      name="description"
                      type="text"
                      autoComplete="off"
                      label="Descripción (opcional)"
                      value={currentAttribute?.description}
                      onChange={(e: any) => handleOnChangeField(e)}
                      rowsMax={4}
                      multiline
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <FormControlLabel
                      sx={{ marginLeft: '0' }}
                      label="Pregunta obligatoria"
                      labelPlacement="start"
                      control={
                        <Switch
                          onChange={(e: any) =>
                            handleOnChangeField({ target: { name: e?.target?.name, value: e?.target?.checked } })
                          }
                          checked={currentAttribute?.is_required}
                          name="is_required"
                          id="is_required"
                        />
                      }
                    />
                  </Grid>
                  {currentAttribute?.attribute_type === 'list_options' ? (
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ListOfOptionsComponent
                        onSave={handleOnSaveAttribute}
                        currentItems={currentAttribute?.possible_values}
                      />
                    </Grid>
                  ) : (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button text="Guardar" variant="contained" onClick={() => handleOnSaveAttribute()} />
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ShowOrganizationFormComponent;
