'use client'

import { Box, Container, VStack } from '@chakra-ui/react';
import Hero from '@/components/lp/Hero';
import WhyChoose from '@/components/lp/WhyChoose';
import HowItWorks from '@/components/lp/HowItWorks';
import Testimonials from '@/components/lp/Testimonials';
import CTA from '@/components/lp/CTA';
import FAQ from '@/components/lp/FAQ';
import Footer from '@/components/lp/Footer';
import Benefits from '@/components/lp/Benefits';

const LandingPage = () => {
  return (
    <Box minH="100vh">
      <Container maxW="container.xl">
        <VStack spacing={32} py={20}>
          <Hero />
          <WhyChoose />
          <HowItWorks />
          <Benefits />
          <Testimonials />
          <CTA />
          <FAQ />
          <Footer />
        </VStack>
      </Container>
    </Box>
  );
};

export default LandingPage;
