import { Box, Heading, VStack, Input, Button, Text, useColorModeValue, Flex, Icon, Progress, HStack, Card, CardBody } from '@chakra-ui/react';
import { FaUserPlus, FaBuilding, FaUser, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
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
          <Heading 
            as="h2" 
            size="xl" 
            textAlign="center"
            bgGradient="linear(to-r, blue.300, purple.300, pink.300)"
            bgClip="text"
            fontWeight="extrabold"
          >
            Join 0xPartner
          </Heading>

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
                <Text fontSize="xl" textAlign="center" color={textColor} mb={4}>
                  Welcome to 0xPartner! We're excited to have you join our community. Let's get started with your registration.
                </Text>
              )}
              {step === 1 && (
                <VStack spacing={4}>
                  <Text fontSize="xl" textAlign="center" color={textColor} mb={4}>
                    Are you joining as a Brand or an Influencer?
                  </Text>
                  <HStack spacing={4}>
                    <Card 
                      onClick={() => setPartnerType(UserType.Brand)}
                      cursor="pointer"
                      bg={partnerType === UserType.Brand ? "purple.500" : "whiteAlpha.200"}
                      _hover={{ bg: "purple.400" }}
                      width="200px"
                      height="150px"
                    >
                      <CardBody>
                        <VStack justify="center" height="100%">
                          <Icon as={FaBuilding} boxSize={8} color={textColor} />
                          <Text color={textColor}>Brand</Text>
                        </VStack>
                      </CardBody>
                    </Card>
                    <Card 
                      onClick={() => setPartnerType(UserType.Influencer)}
                      cursor="pointer"
                      bg={partnerType === UserType.Influencer ? "purple.500" : "whiteAlpha.200"}
                      _hover={{ bg: "purple.400" }}
                      width="200px"
                      height="150px"
                    >
                      <CardBody>
                        <VStack justify="center" height="100%">
                          <Icon as={FaUser} boxSize={8} color={textColor} />
                          <Text color={textColor}>Influencer</Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  </HStack>
                </VStack>
              )}
              {step === 2 && (
                <Input
                  placeholder={`Enter your ${partnerType === UserType.Brand ? 'brand' : 'influencer'} name`}
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  size="lg"
                  bg={inputBg}
                  color={textColor}
                  _placeholder={{ color: "whiteAlpha.700" }}
                  borderColor="whiteAlpha.300"
                  _focus={{ borderColor: "purple.300", boxShadow: "0 0 0 1px #805AD5" }}
                />
              )}
              {step === 3 && (
                <Text fontSize="xl" textAlign="center" color={textColor}>
                  Great! You're all set to join as {newPartnerName} ({partnerType === UserType.Brand ? 'Brand' : 'Influencer'}). Click 'Finish' to complete your registration.
                </Text>
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