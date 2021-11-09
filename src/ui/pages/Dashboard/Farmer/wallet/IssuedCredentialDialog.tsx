import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Grid } from '@material-ui/core';
import { selectCredentialsDefinitions } from '~services/digital_identity/credential/credential';
import CustomInput from './CustomInputs';
import { showMessage } from '~utils/Messages';
import SelectField from '~ui/atoms/SelectField/SelectField';
import Dialog from '~ui/molecules/Dialog/Dialog';
import Button from '~ui/atoms/Button/Button';

type CredentialComponentProps = {
  open: boolean;
  farmerId: string;
  onClose(isRefresh?: boolean): void;
  onSave(credentialId: any, values: any): Promise<any>;
};

const IssuedCredentialDialogComponent: React.FC<CredentialComponentProps> = (props: CredentialComponentProps) => {
  const { open, onClose, onSave } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDefinitionsLoading, setIsDefinitionsLoading] = useState<boolean>(true);
  const [definitions, setDefinitions] = useState<any[]>([]);
  const [selectedDefinition, setSelectedDefinition] = useState<any | undefined>(undefined);
  const [credentialValues, setCredentialValues] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});
  const isCompMounted = useRef(null);

  useEffect(() => {
    selectCredentialsDefinitions()
      .then((res: any) => {
        setDefinitions(res.data.data);
        setIsDefinitionsLoading(false);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar los certificados disponibles.', 'error', true);
        setIsDefinitionsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnChangeDefinition = useCallback(
    (name: any, value: any) => {
      definitions?.forEach((definition: any) => {
        if (definition?.id === value) {
          setSelectedDefinition(definition);
          setCredentialValues(definition?.credential_attributes ?? []);
        }
      });
    },
    [definitions]
  );

  const handleChange = useCallback((event: any) => {
    const { name, value } = event.target;
    setCredentialValues((prevValue: any[]) => {
      const newValues = prevValue.map((attribute: any) => {
        if (attribute?.name === name) {
          const newValues: any = Object.assign({}, attribute);
          newValues['value'] = value;
          return newValues;
        }
        return attribute;
      });
      return newValues;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
    onSave(selectedDefinition?.id, { credential_values: credentialValues })
      .then(() => {
        if (isCompMounted.current) {
          showMessage('', 'Certificado emitido.', 'success');
          onClose(true);
        }
      })
      .catch((err: any) => {
        if (isCompMounted.current) {
          const data = err?.response?.data;
          setErrors(data?.errors ?? {});
          setIsSubmitting(false);
          if (data?.error?.message !== undefined) {
            showMessage('', data?.error?.message, 'error', true);
            return;
          }
          if (data?.message !== undefined) {
            showMessage('', data?.message, 'error', true);
            return;
          }
          showMessage('', 'Problemas al emitir el certificado.', 'error', true);
        }
      });
  }, [onSave, onClose, credentialValues, selectedDefinition]);

  return (
    <div ref={isCompMounted}>
      <Dialog
        open={open}
        title="Emitir Certificado"
        subtitle="Selecciona un certificado disponible y llena los atributos solicitados"
        onClose={() => onClose()}
        actions={
          <>
            <Button text="Cancelar" onClick={() => onClose()} variant="outlined" disabled={isSubmitting} />
            <Button
              onClick={handleSubmit}
              color="primary"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              variant="contained"
              text="Emitir"
            />
          </>
        }>
        <Grid container={true} spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <SelectField
              id="definition"
              name="definition"
              label="Certificados"
              value={null}
              items={definitions}
              itemText="name"
              itemValue="id"
              onChange={handleOnChangeDefinition}
              disabled={isSubmitting}
              loading={isDefinitionsLoading}
            />
          </Grid>
          {credentialValues?.length > 0 && (
            <Box fontWeight="bold" fontSize="17px">
              Atributos del certificado
            </Box>
          )}
          {credentialValues?.map((attribute: any, index: number) => (
            <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12} key={`attribute_${index}`}>
              <CustomInput
                id={attribute?.name?.toLowerCase()}
                name={attribute?.name}
                input_type={attribute?.attribute_type}
                label={attribute?.name}
                value={attribute?.value}
                onChange={handleChange}
                disabled={isSubmitting}
                description={attribute?.description}
                possible_values={attribute?.possible_values ?? []}
                errors={errors}
              />
            </Grid>
          ))}
        </Grid>
      </Dialog>
    </div>
  );
};

export default IssuedCredentialDialogComponent;
