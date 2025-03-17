import { Box, Flex, Text } from "@radix-ui/themes";
import React from "react";
import WalletConnection from "./WalletConnection";

const Header = () => {
    return (
        <Flex
            gap="3"
            as="header"
            width="100%"
            align="center"
            justify="between"
            className="bg-primary p-4 items-center h-18"
        >
            <Box>
                <Text
                    className="text-secondary font-bold text-2xl"
                    as="span"
                    role="img"
                    aria-label="logo"
                >
                    <a href="/">
                    NFT dApp 🚀
                    </a>
                    
                </Text>
            </Box>
            <Box>
                <Text>
                    <a href="/profile" className="text-secondary font-medium text-xl">My NFTs</a>
                </Text>
            </Box>
            <WalletConnection />
        </Flex>
    );
};

export default Header;
