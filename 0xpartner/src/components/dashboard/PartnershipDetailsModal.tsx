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
  Badge,
  IconButton
} from '@chakra-ui/react';
import { FaEthereum, FaCheck, FaTimes, FaFileContract, FaCopy, FaArrowRight, FaClock, FaHandshake, FaBuilding, FaUser, FaTimesCircle } from 'react-icons/fa';
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
              <Heading size="lg" color="white">
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
                      p={6}
                      borderRadius="lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                      _hover={{ 
                        boxShadow: "0 6px 8px rgba(138, 75, 175, 0.2)",
                        transform: "translateY(-2px)",
                        transition: "all 0.3s ease-in-out"
                      }}
                    >
                      <Flex alignItems="center" mb={4}>
                        <Icon as={FaEthereum} color="purple.400" boxSize={6} mr={3} />
                        <Text fontSize="xl" fontWeight="bold" color="white">
                          Partnership Amount
                        </Text>
                      </Flex>
                      <VStack spacing={2} align="stretch">
                        <Text 
                          fontSize="3xl" 
                          fontWeight="bold" 
                          color="white"
                          bgGradient="linear(to-r, purple.400, pink.400)"
                          bgClip="text"
                        >
                          {currentPartnership.amount} ETH
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          Gas Fee: Estimated at contract execution
                        </Text>
                      </VStack>
                      <Box mt={4} pt={4} borderTopWidth={1} borderTopColor="whiteAlpha.300">
                        <Text fontSize="sm" color="gray.300">
                          This partnership is secured by smart contract technology, ensuring transparency and trust between parties.
                        </Text>
                      </Box>
                    </MotionBox>
                    <MotionBox
                      bg={cardBg}
                      p={6}
                      borderRadius="lg"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                      _hover={{ boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)" }}
                    >
                      <Flex alignItems="center" mb={4}>
                        <Icon as={FaHandshake} color="purple.400" boxSize={6} mr={2} />
                        <Text fontSize="xl" fontWeight="bold" color="white">
                          Partnership Parties
                        </Text>
                      </Flex>
                      <VStack align="stretch" spacing={4}>
                        <Flex alignItems="center" bg="rgba(255, 255, 255, 0.1)" p={3} borderRadius="md">
                          <Icon as={FaBuilding} color="blue.300" boxSize={5} mr={3} />
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm" color="gray.400">Brand</Text>
                            <Text fontSize="md" color="white" fontWeight="medium" isTruncated maxWidth="200px">
                              {currentPartnership.brand}
                            </Text>
                          </VStack>
                        </Flex>
                        <Flex alignItems="center" bg="rgba(255, 255, 255, 0.1)" p={3} borderRadius="md">
                          <Icon as={FaUser} color="green.300" boxSize={5} mr={3} />
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm" color="gray.400">Influencer</Text>
                            <Text fontSize="md" color="white" fontWeight="medium" isTruncated maxWidth="200px">
                              {currentPartnership.influencer}
                            </Text>
                          </VStack>
                        </Flex>
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
                    <VStack mb={2} alignItems="center" spacing={2}>
                      <Icon as={currentPartnership.completed ? FaCheck : FaClock} color={currentPartnership.completed ? "green.500" : "yellow.500"} boxSize={5} />
                      <Text color={currentPartnership.completed ? "green.500" : "yellow.500"} fontSize="md" fontWeight="bold" textAlign="center">Status: {currentPartnership.completed ? 'Completed' : 'Pending'}</Text>
                    </VStack>
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
                  <Heading size="sm" mt={2} mb={1}>Transaction History</Heading>
                  <VStack spacing={3} align="stretch">
                    {txHistory.map((tx, index) => (
                      <MotionBox
                        key={index}
                        p={6}
                        bg={cardBg}
                        borderRadius="xl"
                        w="full"
                        boxShadow="lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (index + 1) }}
                      >
                        <Flex justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
                          <VStack align="start" spacing={3} maxW="70%">
                            <Badge colorScheme="purple" fontSize="sm" px={2} py={1} borderRadius="md">
                              {tx.action}
                            </Badge>
                            <Text fontSize="sm" fontWeight="medium" color="gray.300">
                              {tx.user}
                            </Text>
                            <HStack spacing={2} alignItems="center">
                              <Text fontSize="xs" fontWeight="bold" color="gray.400">
                                {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                              </Text>
                              <Tooltip label="Copy to clipboard" placement="top">
                                <IconButton
                                  aria-label="Copy transaction hash"
                                  icon={<FaCopy />}
                                  size="xs"
                                  variant="ghost"
                                  colorScheme="purple"
                                  onClick={() => copyToClipboard(tx.txHash)}
                                />
                              </Tooltip>
                            </HStack>
                          </VStack>
                          <Link
                            href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                            isExternal
                            color="white"
                            fontSize="sm"
                            display="flex"
                            alignItems="center"
                            _hover={{ textDecoration: 'none', color: 'purple.200' }}
                            mb={2}
                          >
                            View on Etherscan
                            <Icon as={FaArrowRight} ml={2} boxSize={4} />
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