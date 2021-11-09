import React, { useState, useCallback } from 'react';
import { Box, Icon } from '@material-ui/core';

type FileUploadedProps = {
  index: number;
  file: any;
  onDelete: (index: number) => void;
};

const FileUploaded: React.FC<FileUploadedProps> = (props: FileUploadedProps) => {
  const [isHover, setIsHover] = useState<boolean>(false);

  const { index, file, onDelete } = props;

  const handleOnHover = useCallback(() => {
    setIsHover((prevValue: boolean) => !prevValue);
  }, []);

  return (
    <Box display="flex" alignItems="center" py={1}>
      {file.file_name}

      <Box display="flex" alignItems="center" onMouseEnter={handleOnHover} onMouseLeave={handleOnHover}>
        {!isHover && <Icon sx={{ color: '#34C759' }}>check_circle</Icon>}
        {isHover && (
          <Icon sx={{ cursor: 'pointer', color: 'red' }} onClick={() => onDelete(index)}>
            close
          </Icon>
        )}
      </Box>
    </Box>
  );
};

export default FileUploaded;
