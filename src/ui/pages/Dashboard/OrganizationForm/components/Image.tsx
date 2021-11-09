/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useCallback } from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import LightBoxModal from '~atoms/LightBoxModal/LightBoxModal';

type ImageComponentProps = {
  image: any;
};

const LargeImgStyle = styled('img')(() => ({
  top: 0,
  width: '150px',
  height: '150px',
  objectFit: 'cover'
}));

const ImageComponent: React.FC<ImageComponentProps> = (props: ImageComponentProps) => {
  const { image } = props;
  const [openLightBox, setOpenLightBox] = useState<boolean>(false);

  const handleOpenLightbox = useCallback(() => {
    setOpenLightBox((prevValue: boolean) => !prevValue);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSetPhotoIndex = useCallback((index: number) => {}, []);

  return (
    <>
      <Box sx={{ cursor: 'zoom-in' }}>
        <LargeImgStyle alt="large image" src={image} onClick={handleOpenLightbox} />
      </Box>

      <LightBoxModal
        images={[image]}
        photoIndex={0}
        setPhotoIndex={handleSetPhotoIndex}
        isOpen={openLightBox}
        onClose={handleOpenLightbox}
      />
    </>
  );
};

export default ImageComponent;
