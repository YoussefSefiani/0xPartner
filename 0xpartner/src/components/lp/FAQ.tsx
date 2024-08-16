import {
    Box,
    Container,
    VStack,
    Heading,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Text,
    Button,
  } from '@chakra-ui/react';
  import { motion } from 'framer-motion';
  import { FaArrowRight } from 'react-icons/fa';
  
  const FAQ = () => {
    const faqs = [
        {
          question: "What is 0xPartner?",
          answer: "0xPartner is a revolutionary platform that combines blockchain technology with influencer marketing, creating secure and transparent partnerships between brands and influencers. Our platform leverages smart contracts to automate agreements, ensure fair compensation, and provide real-time analytics for both parties."
        },
        {
          question: "How does blockchain improve influencer marketing?",
          answer: "Blockchain technology enhances influencer marketing in several ways: It ensures transparency by recording all transactions and agreements on an immutable ledger. It increases security through cryptographic protection of data and payments. It improves efficiency by automating processes with smart contracts. It enables real-time performance tracking, allowing for instant verification of campaign metrics and it facilitates secure and instant payments, reducing delays and disputes."
        },
        {
          question: "Is 0xPartner suitable for small businesses?",
          answer: "Absolutely! 0xPartner caters to businesses of all sizes, providing scalable solutions that grow with your needs and budget. Our platform offers flexible pricing tiers and customizable features, making it accessible for small businesses while still providing powerful tools for larger enterprises."
        },
        {
          question: "How do I get started with 0xPartner?",
          answer: "Getting started is easy! Simply click the 'Launch Your Journey' button above to create your account. Our team will guide you through the onboarding process, which includes setting up your profile, connecting your wallet, and exploring our marketplace of influencers or brands. We also offer personalized onboarding sessions to ensure you're making the most of our platform."
        },
        {
          question: "What types of influencers are on the 0xPartner platform?",
          answer: "0xPartner hosts a diverse range of influencers across various niches and platforms. You'll find content creators from social media platforms like Instagram, YouTube, TikTok, and Twitter, as well as bloggers, podcasters, and niche experts. Our influencers range from micro-influencers with highly engaged small audiences to macro-influencers with millions of followers."
        }
      ];
  
    return (
      <Box as="section" py={10} width="100%">
        <VStack spacing={16} width="100%">
          <Heading
            as="h2"
            size="3xl"
            textAlign="center"
            bgGradient="linear(to-r, blue.300, purple.300, pink.300)"
            bgClip="text"
            fontWeight="extrabold"
          >
            Frequently Asked Questions
          </Heading>
          <Accordion allowToggle width="100%">
            {faqs.map((faq, index) => (
              <AccordionItem key={index}>
                {() => (
                  <>
                    <h2>
                      <AccordionButton
                        py={4}
                        _expanded={{ bg: 'rgba(255, 255, 255, 0.1)' }}
                      >
                        <Box flex="1" color="whiteAlpha.900" textAlign="left" fontWeight="semibold">
                          {faq.question}
                        </Box>
                        <AccordionIcon color="white"/>
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text color="whiteAlpha.900">{faq.answer}</Text>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            ))}
          </Accordion>
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
            View All FAQs
          </Button>
        </VStack>
      </Box>
    );
  };
  
  export default FAQ;