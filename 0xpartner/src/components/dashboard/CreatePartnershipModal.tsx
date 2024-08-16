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
  FormControl,
  FormLabel,
  Select,
  Input,
  Text,
  Heading,
  Icon,
  Box,
  Flex,
  Tooltip,
  useColorModeValue,
  HStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaHandshake, FaEthereum, FaInfoCircle, FaFileContract } from 'react-icons/fa';
import { UserType } from '../../types/UserType';
import { motion, AnimatePresence } from 'framer-motion';

interface Partner {
  address: string;
  name: string;
  userType: UserType;
}

interface CreatePartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  allPartners: Partner[];
  account: string;
  newPartnershipPartner: string;
  setNewPartnershipPartner: (partner: string) => void;
  newPartnershipAmount: string;
  setNewPartnershipAmount: (amount: string) => void;
  createPartnership: () => void;
  isCreatingPartnership: boolean;
}

const MotionModalContent = motion(ModalContent);
const MotionButton = motion(Button);
const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

export default function CreatePartnershipModal({
  isOpen,
  onClose,
  allPartners,
  account,
  newPartnershipPartner,
  setNewPartnershipPartner,
  newPartnershipAmount,
  setNewPartnershipAmount,
  createPartnership,
  isCreatingPartnership
}: CreatePartnershipModalProps) {
  const filteredPartners = allPartners?.filter(p => p.address !== account) || [];
  
  const handlePartnerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewPartnershipPartner(e.target.value);
  };

  const modalBg = useColorModeValue('rgba(255, 255, 255, 0.1)', 'rgba(26, 32, 44, 0.4)');
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.05)', 'rgba(26, 32, 44, 0.3)');

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
          <ModalOverlay backdropFilter="blur(10px)" />
          <MotionModalContent
            bg={modalBg}
            color="white"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            borderRadius="xl"
            boxShadow="0 0 30px rgba(138, 75, 175, 0.3)"
            p={6}
            maxH="80vh"
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-track': { width: '6px' },
              '&::-webkit-scrollbar-thumb': {
                background: 'purple.500',
                borderRadius: '24px',
              },
            }}
          >
            <ModalHeader>
              <Heading size="xl" bgGradient="linear(to-r, blue.400, purple.500, pink.500)" bgClip="text">
                Create New Partnership
              </Heading>
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody>
              <MotionVStack spacing={6} align="stretch" initial="hidden" animate="visible" variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}>
                <MotionBox variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}>
                  <Text fontSize="lg" color="white" lineHeight="tall">
                    Creating a new partnership is the first step in establishing a collaboration. 
                    Choose your partner wisely and set an appropriate amount for your partnership.
                  </Text>
                </MotionBox>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <MotionBox bg={cardBg} p={4} borderRadius="lg" variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="xl" fontWeight="bold" color="white" mb={2}>Select Partner</FormLabel>
                      {filteredPartners.length > 0 ? (
                        <Select
                          placeholder="Choose a partner"
                          value={newPartnershipPartner}
                          onChange={handlePartnerChange}
                          bg="transparent"
                          color="white"
                          size="lg"
                          fontSize="md"
                          borderColor="whiteAlpha.300"
                          _hover={{ borderColor: "purple.300" }}
                          _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px #805AD5" }}
                        >
                          {filteredPartners.map((partner) => (
                            <option key={partner.address} value={partner.address} style={{color: 'black'}}>
                              {partner.name} ({UserType[partner.userType]})
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <Text color="red.500" fontSize="md">No partners available. Please add partners first.</Text>
                      )}
                    </FormControl>
                  </MotionBox>
                  <MotionBox bg={cardBg} p={4} borderRadius="lg" variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0 }
                  }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="xl" fontWeight="bold" color="white" mb={2}>
                        Amount (ETH)
                        <Tooltip label="Enter the amount of ETH for this partnership" placement="top">
                          <Icon as={FaInfoCircle} color="blue.500" ml={2} boxSize={4} />
                        </Tooltip>
                      </FormLabel>
                      <Flex alignItems="center">
                        <Input
                          placeholder="Enter amount"
                          type="number"
                          step="0.01"
                          value={newPartnershipAmount}
                          onChange={(e) => setNewPartnershipAmount(e.target.value)}
                          bg="transparent"
                          color="white"
                          size="lg"
                          fontSize="md"
                          borderColor="whiteAlpha.300"
                          _hover={{ borderColor: "purple.300" }}
                          _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px #805AD5" }}
                          flex="1"
                        />
                        <Icon as={FaEthereum} color="purple.500" boxSize={6} ml={2} />
                      </Flex>
                    </FormControl>
                  </MotionBox>
                </SimpleGrid>
                <MotionBox bg={cardBg} p={4} borderRadius="lg" variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}>
                  <HStack spacing={4}>
                    <Icon as={FaFileContract} color="purple.500" boxSize={5} />
                    <Text fontSize="lg" fontWeight="bold">Partnership Details</Text>
                  </HStack>
                  <Text fontSize="md" mt={2}>
                    Please review the details carefully before creating the partnership.
                  </Text>
                </MotionBox>
              </MotionVStack>
            </ModalBody>
            <ModalFooter>
              <HStack spacing={4} width="100%" justifyContent="center">
                <MotionButton
                  leftIcon={<Icon as={FaHandshake} boxSize={5} />}
                  bgGradient="linear(to-r, blue.400, purple.500)"
                  color="white"
                  onClick={createPartnership}
                  isLoading={isCreatingPartnership}
                  loadingText="Creating Partnership..."
                  isDisabled={!newPartnershipPartner || !newPartnershipAmount || isCreatingPartnership}
                  size="lg"
                  fontSize="lg"
                  px={8}
                  _hover={{ 
                    bgGradient: "linear(to-r, blue.500, purple.600)",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Partnership
                </MotionButton>
                <Button
                  onClick={onClose}
                  size="lg"
                  fontSize="lg"
                  px={8}
                  color="white"
                  variant="outline"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  Cancel
                </Button>
              </HStack>
            </ModalFooter>
          </MotionModalContent>
        </Modal>
      )}
    </AnimatePresence>
  );
}