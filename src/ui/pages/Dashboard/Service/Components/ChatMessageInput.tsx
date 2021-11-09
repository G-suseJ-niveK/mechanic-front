import React, { useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
// import micFill from '@iconify/icons-eva/mic-fill';
import roundSend from '@iconify/icons-ic/round-send';
import attach2Fill from '@iconify/icons-eva/attach-2-fill';
import roundAddPhotoAlternate from '@iconify/icons-ic/round-add-photo-alternate';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Input, Divider, IconButton } from '@material-ui/core';
import { showMessage } from '~utils/Messages';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }: any) => ({
  minHeight: 56,
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  paddingLeft: theme.spacing(2)
}));

// ----------------------------------------------------------------------

type ChatMessageInputProps = {
  disabled: boolean;
  conversationId: string;
  onSend: (data: any) => any;
};

export default function ChatMessageInput({ disabled, conversationId, onSend }: ChatMessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleOnFileName = useCallback(
    (e: any) => {
      const { files } = e.target;
      if (files.length === 1) {
        if (files[0].size >= 25000000) {
          showMessage('', 'El archivo es muy pesado.', 'error', true);
          return;
        }

        const file = {
          file: files[0],
          file_name: files[0].name,
          file_type: files[0].type
        };

        const formData = new FormData();
        formData.append('message_type', 'media');
        formData.append('file_name', file.file_name);
        formData.append('file_type', file.file_type);
        formData.append('file', file.file);
        e.target.value = null;
        setIsSubmitting(true);
        onSend({
          id: conversationId,
          data: formData
        }).then(() => {
          setMessage('');
          setIsSubmitting(false);
        });
      }
    },
    [onSend, conversationId]
  );

  const handleSend = useCallback(() => {
    if (!message) {
      return;
    }
    if (onSend) {
      const formData = new FormData();

      formData.append('message_type', 'string');
      formData.append('description', message);

      setIsSubmitting(true);
      onSend({
        id: conversationId,
        data: formData
      }).then(() => {
        setMessage('');
        setIsSubmitting(false);
      });
    }
  }, [conversationId, onSend, message]);

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' || event.keyCode === 13) {
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <RootStyle>
      <Input
        disabled={disabled}
        fullWidth
        value={message}
        disableUnderline
        onKeyUp={handleKeyUp}
        onChange={(e: any) => {
          setMessage(e.target.value);
        }}
        placeholder="Type a message"
        endAdornment={
          <Box sx={{ flexShrink: 0, mr: 1.5, '& > *': { mx: 0.5 } }}>
            <IconButton disabled={disabled} size="small" component="label">
              {/* onClick={handleAttach} */}
              <Icon icon={roundAddPhotoAlternate} width={24} height={24} />
              <input type="file" accept="image/*" hidden onChange={handleOnFileName} />
            </IconButton>
            <IconButton disabled={disabled} size="small" component="label">
              <input type="file" hidden onChange={handleOnFileName} />
              <Icon icon={attach2Fill} width={24} height={24} />
            </IconButton>
            {/* <IconButton disabled={disabled} size="small">
              <Icon icon={micFill} width={24} height={24} />
            </IconButton> */}
          </Box>
        }
        sx={{ height: '100%' }}
      />
      <Divider orientation="vertical" flexItem />
      <IconButton color="primary" disabled={!message || isSubmitting} onClick={handleSend} sx={{ mx: 1 }}>
        <Icon icon={roundSend} width={24} height={24} />
      </IconButton>
    </RootStyle>
  );
}
