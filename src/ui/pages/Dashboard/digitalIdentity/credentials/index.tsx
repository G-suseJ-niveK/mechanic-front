import React, { useRef, useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Paper from '~ui/atoms/Paper/Paper';
import DataTable from '~ui/organisms/DataTable/ClientSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import { showMessage } from '~/utils/Messages';
import { getCredentialsDefinitions } from '~services/digital_identity/credential/credential';

type CredentialComponentProps = {};

const CredentialComponent: React.FC<CredentialComponentProps> = () => {
  const isCompMounted = useRef(null);
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getCredentialsDefinitions()
      .then((res: any) => {
        if (isCompMounted.current) {
          setItems(res?.data?.data ?? []);
          setIsLoading(false);
        }
      })
      .catch((err: any) => {
        if (isCompMounted.current) {
          setIsLoading(false);
          const data = err?.response?.data;
          if (data?.status && data?.error?.message) {
            showMessage('', data?.error?.message, data?.status, data?.status === 'error' ? true : false);
          } else {
            showMessage('', 'Problemas al cargar las conexiones.', 'error', true);
          }
        }
      });
  }, []);

  useEffect(() => {
    setHeaders([
      {
        sorteable: true,
        align: 'left',
        text: 'Nombre',
        value: 'name'
      },
      {
        sorteable: true,
        align: 'center',
        text: 'Atributos',
        value: 'attributes',
        render: (value: any) => value?.credential_attributes?.map((attribute: any) => attribute?.name).join(', ')
      },
      { sorteable: true, align: 'center', text: 'Versión', value: 'version' }
    ]);
  }, []);

  return (
    <>
      <Grid container={true} ref={isCompMounted}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper title="Definición de Certificados">
            <Grid container={true}>
              <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
                <DataTable headers={headers} stickyHeader={false} items={items} loading={isLoading} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default CredentialComponent;
