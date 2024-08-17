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
  Divider,
  Avatar,
  AvatarGroup,
} from '@chakra-ui/react';
import { FaHandshake, FaEthereum, FaInfoCircle, FaFileContract, FaUserFriends, FaChartLine } from 'react-icons/fa';
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
  onCreateSuccess: () => void;
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
          <ModalOverlay backdropFilter="blur(100px)" />
          <MotionModalContent
            bg={modalBg}
            color="white"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            borderRadius="2xl"
            boxShadow="0 0 40px rgba(138, 75, 175, 0.4)"
            p={8}
            maxH="90vh"
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
            <ModalHeader p={0} mb={6}>
              <Flex alignItems="center" justifyContent="space-between">
                <HStack spacing={4}>
                  <Icon as={FaHandshake} boxSize={8} color="purple.400" />
                  <Heading size="xl" fontWeight="bold" bgGradient="linear(to-r, blue.300, purple.300)" bgClip="text">
                    Create New Partnership
                  </Heading>
                </HStack>
                <ModalCloseButton position="static" size="lg" />
              </Flex>
            </ModalHeader>
            <ModalBody p={0}>
              <MotionVStack spacing={8} align="stretch" initial="hidden" animate="visible" variants={{
                visible: { transition: { staggerChildren: 0.15 } }
              }}>
                <MotionBox variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}>
                  <Text fontSize="lg" color="whiteAlpha.800" lineHeight="tall" fontWeight="medium">
                    Forge a powerful alliance by creating a new partnership. Choose your collaborator wisely and set the perfect foundation for your joint venture.
                  </Text>
                </MotionBox>
                <Divider borderColor="whiteAlpha.300" />
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                  <MotionBox bg={cardBg} p={6} borderRadius="xl" boxShadow="lg" variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="xl" fontWeight="bold" color="white" mb={4}>
                        <HStack spacing={3}>
                          <Icon as={FaUserFriends} color="blue.300" />
                          <Text>Select Partner</Text>
                        </HStack>
                      </FormLabel>
                      {filteredPartners.length > 0 ? (
                        <Select
                          placeholder="Choose your collaborator"
                          value={newPartnershipPartner}
                          onChange={handlePartnerChange}
                          bg="whiteAlpha.100"
                          color="white"
                          size="lg"
                          fontSize="md"
                          borderColor="whiteAlpha.300"
                          _hover={{ borderColor: "purple.300" }}
                          _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px #805AD5" }}
                          icon={<Icon as={FaChartLine} color="purple.300" />}
                        >
                          {filteredPartners.map((partner) => (
                            <option key={partner.address} value={partner.address} style={{color: 'black'}}>
                              {partner.name} ({UserType[partner.userType]})
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <Text color="red.400" fontSize="md" fontWeight="medium">No partners available. Please add partners first.</Text>
                      )}
                    </FormControl>
                  </MotionBox>
                  <MotionBox bg={cardBg} p={6} borderRadius="xl" boxShadow="lg" variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0 }
                  }}>
                    <FormControl isRequired>
                      <FormLabel fontSize="xl" fontWeight="bold" color="white" mb={4}>
                        <HStack spacing={3}>
                          <Icon as={FaEthereum} color="purple.300" />
                          <Text>Partnership Amount</Text>
                        </HStack>
                      </FormLabel>
                      <Flex alignItems="center">
                        <Input
                          placeholder="Enter ETH amount"
                          type="number"
                          step="0.01"
                          value={newPartnershipAmount}
                          onChange={(e) => setNewPartnershipAmount(e.target.value)}
                          bg="whiteAlpha.100"
                          color="white"
                          size="lg"
                          fontSize="md"
                          borderColor="whiteAlpha.300"
                          _hover={{ borderColor: "purple.300" }}
                          _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px #805AD5" }}
                          flex="1"
                        />
                        <Box ml={4}>
                          <Tooltip label="Enter the amount of ETH for this partnership" placement="top">
                            <Icon as={FaInfoCircle} color="blue.300" boxSize={6} />
                          </Tooltip>
                        </Box>
                      </Flex>
                    </FormControl>
                  </MotionBox>
                </SimpleGrid>
                <MotionBox bg={cardBg} p={6} borderRadius="xl" boxShadow="lg" variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}>
                  <HStack spacing={4} mb={4}>
                    <Icon as={FaFileContract} color="purple.400" boxSize={6} />
                    <Text fontSize="xl" fontWeight="bold">Partnership Overview</Text>
                  </HStack>
                  <Text fontSize="md" mb={4}>
                    Review the details carefully before finalizing your partnership. This collaboration could be the start of something extraordinary!
                  </Text>
                  <Flex justifyContent="space-between" alignItems="center">
                    <AvatarGroup size="md" max={3}>
                      <Avatar name="You" bg="blue.500" />
                      <Avatar name="Partner" bg="purple.500" />
                    </AvatarGroup>
                    <Text fontSize="lg" fontWeight="bold">
                      {newPartnershipAmount ? `${newPartnershipAmount} ETH` : 'Amount not set'}
                    </Text>
                  </Flex>
                </MotionBox>
              </MotionVStack>
            </ModalBody>
            <ModalFooter justifyContent="center" mt={8}>
              <HStack spacing={6}>
                <MotionButton
                  leftIcon={<Icon as={FaHandshake} boxSize={5} />}
                  bgGradient="linear(to-r, blue.400, purple.500)"
                  color="white"
                  onClick={createPartnership}
                  isLoading={isCreatingPartnership}
                  loadingText="Forging Partnership..."
                  isDisabled={!newPartnershipPartner || !newPartnershipAmount || isCreatingPartnership}
                  size="lg"
                  fontSize="lg"
                  fontWeight="bold"
                  px={10}
                  py={6}
                  _hover={{ 
                    bgGradient: "linear(to-r, blue.500, purple.600)",
                    transform: "translateY(-2px)",
                    boxShadow: "xl",
                  }}
                  _active={{
                    transform: "translateY(0)",
                    boxShadow: "md",
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
                  fontWeight="bold"
                  px={10}
                  py={6}
                  color="white"
                  variant="outline"
                  _hover={{ bg: 'whiteAlpha.200', transform: "translateY(-2px)" }}
                  _active={{
                    transform: "translateY(0)",
                    boxShadow: "md",
                  }}
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