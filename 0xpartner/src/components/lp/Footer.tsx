import {
    Box,
    Container,
    VStack,
    Divider,
    Flex,
    Text,
    HStack,
    Link,
    SimpleGrid,
  } from '@chakra-ui/react';
  
  const Footer = () => {
    return (
      <Box as="footer" py={10} width="100%">
        <Container maxW="100%" px={{ base: 4, md: 6, lg: 8 }}>
          <VStack spacing={16} width="100%">
            <Divider borderColor="whiteAlpha.300" />
            <Flex
              direction={{ base: 'column', lg: 'row' }}
              justify="space-between"
              align="flex-start"
              w="100%"
            >
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10} w="100%">
                <VStack align="flex-start">
                  <Text fontWeight="bold" fontSize="xl" mb={4} color="blue.300">
                    Product
                  </Text>
                  <VStack align="flex-start" spacing={3}>
                    <Link href="#" color="white" _hover={{ color: 'blue.300', textDecoration: 'none' }}>
                      <Text color="white">Features</Text>
                    </Link>
                    <Link href="#" color="white" _hover={{ color: 'blue.300', textDecoration: 'none' }}>
                      <Text color="white">Pricing</Text>
                    </Link>
                    <Link href="#" color="white" _hover={{ color: 'blue.300', textDecoration: 'none' }}>
                      <Text color="white">Case Studies</Text>
                    </Link>
                  </VStack>
                </VStack>
                <VStack align="flex-start">
                  <Text fontWeight="bold" fontSize="xl" mb={4} color="blue.300">
                    Company
                  </Text>
                  <VStack align="flex-start" spacing={3}>
                    <Link href="#" color="white" _hover={{ color: 'blue.300', textDecoration: 'none' }}>
                      <Text color="white">About Us</Text>
                    </Link>
                    <Link href="#" color="white" _hover={{ color: 'blue.300', textDecoration: 'none' }}>
                      <Text color="white">Careers</Text>
                    </Link>
                    <Link href="#" color="white" _hover={{ color: 'blue.300', textDecoration: 'none' }}>
                      <Text color="white">Contact</Text>
                    </Link>
                  </VStack>
                </VStack>
                <VStack align="flex-start">
                  <Text fontWeight="bold" fontSize="xl" mb={4} color="blue.300">
                    Resources
                  </Text>
                  <VStack align="flex-start" spacing={3}>
                    <Link href="#" color="white" _hover={{ color: 'blue.300', textDecoration: 'none' }}>
                      <Text color="white">Blog</Text>
                    </Link>
                    <Link href="#" color="white" _hover={{ color: 'blue.300', textDecoration: 'none' }}>
                      <Text color="white">Documentation</Text>
                    </Link>
                    <Link href="#" color="white" _hover={{ color: 'blue.300', textDecoration: 'none' }}>
                      <Text color="white">FAQ</Text>
                    </Link>
                  </VStack>
                </VStack>
              </SimpleGrid>
            </Flex>
            <Divider borderColor="whiteAlpha.300" />
            <Flex
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
              align="center"
              w="100%"
            >
              <Text fontSize="sm" color="white">
                © 2024 0xPartner. All rights reserved.
              </Text>
              <HStack spacing={6} mt={{ base: 4, md: 0 }}>
                <Link href="#" fontSize="sm" color="white" _hover={{ color: 'blue.300', textDecoration: 'none' }}>
                  Privacy Policy
                </Link>
                <Link href="#" fontSize="sm" color="white" _hover={{ color: 'blue.300', textDecoration: 'none' }}>
                  Terms of Service
                </Link>
              </HStack>
            </Flex>
          </VStack>
        </Container>
      </Box>
    );
  };
  
  export default Footer;