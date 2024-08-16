import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Heading,
  Icon,
  Box,
  useColorModeValue,
  HStack,
  Divider,
  SimpleGrid,
  Tooltip,
  Link,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { FaEthereum, FaCheck, FaTimes, FaFileContract, FaCopy, FaArrowRight, FaClock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getPartnershipContractReadOnly } from '../../utils/alchemy';

interface PartnershipDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnership: Partnership;
  confirmPartnership: (id: number) => Promise<void>;
  cancelPartnership: (id: number) => Promise<void>;
  isConfirmingPartnership: boolean;
  isCancellingPartnership: boolean;
  account: string;
  signer: ethers.Signer;
}

interface TransactionHistory {
  txHash: string;
  action: string;
  user: string;
}

const MotionModalContent = motion(ModalContent);
const MotionButton = motion(Button);
const MotionBox = motion(Box);

export default function PartnershipDetailsModal({
  isOpen,
  onClose,
  partnership,
  confirmPartnership,
  cancelPartnership,
  isConfirmingPartnership,
  isCancellingPartnership,
  account,
}: PartnershipDetailsModalProps) {
  const modalBg = useColorModeValue('rgba(255, 255, 255, 0.1)', 'rgba(26, 32, 44, 0.4)');
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.05)', 'rgba(26, 32, 44, 0.3)');
  const [txHistory, setTxHistory] = useState<TransactionHistory[]>([]);
  const [currentPartnership, setCurrentPartnership] = useState(partnership);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTxHistory = async (partnershipId: number) => {
    setIsLoading(true);
    try {
      const contract = getPartnershipContractReadOnly();
      const filter = contract.filters.PartnershipTransaction(partnershipId);
      const events = await contract.queryFilter(filter);
      setTxHistory(events.map(event => ({
        txHash: event.transactionHash,
        action: event.args?.action || '',
        user: event.args?.user || '',
      })));
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTxHistory(currentPartnership.id);
    }
  }, [isOpen, currentPartnership.id]);

  useEffect(() => {
    setCurrentPartnership(partnership);
    fetchTxHistory(partnership.id);
  }, [partnership]);

  useEffect(() => {
    if (!isConfirmingPartnership && !isCancellingPartnership) {
      const fetchUpdatedPartnership = async () => {
        setIsLoading(true);
        try {
          const contract = getPartnershipContractReadOnly();
          const updatedPartnership = await contract.getPartnership(currentPartnership.id);
          setCurrentPartnership({
            ...currentPartnership,
            completed: updatedPartnership.completed,
            brandConfirmed: updatedPartnership.brandConfirmed,
            influencerConfirmed: updatedPartnership.influencerConfirmed,
          });
          await fetchTxHistory(currentPartnership.id);
        } catch (error) {
          console.error("Error fetching updated partnership:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUpdatedPartnership();
    }
  }, [isConfirmingPartnership, isCancellingPartnership]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
          <ModalOverlay backdropFilter="blur(10px)" />
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
            maxH="80vh"
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'purple.500',
                borderRadius: '24px',
              },
            }}
          >
            <ModalHeader>
              <Heading size="xl" bgGradient="linear(to-r, blue.400, purple.500, pink.500)" bgClip="text">
                Partnership Details
              </Heading>
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody>
              {isLoading ? (
                <Flex justify="center" align="center" height="200px">
                  <Spinner size="xl" color="purple.500" />
                </Flex>
              ) : (
                <VStack spacing={6} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <MotionBox
                      bg={cardBg}
                      p={4}
                      borderRadius="lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Text fontSize="xl" fontWeight="bold" mb={2}>
                        Amount
                      </Text>
                      <HStack>
                        <Icon as={FaEthereum} color="purple.500" boxSize={5} />
                        <Text fontSize="lg">{currentPartnership.amount} ETH</Text>
                      </HStack>
                    </MotionBox>
                    <MotionBox
                      bg={cardBg}
                      p={4}
                      borderRadius="lg"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Text fontSize="xl" fontWeight="bold" mb={2}>
                        Parties
                      </Text>
                      <VStack align="start" spacing={2}>
                        <HStack>
                          <Icon as={FaFileContract} color="purple.500" boxSize={4} />
                          <Text fontSize="md" wordBreak="break-all">Brand: {currentPartnership.brand}</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FaFileContract} color="purple.500" boxSize={4} />
                          <Text fontSize="md" wordBreak="break-all">Influencer: {currentPartnership.influencer}</Text>
                        </HStack>
                      </VStack>
                    </MotionBox>
                  </SimpleGrid>
                  <MotionBox
                    bg={cardBg}
                    p={4}
                    borderRadius="lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <HStack mb={2}>
                      <Icon as={currentPartnership.completed ? FaCheck : FaClock} color={currentPartnership.completed ? "green.500" : "yellow.500"} boxSize={5} />
                      <Text fontSize="lg" fontWeight="bold">Status: {currentPartnership.completed ? 'Completed' : 'Pending'}</Text>
                    </HStack>
                    {!currentPartnership.completed && (
                      <HStack spacing={4} mt={4}>
                        <MotionButton
                          flex={1}
                          bgGradient="linear(to-r, blue.400, purple.500)"
                          color="white"
                          _hover={{ bgGradient: "linear(to-r, blue.500, purple.600)" }}
                          onClick={() => confirmPartnership(currentPartnership.id)}
                          isLoading={isConfirmingPartnership}
                          loadingText="Confirming..."
                          isDisabled={
                            (currentPartnership.brand === account && currentPartnership.brandConfirmed) ||
                            (currentPartnership.influencer === account && currentPartnership.influencerConfirmed)
                          }
                          leftIcon={<FaCheck />}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Confirm
                        </MotionButton>
                        <MotionButton
                          flex={1}
                          bg="transparent"
                          color="white"
                          borderColor="white"
                          borderWidth={1}
                          _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                          onClick={async () => {
                            await cancelPartnership(currentPartnership.id);
                            onClose();
                          }}
                          isLoading={isCancellingPartnership}
                          loadingText="Cancelling..."
                          leftIcon={<FaTimes />}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel
                        </MotionButton>
                      </HStack>
                    )}
                  </MotionBox>
                  <Divider />
                  <Heading size="md" mt={2} mb={1}>Transaction History</Heading>
                  <VStack spacing={3} align="stretch">
                    {txHistory.map((tx, index) => (
                      <MotionBox
                        key={index}
                        p={4}
                        bg={cardBg}
                        borderRadius="lg"
                        w="full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (index + 1) }}
                      >
                        <Flex justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
                          <VStack align="start" spacing={2} maxW="70%">
                            <Text fontSize="lg" fontWeight="bold">{tx.action}</Text>
                            <Text fontSize="sm" wordBreak="break-all">{tx.user}</Text>
                            <HStack>
                              <Text fontSize="xs" wordBreak="break-all">{tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}</Text>
                              <Tooltip label="Copy to clipboard">
                                <Icon as={FaCopy} cursor="pointer" onClick={() => copyToClipboard(tx.txHash)} color="purple.300" />
                              </Tooltip>
                            </HStack>
                          </VStack>
                          <Link href={`https://sepolia.etherscan.io/tx/${tx.txHash}`} isExternal color="white" fontWeight="bold" fontSize="sm" display="flex" alignItems="center">
                            View on Etherscan
                            <Icon as={FaArrowRight} ml={1} boxSize={3} />
                          </Link>
                        </Flex>
                      </MotionBox>
                    ))}
                  </VStack>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose} colorScheme="purple" size="md">
                Close
              </Button>
            </ModalFooter>
          </MotionModalContent>
        </Modal>
      )}
    </AnimatePresence>
  );
}