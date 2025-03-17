import { Contract } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
import { getReadOnlyProvider } from "../utils";
import NFT_ABI from "../ABI/nft.json";
import { useAccount } from "wagmi";

const appContext = createContext();

export const useAppContext = () => {
    const context = useContext(appContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }

    return context;
};

export const AppProvider = ({ children }) => {
    const [nextTokenId, setNextTokenId] = useState(null);
    const [maxSupply, setMaxSupply] = useState(null);
    const [baseTokenURI, setBaseTokenURI] = useState("");
    const [tokenMetaData, setTokenMetaData] = useState(new Map());
    const [mintPrice, setMintPrice] = useState(null);
    const [owners, setOwners] = useState(new Map());
    const [ownerMetadata, setOwnerMetadata] = useState(new Map());
    const [isLoading, setIsLoading] = useState(false)
    const [isMetaDataLoading, setIsMetaDataLoading] = useState(false)
    const { address} = useAccount()

    useEffect(() => {
        const contract = new Contract(
            import.meta.env.VITE_NFT_CONTRACT_ADDRESS,
            NFT_ABI,
            getReadOnlyProvider()
        );
        contract
            .nextTokenId()
            .then((id) => setNextTokenId(id))
            .catch((error) => console.error("error: ", error));

        // const filterMinted = contract.filter.Minted;

        contract.on("Minted", (owner, tokenId, event) => {
            // console.log("Minted event detected:", { owner, tokenId, event });
            // console.log(nextTokenId)
            const newTokenId = Number(tokenId) + 1;
            setNextTokenId(newTokenId);            
            // console.log(nextTokenId)
        });
        
        

        contract
            .baseTokenURI()
            .then((uri) => setBaseTokenURI(uri))
            .catch((error) => console.error("error: ", error));

        contract
            .maxSupply()
            .then((supply) => setMaxSupply(supply))
            .catch((error) => console.error("error: ", error));

        contract
            .mintPrice()
            .then((price) => setMintPrice(price))
            .catch((error) => console.error("error: ", error));

            

    }, []);

    useEffect(() => {
        if (!maxSupply || !baseTokenURI) return;
        // const tokenIds = Array.from({ length: Number(maxSupply) }, (_, i) => i);
        // console.log(baseTokenURI)
        setIsMetaDataLoading(true);
        const tokenIds = [];
        for (let i = 0; i < maxSupply; i++) {
            tokenIds.push(i);
        }

        const promises = tokenIds.map((id) => {
            return fetch(`${baseTokenURI}${id}.json`)
                .then((response) => response.json())
                .then((data) => {
                    return data;
                });
        });

        Promise.all(promises)
            .then((responses) => {
                const tokenMetaData = new Map();
                responses.forEach((response, index) => {
                    tokenMetaData.set(index, response);
                });
                setTokenMetaData(tokenMetaData);
            })
            .catch((error) => console.error("error: ", error)).finally(
                () => setIsMetaDataLoading(false)
            );
    }, [baseTokenURI, maxSupply]);



    useEffect(() => {
        if (nextTokenId == null || !baseTokenURI || !address) return;  // ✅ Ensure all values exist
    
        const contract = new Contract(
            import.meta.env.VITE_NFT_CONTRACT_ADDRESS,
            NFT_ABI,
            getReadOnlyProvider()
        );
    
        const fetchOwners = async () => {
            setIsLoading(true)
            try {
                const ownerMap = new Map();
    
                for (let i = 0; i < nextTokenId; i++) {
                    try {
                        const owner = await contract.ownerOf(i);
                        ownerMap.set(i, owner);
                    } catch (error) {
                        console.error(`Error fetching owner for token ${i}:`, error);
                    }
                }
    
                const ownedNfts = Array.from(ownerMap.entries())
                    .filter(([tokenId, owner]) => owner.toLowerCase() === address.toLowerCase())
                    .map(([tokenId]) => tokenId);
    
                console.log("NFTs owned by connected address:", ownedNfts);
    
                const promises = ownedNfts.map((id) => 
                    fetch(`${baseTokenURI}${id}.json`)
                        .then((response) => response.json())
                        .then((data) => ({ id, ...data })) // ✅ Store with ID
                );
    
                Promise.all(promises)
                    .then((responses) => {
                        const tokenMetaData = new Map();
                        responses.forEach(({ id, ...response }) => {
                            tokenMetaData.set(id, response);  // ✅ Use ID instead of index
                        });
    
                        console.log("Updated ownerMetadata:", tokenMetaData);
                        setOwnerMetadata(tokenMetaData);
                    })
                    .catch((error) => console.error("Error fetching metadata:", error));
    
                setOwners(ownerMap);
            } catch (error) {
                console.error("Error in fetchOwners:", error);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchOwners();
    }, [nextTokenId, baseTokenURI, address]);  
    console.log(owners)
    console.log(ownerMetadata)

    return (
        <appContext.Provider
            value={{
                nextTokenId,
                maxSupply,
                baseTokenURI,
                tokenMetaData,
                mintPrice,
                ownerMetadata,
                isLoading,
                isMetaDataLoading
            }}
        >
            {children}
        </appContext.Provider>
    );
};
