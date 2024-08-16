import {
  Box,
  Container,
  VStack,
  Heading,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Icon,
  Button,
  Text,
  Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaUserFriends, FaLightbulb, FaChartLine, FaChartBar, FaShieldAlt, FaHandshake, FaRocket, FaUsers, FaMoneyCheckAlt, FaWallet, FaClipboardCheck, FaPalette } from 'react-icons/fa';
import Link from 'next/link';

const Benefits = () => {
  return (
    <Box as="section" py={10} position="relative" overflow="hidden">
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        filter="blur(100px)"
        zIndex={-1}
      />
      <Container maxW="container.xl" position="relative">
        <VStack spacing={24}>
          <Heading
            as="h2"
            size="4xl"
            textAlign="center"
            bgGradient="linear(to-r, blue.300, purple.300, pink.300)"
            bgClip="text"
            fontWeight="extrabold"
            mb={8}
          >
            Unlock the Power of 0xPartner
          </Heading>
          <Box
            overflow="hidden"
            p={8}
            bg="rgba(255, 255, 255, 0.05)"
            backdropFilter="blur(10px)"
            borderRadius="2xl"
          >
            <Table variant="unstyled" colorScheme="whiteAlpha" size="lg">
              <TableCaption placement="top" fontSize="3xl" fontWeight="bold" mb={8} color="white">
                Comprehensive Benefits for Brands and Influencers
              </TableCaption>
              <Thead>
                <Tr>
                  <Th fontSize="2xl" py={8} textAlign="center" color="blue.300">Feature</Th>
                  <Th fontSize="2xl" py={8} textAlign="center" color="blue.300">For Brands</Th>
                  <Th fontSize="2xl" py={8} textAlign="center" color="purple.300">For Influencers</Th>
                </Tr>
              </Thead>
              <Tbody>
                {[
                  {
                    feature: "Network Access",
                    brand: { text: "Diverse influencer pool", icon: FaUserFriends },
                    influencer: { text: "Exciting brand opportunities", icon: FaLightbulb }
                  },
                  {
                    feature: "Performance Tracking",
                    brand: { text: "Real-time campaign analytics", icon: FaChartLine },
                    influencer: { text: "Showcase metrics & growth", icon: FaChartBar }
                  },
                  {
                    feature: "Smart Contracts",
                    brand: { text: "Secure investment protection", icon: FaShieldAlt },
                    influencer: { text: "Guaranteed fair compensation", icon: FaHandshake }
                  },
                  {
                    feature: "Scalability",
                    brand: { text: "Effortless partnership expansion", icon: FaRocket },
                    influencer: { text: "Long-term brand relationships", icon: FaUsers }
                  },
                  {
                    feature: "Payment System",
                    brand: { text: "Automated, secure transactions", icon: FaMoneyCheckAlt },
                    influencer: { text: "Instant payouts, multiple currencies", icon: FaWallet }
                  },
                  {
                    feature: "Content Collaboration",
                    brand: { text: "Streamlined approval process", icon: FaClipboardCheck },
                    influencer: { text: "Creative freedom with guidelines", icon: FaPalette }
                  }
                ].map((row, index) => (
                  <Tr key={index} _hover={{ bg: "rgba(255, 255, 255, 0.05)" }} transition="all 0.3s">
                    <Td fontWeight="bold" fontSize="xl" py={6} color="white">{row.feature}</Td>
                    <Td>
                      <Flex align="center">
                        <Icon as={row.brand.icon} color="blue.300" w={8} h={8} mr={4} />
                        <Text fontSize="lg" color="gray.200">{row.brand.text}</Text>
                      </Flex>
                    </Td>
                    <Td>
                      <Flex align="center">
                        <Icon as={row.influencer.icon} color="purple.300" w={8} h={8} mr={4} />
                        <Text fontSize="lg" color="gray.200">{row.influencer.text}</Text>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Link href="/dashboard">
          <Button
            as={motion.button}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(107, 70, 193, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            size="lg"
            bgGradient="linear(to-r, blue.400, purple.500)"
            color="white"
            rightIcon={<FaArrowRight />}
            fontSize="2xl"
            py={8}
            px={16}
            mt={16}
            borderRadius="full"
            _hover={{
              bgGradient: "linear(to-r, blue.500, purple.600)",
            }}
          >
            Start Benefiting Now
          </Button>
          </Link>
        </VStack>
      </Container>
    </Box>
  );
};

export default Benefits;