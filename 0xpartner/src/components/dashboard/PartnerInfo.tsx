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
          filter: 'blur(15px)',
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
            <MotionHeading size="2xl" color="white" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              Welcome, {partnerInfo.name}!
            </MotionHeading>
            <Icon as={partnerInfo.userType === UserType.Brand ? FaBuilding : FaUser} color="purple.300" boxSize={10} />
          </Flex>
          
          <MotionFlex alignItems="center" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Icon as={FaAddressCard} mr={2} color="pink.300" boxSize={6} />
            <Text fontSize="md" color={textColor}>
              Address: {partnerInfo.address.slice(0, 6)}...{partnerInfo.address.slice(-4)}
            </Text>
          </MotionFlex>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {statData.map((stat, index) => (
              <MotionStat key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }} bg={statBg} p={4} borderRadius="lg">
                <StatLabel color="gray.300">{stat.label}</StatLabel>
                <StatNumber color={textColor}>{stat.value}</StatNumber>
              </MotionStat>
            ))}
          </SimpleGrid>

          {infoData.map((info, index) => (
            <HStack key={index} spacing={4}>
              <Icon as={info.icon} color={info.color} boxSize={6} />
              <Text color={textColor}>{info.text}</Text>
            </HStack>
          ))}
        </VStack>
      </Box>
    </MotionBox>
  );
}