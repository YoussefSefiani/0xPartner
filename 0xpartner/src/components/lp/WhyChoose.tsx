import {
    Box,
    Container,
    VStack,
    Heading,
    SimpleGrid,
    Icon,
    Circle,
    Text,
  } from '@chakra-ui/react';
  import { motion } from 'framer-motion';
  import { FaHandshake, FaChartLine, FaShieldAlt, FaRocket } from 'react-icons/fa';
  import { useInView } from 'react-intersection-observer';

  const MotionBox = motion(Box);

  const WhyChoose = () => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    return (
      <Box
        ref={ref}
        as="section"
        py={10}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl" position="relative" zIndex={2}>
          <VStack spacing={16} align="stretch">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Heading
                as="h2"
                size="4xl"
                textAlign="center"
                bgGradient="linear(to-r, blue.300, purple.300)"
                bgClip="text"
                fontWeight="extrabold"
                mb={4}
              >
                Why Choose 0xPartner?
              </Heading>
            </motion.div>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={16}>
              {[
                {
                  icon: FaHandshake,
                  title: "Smart Partnerships",
                  description: "Create and manage partnerships effortlessly using our blockchain-powered smart contracts, ensuring transparency and trust.",
                  color: "blue.300"
                },
                {
                  icon: FaChartLine,
                  title: "Real-Time Analytics",
                  description: "Monitor campaign performance and payouts in real-time with unparalleled transparency and accuracy, powered by blockchain technology.",
                  color: "purple.300"
                },
                {
                  icon: FaShieldAlt,
                  title: "Secure Transactions",
                  description: "Ensure safe and timely payments with our state-of-the-art blockchain-based escrow system, eliminating fraud and disputes.",
                  color: "green.300"
                },
                {
                  icon: FaRocket,
                  title: "Scalable Growth",
                  description: "Expand your network and boost your partnerships effortlessly on our cutting-edge platform, designed for unlimited scalability.",
                  color: "orange.300"
                }
              ].map((item, index) => (
                <MotionBox
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                >
                  <VStack
                    align="start"
                    spacing={6}
                    p={8}
                    borderRadius="xl"
                    transition="all 0.3s"
                    _hover={{ transform: 'translateY(-5px)' }}
                    bg="rgba(255, 255, 255, 0.05)"
                    backdropFilter="blur(10px)"
                  >
                    <Circle size="60px" bg={item.color} color="white">
                      <Icon as={item.icon} w={8} h={8} />
                    </Circle>
                    <Heading as="h3" size="lg" color="white">{item.title}</Heading>
                    <Text color="gray.300">
                      {item.description}
                    </Text>
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={1}
        />
      </Box>
    );
  };
  
  export default WhyChoose;