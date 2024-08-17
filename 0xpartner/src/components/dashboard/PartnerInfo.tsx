import { Box, Heading, Text, VStack, HStack, Icon, Flex, Stat, StatLabel, StatNumber, SimpleGrid, keyframes } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { UserType } from '../../types/UserType';
import { FaUser, FaBuilding, FaAddressCard, FaChartLine, FaStar } from 'react-icons/fa';

interface PartnerInfoProps {
  partnerInfo: {
    name: string;
    userType: UserType;
    address: string;
  };
  partnerStats: {
    totalPartnerships: number;
    successRate: number;
    totalEthEarned: string;
  };
}

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionFlex = motion(Flex);
const MotionStat = motion(Stat);

const infoData = [
  { icon: FaChartLine, text: 'Performance Trend: Positive', color: 'blue.300' },
  { icon: FaStar, text: 'Average Rating: 4.9/5', color: 'yellow.300' },
];

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(107, 70, 193, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(107, 70, 193, 0); }
  100% { box-shadow: 0 0 0 0 rgba(107, 70, 193, 0); }
`;

export default function PartnerInfo({ partnerInfo, partnerStats }: PartnerInfoProps) {
  const cardBg = 'rgba(255, 255, 255, 0.1)';
  const textColor = 'white';
  const statBg = 'rgba(255, 255, 255, 0.05)';
  console.log("partnerInfo", partnerInfo);

  const statData = [
    { label: 'Partnerships', value: partnerStats.totalPartnerships },
    { label: 'Success Rate', value: `${partnerStats.successRate.toFixed(2)}%` },
  ];

  if (partnerInfo.userType !== UserType.Brand) {
    statData.push({ label: 'ETH Earned', value: `${partnerStats.totalEthEarned} ETH` });
  }

  return (
    <MotionBox 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      sx={{
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-5px',
          left: '-5px',
          right: '-5px',
          bottom: '-5px',
          background: 'linear-gradient(to bottom right, #1a202c, #6b46c1)',
          borderRadius: 'xl',
          zIndex: -1,
          opacity: 0.7,
          animation: `${pulseAnimation} 2s infinite`,
        }
      }}
    >
      <Box 
        borderWidth={1} 
        borderRadius="xl" 
        p={8} 
        bg={cardBg} 
        boxShadow="0 0 20px rgba(255, 255, 255, 0.25)" 
        backdropFilter="blur(10px)"
        position="relative"
        overflow="hidden"
      >
        <VStack spacing={8} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <MotionHeading 
              size="2xl" 
              color="white" 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.2 }}
              color="white"
            >
              Welcome, {partnerInfo.name}
            </MotionHeading>
            <MotionBox
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
            >
              <Icon 
                as={partnerInfo.userType === UserType.Brand ? FaBuilding : FaUser} 
                color="purple.300" 
                boxSize={16}
                filter="drop-shadow(0px 0px 8px rgba(128, 90, 213, 0.6))"
              />
            </MotionBox>
          </Flex>
          
          <MotionFlex 
            alignItems="center" 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5, delay: 0.4 }}
            bg="rgba(255, 255, 255, 0.05)"
            p={4}
            borderRadius="lg"
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            _hover={{
              bg: "rgba(255, 255, 255, 0.1)",
              transform: "translateY(-2px)",
              transition: "all 0.3s ease-in-out"
            }}
          >
            <Icon as={FaAddressCard} mr={3} color="pink.300" boxSize={8} />
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" color="gray.400">Wallet Address</Text>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {partnerInfo.address.slice(0, 6)}...{partnerInfo.address.slice(-4)}
              </Text>
            </VStack>
          </MotionFlex>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {statData.map((stat, index) => (
              <MotionStat 
                key={index} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }} 
                bg={statBg} 
                p={4} 
                borderRadius="lg"
                boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                _hover={{ 
                  transform: "translateY(-5px)", 
                  boxShadow: "0 8px 15px rgba(107, 70, 193, 0.3)",
                  transition: "all 0.3s ease-in-out"
                }}
              >
                <StatLabel color="gray.300" fontSize="sm" fontWeight="medium">{stat.label}</StatLabel>
                <StatNumber color={textColor} fontSize="3xl" fontWeight="bold" 
                  bgGradient="linear(to-r, blue.300, purple.300, pink.300)"
                  bgClip="text"
                >
                  {stat.value}
                </StatNumber>
              </MotionStat>
            ))}
          </SimpleGrid>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Heading size="lg" color="white" mb={6} 
              color="white"
            >
              Performance Insights
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {infoData.map((info, index) => (
                <MotionFlex 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  bg="rgba(255, 255, 255, 0.05)" 
                  p={5} 
                  borderRadius="lg"
                  alignItems="center"
                  boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                  _hover={{ 
                    bg: "rgba(255, 255, 255, 0.1)",
                    transform: "translateX(5px)",
                    transition: "all 0.3s ease-in-out"
                  }}
                >
                  <Icon as={info.icon} color={info.color} boxSize={10} mr={4} />
                  <VStack align="start" spacing={0}>
                    <Text color={textColor} fontWeight="bold" fontSize="lg">{info.text.split(':')[0]}:</Text>
                    <Text color={info.color} fontWeight="medium" fontSize="xl">{info.text.split(':')[1]}</Text>
                  </VStack>
                </MotionFlex>
              ))}
            </SimpleGrid>
          </MotionBox>
        </VStack>
      </Box>
    </MotionBox>
  );
}