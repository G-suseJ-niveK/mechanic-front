import React, { useCallback, useState, useEffect } from 'react';
import { Grid, Button, Typography, Box, Card, Tooltip, Icon } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AssignFarmerDialog from './AssignFarmerDialog';
import { Farmer } from '~models/farmer';
import { AxiosResponse } from 'axios';
import { selectFarmer } from '~services/farmer';
import {
  assignFarmersToAgroLeader,
  assignedFarmersToAgroLeader,
  removeAssignedFarmerToAgroLeader
} from '~services/agro_leaders';
import RoomIcon from '@material-ui/icons/Room';
import { useHistory } from 'react-router-dom';
import routes from '~routes/routes';
import { showDeleteQuestion, showMessage } from '~utils/Messages';
import LinearProgress from '~ui/atoms/LinearProgress/LinearProgress';
import { capitalizeAllWords } from '~utils/Word';

type TabProducerProps = {
  agroLeaderId: string;
};

type FollowerCardProps = {
  follower: Farmer;
  onToggle: any;
  onDelete(): void;
};

function FollowerCard({ follower, onToggle, onDelete }: FollowerCardProps) {
  const { first_name, last_name, phone, farms } = follower;

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, height: '100%' }}>
      <Box sx={{ flexGrow: 1, minWidth: 0, pl: 2, pr: 1 }}>
        <Typography variant="subtitle2" fontSize="1em">
          {capitalizeAllWords((first_name || '') + ' ' + (last_name || ''))}
        </Typography>
        <Typography variant="subtitle2" noWrap fontSize="0.78em">
          {phone}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
          {farms && farms.length > 0 && (
            <>
              <Box component={RoomIcon} sx={{ width: 16, height: 16, mr: 0.5, flexShrink: 0 }} />

              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {farms[0]?.zone?.name}
              </Typography>
            </>
          )}
        </Box>
      </Box>
      <Box>
        <Box display="flex" flexDirection="row" justifyContent="space-around">
          <Tooltip title="Ver certificados" arrow style={{ cursor: 'pointer' }}>
            <Icon onClick={onToggle} sx={{ color: '#27AE60' }}>
              visibility
            </Icon>
          </Tooltip>
          <Tooltip title="Eliminar" arrow style={{ cursor: 'pointer' }}>
            <Icon onClick={onDelete}>delete</Icon>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
}

const TabProducer: React.FC<TabProducerProps> = (props: TabProducerProps) => {
  const { agroLeaderId }: TabProducerProps = props;
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [assignedFarmers, setAssignedFarmers] = useState<Farmer[]>([]);

  const history = useHistory();

  const handleViewFarmer = useCallback(
    (farmer: Farmer) => {
      history.push(`${routes.farmers}/${farmer.id}`);
    },
    [history]
  );

  const ListAssignedFarmers = useCallback(() => {
    setIsLoading(true);
    assignedFarmersToAgroLeader(agroLeaderId)
      .then((res: any) => {
        const { data } = res.data;
        setAssignedFarmers(data);
        setIsLoading(false);
      })
      .catch((err: any) => {
        setIsLoading(false);
        const errorMessage = 'Problemas al listar los productores asignados.';
        const data = err?.response?.data;
        if (data?.hasOwnProperty('error')) {
          showMessage('', data?.error?.message ?? errorMessage, 'error', true);
        } else {
          showMessage('', errorMessage, 'error', true);
        }
      });
  }, [agroLeaderId]);

  const handleCloseAction = useCallback(
    (_updateTable?: boolean) => {
      setIsAssignDialogOpen((open: boolean) => !open);
      ListAssignedFarmers();
    },
    [ListAssignedFarmers]
  );

  const handleDeleteFarmer = useCallback(
    (farmer: Farmer) => {
      showDeleteQuestion('ADVERTENCIA', 'Está seguro de eliminar el productor asignado.').then((response: any) => {
        if (response) {
          removeAssignedFarmerToAgroLeader(agroLeaderId, farmer.id)
            .then((res: any) => {
              const message = res.data?.messsage;
              showMessage('', message || 'Productor asignado eliminado.', 'success');

              ListAssignedFarmers();
            })
            .catch((err: any) => {
              const { data } = err.response;
              if (data?.status && data?.error?.message) {
                showMessage('', data?.error?.message, data.status, data.status === 'error' ? true : false);
              } else {
                showMessage('', 'Problemas al eliminar.', 'error', true);
              }
            });
        }
      });
    },
    [agroLeaderId, ListAssignedFarmers]
  );

  const handleSaveAction = useCallback((agroLeaderId: string, data: any): Promise<AxiosResponse<any>> => {
    return assignFarmersToAgroLeader(agroLeaderId, data);
  }, []);

  useEffect(() => {
    ListAssignedFarmers();
  }, [ListAssignedFarmers]);

  useEffect(() => {
    selectFarmer().then((res: any) => {
      setFarmers(res.data.data);
    });
  }, []);

  return (
    <>
      {isLoading && <LinearProgress loading={true} />}
      <Box sx={{ mt: 5 }}>
        <Box
          fontSize="1.7em"
          fontWeight={400}
          color="#0E4535"
          mb={3}
          display="flex"
          flexDirection="row-reverse"
          alignItems="center">
          <Button variant="contained" onClick={() => handleCloseAction()} startIcon={<AddIcon />}>
            Nuevo productor
          </Button>
        </Box>

        <Grid container spacing={3} direction="row" alignItems="stretch">
          {assignedFarmers.map((follower: any) => (
            <Grid key={follower.id} item xs={12} md={4}>
              <FollowerCard
                follower={follower}
                onToggle={() => handleViewFarmer(follower)}
                onDelete={() => handleDeleteFarmer(follower)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {isAssignDialogOpen && agroLeaderId !== undefined && (
        <AssignFarmerDialog
          agroLeaderId={agroLeaderId}
          farmers={farmers}
          closeAction={handleCloseAction}
          saveAction={handleSaveAction}
        />
      )}
    </>
  );
};

export default React.memo(TabProducer);
