// Imports the Alchemy SDK
import { Alchemy, Network } from "alchemy-sdk";
import { ethers } from "ethers";
import { JsonRpcProvider } from "ethers/providers";
import partnershipArtifact from "../../../hardhat/artifacts/contracts/Partnership.sol/Partnership.json";
import registryArtifact from "../../../hardhat/artifacts/contracts/Registry.sol/Registry.json";

// Configures the Alchemy SDK
const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Replace with your API key
    network: Network.ETH_SEPOLIA, // Replace with your network
};

const alchemyProvider = new JsonRpcProvider(
  `${process.env.NEXT_PUBLIC_ALCHEMY_API_URL ?? ''}${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);

export const alchemy = new Alchemy(config);

export function getPartnershipContractAsSigner(signer: ethers.Signer) {
    return new ethers.Contract(
        process.env.NEXT_PUBLIC_PARTNERSHIP_CONTRACT!,
        partnershipArtifact.abi,
        signer
    );
}

export function getPartnershipContractReadOnly() {
    return new ethers.Contract(
        process.env.NEXT_PUBLIC_PARTNERSHIP_CONTRACT!,
        partnershipArtifact.abi,
    ).connect(alchemyProvider);
}

export function getRegistryContractAsSigner(signer: ethers.Signer) {
    return new ethers.Contract(
        process.env.NEXT_PUBLIC_REGISTRY_CONTRACT!,
        registryArtifact.abi,
        signer,
    );
}

export function getRegistryContractReadOnly() {
    return new ethers.Contract(
        process.env.NEXT_PUBLIC_REGISTRY_CONTRACT!,
        registryArtifact.abi,
    ).connect(alchemyProvider);
}