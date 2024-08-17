"use client";
import { useState, useEffect } from 'react';
import { Button, Icon, Text, Flex, Spinner, HStack, Box, Menu, MenuButton, MenuList, MenuItem, VStack, Badge, IconButton } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaCircle, FaEthereum, FaSignOutAlt, FaExchangeAlt, FaCopy } from 'react-icons/fa';
import { ethers } from 'ethers';
import { getRegistryContractAsSigner } from '@/utils/alchemy'
import { UserType } from '@/types/UserType';

interface ConnectWalletBtnProps {
  connected: boolean;
  setConnected: (connected: boolean) => void;
  walletAddress: string;
  setWalletAddress: (address: string) => void;
  setSigner: (signer: ethers.Signer | null) => void;
  toast: any;
  isConnecting: boolean;
  setIsConnecting: (isConnecting: boolean) => void;
}

const ConnectWalletBtn: React.FC<ConnectWalletBtnProps> = ({
  connected,
  setConnected,
  walletAddress,
  setWalletAddress,
  setSigner,
  toast,
  isConnecting,
  setIsConnecting
}) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<{ address: string; name: string }[]>([]);
  const [partnerInfo, setPartnerInfo] = useState<{ [address: string]: { name: string, userType: UserType } }>({});

  const connectWallet = async () => {
    if (!connected && !isConnecting) {
      setIsConnecting(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("wallet_switchEthereumChain", [{ chainId: "0xaa36a7" }]); // Switch to Sepolia
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const _walletAddress = await signer.getAddress();
        setConnected(true);
        setWalletAddress(_walletAddress);
        setSigner(signer);

        const registryContract = getRegistryContractAsSigner(signer);
        const partnerInfoPromises = accounts.map(async (addr: string) => {
          try {
            const info = await registryContract.getPartnerInfo(addr);
            return { address: addr, name: info.name, userType: parseInt(info.userType.toString()) };
          } catch (error) {
            console.error(`Failed to fetch partner info for ${addr}:`, error);
            return { address: addr, name: '', userType: -1 };
          }
        });
        const partnerInfoResults = await Promise.all(partnerInfoPromises);

        const partnerInfoMap = partnerInfoResults.reduce((acc, info, index) => {
          acc[info.address] = info.name ? { name: info.name, userType: info.userType } : { name: `Account ${index + 1}`, userType: -1 };
          return acc;
        }, {});

        setPartnerInfo(partnerInfoMap);
        setAccounts(accounts.map((addr: string) => ({ address: addr, name: partnerInfoMap[addr].name })));
        
        const _balance = await provider.getBalance(_walletAddress);
        setBalance(ethers.formatEther(_balance));
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        toast({
          title: "Error",
          description: "Failed to connect wallet",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsConnecting(false);
      }
    } else if (connected) {
      try {
        setConnected(false);
        setWalletAddress("");
        setSigner(null);
        setBalance(null);
        setAccounts([]);
      } catch (error) {
        console.error("Failed to disconnect wallet:", error);
        toast({
          title: "Error",
          description: "Failed to disconnect wallet",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const switchAccount = async (account: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("wallet_switchEthereumChain", [{ chainId: "0xaa36a7" }]); // Switch to Sepolia
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner(account);
      const _walletAddress = await signer.getAddress();
      setWalletAddress(_walletAddress);
      setSigner(signer);
      
      const _balance = await provider.getBalance(_walletAddress);
      setBalance(ethers.formatEther(_balance));

      toast({
        title: "Success",
        description: "Switched to account " + _walletAddress,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to switch account:", error);
      toast({
        title: "Error",
        description: "Failed to switch account",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const updateBalance = async () => {
      if (connected && walletAddress) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const _balance = await provider.getBalance(walletAddress);
          setBalance(ethers.formatEther(_balance));
        } catch (error) {
          console.error("Failed to update balance:", error);
        }
      }
    };

    updateBalance();
    const interval = setInterval(updateBalance, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [connected, walletAddress]);

  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length > 0) {
        const newAddress = accounts[0];
        setWalletAddress(newAddress);
        setAccounts(accounts.map((addr, index) => ({ address: addr, name: `Wallet ${index + 1}` })));
        
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          setSigner(signer);
          
          const _balance = await provider.getBalance(newAddress);
          setBalance(ethers.formatEther(_balance));
          
          setConnected(true);
        } catch (error) {
          console.error("Failed to update wallet:", error);
          toast({
            title: "Error",
            description: "Failed to update wallet",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        setConnected(false);
        setWalletAddress("");
        setSigner(null);
        setBalance(null);
        setAccounts([]);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [setConnected, setWalletAddress, setSigner, toast]);

  return (
    <>
      {connected ? (
        <HStack 
          spacing={4}
          bg="whiteAlpha.200" 
          p={3} 
          borderRadius="xl" 
          border="1px solid white"
        >
          <Flex alignItems="center">
            <Icon as={FaCircle} color="green.500" mr={2} boxSize={3} />
            <Text fontSize="md" color="white">
              {walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4)}
            </Text>
            <IconButton
              aria-label="Copy wallet address"
              icon={<FaCopy />}
              size="sm"
              variant="ghost"
              colorScheme="whiteAlpha"
              ml={2}
              onClick={() => {
                navigator.clipboard.writeText(walletAddress);
                toast({
                  title: "Address copied",
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
              }}
            />
          </Flex>
          <Box 
            bg="whiteAlpha.300" 
            p={2} 
            borderRadius="lg"
          >
            <Flex alignItems="center">
              <Icon as={FaEthereum} color="purple.300" mr={2} />
              <Text fontSize="sm" color="white">
                {balance ? `${parseFloat(balance).toFixed(4)} ETH` : 'Loading...'}
              </Text>
            </Flex>
          </Box>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FaExchangeAlt />}
              bgGradient="linear(to-r, blue.400, purple.500)"
              color="white"
              variant="solid"
              size="sm"
              borderRadius="lg"
              p={2}
              height="100%"
              _hover={{
                bgGradient: "linear(to-r, blue.500, purple.600)",
                boxShadow: "0px 0px 20px rgba(66, 153, 225, 0.8)"
              }}
              _active={{
                bgGradient: "linear(to-r, blue.600, purple.700)",
                boxShadow: "0px 0px 20px rgba(66, 153, 225, 1)"
              }}
              aria-label="Change Account"
            />
            <MenuList 
              bg="whiteAlpha.200" 
              borderColor="white" 
              borderWidth="1px"
              borderRadius="xl"
              p={2}
              mt={3}
            >
              {accounts.map((account, index) => (
                <MenuItem 
              bg="whiteAlpha.200" 

                  key={index} 
                  onClick={() => switchAccount(account.address)}
                  _hover={{ bg: "whiteAlpha.300" }}
                  _focus={{ bg: "whiteAlpha.300" }}
                  borderRadius="md"
                  mb={1}
                >
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" color="white">
                      {partnerInfo[account.address]?.name || `Account ${index + 1}`}
                    </Text>
                    <Text fontSize="xs" color="whiteAlpha.700">
                      {account.address.slice(0, 6) + '...' + account.address.slice(-4)}
                      {partnerInfo[account.address]?.userType >= 0 && (
                        <Badge ml={2} colorScheme={partnerInfo[account.address]?.userType === 0 ? "blue" : "purple"}>
                          {partnerInfo[account.address]?.userType === 0 ? "Influencer" : "Brand"}
                        </Badge>
                      )}
                    </Text>
                  </VStack>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Button
            as={motion.button}
            whileTap={{ scale: 0.95 }}
            onClick={connectWallet}
            bgGradient="linear(to-r, blue.400, purple.500)"
            color="white"
            variant="solid"
            size="sm"
            fontWeight="bold"
            borderRadius="lg"
            p={2}
            _hover={{
              bgGradient: "linear(to-r, blue.500, purple.600)",
              boxShadow: "0px 0px 20px rgba(66, 153, 225, 0.8)"
            }}
            _active={{
              bgGradient: "linear(to-r, blue.600, purple.700)",
              boxShadow: "0px 0px 20px rgba(66, 153, 225, 1)"
            }}
          >
            <Icon as={FaSignOutAlt} />
          </Button>
        </HStack>
      ) : (
        <Button
          as={motion.button}
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(66, 153, 225, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          onClick={connectWallet}
          bgGradient="linear(to-r, blue.400, purple.500)"
          color="white"
          variant="solid"
          size="md"
          fontWeight="bold"
          borderRadius="full"
          leftIcon={isConnecting ? <Spinner size="sm" /> : <Icon as={FaUserPlus} />}
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
          isDisabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </>
  );
};

export default ConnectWalletBtn;
