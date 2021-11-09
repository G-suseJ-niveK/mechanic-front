import React, { useState, useEffect, useCallback } from 'react';
import { Box, Card, CardActionArea, Divider, Grid, Typography, Chip, LinearProgress, Tooltip } from '@material-ui/core';
import { getAllCredentialFromConnection, issuedCredential } from '~services/digital_identity/credential/credential';
import { makeStyles } from '@material-ui/core/styles';
import { showMessage } from '~utils/Messages';
import Button from '~ui/atoms/Button/Button';
import IssuedCredentialDialog from './IssuedCredentialDialog';
import { getStatusColorCredentials } from '../colorLabelStatus';

type CredentialComponentProps = {
  farmerId: string;
};

const useStyles = makeStyles({
  root: {
    padding: '10px'
  },
  media: {
    height: 140
  }
});

const CredentialComponent: React.FC<CredentialComponentProps> = (props: CredentialComponentProps) => {
  const { farmerId } = props;
  const [credentials, setCredentials] = useState<any[]>([]);
  const classes = useStyles();
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadAllCredentialFromConnection = useCallback(() => {
    setIsLoading(true);
    getAllCredentialFromConnection(farmerId)
      .then((res: any) => {
        setCredentials(res.data.data);
        setIsLoading(false);
      })
      .catch(() => {
        showMessage('', 'Problemas al listar los certificados.', 'error', true);
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadAllCredentialFromConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDialog = useCallback(
    (isRefresh?: boolean) => {
      setIsOpenDialog((value: boolean) => !value);
      if (isRefresh !== undefined && isRefresh) {
        loadAllCredentialFromConnection();
      }
    },
    [loadAllCredentialFromConnection]
  );

  const handleStore = useCallback(
    (credentialId: any, values: any) => {
      return issuedCredential(farmerId, credentialId, { ...values });
    },
    [farmerId]
  );

  const chipStatus = useCallback((value: string) => {
    const { ColorBox, colorText } = getStatusColorCredentials(value);
    if (value === 'Ofertado') {
      return (
        <Tooltip title="Esperando que el productor acepte el certificado" aria-label="Ofertado">
          <Chip label="En espera" style={{ background: ColorBox, color: colorText }} />
        </Tooltip>
      );
    }
    return <Chip label={value} style={{ background: ColorBox, color: colorText }} />;
  }, []);

  return (
    <>
      {isLoading && <LinearProgress />}
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box>
            <Button text="Emitir Certificados" variant="contained" onClick={() => handleDialog()} />
          </Box>
        </Grid>
        {credentials?.length !== 0 ? (
          credentials?.map((credential: any, index: number) => (
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} key={`credential_${index}`}>
              <Card>
                <CardActionArea className={classes.root}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" gutterBottom>
                      {credential.name}
                    </Typography>
                    {/* <Chip color="primary" style={{ background: '#828282' }} label="Restaurar" /> */}
                    {chipStatus(credential.state)}
                  </Box>
                  <Divider />
                  <Box p={1}>
                    {Object.keys(credential?.values)?.map((attribute: any, index: number) => (
                      <Box display="flex" justifyContent="space-between" key={`attribute_${attribute}_${index}`}>
                        <Typography>{attribute}</Typography>
                        <Typography>{credential?.values[attribute]}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        ) : (
          <Box>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              No se encontraron certificados
            </Grid>
          </Box>
        )}
      </Grid>

      {isOpenDialog && (
        <IssuedCredentialDialog open={isOpenDialog} farmerId={farmerId} onClose={handleDialog} onSave={handleStore} />
      )}
    </>
  );
};

export default React.memo(CredentialComponent);
