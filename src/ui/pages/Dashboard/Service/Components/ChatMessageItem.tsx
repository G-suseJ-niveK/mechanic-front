import React, { useState, useCallback } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Avatar, Box, Typography } from '@material-ui/core';
import { OrganizationServiceInteraction } from '~models/organizationServiceInteraction';
import sharpFilePresent from '@iconify/icons-ic/sharp-file-present';
import baselineGetApp from '@iconify/icons-ic/baseline-get-app';
import { Icon } from '@iconify/react';
import { COMMUNITY_BASE_URL_S3 } from '~config/environment';
import { es } from 'date-fns/locale';
import CalificationDialog from './CalificationDialog';
import { PutStatusServiceInteractionsByServiceId } from '~services/service';
import { ServiceInteractionCloseRequest } from '~models/organizationServiceInteraction';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }: any) => ({
  display: 'flex',
  marginBottom: theme.spacing(3)
}));

const ContentStyle = styled('div')(({ theme }: any) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral
}));

const InfoStyle = styled(Typography)(({ theme }: any) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary
}));

const MessageImgStyle = styled('img')(({ theme }: any) => ({
  height: 200,
  minWidth: 296,
  width: '100%',
  cursor: 'pointer',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius
}));

// ----------------------------------------------------------------------

type ChatMessageItemProps = {
  message: OrganizationServiceInteraction;
  onOpenLightbox: (value: string) => void;
  conversationId: string;
  handleRefreshServices(): void;
  status: string;
};

export default function ChatMessageItem({
  message,
  onOpenLightbox,
  conversationId,
  handleRefreshServices,
  status
}: ChatMessageItemProps) {
  const isMe = message?.type === 'question';
  const isMedia = message?.message?.type === 'media';
  const isImage = isMedia && message?.message?.value?.type.includes('image');
  const firstName = message?.organization?.name;
  const logo = message?.organization?.logo_path;
  const mediaPath = isMedia ? COMMUNITY_BASE_URL_S3 + message?.message?.value?.path : '';
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isCalificate, setIsCalificate] = useState<boolean>(false);

  function download(url: string, filename: string) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = filename;
    link.rel = 'noopener noreferrer';
    link.download = 'download';
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  const handleSave = useCallback(
    (calification: ServiceInteractionCloseRequest) => {
      return PutStatusServiceInteractionsByServiceId(conversationId, calification);
    },
    [conversationId]
  );

  const handleDialog = useCallback(() => {
    setIsOpenDialog(true);
  }, []);
  const handleCloseDialog = useCallback(() => {
    setIsOpenDialog(false);
    handleRefreshServices();
    setIsCalificate(true);
  }, [handleRefreshServices]);

  return (
    <RootStyle>
      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto'
          })
        }}>
        {!isMe && <Avatar alt={firstName} src={logo} sx={{ width: 32, height: 32 }} />}

        <Box sx={{ ml: 2 }}>
          <InfoStyle noWrap variant="caption" sx={{ ...(isMe && { justifyContent: 'flex-end' }) }}>
            {!isMe && `${firstName},`}&nbsp;
            {formatDistanceToNowStrict(new Date(message?.created_at), {
              addSuffix: true,
              locale: es
            })}
          </InfoStyle>

          <ContentStyle
            sx={{
              ...(isMe && {
                color: 'grey.800',
                bgcolor: 'primary.lighter'
              })
            }}>
            {isMedia ? (
              isImage ? (
                <MessageImgStyle alt="attachment" src={mediaPath} onClick={() => onOpenLightbox(mediaPath)} />
              ) : (
                <Box
                  height="48px"
                  px={3}
                  mb={2}
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  onClick={() => {
                    download(mediaPath, message?.message?.value?.name);
                  }}
                  style={{ background: '#919EAB20', cursor: 'pointer' }}>
                  <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
                    <Box display="flex" alignItems="center" mr={2}>
                      <Icon icon={sharpFilePresent} width={20} height={20} />
                    </Box>
                    <Box fontSize="0.95em" fontWeight={500}>
                      {message?.message?.value?.name?.substring(0, 15)}
                      {message?.message?.value?.name?.length > 10 && '...'}
                    </Box>
                  </Box>
                  <Box
                    fontSize="0.95em"
                    fontWeight={500}
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    ml={2}>
                    <Icon icon={baselineGetApp} width={20} height={20} />
                  </Box>
                </Box>
              )
            ) : (
              <>
                <Typography variant="body2">{message?.message?.value}</Typography>
              </>
            )}
          </ContentStyle>

          {!isMe && conversationId && status !== 'close' && !isCalificate && (
            // <ContentStyle
            //   sx={{
            //     ...{
            //       color: 'grey.800',
            //       bgcolor: 'primary.lighter',
            //       justifyContent: 'flex-end'
            //     }
            //   }}>
            // {/* <Box style={{ background: '#C8FACD' }} mt={3}> */}
            // {/* <Box>
            //     Sí la respuesta entregada por los asesores resolvió su consulta, presioné consulta resuelta, o siga
            //     escribiéndonos para detallar seguir resolviendo sus dudas.
            //   </Box> */}

            <Box
              fontSize="0.95em"
              fontWeight={500}
              height="48px"
              width="250px"
              px={3}
              mb={2}
              onClick={() => handleDialog()}
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              borderRadius="10px"
              mt={2}
              color="#fff"
              style={{ background: '#219653', cursor: 'pointer' }}>
              Consulta resuelta
            </Box>
            // {/* </Box> */}
            // </ContentStyle>
          )}
        </Box>
      </Box>
      {isOpenDialog && (
        <CalificationDialog open={isOpenDialog} closeAction={handleCloseDialog} saveAction={handleSave} />
      )}
    </RootStyle>
  );
}
