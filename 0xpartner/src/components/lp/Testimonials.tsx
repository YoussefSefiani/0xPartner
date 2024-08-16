import {
    Box,
    VStack,
    Heading,
    Flex,
    Text,
    HStack,
    Icon,
  } from '@chakra-ui/react';
  import { motion } from 'framer-motion';
  import { useState, useEffect } from 'react';
  import { FaBriefcase, FaMicrophone, FaChartLine } from 'react-icons/fa';
  
  const Testimonials = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const testimonials = [
      {
        name: 'Sarah Johnson',
        role: 'Marketing Director',
        quote: '0xPartner has revolutionized our influencer campaigns. The transparency and efficiency are unmatched!',
        icon: FaBriefcase
      },
      {
        name: 'Alex Chen',
        role: 'Tech Influencer',
        quote: 'As an influencer, 0xPartner gives me peace of mind. Smart contracts ensure fair compensation every time.',
        icon: FaMicrophone
      },
      {
        name: 'Emily Rodriguez',
        role: 'E-commerce Entrepreneur',
        quote: "The ROI tracking on 0xPartner is a game-changer. It's transformed how we approach influencer partnerships.",
        icon: FaChartLine
      }
    ];
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTestimonial((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
  
      return () => clearInterval(interval);
    }, [testimonials.length]);
  
    return (
      <VStack
        as="section"
        py={10}
        spacing={16}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-50%"
          left="-50%"
          width="200%"
          height="200%"
          filter="blur(60px)"
          opacity={0.4}
          zIndex={0}
        />
        <Heading
          as="h2"
          size="4xl"
          textAlign="center"
          bgGradient="linear(to-r, blue.300, purple.300, pink.300)"
          bgClip="text"
          fontWeight="extrabold"
          mb={4}
          zIndex={1}
        >
          Voices of Success
        </Heading>
        <Box
          position="relative"
          width="full"
          maxW="4xl"
          height={{ base: "auto", md: "400px" }}
          zIndex={1}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {testimonials.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: currentTestimonial === index ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              >
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  height="full"
                  position="relative"
                  overflow="hidden"
                  bg="rgba(255, 255, 255, 0.05)"
                  backdropFilter="blur(10px)"
                  borderRadius="2xl"
                  p={8}
                  boxShadow="lg"
                >
                  <Icon
                    as={item.icon}
                    w={16}
                    h={16}
                    mb={6}
                    color="blue.300"
                  />
                  <Text
                    fontSize="2xl"
                    fontStyle="italic"
                    mb={6}
                    color="gray.200"
                    textAlign="center"
                    maxW="3xl"
                    lineHeight="1.4"
                  >
                    "{item.quote}"
                  </Text>
                  <VStack spacing={2}>
                    <Heading
                      as="h4"
                      size="lg"
                      color="blue.300"
                    >
                      {item.name}
                    </Heading>
                    <Text
                      fontSize="md"
                      fontWeight="medium"
                      color="gray.400"
                    >
                      {item.role}
                    </Text>
                  </VStack>
                </Flex>
              </motion.div>
            ))}
          </motion.div>
        </Box>
        <HStack spacing={4} justify="center" zIndex={1}>
          {testimonials.map((_, index) => (
            <Box
              key={index}
              as="button"
              width={3}
              height={3}
              borderRadius="full"
              bg={currentTestimonial === index ? 'blue.300' : 'gray.600'}
              opacity={currentTestimonial === index ? 1 : 0.5}
              _hover={{ opacity: 0.8 }}
              transition="all 0.2s"
              onClick={() => setCurrentTestimonial(index)}
            />
          ))}
        </HStack>
      </VStack>
    );
  };
  
  export default Testimonials;