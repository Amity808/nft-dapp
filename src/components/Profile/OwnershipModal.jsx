import React, { useState } from 'react'
import { Popover, TextField, Box, Text, Button, Flex } from '@radix-ui/themes'
import useTransferOwnerShip from '../../hooks/useTranferOwnerShip'
const OwnershipModal = ({ tokenId}) => {
  const [newOwner, setnewOwner] = useState(null)
  const transferToken = useTransferOwnerShip({newOwner, tokenId})

  // console.log(newOwner, "0x9dBa18e9b96b905919cC828C399d313EfD55D800")
  return (
    <Popover.Root>
	
	<Popover.Content width="250px">
		<Flex gap="3">
			
			<Box flexGrow="1">
      <TextField.Root size="2" placeholder="Beneficial Address" 
      value={newOwner}
      onChange={(e) => setnewOwner(e.target.value)} />
				<Flex gap="3" mt="3" justify="between">
					<Flex align="center" gap="2" asChild>
						<Text as="label" size="2">
							
							<Text>Transfer NFT</Text>
						</Text>
					</Flex>

					<Popover.Close>
						<Button size="1" onClick={transferToken}>Tranfer</Button>
					</Popover.Close>
				</Flex>
			</Box>
		</Flex>
	</Popover.Content>
  <Popover.Trigger>
		<button     className="w-full p-4 bg-primary/80 hover:bg-primary/50 rounded-md text-secondary font-bold disabled:bg-gray-500"
    >
			Transfer
		</button>
	</Popover.Trigger>
</Popover.Root>

  )
}

export default OwnershipModal