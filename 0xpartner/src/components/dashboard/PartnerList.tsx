import { Box, Heading, Text, useToast, useColorModeValue, SimpleGrid, Flex, Icon, Tooltip } from '@chakra-ui/react';
import { FaCopy, FaUser, FaBuilding, FaEthereum } from 'react-icons/fa';
import { UserType } from '../../types/UserType';
import { motion, AnimatePresence } from 'framer-motion';

interface Partner {
  name: string;
  userType: UserType;
  address: string;
  totalPartnerships: number;
  successRate: number;
  totalEthEarned: string;
}

interface PartnerListProps {
  allPartners: Partner[];
}

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

export default function PartnerList({ allPartners }: PartnerListProps) {
  const toast = useToast();
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.1)', 'rgba(26, 32, 44, 0.4)');

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: "Partner address has been copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      borderRadius="xl"
      p={6}
      bg={cardBg}
      boxShadow="0 0 20px rgba(107, 70, 193, 0.3)"
      backdropFilter="blur(10px)"
      color="white"
    >
      <Heading size="lg" mb={6} bgGradient="linear(to-r, blue.300, purple.300, pink.300)" bgClip="text">All Partners</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        <AnimatePresence>
          {allPartners.map((partner, index) => (
            <MotionFlex
              key={partner.address}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              direction="column"
              bg={useColorModeValue('rgba(255, 255, 255, 0.05)', 'rgba(26, 32, 44, 0.3)')}
              p={4}
              borderRadius="lg"
              boxShadow="lg"
            >
              <Flex align="center" mb={3}>
                <Icon 
                  as={partner.userType === UserType.Brand ? FaBuilding : FaUser} 
                  mr={2} 
                  color={partner.userType === UserType.Brand ? "blue.300" : "purple.300"}
                />
                <Text fontWeight="bold" fontSize="lg">{partner.name}</Text>
              </Flex>
              <Text fontSize="sm" mb={2} isTruncated>
                {partner.address.slice(0, 6) + '...' + partner.address.slice(-4)}
                <Tooltip label="Copy Address">
                  <Icon
                    as={FaCopy}
                    ml={2}
                    cursor="pointer"
                    onClick={() => copyToClipboard(partner.address)}
                    _hover={{ color: 'purple.300' }}
                  />
                </Tooltip>
              </Text>
              <Text fontSize="sm" mb={1}>Partnerships: {partner.totalPartnerships}</Text>
              <Text fontSize="sm" mb={1}>Success Rate: {partner.successRate.toFixed(2)}%</Text>
              {partner.userType !== UserType.Brand && (
                <Flex align="center" fontSize="sm">
                  <Icon as={FaEthereum} mr={1} />
                  <Text>{partner.totalEthEarned} ETH Earned</Text>
                </Flex>
              )}
            </MotionFlex>
          ))}
        </AnimatePresence>
      </SimpleGrid>
    </MotionBox>
  );
}