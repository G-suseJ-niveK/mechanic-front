import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import routes from '~routes/routes';
import { Card, Button, Box } from '@material-ui/core';
import Loading from '~ui/atoms/Loading';
import { showMessage } from '~utils/Messages';
import { getAdditionalDataFromFarmer, createAdditionalDataFromFarmer } from '~services/farmer';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { DataAdditionalProducer, DataAdditionalDefault } from '~models/dataAdditionalProducer';
import { AdditionalDataSidebar, AdditionalDataContent } from './Components/AdditionalDataTab';
import AdditonalDataDialog from './AdditonalDataDialog';
import { AxiosResponse } from 'axios';

type TabAdditionalDataProps = {};

const TabAdditionalData: React.FC<TabAdditionalDataProps> = () => {
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const { farmer_id } = useParams();
  if (!farmer_id) history.push(routes.farmers);
  const farmerId: string = farmer_id !== undefined ? farmer_id : '';
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataAdditionals, setDataAdditionals] = useState<DataAdditionalProducer[]>([]);
  const [dataAdditional, setDataAdditional] = useState<DataAdditionalProducer>(DataAdditionalDefault);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const handleChangeTab = (item: DataAdditionalProducer) => {
    setDataAdditional(item);
  };

  const _getAdditionalDataFromFarmer = useCallback(() => {
    getAdditionalDataFromFarmer(farmerId)
      .then((res: any) => {
        const data = res?.data?.data;
        setDataAdditionals(data);

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        showMessage('', 'Problemas al cargar los datos del formulario del productor.', 'error', true);
        history.push(routes.farmers);
      });
  }, [farmerId, history]);

  const handleCloseDialog = useCallback(
    (isUpdated?: boolean) => {
      if (isUpdated !== undefined && isUpdated) {
        _getAdditionalDataFromFarmer();
      }

      setIsOpenDialog((prevValue: boolean) => !prevValue);
    },
    [_getAdditionalDataFromFarmer]
  );

  const handleSaveDialog = useCallback(
    (data: any): Promise<AxiosResponse<any>> => {
      return createAdditionalDataFromFarmer(farmerId, data);
    },
    [farmerId]
  );

  useEffect(() => {
    _getAdditionalDataFromFarmer();
  }, [_getAdditionalDataFromFarmer]);

  return (
    <>
      <Loading
        isLoading={isLoading}
        figureProgress={<LinearProgress loading={true} />}
        isData={dataAdditionals?.length > 0}
        infoIsData={
          <Box height="300px" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              style={{ background: '#F2994A' }}
              startIcon={<ArrowUpwardIcon />}
              onClick={() => handleCloseDialog()}
              component="span">
              Subir archivos
            </Button>
            <Box mt="20px">No hay datos recopilados</Box>
          </Box>
        }>
        <Card sx={{ height: { md: '70vh' }, display: { md: 'flex' } }}>
          <AdditionalDataSidebar items={dataAdditionals} handleChangeTab={handleChangeTab} />
          <AdditionalDataContent item={dataAdditional} handleCloseDialog={handleCloseDialog} />
        </Card>
      </Loading>
      {isOpenDialog && (
        <AdditonalDataDialog open={isOpenDialog} closeAction={handleCloseDialog} saveAction={handleSaveDialog} />
      )}
    </>
  );
};

export default React.memo(TabAdditionalData);
