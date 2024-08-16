'use client'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  ChakraProvider,
  Box,
  VStack,
  Container,
  Progress,
  Text,
  useDisclosure,
  useToast,
  Flex,
  Heading,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaUserPlus } from 'react-icons/fa';
import { getPartnershipContractAsSigner, getRegistryContractAsSigner } from '../../utils/alchemy';
import RegisterPartner from '../../components/dashboard/RegisterPartner';
import PartnerInfo from '../../components/dashboard/PartnerInfo';
import PartnershipList from '../../components/dashboard/PartnershipList';
import PartnerList from '../../components/dashboard/PartnerList';
import CreatePartnershipModal from '../../components/dashboard/CreatePartnershipModal';
import { UserType } from '../../types/UserType';
import NextLink from 'next/link';
import ConnectWalletBtn from '../../components/ConnectWalletBtn';

const MotionBox = motion(Box);

interface Partner {
  name: string;
  userType: UserType;
  address: string;
  totalPartnerships?: number;
  successRate?: number;
  totalEthEarned?: string;
}

export default function Dashboard() {
  const [account, setAccount] = useState<string | null>(null);
  const [isPartner, setIsPartner] = useState(false);
  const [partnerInfo, setPartnerInfo] = useState<Partner | null>(null);
  const [allPartners, setAllPartners] = useState<Partner[]>([]);
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnershipPartner, setNewPartnershipPartner] = useState('');
  const [newPartnershipAmount, setNewPartnershipAmount] = useState('');
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [isCreatingPartnership, setIsCreatingPartnership] = useState(false);
  const [isConfirmingPartnership, setIsConfirmingPartnership] = useState(false);
  const [isCancellingPartnership, setIsCancellingPartnership] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [partnerStats, setPartnerStats] = useState({ totalPartnerships: 0, successRate: 0, totalEthEarned: '0' });
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [signer]);

  async function fetchData() {
    if (!signer) {
      console.error("Signer is not connected");
      return;
    }
    setIsLoading(true);
    try {
      const partnershipContract = getPartnershipContractAsSigner(signer);
      const registryContract = getRegistryContractAsSigner(signer);
      const address = await signer.getAddress();
      setAccount(address);

      await checkPartnerStatus(address, registryContract);
      await fetchAllPartners(registryContract, partnershipContract);
      await fetchUserPartnerships(address, partnershipContract);
      await fetchPartnerStats(address, partnershipContract);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function checkPartnerStatus(address: string, registryContract: ethers.Contract) {
    try {
      const partner = await registryContract.getPartnerInfo(address);
      if (partner.name !== '') {
        setIsPartner(true);
        setPartnerInfo({
          name: partner.name,
          userType: parseInt(partner.userType.toString()) as UserType,
          address: address
        });
      } else {
        setIsPartner(false);
        setPartnerInfo(null);
      }
    } catch (error) {
      console.error("Error checking partner status:", error);
      setIsPartner(false);
      setPartnerInfo(null);
    }
  }

  async function fetchAllPartners(registryContract: ethers.Contract, partnershipContract: ethers.Contract) {
    try {
      const partners = await registryContract.getAllPartners();
      const resolvedPartners = await Promise.all(
        partners.map(async (p: any, index: number) => {
          const address = await registryContract.partnerAddresses(index);
          const totalPartnerships = await partnershipContract.getTotalPartnerships(address);
          const completedPartnerships = await partnershipContract.getCompletedPartnerships(address);
          const totalEthEarned = await partnershipContract.getTotalEthEarned(address);
          return {
            name: p.name,
            userType: parseInt(p.userType.toString()) as UserType,
            address: address,
            totalPartnerships: parseInt(totalPartnerships),
            successRate: parseInt(totalPartnerships) > 0 ? (parseInt(completedPartnerships) / parseInt(totalPartnerships)) * 100 : 0,
            totalEthEarned: ethers.formatEther(totalEthEarned)
          };
        })
      );
      setAllPartners(resolvedPartners);
    } catch (error) {
      console.error("Error fetching all partners:", error);
    }
  }

  async function fetchUserPartnerships(address: string, partnershipContract: ethers.Contract) {
    try {
      const userPartnershipIds = await partnershipContract.getUserPartnerships(address);
      const partnershipPromises = userPartnershipIds.map((id: number) => partnershipContract.getPartnership(id));
      const partnershipDetails = await Promise.all(partnershipPromises);
      setPartnerships(partnershipDetails.map((p: any, index: number) => ({
        id: userPartnershipIds[index],
        brand: p.brand,
        influencer: p.influencer,
        amount: ethers.formatEther(p.amount),
        completed: p.completed,
        brandConfirmed: p.brandConfirmed,
        influencerConfirmed: p.influencerConfirmed
      })));
    } catch (error) {
      console.error("Error fetching user partnerships:", error);
    }
  }

  async function fetchPartnerStats(address: string, partnershipContract: ethers.Contract) {
    try {
      const totalPartnerships = await partnershipContract.getTotalPartnerships(address);
      const completedPartnerships = await partnershipContract.getCompletedPartnerships(address);
      const totalEthEarned = await partnershipContract.getTotalEthEarned(address);

      setPartnerStats({
        totalPartnerships: parseInt(totalPartnerships),
        successRate: parseInt(totalPartnerships) > 0 ? (parseInt(completedPartnerships) / parseInt(totalPartnerships)) * 100 : 0,
        totalEthEarned: ethers.formatEther(totalEthEarned)
      });
    } catch (error) {
      console.error("Error fetching partner stats:", error);
    }
  }

  async function addPartner(partnerType: UserType) {
    setIsAddingPartner(true);
    try {
      const registryContract = getRegistryContractAsSigner(signer);
      const tx = await registryContract.addPartner(newPartnerName, partnerType);
      await tx.wait();
      toast({
        title: "Success",
        description: `You have been registered as a ${partnerType === UserType.Brand ? 'Brand' : 'Influencer'}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await fetchData();
    } catch (error) {
      console.error("Error adding partner:", error);
      toast({
        title: "Error",
        description: "Failed to register as a partner",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsAddingPartner(false);
    }
  }

  async function createPartnership() {
    setIsCreatingPartnership(true);
    try {
      const partnershipContract = getPartnershipContractAsSigner(signer);
      const amount = ethers.parseEther(newPartnershipAmount);
      const tx = await partnershipContract.createPartnership(newPartnershipPartner, amount, { value: amount });
      await tx.wait();
      toast({
        title: "Success",
        description: "Partnership created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await fetchData();
      onClose();
    } catch (error) {
      console.error("Error creating partnership:", error);
      toast({
        title: "Error",
        description: "Failed to create partnership",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsCreatingPartnership(false);
    }
  }

  async function confirmPartnership(partnershipId: number) {
    setIsConfirmingPartnership(true);
    try {
      const partnershipContract = getPartnershipContractAsSigner(signer);
      const tx = await partnershipContract.confirmPartnership(partnershipId);
      await tx.wait();
      toast({
        title: "Success",
        description: "Partnership confirmed successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await fetchData();
    } catch (error) {
      console.error("Error confirming partnership:", error);
      toast({
        title: "Error",
        description: "Failed to confirm partnership",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsConfirmingPartnership(false);
    }
  }

  async function cancelPartnership(partnershipId: number) {
    setIsCancellingPartnership(true);
    try {
      const partnershipContract = getPartnershipContractAsSigner(signer);
      const tx = await partnershipContract.cancelPartnership(partnershipId);
      await tx.wait();
      toast({
        title: "Success",
        description: "Partnership cancelled successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      await fetchData();
    } catch (error) {
      console.error("Error cancelling partnership:", error);
      toast({
        title: "Error",
        description: "Failed to cancel partnership",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsCancellingPartnership(false);
    }
  }

  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <ChakraProvider>
      <Box minHeight="100vh" color={textColor}>
        <Container maxW="container.xl" py={10}>
          <VStack spacing={16} align="stretch">
            <Flex justifyContent="space-between" alignItems="center">
              <MotionBox initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <NextLink href="/" passHref>
                  <Heading as="h2" size="md" bgGradient="linear(to-r, blue.300, purple.300, pink.300)" bgClip="text" fontWeight="bold">
                    0xPartner
                  </Heading>
                </NextLink>
              </MotionBox>
              <MotionBox initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <ConnectWalletBtn
                  connected={connected}
                  setConnected={setConnected}
                  walletAddress={walletAddress}
                  setWalletAddress={setWalletAddress}
                  setSigner={setSigner}
                  toast={toast}
                  isConnecting={isConnecting}
                  setIsConnecting={setIsConnecting}
                />
              </MotionBox>
            </Flex>
            
            {connected ? (
              <>
                <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <Heading as="h1" size="2xl" color="white" fontWeight="extrabold">
                    Dashboard
                  </Heading>
                </MotionBox>

                {isLoading && (
                  <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <Progress size="xs" isIndeterminate colorScheme="purple" />
                  </MotionBox>
                )}

                {account && !isPartner && (
                  <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <RegisterPartner
                      newPartnerName={newPartnerName}
                      setNewPartnerName={setNewPartnerName}
                      addPartner={addPartner}
                      isAddingPartner={isAddingPartner}
                    />
                  </MotionBox>
                )}

                {account && isPartner && (
                  <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <PartnerInfo partnerInfo={partnerInfo} partnerStats={partnerStats} />
                    <VStack spacing={16} mt={16} align="stretch">
                      <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                        <PartnershipList
                          partnerships={partnerships}
                          account={account}
                          onOpen={onOpen}
                          confirmPartnership={confirmPartnership}
                          cancelPartnership={cancelPartnership}
                          isConfirmingPartnership={isConfirmingPartnership}
                          isCancellingPartnership={isCancellingPartnership}
                          signer={signer}
                        />
                      </MotionBox>
                      <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                        <PartnerList allPartners={allPartners} />
                      </MotionBox>
                    </VStack>
                  </MotionBox>
                )}
              </>
            ) : (
              <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} textAlign="center" mt={20}>
                <Icon as={FaUserPlus} boxSize={16} color="white" mb={4} />
                <Heading as="h2" size="xl" mb={4} color="white">
                  Connect Your Wallet
                </Heading>
                <Text fontSize="lg" mb={8} color="white">
                  To access the dashboard and start creating partnerships, please connect your wallet.
                </Text>
                {isConnecting ? (
                  <Progress size="xs" isIndeterminate colorScheme="blue" />
                ) : (
                  <ConnectWalletBtn
                    connected={connected}
                    setConnected={setConnected}
                    walletAddress={walletAddress}
                    setWalletAddress={setWalletAddress}
                    setSigner={setSigner}
                    toast={toast}
                    isConnecting={isConnecting}
                    setIsConnecting={setIsConnecting}
                  />
                )}
              </MotionBox>
            )}

            <CreatePartnershipModal
              isOpen={isOpen}
              onClose={onClose}
              allPartners={allPartners}
              account={account!}
              newPartnershipPartner={newPartnershipPartner}
              setNewPartnershipPartner={setNewPartnershipPartner}
              newPartnershipAmount={newPartnershipAmount}
              setNewPartnershipAmount={setNewPartnershipAmount}
              createPartnership={createPartnership}
              isCreatingPartnership={isCreatingPartnership}
              signer={signer}
            />
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}