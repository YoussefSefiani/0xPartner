import {
    Box,
    VStack,
    Heading,
    Text,
    HStack,
    Button,
    Icon,
  } from '@chakra-ui/react';
  import { motion } from 'framer-motion';
  import { FaRocket, FaCalendarAlt } from 'react-icons/fa';
  import Link from 'next/link';
  import { useInView } from 'react-intersection-observer';
  
  const CTA = () => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });
  
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Box
          p={16}
          borderRadius="3xl"
          textAlign="center"
          width="full"
          position="relative"
          overflow="hidden"
          bg="rgba(255, 255, 255, 0.05)"
          backdropFilter="blur(10px)"
          boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
          border="1px solid rgba(255, 255, 255, 0.18)"
        >
          <Box
            position="absolute"
            top="-50%"
            left="-50%"
            width="200%"
            height="200%"
            backgroundImage="url('/network-bg.svg')"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            opacity={0.1}
            animation="pulse 15s infinite"
          />
          <VStack spacing={8} position="relative" zIndex={1}>
            <Heading
              as="h2"
              size="3xl"
              mb={4}
              bgGradient="linear(to-r, blue.300, purple.300)"
              bgClip="text"
              fontWeight="extrabold"
            >
              Revolutionize Your Partnerships Today!
            </Heading>
            <Text fontSize="2xl" color="whiteAlpha.900" maxW="2xl" mb={8}>
              Join 0xPartner and unlock a world of secure, transparent, and lucrative collaborations powered by blockchain technology.
            </Text>
            <HStack spacing={8} justify="center" wrap="wrap">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/dashboard">
                  <Button
                    as={motion.button}
                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(66, 153, 225, 0.6)" }}
                    whileTap={{ scale: 0.95 }}
                    size="lg"
                    bgGradient="linear(to-r, blue.400, purple.500)"
                    color="white"
                    leftIcon={<Icon as={FaRocket} />}
                    fontSize="xl"
                    py={8}
                    px={12}
                    borderRadius="full"
                    _hover={{
                      bgGradient: "linear(to-r, blue.500, purple.600)",
                      boxShadow: "0px 0px 20px rgba(66, 153, 225, 0.8)"
                    }}
                    _active={{
                      bgGradient: "linear(to-r, blue.600, purple.700)",
                      boxShadow: "0px 0px 20px rgba(66, 153, 225, 1)"
                    }}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: '-3px',
                      left: '-3px',
                      right: '-3px',
                      bottom: '-3px',
                      borderRadius: 'full',
                      background: 'linear-gradient(to right, #3182CE, #805AD5)',
                      filter: 'blur(10px)',
                      opacity: '0.7',
                      zIndex: '-1',
                    }}
                    _hover={{
                      _before: {
                        filter: 'blur(15px)',
                        opacity: '1',
                      },
                    }}
                  >
                    Launch Your Journey
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  fontSize="xl"
                  py={8}
                  px={12}
                  borderWidth={2}
                  borderColor="purple.400"
                  color="purple.400"
                  _hover={{ bg: "rgba(159, 122, 234, 0.1)" }}
                  leftIcon={<Icon as={FaCalendarAlt} color="purple.400" />}
                >
                  Schedule a Demo
                </Button>
              </motion.div>
            </HStack>
            <Text fontSize="lg" color="whiteAlpha.800" mt={6}>
              Join 1000+ brands and influencers already transforming their partnerships
            </Text>
          </VStack>
        </Box>
      </motion.div>
    );
  };

  export default CTA;
