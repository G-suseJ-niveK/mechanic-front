import React, { useCallback, useState, useEffect } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid, Box } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '~ui/atoms/Button/Button';
import { AxiosResponse } from 'axios';
import { showMessage } from '~utils/Messages';
import { Farmer } from '~models/farmer';
import Autocomplete from '~ui/atoms/Autocomplete/Autocomplete';
import { listAllDepartments, listAllDistrictsOfProvince, listAllProvincesOfDepartment } from '~services/department';
import TextField from '~ui/atoms/TextField/TextField';
import { updateFarmerLocation } from '~services/farmer';

type FarmerLocationDialogProps = {
  farmer?: Farmer;
  closeAction(isRefresh?: boolean): void;
  saveAction(farmer: Farmer): Promise<AxiosResponse<any>>;
};

const FarmerLocationDialog: React.FC<FarmerLocationDialogProps> = (props: FarmerLocationDialogProps) => {
  const { closeAction, farmer } = props;

  const [departments, setDepartments] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [isProvincesLoading, setIsProvincesLoading] = useState<boolean>(false);
  const [districts, setDistricts] = useState<any[]>([]);
  const [isDistrictsLoading, setIsDistrictsLoading] = useState<boolean>(false);

  const newAgroLeader: any = {
    id: farmer?.id || '',
    first_name: farmer?.first_name || '',
    last_name: farmer?.last_name || '',
    full_name: farmer?.full_name || '',
    dni: farmer?.dni || '',
    phone_carrier: farmer?.phone_carrier || '',
    email: farmer?.email || '',
    phone: farmer?.phone || '',
    whatsapp_number: farmer?.whatsapp_number || '',
    country_id: farmer?.country_id || '',
    department_id: farmer?.department_id || '',
    province_id: farmer?.province_id || '',
    district_id: farmer?.district_id || '',
    hamlet: farmer?.hamlet || '',
    reference: farmer?.reference || ''
  };

  // validation
  const validationSchema = yup.object().shape({
    phone: yup.string().required('Campo requerido.')
  });

  const formik = useFormik({
    initialValues: newAgroLeader,
    onSubmit: (farmer: Farmer) => {
      //Verifica Phone
      updateFarmerLocation(farmer.id || '', farmer)
        .then((res: any) => {
          const message = res?.data?.data?.message;
          showMessage('', message, 'success');
          closeAction(true);
        })
        .catch((err: any) => {
          const errorMessage = 'Problemas al actualizar al productor.';
          const data = err?.response?.data;
          if (data?.hasOwnProperty('error')) {
            showMessage('', data?.error?.message ?? errorMessage, 'error', true);
          } else if (data?.hasOwnProperty('errors')) {
            formik.setErrors(data.errors);
          } else {
            showMessage('', errorMessage, 'error', true);
          }
          formik.setSubmitting(false);
        });
    },
    validationSchema
  });

  const onSubmit = useCallback(async () => {
    await formik.setErrors({});
    formik.handleSubmit();
  }, [formik]);

  const handleListAllProvincesOfDepartment = useCallback((department_id: string) => {
    setIsProvincesLoading(true);
    listAllProvincesOfDepartment(department_id)
      .then((res: any) => {
        const data = res.data.data;
        setProvinces(data);
        setIsProvincesLoading(false);
      })
      .catch(() => {
        setIsProvincesLoading(false);
        showMessage('', 'Problemas al cargar las provincias.', 'error', true);
      });
  }, []);

  const handleOnChangeDepartment = useCallback(
    (name: string, value: any) => {
      formik.setFieldValue(name, value);
      formik.setFieldValue('province_id', '');
      formik.setFieldValue('district_id', '');
      setProvinces([]);
      setDistricts([]);

      if (value !== null) {
        handleListAllProvincesOfDepartment(value);
      }
    },
    [formik, handleListAllProvincesOfDepartment]
  );

  const handleListAllDistrictsOfProvince = useCallback((department_id: string, district_id: string) => {
    setIsDistrictsLoading(true);

    listAllDistrictsOfProvince(department_id, district_id)
      .then((res: any) => {
        const data = res.data.data;
        setDistricts(data);
        setIsDistrictsLoading(false);
      })
      .catch(() => {
        setIsDistrictsLoading(false);
        showMessage('', 'Problemas al cargar las provincias.', 'error', true);
      });
  }, []);

  const handleOnChangeProvince = useCallback(
    (name: string, value: any) => {
      formik.setFieldValue(name, value);
      formik.setFieldValue('district_id', '');
      setDistricts([]);

      if (value !== null) {
        formik.setFieldValue(name, value);
        handleListAllDistrictsOfProvince(formik?.values?.department_id || '', value);
      }
    },
    [formik, handleListAllDistrictsOfProvince]
  );

  const handleOnChangeDistrict = useCallback(
    (name: string, value: any) => {
      formik.setFieldValue(name, value);
    },
    [formik]
  );

  useEffect(() => {
    listAllDepartments()
      .then((res: any) => {
        const data = res?.data?.data;
        setDepartments(data);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar los departamentos.', 'error', true);
      });
  }, []);

  useEffect(() => {
    if (farmer?.department_id) {
      handleListAllProvincesOfDepartment(farmer?.department_id);
      if (farmer?.province_id) {
        handleListAllDistrictsOfProvince(farmer?.department_id, farmer?.province_id);
      }
    }
  }, [farmer, handleListAllProvincesOfDepartment, handleListAllDistrictsOfProvince]);

  return (
    <Dialog
      open={true}
      onClose={() => null}
      actions={
        <>
          <Button onClick={() => closeAction()} variant="outlined" disabled={formik.isSubmitting} text="Cancelar" />

          <Button
            onClick={() => onSubmit()}
            color="primary"
            variant="contained"
            disabled={formik.isSubmitting}
            isLoading={formik.isSubmitting}
            text={'Guardar'}
          />
        </>
      }>
      <Box>INFORMACIÓN DE DOMICILIO</Box>
      <Grid container spacing={1}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Autocomplete
            id="department_id"
            name="department_id"
            label="Departamento"
            items={departments}
            onChange={handleOnChangeDepartment}
            value={formik.values.department_id}
            selectedValue={formik.values.department_id}
            defaultValue={null}
            itemText="description"
            itemValue="id"
            disabled={formik.isSubmitting}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Autocomplete
            id="province_id"
            name="province_id"
            label="Provincia"
            items={provinces}
            isDataLoading={isProvincesLoading}
            onChange={handleOnChangeProvince}
            value={formik.values.province_id}
            selectedValue={formik.values.province_id}
            defaultValue={null}
            itemText="description"
            itemValue="id"
            disabled={formik.isSubmitting}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Autocomplete
            id="district_id"
            name="district_id"
            label="Distrito"
            items={districts}
            isDataLoading={isDistrictsLoading}
            onChange={handleOnChangeDistrict}
            value={formik.values.district_id}
            selectedValue={formik.values.district_id}
            defaultValue={null}
            itemText="description"
            itemValue="id"
            disabled={formik.isSubmitting}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="hamlet"
            name="hamlet"
            type="text"
            label="Caserio"
            value={formik.values.hamlet}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <TextField
            id="reference"
            name="reference"
            type="text"
            label="Referencia"
            value={formik.values.reference}
            onChange={formik.handleChange}
            disabled={formik.isSubmitting}
            errors={formik.errors}
            touched={formik.touched}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default React.memo(FarmerLocationDialog);
