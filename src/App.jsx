import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAppContext } from "./contexts/appContext";
import NFTCard from "./components/NFTCard";
import useMintToken from "./hooks/useMintToken";
import LoadingSpiner from "./assets/Loading.svg";
function App() {
  const { nextTokenId, tokenMetaData, mintPrice, isMetaDataLoading } =
    useAppContext();

  console.log("nextTokenId: ", nextTokenId);

  const tokenMetaDataArray = Array.from(tokenMetaData.values());
  const  {handleMintToken: mintToken, isLoadingBtn} = useMintToken();

  return (
    <div>
      <Header />
      <main className="h-full min-h-[calc(100vh-128px)] p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">NFT dApp</h1>
          <p className="text-primary font-medium">Mint and manage your NFTs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  mt-6">
          <div className="border-l-2 border-primary p-4">
            <h1 className="text-xl font-bold">Mint NFT</h1>
            <p className="text-gray-500">
              Mint your NFT and make it available for sale
            </p>
          </div>
          <div className="border-l-2 border-primary p-4">
            <h1 className="text-xl font-bold">Manage NFTs</h1>
            <p className="text-gray-500">View and manage your minted NFTs</p>
          </div>
          <div className="border-l-2 border-primary p-4">
            <h1 className="text-xl font-bold">Marketplace</h1>
            <p className="text-gray-500">
              Buy and sell NFTs on the marketplace
            </p>
          </div>
        </div>
        {isMetaDataLoading ? (
          <div className=" flex justify-center items-center mt-20">
            <img src={LoadingSpiner} className=" w-[150px] h-[150px]" />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {tokenMetaDataArray.map((token, i) => (
              <NFTCard
                key={token.name.split(" ").join("")}
                metadata={token}
                mintPrice={mintPrice}
                tokenId={i}
                nextTokenId={nextTokenId}
                mintNFT={mintToken}
                isLoadingBtn={isLoadingBtn}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
