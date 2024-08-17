"use client"

import { Box, Heading, Button, SimpleGrid, Text, useColorModeValue, Flex, Icon, VStack, Badge, useDisclosure } from '@chakra-ui/react';
import { FaHandshake, FaFileContract, FaEthereum } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import PartnershipDetailsModal from "./PartnershipDetailsModal";
import { useState } from 'react';
import { ethers } from 'ethers';

interface PartnershipListProps {
  partnerships: Partnership[];
  account: string;
  onOpen: () => void;
  confirmPartnership: (id: number) => Promise<void>;
  cancelPartnership: (id: number) => Promise<void>;
  isConfirmingPartnership: boolean;
  isCancellingPartnership: boolean;
  signer: ethers.Signer;
}

const MotionBox = motion(Box);
const MotionButton = motion(Button);

export default function PartnershipList({
  partnerships,
  account,
  onOpen,
  confirmPartnership,
  cancelPartnership,
  isConfirmingPartnership,
  isCancellingPartnership,
  signer
}: PartnershipListProps) {
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.1)', 'rgba(26, 32, 44, 0.4)');
  const textColor = useColorModeValue('gray.100', 'white');
  const { isOpen, onOpen: onModalOpen, onClose } = useDisclosure();
  const [selectedPartnership, setSelectedPartnership] = useState<Partnership | null>(null);

  const handleCardClick = (partnership: Partnership) => {
    setSelectedPartnership(partnership);
    onModalOpen();
  };

  return (
    <>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          borderWidth={1}
          borderRadius="xl"
          p={8}
          bg={cardBg}
          boxShadow="xl"
          backdropFilter="blur(10px)"
          color={textColor}
        >
          <Flex alignItems="center" mb={8}>
            <Icon as={FaFileContract} w={8} h={8} mr={4} color="purple.300" />
            <Heading size="lg" color="white">Your Partnerships</Heading>
          </Flex>
          <MotionButton
            leftIcon={<FaHandshake />}
            colorScheme="purple"
            onClick={onOpen}
            mb={8}
            size="md"
            width="full"
            height="50px"
            fontSize="lg"
            whileTap={{ scale: 0.95 }}
          >
            Create New Partnership
          </MotionButton>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            <AnimatePresence>
              {partnerships.map((partnership) => (
                <MotionBox
                  key={partnership.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  borderWidth={1}
                  borderRadius="lg"
                  p={6}
                  bg={useColorModeValue('rgba(255, 255, 255, 0.05)', 'rgba(26, 32, 44, 0.3)')}
                  boxShadow="lg"
                  _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s ease', boxShadow: 'xl', cursor: 'pointer' }}
                  onClick={() => handleCardClick(partnership)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <VStack align="stretch" spacing={4}>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Badge
                        colorScheme={partnership.completed ? "green" : "yellow"}
                        fontSize="sm"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {partnership.completed ? 'Completed' : 'Pending'}
                      </Badge>
                      <Icon as={FaEthereum} w={5} h={5} color="purple.300" />
                    </Flex>
                    <Text fontSize="xl" fontWeight="bold">
                      {partnership.amount} ETH
                    </Text>
                    <Text fontSize="md" fontWeight="medium">
                      Partner:
                    </Text>
                    <Text fontSize="sm" isTruncated>
                      {partnership.brand === account ? partnership.influencer : partnership.brand}
                    </Text>
                  </VStack>
                </MotionBox>
              ))}
            </AnimatePresence>
          </SimpleGrid>
        </Box>
      </MotionBox>
      {selectedPartnership && (
        <PartnershipDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          partnership={selectedPartnership}
          confirmPartnership={confirmPartnership}
          cancelPartnership={cancelPartnership}
          isConfirmingPartnership={isConfirmingPartnership}
          isCancellingPartnership={isCancellingPartnership}
          account={account}
          signer={signer}
        />
      )}
    </>
  );
}