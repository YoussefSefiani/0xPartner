import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  HStack,
  Image,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaRocket, FaPlay } from 'react-icons/fa';
import { chakra } from '@chakra-ui/react';
import { useInView } from 'react-intersection-observer';
import VideoModal from './VideoModal';

const MotionBox = chakra(motion.div);

const Hero = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      position="relative"
      w="full"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgSize="cover"
        bgPosition="center"
        opacity="0.2"
      />
      <Container maxW="container.xl" h="full">
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          justify="space-between"
          h="full"
          py={20}
        >
          <MotionBox
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            maxW={{ base: 'full', lg: '50%' }}
            mb={{ base: 16, lg: 0 }}
            zIndex={2}
          >
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              bgGradient="linear(to-r, blue.300, purple.300, pink.300)"
              bgClip="text"
              fontWeight="extrabold"
              mb={6}
              lineHeight="1.1"
            >
              Revolutionize Your Brand Partnerships
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} mb={8} fontWeight="medium" color="whiteAlpha.900">
              0xPartner: Where Blockchain Meets Influencer Marketing
            </Text>
            <Text fontSize={{ base: "md", md: "lg" }} mb={10} color="whiteAlpha.800">
              Experience the future of secure, transparent, and efficient influencer-brand collaborations powered by cutting-edge blockchain technology.
            </Text>
            <HStack spacing={4}>
              <Link href="/dashboard" passHref>
                <Button
                  as={motion.button}
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(66, 153, 225, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                  size="lg"
                  bgGradient="linear(to-r, blue.400, purple.500)"
                  color="white"
                  rightIcon={<FaRocket />}
                  fontSize="lg"
                  py={8}
                  px={10}
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
                    transition: '0.3s',
                  }}
                  _hover={{
                    _before: {
                      filter: 'blur(15px)',
                      opacity: '1',
                    },
                  }}
                >
                  Get Started Now
                </Button>
              </Link>
              <Button
                as={motion.button}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(159, 122, 234, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                size="lg"
                color="white"
                rightIcon={<FaPlay />}
                fontSize="lg"
                py={8}
                px={10}
                borderRadius="full"
                variant="outline"
                borderColor="white"
                _hover={{
                  bg: "white",
                  color: "purple.500",
                }}
                onClick={onOpen}
              >
                Watch Demo
              </Button>
            </HStack>
          </MotionBox>
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            maxW={{ base: 'full', lg: '45%' }}
            zIndex={2}
          >
            <Image
              src="/header.png"
              alt="0xPartner Illustration"
              w="full"
              h="auto"
              objectFit="contain"
            />
          </MotionBox>
        </Flex>
      </Container>
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        h="150px"
        bgGradient="none"
        zIndex={1}
      />
      <VideoModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default Hero;