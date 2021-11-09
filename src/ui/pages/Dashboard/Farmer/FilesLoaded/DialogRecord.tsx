import React, { useCallback } from 'react';
import Dialog from '~ui/molecules/Dialog/Dialog';
import { Grid, Typography } from '@material-ui/core';
import Button from '~ui/atoms/Button/Button';
import { updateFarmerRecord } from '~services/farmer';
import { showMessage } from '~utils/Messages';

type RecordDialogProps = {
  open: boolean;
  record: any;
  closeAction(): void;
  saveAction(record: any): void;
};

const RecordDialog: React.FC<RecordDialogProps> = (props: RecordDialogProps) => {
  const { open, record, closeAction, saveAction } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onSubmit = useCallback(async () => {
    setIsLoading(true);
    updateFarmerRecord(record.id, record)
      .then(() => {
        showMessage('', 'Productor actualizado.', 'success');
        saveAction(record);
      })
      .catch(() => {
        showMessage('', 'Problemas al actualizar al productor.', 'error');
        setIsLoading(false);
      });
  }, [record, saveAction]);

  return (
    <Dialog
      open={open}
      title={'Actualizar datos del productor Productor'}
      onClose={() => 0}
      actions={
        <>
          <Button onClick={() => closeAction()} variant="outlined" disabled={isLoading} text="Cancelar" />
          <Button
            onClick={() => onSubmit()}
            color="primary"
            variant="contained"
            disabled={isLoading}
            isLoading={isLoading}
            text="Actualizar"
          />
        </>
      }>
      <Grid container={true}>
        <Grid item={true} xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography align="center">¿Esta seguro actualizar los datos del productor?</Typography>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default React.memo(RecordDialog);
