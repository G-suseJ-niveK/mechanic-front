import React, { useState, useCallback, useEffect } from 'react';
import { Icon as Iconify } from '@iconify/react';
import ExcelIcon from '@iconify/icons-vscode-icons/file-type-excel';
import { OrganizationFormAttribute } from '~models/organizationFormAttribute';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import DataTable from '~ui/organisms/DataTable/ClientSide/DataTable';
import { TableHeadColumn } from '~ui/molecules/TableHead/TableHead';
import { getOrganizationForm, getOrganizationFormData } from '~services/organization/form';
import Breadcrumbs from '~ui/molecules/Breadcrumbs/Breadcrumbs';
import { OrganizationForm } from '~models/organizationForm';
import { Grid, Paper, Icon, Box } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import { showMessage } from '~utils/Messages';
import FormDataType from './components/FormDataType';
import routes from '~routes/routes';
import Button from '~atoms/Button/Button';
import * as XLSX from 'xlsx';
import { capitalizeAllWords } from '~utils/Word';

type DataOrganizationFormProps = {};

const DataOrganizationForm: React.FC<DataOrganizationFormProps> = () => {
  const history = useHistory();
  const [organizationForm, setOrganizationForm] = useState<OrganizationForm | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const { organization_form_id } = useParams();
  if (!organization_form_id) history.push(routes.organizationForm);
  const organizationFormId: string = organization_form_id !== undefined ? organization_form_id : '';
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [items, setItems] = useState<any[]>([]);
  const [headers, setHeaders] = useState<TableHeadColumn[]>([]);

  const loadOrganizationForm = useCallback(() => {
    setIsLoading(true);
    getOrganizationForm(organizationFormId)
      .then((res: any) => {
        setOrganizationForm(res.data.data);
        setIsLoading(false);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar el formulario.', 'error', true);
        setIsLoading(false);
        history.push(routes.organizationForm);
      });
  }, [organizationFormId, history]);

  const loadOrganizationFormData = useCallback(() => {
    getOrganizationFormData(organizationFormId)
      .then((res: any) => {
        setItems(res.data.data.Items);
        setIsDataLoading(false);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar los datos del formulario.', 'error', true);
        setIsDataLoading(false);
      });
  }, [organizationFormId]);

  useEffect(() => {
    loadOrganizationForm();
  }, [loadOrganizationForm]);

  useEffect(() => {
    loadOrganizationFormData();
  }, [loadOrganizationFormData]);

  useEffect(() => {
    const _setheaders: any = [];
    if (organizationForm?.name !== undefined) {
      _setheaders.push({
        sorteable: false,
        align: 'left',
        text: 'Productor',
        value: 'farmer',
        padding: 'none',
        render: (row: any) => {
          return (
            <FormDataType
              type="string"
              attribute={capitalizeAllWords((row?.farmer?.first_name || '') + ' ' + (row?.farmer?.last_name || ''))}
            />
          );
        }
      });
    }

    if (organizationForm?.form_type === 'farm') {
      _setheaders.push({
        sorteable: false,
        align: 'left',
        text: 'Parcela',
        value: 'farm_name_value',
        padding: 'none',
        render: (row: any) => {
          return <FormDataType type="string" attribute={row?.organization_forms_values['farm_name_value'] || ''} />;
        }
      });
    }
    organizationForm?.organization_form_attributes?.forEach((value: OrganizationFormAttribute) => {
      _setheaders.push({
        sorteable: false,
        align: 'left',
        text: value.display_name,
        value: value.name,
        padding: 'none',
        render: (row: any) => {
          return (
            <FormDataType type={value.attribute_type} attribute={row?.organization_forms_values[value?.name] || ''} />
          );
        }
      });
    });

    setHeaders(_setheaders);
  }, [organizationForm]);

  const downloadExcel = useCallback((s: any) => {
    const buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    const view = new Uint8Array(buf); //create uint8array as viewer
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
    return buf;
  }, []);

  const saveAs = useCallback((blob: any, fileName: any) => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }, []);

  const handleOnDownload = useCallback(() => {
    const sheetName = 'Formulario';
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: sheetName,
      Subject: ''
    };

    wb.SheetNames.push(sheetName);
    const colsWch: any[] = [];
    const wsHeaderName: string[] = [];
    const wsHeader: string[] = headers?.map((head: TableHeadColumn) => {
      colsWch.push({ wch: head?.text?.length + 5 });
      wsHeaderName.push(head.value);
      return head?.text;
    });

    const wsData: any[] = items?.map((value: any) => {
      const values: any[] = [];
      wsHeaderName.forEach((key: string) => {
        if (key === 'farmer') {
          values.push(capitalizeAllWords((value?.farmer?.first_name || '') + ' ' + (value?.farmer?.last_name || '')));
          return;
        }
        values.push(value?.organization_forms_values[key] || '');
      });
      return values;
    });

    const ws = XLSX.utils.aoa_to_sheet([wsHeader, ...wsData]);
    ws['!cols'] = [{ wch: 18 }, { wch: 18 }, { wch: 10 }, ...colsWch];
    wb.Sheets[sheetName] = ws;
    const workBook = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([downloadExcel(workBook)], { type: 'application/octet-stream' }), `${sheetName}.xlsx`);
  }, [downloadExcel, saveAs, items, headers]);

  return (
    <>
      <Box mb="20px">
        <Grid container>
          <Grid item={true} xs={12} sm={12} md={12} lg={6} xl={6}>
            <Box mr="10px" fontSize="1.7em" fontWeight={400} mb="5px" color="#0E4535">
              Datos del Formulario
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
          </Grid>

          <Grid
            item={true}
            xs={12}
            sm={12}
            md={12}
            lg={6}
            xl={6}
            sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button
              text="Descargar excel"
              variant="contained"
              onClick={handleOnDownload}
              startIcon={<Iconify icon={ExcelIcon} />}
            />
          </Grid>
        </Grid>
      </Box>

      {isLoading && (
        <Box mb={2}>
          <LinearProgress loading={true} />
        </Box>
      )}

      <Grid container={true} spacing={1}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper data-testid="Paper" elevation={3} sx={{ padding: '20px' }}>
            <DataTable headers={headers} items={items} loading={isDataLoading} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default DataOrganizationForm;
