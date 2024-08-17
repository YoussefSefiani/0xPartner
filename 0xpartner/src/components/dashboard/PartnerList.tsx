import { Box, Heading, Text, useToast, useColorModeValue, Grid, HStack, Flex, Icon, Tooltip, VStack, Badge, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Input, InputGroup, InputLeftElement, Container, Divider, SimpleGrid, Button, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb, ButtonGroup } from '@chakra-ui/react';
import { FaCopy, FaUser, FaBuilding, FaEthereum, FaHandshake, FaStar, FaSearch, FaSort, FaFilter } from 'react-icons/fa';
import { UserType } from '../../types/UserType';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';

interface Partner {
  name: string;
  userType: number;
  address: string;
  totalPartnerships: number;
  successRate: number;
  totalEthEarned: string;
  recentPerformance?: 'increase' | 'decrease';
}

interface PartnerListProps {
  allPartners: Partner[];
}

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

export default function PartnerList({ allPartners }: PartnerListProps) {
  const toast = useToast();
  const [sortBy, setSortBy] = useState<'partnerships' | 'successRate'>('partnerships');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSuccessRate, setFilterSuccessRate] = useState<[number, number]>([0, 100]);

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

  const filteredAndSortedPartners = useMemo(() => {
    return allPartners
      .filter(partner => 
        (partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (partner.successRate >= filterSuccessRate[0] && partner.successRate <= filterSuccessRate[1])
      )
      .sort((a, b) => {
        if (sortBy === 'partnerships') return b.totalPartnerships - a.totalPartnerships;
        return b.successRate - a.successRate;
      });
  }, [allPartners, sortBy, searchTerm, filterSuccessRate]);

  return (
    <Box maxW="container.xl" mx="auto" py={10}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        borderWidth={1}
        borderRadius="xl"
        p={8}
        bg={useColorModeValue('rgba(255, 255, 255, 0.1)', 'rgba(26, 32, 44, 0.4)')}
        boxShadow="xl"
        backdropFilter="blur(10px)"
        color={useColorModeValue('gray.100', 'white')}
      >
        <Flex justifyContent="space-between" alignItems="center" mb={8} flexWrap="wrap">
          <Heading size="2xl" color="white" mb={4}>
            All Partners
          </Heading>
          <InputGroup maxW="300px" mb={4}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={useColorModeValue('rgba(255, 255, 255, 0.05)', 'rgba(26, 32, 44, 0.3)')}
              border="none"
              _focus={{ boxShadow: "0 0 0 2px rgba(138, 75, 175, 0.6)" }}
            />
          </InputGroup>
        </Flex>
        <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems="center" mb={8}>
          <VStack align="start" spacing={4} mb={{ base: 4, md: 0 }}>
            <Text fontSize="lg" fontWeight="bold">Sort by</Text>
            <ButtonGroup size="sm" spacing={3} variant="outline">
              <Button
                variant={sortBy === 'partnerships' ? 'solid' : 'outline'}
                colorScheme={sortBy === 'partnerships' ? 'purple' : 'whiteAlpha'}
                onClick={() => setSortBy('partnerships')}
                leftIcon={<Icon as={FaHandshake} />}
                borderColor="white"
                color="white"
              >
                Partnerships
              </Button>
              <Button
                variant={sortBy === 'successRate' ? 'solid' : 'outline'}
                colorScheme={sortBy === 'successRate' ? 'purple' : 'whiteAlpha'}
                onClick={() => setSortBy('successRate')}
                leftIcon={<Icon as={FaStar} />}
                borderColor="white"
                color="white"
              >
                Success Rate
              </Button>
            </ButtonGroup>
          </VStack>
          <VStack align="start" spacing={4} w={{ base: "100%", md: "300px" }}>
            <Text fontSize="lg" fontWeight="bold">Filter by Success Rate</Text>
            <Box w="100%">
              <RangeSlider
                aria-label={['min', 'max']}
                defaultValue={[0, 100]}
                min={0}
                max={100}
                step={1}
                onChange={(val) => setFilterSuccessRate(val as [number, number])}
                colorScheme="purple"
              >
                <RangeSliderTrack bg="whiteAlpha.500">
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} boxSize={3} />
                <RangeSliderThumb index={1} boxSize={3} />
              </RangeSlider>
            </Box>
            <Text fontSize="sm" fontWeight="medium" alignSelf="flex-end">
              {filterSuccessRate[0]}% - {filterSuccessRate[1]}%
            </Text>
          </VStack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          <AnimatePresence>
            {filteredAndSortedPartners.map((partner, index) => (
              <MotionBox
                key={partner.address}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                borderWidth={1}
                borderRadius="lg"
                p={6}
                bg={useColorModeValue('rgba(255, 255, 255, 0.05)', 'rgba(26, 32, 44, 0.3)')}
                boxShadow="lg"
                _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s ease', boxShadow: 'xl', cursor: 'pointer' }}
              >
                <Flex align="center" mb={4}>
                  <Icon 
                    as={parseInt(partner.userType.toString()) === 1 ? FaBuilding : FaUser} 
                    mr={3} 
                    color={parseInt(partner.userType.toString()) === 1 ? "blue.300" : "purple.300"}
                    boxSize={10}
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="2xl">{partner.name}</Text>
                    <Badge colorScheme={parseInt(partner.userType.toString()) === 1 ? "blue" : "purple"} fontSize="sm" mt={1}>
                      {parseInt(partner.userType.toString()) === 1 ? "Brand" : "Influencer"}
                    </Badge>
                  </VStack>
                </Flex>
                
                <Text fontSize="sm" mb={4} isTruncated>
                  {partner.address.slice(0, 6) + '...' + partner.address.slice(-4)}
                  <Tooltip label="Copy Address" placement="top">
                    <Icon
                      as={FaCopy}
                      ml={2}
                      cursor="pointer"
                      onClick={() => copyToClipboard(partner.address)}
                      _hover={{ color: 'purple.300' }}
                    />
                  </Tooltip>
                </Text>
                
                <Divider my={4} />
                
                <SimpleGrid columns={2} spacing={4} mb={4}>
                  <Stat>
                    <StatLabel fontSize="sm"><Icon as={FaHandshake} mr={2} />Partnerships</StatLabel>
                    <StatNumber fontSize="2xl">{partner.totalPartnerships}</StatNumber>
                    {partner.recentPerformance && (
                      <StatHelpText>
                        <StatArrow type={partner.recentPerformance} />
                        {partner.recentPerformance === 'increase' ? '23%' : '9.05%'}
                      </StatHelpText>
                    )}
                  </Stat>
                  <Stat>
                    <StatLabel fontSize="sm"><Icon as={FaStar} mr={2} />Success Rate</StatLabel>
                    <StatNumber fontSize="2xl">{partner.successRate.toFixed(2)}%</StatNumber>
                  </Stat>
                </SimpleGrid>
                
                {parseInt(partner.userType.toString()) !== 1 && (
                  <Stat mb={4}>
                    <StatLabel fontSize="sm"><Icon as={FaEthereum} mr={2} />ETH Earned</StatLabel>
                    <StatNumber fontSize="2xl">{partner.totalEthEarned} ETH</StatNumber>
                  </Stat>
                )}
              </MotionBox>
            ))}
          </AnimatePresence>
        </SimpleGrid>
      </MotionBox>
    </Box>
  );
}