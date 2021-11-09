import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import routes from '~routes/routes';
import { Typography, Paper, Icon, Box, Grid, Button } from '@material-ui/core';
// import { getAllCredentialFromConnection, issuedCredential } from '~services/digital_identity/credential/credential';
import RoomIcon from '@material-ui/icons/Room';
import MapContainer from './Map';
import { COMMUNITY_BASE_URL_S3 } from '~config/environment';
import PhotosSlider from '~ui/molecules/PhotosSlider/PhotosSlider';
import PlantingEditDialog from './PlantingEditDialog';
import FarmMediaDialog from './FarmMediaDialog';
import { PlantingsEdit } from '~models/plantings';
import { updatePlanting } from '~services/planting';
import { selectCrops } from '~services/crop';
import { AxiosResponse } from 'axios';
import { Icon as IconFy } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
import { SystemTable } from '~models/systemTable';
import { showMessage } from '~utils/Messages';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { createFarmMedia, listFarmMedia } from '~services/farm';
import MapPopper from './MapPopper';

type TabFarmProps = {
  farm: any;
  onHandle?: any;
};

const TabFarm: React.FC<TabFarmProps> = ({ farm, onHandle }: TabFarmProps) => {
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const { farmer_id } = useParams();
  const [farmMedias, setFarmMedias] = useState<any[]>([]);
  const [plantings, setPlantings] = useState<any>(undefined);
  const [crops, setCrops] = useState<SystemTable[]>([]);
  const [farmPolygon, setFarmPolygon] = useState<any | undefined>(undefined);
  const [mapCenter, setMapCenter] = useState<any[]>([-5.087988853333342, -80.13251264000019]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [refreshMap, setRefreshMap] = useState<boolean>(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isOpenDialogMedia, setIsOpenDialogMedia] = useState<boolean>(false);

  if (!farmer_id) history.push(routes.farmers);

  const farmerId: string = farmer_id !== undefined ? farmer_id : '';

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleEditPolygon = useCallback((_polygon: any, _center: []) => {}, []);

  const handleCloseDialog = useCallback(
    (isUpdated?: boolean) => {
      if (isUpdated !== undefined && isUpdated) {
        onHandle();
      }
      setIsOpenDialog((prevValue: boolean) => !prevValue);
    },
    [onHandle]
  );
  const handleCloseDialogMedia = useCallback(
    (isUpdated?: boolean) => {
      if (isUpdated !== undefined && isUpdated) {
        onHandle();
      }
      setIsOpenDialogMedia((prevValue: boolean) => !prevValue);
    },
    [onHandle]
  );

  const handleSaveDialog = useCallback(
    (data: PlantingsEdit): Promise<AxiosResponse<any>> => {
      return updatePlanting(plantings.id, data);
    },
    [plantings]
  );

  const handleSaveFarmMediaDialog = useCallback(
    (data: any): Promise<AxiosResponse<any>> => {
      return createFarmMedia(data, farm.id);
    },
    [farm]
  );

  const _getFarmMediaTypes = useCallback((): Promise<AxiosResponse<any>> => {
    return listFarmMedia(farm.id);
  }, [farm]);

  useEffect(() => {
    selectCrops()
      .then(async (res: any) => {
        const data = res?.data?.data;
        await setCrops(data);
      })
      .catch(() => {
        showMessage('', 'Problemas al cargar los datos del productor.', 'error', true);
        history.push(routes.farmers);
      });
  }, [farmerId, history]);

  useEffect(() => {
    if (farm?.area_sqmt !== undefined) {
      setFarmPolygon(
        farm
          ? {
              type: 'Feature',
              geometry: farm?.area_sqmt
            }
          : undefined
      );

      const coordinates = farm?.area_sqmt?.coordinates?.[0]?.[0];
      if (coordinates !== undefined) {
        setMapCenter([coordinates[1], coordinates[0]]);
      }
    }
    if (farm?.plantings?.length > 0) {
      setPlantings(farm?.plantings[0]);
    }
    const farmMedias: any[] = [];
    farm.farm_medias?.map((media: any) => {
      farmMedias.push(
        `${COMMUNITY_BASE_URL_S3}farmers/${farmerId}/farms/${farm?.id}/${media.farm_type_media.name}/${media.path}`
      );
    });
    setFarmMedias(farmMedias);

    setRefreshMap((value: boolean) => !value);
  }, [farmerId, history, farm]);

  return (
    <>
      <Box pl={0.5} mb="15px" fontWeight={700}>
        <Typography fontSize="1.1em" variant="overline">
          {farm?.name}
        </Typography>
      </Box>

      <Grid container spacing={3} direction="row" alignItems="stretch">
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 2,
              width: 1,
              height: '100%'
            }}>
            <Box p={2} height="460px">
              <MapContainer
                center={mapCenter}
                refresh={refreshMap}
                onEditPolygon={handleEditPolygon}
                polygon={farmPolygon}
              />
              <MapPopper />
            </Box>
          </Paper>
        </Grid>
        <Grid container item xs={12} md={4} direction="row" justifyContent="space-between" spacing={3}>
          <Grid item xs={12} md={12}>
            <Paper
              key="info_zone"
              sx={{
                p: 3,
                width: 1,
                height: '100%'
              }}>
              <Box mb="15px">
                <Typography fontSize="1.1em" variant="overline" sx={{ color: 'text.secondary' }}>
                  {farm?.name ?? 'Parcela'}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="row" alignItems="center" mb="5px">
                <RoomIcon style={{ marginRight: '15px' }} />
                <Typography fontSize="1.1em" variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                  {farm?.zone?.name ?? '-'}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="row" alignItems="center" mb="5px">
                <Icon style={{ marginRight: '15px' }}>view_module</Icon>
                <Typography fontSize="1.1em" variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                  {farm?.area_ha ?? '-'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper
              key="info_zone"
              sx={{
                p: 3,
                width: 1,
                height: '100%'
              }}>
              {plantings !== undefined ? (
                <>
                  <Box mb="15px">
                    <Typography fontSize="1.1em" variant="overline" sx={{ color: 'text.secondary' }}>
                      Cultivo
                    </Typography>
                  </Box>

                  <Box display="flex" flexDirection="row" alignItems="center" mb="5px">
                    <Typography variant="body2" gutterBottom>
                      <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                        Nombre: &nbsp;
                      </Typography>
                      {plantings?.crop?.description ?? '-'}
                    </Typography>
                  </Box>

                  <Box display="flex" flexDirection="row" alignItems="center" mb="5px">
                    <Typography variant="body2" gutterBottom>
                      <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                        Tipo de Cultivo: &nbsp;
                      </Typography>
                      {(plantings?.crop_type === 'organic' ? 'Orgánico' : 'Convencional') ?? '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" flexDirection="row" alignItems="center" mb="5px">
                    <Typography variant="body2" gutterBottom>
                      <Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
                        Comentarios: &nbsp;
                      </Typography>
                      {plantings?.commentary ?? '-'}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Button
                      startIcon={<IconFy icon={editFill} />}
                      onClick={() => {
                        handleCloseDialog();
                      }}>
                      Editar
                    </Button>
                  </Box>
                </>
              ) : (
                <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" height="100%">
                  No tiene plantación
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Box mt={1.5}>
        <Box
          pl={0.5}
          mb="15px"
          mt="35px"
          fontWeight={700}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Typography fontSize="1.1em" variant="overline">
            Fotos
          </Typography>
          <Button
            variant="contained"
            style={{ background: '#F2994A' }}
            startIcon={<ArrowUpwardIcon />}
            onClick={() => handleCloseDialogMedia()}
            component="span">
            Subir imágenes
          </Button>
        </Box>

        <Paper
          key="farm_medias"
          sx={{
            p: 3,
            width: 1,
            height: '100%'
          }}>
          <PhotosSlider images={farmMedias} />
        </Paper>
      </Box>
      {isOpenDialog && (
        <PlantingEditDialog
          closeAction={handleCloseDialog}
          saveAction={handleSaveDialog}
          planting={plantings}
          crops={crops}
        />
      )}
      {isOpenDialogMedia && (
        <FarmMediaDialog
          getFarmMediaTypes={_getFarmMediaTypes}
          closeAction={handleCloseDialogMedia}
          saveAction={handleSaveFarmMediaDialog}
          open={isOpenDialogMedia}
        />
      )}
    </>
  );
};

export default TabFarm;
