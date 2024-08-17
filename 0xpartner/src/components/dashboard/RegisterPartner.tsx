import { Box, Heading, VStack, Input, Button, Text, useColorModeValue, Flex, Icon, Progress, HStack, Card, CardBody, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { FaUserPlus, FaBuilding, FaUser, FaArrowRight, FaArrowLeft, FaRocket, FaNetworkWired, FaShieldAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { UserType } from '../../types/UserType';
import { useState } from 'react';

interface RegisterPartnerProps {
  newPartnerName: string;
  setNewPartnerName: (name: string) => void;
  addPartner: (partnerType: UserType) => void;
  isAddingPartner: boolean;
}

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

export default function RegisterPartner({
  newPartnerName,
  setNewPartnerName,
  addPartner,
  isAddingPartner
}: RegisterPartnerProps) {
  const [step, setStep] = useState(0);
  const [partnerType, setPartnerType] = useState<UserType | null>(null);
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.1)', 'rgba(26, 32, 44, 0.4)');
  const textColor = useColorModeValue('white', 'gray.200');
  const inputBg = useColorModeValue('whiteAlpha.300', 'whiteAlpha.200');

  const steps = [
    { title: "Welcome", icon: FaUserPlus },
    { title: "Choose Type", icon: FaUserPlus },
    { title: "Your Name", icon: partnerType === UserType.Brand ? FaBuilding : FaUser },
    { title: "Confirmation", icon: FaArrowRight },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      addPartner(partnerType!);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <Box
        borderWidth={1}
        borderRadius="xl"
        p={8}
        bg={cardBg}
        boxShadow="0 0 20px rgba(107, 70, 193, 0.5)"
        backdropFilter="blur(10px)"
        maxWidth="75vw"
        margin="auto"
      >
        <VStack spacing={8} align="stretch">
          <Flex justify="space-between">
            {steps.map((s, index) => (
              <VStack key={index} spacing={2}>
                <Icon
                  as={s.icon}
                  boxSize={8}
                  color={index <= step ? "purple.300" : "gray.500"}
                />
                <Text color={index <= step ? textColor : "gray.500"} fontSize="sm">
                  {s.title}
                </Text>
              </VStack>
            ))}
          </Flex>

          <Progress value={(step / (steps.length - 1)) * 100} colorScheme="purple" />

          <AnimatePresence mode="wait">
            <MotionFlex
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              direction="column"
              align="center"
              justify="center"
              minHeight="200px"
            >
              {step === 0 && (
                <VStack spacing={6} align="center" maxWidth="600px">
                  <Icon as={FaUserPlus} boxSize={16} color="purple.300" />
                  <Heading fontSize="3xl" textAlign="center" color={textColor}>
                    Welcome to 0xPartner !
                  </Heading>
                  <Text fontSize="xl" textAlign="center" color={textColor}>
                    We're excited to have you join our community. Let's get started with your registration.
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="white">
                    Ready to revolutionize your partnerships ?
                  </Text>
                </VStack>
              )}
              {step === 1 && (
                <VStack spacing={6}>
                  <Text fontSize="xl" textAlign="center" color={textColor} mb={4}>
                    Are you joining as a Brand or an Influencer ?
                  </Text>
                  <HStack spacing={6}>
                    <Card 
                      onClick={() => setPartnerType(UserType.Brand)}
                      cursor="pointer"
                      bg={partnerType === UserType.Brand ? "purple.500" : "whiteAlpha.200"}
                      _hover={{ bg: "purple.400" }}
                      width="250px"
                      height="200px"
                    >
                      <CardBody>
                        <VStack justify="center" height="100%" spacing={4}>
                          <Icon as={FaBuilding} boxSize={10} color={textColor} />
                          <Text color={textColor} fontSize="lg" fontWeight="bold">Brand</Text>
                          <Text color={textColor} fontSize="sm" textAlign="center">
                            Join as a company looking to collaborate with influencers for marketing campaigns.
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                    <Card 
                      onClick={() => setPartnerType(UserType.Influencer)}
                      cursor="pointer"
                      bg={partnerType === UserType.Influencer ? "purple.500" : "whiteAlpha.200"}
                      _hover={{ bg: "purple.400" }}
                      width="250px"
                      height="200px"
                    >
                      <CardBody>
                        <VStack justify="center" height="100%" spacing={4}>
                          <Icon as={FaUser} boxSize={10} color={textColor} />
                          <Text color={textColor} fontSize="lg" fontWeight="bold">Influencer</Text>
                          <Text color={textColor} fontSize="sm" textAlign="center">
                            Join as a content creator looking to partner with brands for sponsored content.
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  </HStack>
                </VStack>
              )}
              {step === 2 && (
                <VStack spacing={6} align="stretch" width="100%">
                  <Heading fontSize="2xl" textAlign="center" color={textColor}>
                    Let's Get to Know You
                  </Heading>
                  <Text fontSize="md" textAlign="center" color={textColor}>
                    Enter your {partnerType === UserType.Brand ? 'brand' : 'influencer'} name below
                  </Text>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={partnerType === UserType.Brand ? FaBuilding : FaUser} color="purple.300" />
                    </InputLeftElement>
                    <Input
                      placeholder={`Your ${partnerType === UserType.Brand ? 'brand' : 'influencer'} name`}
                      value={newPartnerName}
                      onChange={(e) => setNewPartnerName(e.target.value)}
                      bg={inputBg}
                      color={textColor}
                      _placeholder={{ color: "whiteAlpha.700" }}
                      borderColor="whiteAlpha.300"
                      _focus={{ borderColor: "purple.300", boxShadow: "0 0 0 1px #805AD5" }}
                    />
                  </InputGroup>
                  <Text fontSize="sm" color="gray.400" textAlign="center">
                    This name will be visible to potential partners on the platform
                  </Text>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Box
                      borderWidth={1}
                      borderRadius="md"
                      p={4}
                      bg="rgba(128, 90, 213, 0.1)"
                      borderColor="purple.300"
                    >
                      <Text fontSize="sm" color={textColor}>
                        💡 Tip: Choose a name that's memorable and reflects your brand identity or personal style.
                      </Text>
                    </Box>
                  </motion.div>
                </VStack>
              )}
              {step === 3 && (
                <VStack spacing={8} align="center" w="full">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <Icon
                      as={partnerType === UserType.Brand ? FaBuilding : FaUser}
                      boxSize={24}
                      color="purple.300"
                      filter="drop-shadow(0px 0px 8px rgba(128, 90, 213, 0.6))"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Heading fontSize="4xl" textAlign="center" color={textColor} fontWeight="extrabold">
                      Welcome aboard, {newPartnerName} !
                    </Heading>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Text fontSize="2xl" textAlign="center" color={textColor} fontWeight="medium">
                      You're all set to join as {partnerType === UserType.Brand ? 'a Brand' : 'an Influencer'}.
                    </Text>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                  >
                    <Box
                      borderWidth={3}
                      borderColor="purple.400"
                      borderRadius="xl"
                      p={6}
                      bg="rgba(128, 90, 213, 0.15)"
                      boxShadow="0 0 20px rgba(128, 90, 213, 0.3)"
                      maxW="md"
                      w="full"
                    >
                      <VStack spacing={4} align="start">
                        <HStack>
                          <Icon as={FaRocket} color="purple.300" boxSize={6} />
                          <Text fontSize="lg" color={textColor} fontWeight="semibold">
                            Revolutionize Web3 partnerships
                          </Text>
                        </HStack>
                        <HStack>
                          <Icon as={FaNetworkWired} color="purple.300" boxSize={6} />
                          <Text fontSize="lg" color={textColor} fontWeight="semibold">
                            Access to {partnerType === UserType.Brand ? 'top influencers' : 'innovative brands'}
                          </Text>
                        </HStack>
                        <HStack>
                          <Icon as={FaShieldAlt} color="purple.300" boxSize={6} />
                          <Text fontSize="lg" color={textColor} fontWeight="semibold">
                            Secure & transparent collaborations
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Text fontSize="xl" fontWeight="bold" color="white" textAlign="center">
                      Click 'Finish' to complete your registration and embark on an exciting journey !
                    </Text>
                  </motion.div>
                </VStack>
              )}
            </MotionFlex>
          </AnimatePresence>

          <HStack spacing={4}>
            <Button
              leftIcon={<FaArrowLeft />}
              bgGradient="linear(to-r, blue.400, purple.500)"
              color="white"
              onClick={handlePrevious}
              size="lg"
              width="50%"
              isDisabled={step === 0}
              _hover={{}}
              _active={{
                bgGradient: "linear(to-r, blue.600, purple.700)",
                boxShadow: "md"
              }}
            >
              Previous
            </Button>
            <Button
              rightIcon={step < steps.length - 1 ? <FaArrowRight /> : <FaUserPlus />}
              bgGradient="linear(to-r, blue.400, purple.500)"
              color="white"
              onClick={handleNext}
              size="lg"
              width="50%"
              isLoading={isAddingPartner}
              loadingText="Registering..."
              isDisabled={(step === 1 && partnerType === null) || (step === 2 && !newPartnerName.trim())}
              _hover={{}}
              _active={{
                bgGradient: "linear(to-r, blue.600, purple.700)",
                boxShadow: "md"
              }}
            >
              {step < steps.length - 1 ? 'Next' : 'Finish'}
            </Button>
          </HStack>
        </VStack>
      </Box>
    </MotionBox>
  );
}