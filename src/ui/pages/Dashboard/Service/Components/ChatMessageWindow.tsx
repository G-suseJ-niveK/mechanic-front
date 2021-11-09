import React, { useCallback, useState } from 'react';
// material
import { Icon } from '@iconify/react';
import baselineRefresh from '@iconify/icons-ic/baseline-refresh';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Divider, Box, Grid } from '@material-ui/core';
import { capitalize } from '~utils/Word';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import ChatMessageInput from './ChatMessageInput';
import ChatMessageList from './ChatMessageList';
import ChatMessageInit from './ChatMessageInit';
import { createService, CreateServiceInteractionsByServiceId } from '~services/service';
import { useSnackbar } from 'notistack';

import { OrganizationServiceCreate, OrganizationService } from '~models/organizationService';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column',
  height: '100%'
});

const HeaderStyle = styled('div')(({ theme }: any) => ({
  height: 84,
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  margin: '0px 20px'
}));

// ----------------------------------------------------------------------

type MessageWindowProps = {
  item: OrganizationService;
  isOpenSolicitude: boolean;
  handleRefreshInteraction(serviceId: string): void;
  handleRefreshServices(): void;
};

function MessageWindow({
  item,
  isOpenSolicitude,
  handleRefreshInteraction,
  handleRefreshServices
}: MessageWindowProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const alertMessage = useCallback(
    (message: string = 'Error', type: any = 'warning', duration: number = 1000) => {
      return enqueueSnackbar(message, {
        autoHideDuration: duration,
        variant: type,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
    },
    [enqueueSnackbar]
  );

  const handleSendMessage = useCallback(
    (value: any) => {
      return new Promise((resolve: any, reject: any) => {
        setIsSubmitting(true);
        CreateServiceInteractionsByServiceId(value.id, value.data)
          .then(() => {
            alertMessage('Mensaje enviado.', 'success');
            handleRefreshInteraction(item?.id);
            setIsSubmitting(false);
            resolve();
          })
          .catch(() => {
            alertMessage('Problemas al enviar el mensaje.', 'warning');
            setIsSubmitting(false);
            reject();
          });
      });
    },
    [alertMessage, handleRefreshInteraction, item]
  );

  const handleSave = useCallback((data: OrganizationServiceCreate) => {
    return new Promise((resolve: any, reject: any) => {
      createService(data)
        .then((res: any) => {
          resolve(res);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }, []);

  const handleClose = useCallback(
    (isRefresh: boolean) => {
      if (isRefresh !== undefined && isRefresh) {
        handleRefreshServices();
      }
    },
    [handleRefreshServices]
  );

  return (
    <RootStyle>
      <HeaderStyle>
        {isOpenSolicitude ? (
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box fontSize="1.2em" fontWeight="415">
              Solicitud de servicio
            </Box>
          </Box>
        ) : (
          <Grid container flexDirection="row" alignItems="space-between" justifyContent="space-between">
            <Grid item>
              <Box display="flex" flexDirection="row" alignItems="center">
                <Box fontSize="1.2em" fontWeight="415">
                  {capitalize(item?.organization_service_type?.description ?? '')}
                </Box>
                <Box
                  m="0px 11px"
                  color="#637381"
                  fontSize="0.7em"
                  display="flex"
                  flexDirection="row"
                  alignItems="revert">
                  {item?.created_at && format(new Date(item.created_at), 'dd MMM yyyy', { locale: es })}
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                color="#67AE1C"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  handleRefreshInteraction(item?.id);
                }}>
                <Icon icon={baselineRefresh} width={24} height={24} /> <Box ml={1}>Actualizar</Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </HeaderStyle>

      <Divider />

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        {isOpenSolicitude ? (
          <ChatMessageInit closeAction={handleClose} saveAction={handleSave} />
        ) : (
          <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
            <ChatMessageList
              conversation={item.organization_service_interactions}
              conversationId={item?.id}
              handleRefreshServices={handleRefreshServices}
              status={item.organization_service_status_issuer.name}
            />

            {isSubmitting && (
              <Box color="#928f8f" textAlign="right" pr={2}>
                enviando mensaje...
              </Box>
            )}
            <Divider />

            {item.id !== '-1' && item?.organization_service_status_issuer?.name !== 'close' && (
              <ChatMessageInput
                conversationId={item.id}
                onSend={handleSendMessage}
                disabled={item?.organization_service_status_issuer?.name === 'close' ? true : false}
              />
            )}
          </Box>
        )}
      </Box>
    </RootStyle>
  );
}

export default React.memo(MessageWindow);
