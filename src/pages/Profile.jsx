import React from "react";
import Header from "../components/Header";
import { useAppContext } from "../contexts/appContext";
import UserNFT from "../components/Profile/UserNft";
import LoadingSpiner from "../assets/Loading.svg";
import { useAccount } from "wagmi";
const Profile = () => {
const { address} = useAccount();
  const { ownerMetadata, mintPrice, isLoading } = useAppContext();

  // const ownerMetaDataArray = Array.from(ownerMetaData.values());
  const ownerMetaDataArray = ownerMetadata
    ? Array.from(ownerMetadata.values())
    : []; 

  console.log(ownerMetaDataArray);

  return (
    <div>
      <Header />
      <main className="h-full min-h-[calc(100vh-128px)] p-4">
        { address ? (
          <>
            <div className="text-center">
          <h1 className="text-3xl font-bold">NFT dApp</h1>
          <p className="text-primary font-medium">My Nft Collections</p>
        </div>

        {!isLoading ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {ownerMetaDataArray?.map((token, i) => (
            <UserNFT
              key={token.name.split(" ").join("")}
              metadata={token}
              mintPrice={mintPrice}
              tokenId={i}
              // nextTokenId={nextTokenId}
            />
            ))}
          </div>
        ) : (
          <div className=" flex justify-center items-center mt-20">
            <img src={LoadingSpiner} className=" w-[150px] h-[150px]" />
          </div>
        )}
          </>
        ): (
          <div className="flex justify-center items-center mt-20">
            <p className=" text-2xl font-bold">Please connect your wallet to view your NFTs</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
