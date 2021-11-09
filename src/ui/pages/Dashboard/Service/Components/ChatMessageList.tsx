import React, { useState, useRef, useEffect } from 'react';
import Scrollbar from '~ui/atoms/Scrollbar/Scrollbar';
import LightboxModal from '~ui/molecules/LightBoxModal';
import ChatMessageItem from './ChatMessageItem';
import { OrganizationServiceInteraction } from '~models/organizationServiceInteraction';

// ----------------------------------------------------------------------

type ChatMessageListProps = {
  conversation: OrganizationServiceInteraction[];
  conversationId: string;
  status: string;
  handleRefreshServices(): void;
};

export default function ChatMessageList({
  status,
  conversation,
  conversationId,
  handleRefreshServices
}: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [imageSRC, setImageSRC] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedImage, setSelectedImage] = useState<number>(0);

  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation]);

  const handleOpenLightbox = (url: string) => {
    setImageSRC(url);
    setOpenLightbox(true);
    setSelectedImage(0);
  };

  return (
    <Scrollbar scrollableNodeProps={{ ref: scrollRef }} sx={{ p: 3 }}>
      {conversation?.map((message: OrganizationServiceInteraction, index: number) => (
        <ChatMessageItem
          key={message.id}
          message={message}
          conversationId={conversation.length - 1 === index ? conversationId : ''}
          onOpenLightbox={handleOpenLightbox}
          handleRefreshServices={handleRefreshServices}
          status={status}
        />
      ))}

      <LightboxModal
        images={[imageSRC]}
        photoIndex={0}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onClose={() => setOpenLightbox(false)}
      />
    </Scrollbar>
  );
}
