import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  AspectRatio,
  useColorModeValue,
  Icon,
  Heading,
  Flex,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MotionModalContent = motion(ModalContent);

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  const modalBg = useColorModeValue('rgba(255, 255, 255, 0.1)', 'rgba(26, 32, 44, 0.4)');

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
          <ModalOverlay backdropFilter="blur(100px)" />
          <MotionModalContent
            bg={modalBg}
            color="white"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
            borderRadius="xl"
            boxShadow="0 0 30px rgba(138, 75, 175, 0.3)"
            p={6}
          >
            <ModalHeader p={0} mb={6}>
              <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center">
                  <Icon as={FaPlay} boxSize={6} color="purple.400" mr={3} />
                  <Heading size="lg" fontWeight="bold" bgGradient="linear(to-r, blue.300, purple.300)" bgClip="text">
                    0xPartner Demo
                  </Heading>
                </Flex>
                <ModalCloseButton position="static" size="lg" />
              </Flex>
            </ModalHeader>
            <ModalBody p={0}>
              <AspectRatio ratio={16 / 9}>
                <iframe
                  src="https://www.youtube.com/embed/2A3AV5xv26M"
                  title="0xPartner Demo Video"
                  allowFullScreen
                />
              </AspectRatio>
            </ModalBody>
            <ModalFooter justifyContent="center" mt={8}>
              <Button
                onClick={onClose}
                size="lg"
                fontSize="lg"
                fontWeight="bold"
                px={10}
                py={6}
                color="white"
                bgGradient="linear(to-r, blue.400, purple.500)"
                _hover={{ 
                  bgGradient: "linear(to-r, blue.500, purple.600)",
                  transform: "translateY(-2px)",
                  boxShadow: "xl",
                }}
                _active={{
                  transform: "translateY(0)",
                  boxShadow: "md",
                }}
              >
                Close
              </Button>
            </ModalFooter>
          </MotionModalContent>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;