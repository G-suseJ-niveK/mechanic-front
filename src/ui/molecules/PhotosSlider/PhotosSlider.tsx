import React, { useState, useRef, useCallback } from 'react';
import Slider from 'react-slick';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import LightBoxModal from '~atoms/LightBoxModal/LightBoxModal';

type PhotosSliderProps = {
  images: any[];
};

const RootStyle = styled('div')(({ theme }: any) => ({
  '& .slick-slide': {
    float: theme.direction === 'rtl' ? 'right' : 'left',
    '&:focus': { outline: 'none' }
  }
}));

const LargeImgStyle = styled('img')(() => ({
  top: 0,
  width: '150px',
  height: '150px',
  padding: '5px',
  objectFit: 'cover'
}));

type LargeItemProps = {
  item: string;
  onOpenLightbox: (value: string) => void;
};

function LargeItem({ item, onOpenLightbox }: LargeItemProps) {
  return (
    <Box sx={{ cursor: 'zoom-in', position: 'relative' }}>
      <LargeImgStyle alt="large image" src={item} onClick={() => onOpenLightbox(item)} />
    </Box>
  );
}

const PhotosSlider: React.FC<PhotosSliderProps> = (props: PhotosSliderProps) => {
  const { images } = props;
  const [openLightBox, setOpenLightBox] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [nav2, setNav2] = useState<Slider>();
  const slider1 = useRef<Slider | null>(null);

  const settings = {
    dots: false,
    arrows: false,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    variableWidth: true,
    centerPadding: '0px',
    slidesToShow: images.length > 5 ? 5 : images.length
  };

  const handleOpenLightbox = (index: number) => {
    setOpenLightBox(true);
    setSelectedImage(index);
  };

  const handleSetPhotoIndex = useCallback((index: number) => {
    setSelectedImage(index);
  }, []);

  return (
    <>
      <RootStyle>
        <Box sx={{ p: 1 }}>
          <Box
            sx={{
              maxWidth: '100%'
            }}>
            <Slider {...settings} asNavFor={nav2} ref={slider1}>
              {images.map((item: any, index: number) => {
                return <LargeItem key={item} item={item} onOpenLightbox={() => handleOpenLightbox(index)} />;
              })}
            </Slider>
          </Box>
        </Box>
        <LightBoxModal
          images={images}
          photoIndex={selectedImage}
          setPhotoIndex={handleSetPhotoIndex}
          isOpen={openLightBox}
          onClose={() => setOpenLightBox(false)}
        />
      </RootStyle>
    </>
  );
};

export default PhotosSlider;
