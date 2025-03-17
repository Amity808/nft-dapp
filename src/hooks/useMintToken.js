import React, { useCallback, useState } from "react";
import { useAccount, useChainId, useConfig } from "wagmi";
import { useAppContext } from "../contexts/appContext";
import { Contract } from "ethers";
import NFT_ABI from "../ABI/nft.json";
import { getEthersSigner } from "../config/wallet-connection/adapter";
import { isSupportedNetwork } from "../utils";
// import { config } from "../config/wallet-connection/wagmi";
import { toast } from "react-toastify";
const useMintToken = () => {
    const { address } = useAccount();
    const chainId = useChainId();
    const wagmiConfig = useConfig();
    const { nextTokenId, maxSupply, mintPrice } = useAppContext();
    const [isLoadingBtn, setisLoadingBtn] = useState(false);
    const handleMintToken = useCallback(async () => {
        setisLoadingBtn(true);
        if (!address) return toast.error("Please connect your wallet");
        if (!isSupportedNetwork(chainId)) return toast.error("Unsupported network");
        if (nextTokenId >= maxSupply) return toast.error("No more tokens to mint");

        const signer = await getEthersSigner(wagmiConfig);

        const contract = new Contract(
            import.meta.env.VITE_NFT_CONTRACT_ADDRESS,
            NFT_ABI,
            signer
        );

        try {
            const tx = await contract.mint({ value: mintPrice });
            const receipt = await tx.wait();
            if (receipt.status === 0) {
                throw new Error("Transaction failed");
            }

            toast.success("Token minted successfully");
        } catch (error) {
            console.error("error: ", error);
        } finally {
            setisLoadingBtn(false);
        }
    }, [address, chainId, maxSupply, mintPrice, nextTokenId, wagmiConfig]);
    return  { handleMintToken, isLoadingBtn}
};

export default useMintToken;
