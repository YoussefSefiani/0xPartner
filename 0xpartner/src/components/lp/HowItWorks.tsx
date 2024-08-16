import {
    Box,
    Container,
    VStack,
    Heading,
    HStack,
    Text,
    ScaleFade,
  } from '@chakra-ui/react';
  import { motion } from 'framer-motion';
  import { useInView } from 'react-intersection-observer';

  const HowItWorks = () => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    return (
      <Box
        ref={ref}
        position="relative"
        w="full"
        overflow="hidden"
        py={10}
      >
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <Heading
              as="h2"
              size="3xl"
              textAlign="center"
              bgGradient="linear(to-r, blue.300, purple.300, pink.300)"
              bgClip="text"
              fontWeight="extrabold"
            >
              How It Works
            </Heading>
            <VStack spacing={8} w="full">
              {[
                { 
                  step: 'Register', 
                  description: 'Create your account as a brand or influencer in minutes. Fill out your profile, showcase your expertise or brand values, and set your preferences for partnerships.'
                },
                { 
                  step: 'Create Partnerships', 
                  description: 'Set up smart contracts for your partnerships with ease. Define terms, deliverables, and compensation. Our platform automates the partnership process, ensuring clarity and security for both parties.'
                },
                { 
                  step: 'Collaborate & Earn', 
                  description: 'Work together, track progress, and receive secure payments. Utilize our collaboration tools, monitor real-time analytics, and enjoy automated, blockchain-secured transactions upon successful completion of milestones.'
                }
              ].map((item, index) => (
                <ScaleFade in={inView} initialScale={0.9} delay={index * 0.2} key={item.step}>
                  <HStack
                    spacing={8}
                    align="flex-start"
                    p={8}
                    bg="rgba(255, 255, 255, 0.05)"
                    backdropFilter="blur(10px)"
                    borderRadius="xl"
                    transition="all 0.3s"
                    _hover={{ transform: 'translateY(-5px)' }}
                    w="full"
                  >
                    <VStack spacing={4} align="center" minW="150px">
                      <Text fontSize="6xl" fontWeight="bold" bgGradient="linear(to-r, blue.300, purple.300)" bgClip="text">
                        {index + 1}
                      </Text>
                    </VStack>
                    <VStack align="start" spacing={4} flex={1}>
                      <Heading as="h3" size="xl" color="white">
                        {item.step}
                      </Heading>
                      <Text fontSize="lg" color="gray.300">
                        {item.description}
                      </Text>
                    </VStack>
                  </HStack>
                </ScaleFade>
              ))}
            </VStack>
          </VStack>
        </Container>
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.8}
          zIndex={-1}
        />
      </Box>
    );
  };
  
  export default HowItWorks;