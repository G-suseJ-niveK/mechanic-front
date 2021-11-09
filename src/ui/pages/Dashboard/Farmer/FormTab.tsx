import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Card } from '@material-ui/core';
import routes from '~routes/routes';
import { FormList, FormSidebar } from './Components/FormTab';
import { getFormsFromFarmer } from '~services/farmer';
import { showMessage } from '~utils/Messages';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import Loading from '~ui/atoms/Loading';
import { OrganizationFormProducer, FormMade, FormMadeDefault } from '~models/organizationFormAttribute';

type TabFormProps = {};

const TabForm: React.FC<TabFormProps> = () => {
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const { farmer_id } = useParams();
  if (!farmer_id) history.push(routes.farmers);
  const farmerId: string = farmer_id !== undefined ? farmer_id : '';
  const [forms, setForms] = useState<OrganizationFormProducer[]>([]);
  const [formMade, setFormMade] = useState<FormMade>(FormMadeDefault);
  const [formName, setFormName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleFormItem = useCallback((formMade: FormMade, formName: string) => {
    setFormMade(formMade);
    setFormName(formName);
  }, []);

  useEffect(() => {
    getFormsFromFarmer(farmerId)
      .then((res: any) => {
        const data = res?.data?.data;
        setForms(data);

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        showMessage('', 'Problemas al cargar los datos del formulario del productor.', 'error', true);
        history.push(routes.farmers);
      });
  }, [farmerId, history, setIsLoading]);

  return (
    <Loading isLoading={isLoading} figureProgress={<LinearProgress loading={true} />} isData={forms?.length > 0}>
      <Card sx={{ height: { md: '72vh' }, display: { md: 'flex' } }}>
        <FormSidebar labels={forms} handleFormItem={handleFormItem} />
        <FormList formItem={formMade} description_name={formName} />
      </Card>
    </Loading>
  );
};

export default React.memo(TabForm);
