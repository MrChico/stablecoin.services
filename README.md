# About stablecoin.services
Today, we are introducing `stablecoin.services`, a selection of common Dai and Chai operations offered gas-free, at your convenience.
This promotes Dai and Chai to first class tokens in the Ethereum network, allowing users to transact in these currencies without ever holding any Ether.

At launch, the following operations are supported:

 - Dai and Chai transfers,
 - Dai -> Eth and Chai -> Eth uniswap trades,
 - Dai <-> Chai conversions.

Head over to [stablecoin.services](https://stablecoin.services) to give it a spin. Bernard will be there to assist you.

[butler.png]

A relaying api is provided at [api.stablecoin.services](https://api.stablecoin.services), which can be integrated into other dapps interested in offering gas-free conveniences to their users.

## How does it work?

To initiate an action, the user signs a message specifying the details of the operation to be performed, and authorizes a relayer to process the transaction on their behalf. As the relayer submits the message to the blockchain, the operation is processed and the fee is delivered to the relayer to reimburse their gas costs.

At the heart of this process sits a smart contract called the Dai Automated Clearing House, or [`dach`](https://etherscan.io/address/0x64043a98f097fD6ef0D3ad41588a6B0424723b3a#code), for short. The first time you use `stablecoin.services` you will be asked to sign a message which permits this contract to operate on your behalf. You should study this contract carefully as it determines the terms of engagement between you and the relaying service. It specifies a set of message types, one for each action offered by `stablecoin.services`, and corresponding functions which executes the operation specified by each message.

This is all made possible by the [`permit` function](https://github.com/makerdao/dss/blob/master/src/dai.sol#L117) in the Dai and Chai contracts, which allows for approvals to be done by signed messages, instead of transactions relying on `msg.sender`. We hope that `stablecoin.services` serves as an example of the power and extensibility of the `permit` construction, and encourage future token designers to adopt a similar pattern.

The processing fee suggested by the front end is calculated according to the following formula:

`operation_fee = 1.1 * gas_per_operation * fast_gas_price * eth_price_in_dai (or chai)`,

where `fast_gas_price` is provided by Gas Station Network.

## What are the risks?

The `dach` contract has not yet undergone and audit. It is a fairly small and straightforward contract written and reviewed by experienced smart contract developers, but as with all smart contracts, you should make your own risk assessment before engaging.

Assuming the contract works as intended, neither the relayer or the `dach` contract holds custody over any user assets. They are simply granted the permission to execute the actions as specified by the signed messages by the user, and the worst they can do is to withhold from processing an operation, only to submit it when the user gives up. To mitigate against this, messages are equipped with an expiration date after which they can no longer be processed. The time to live for messages signed using `stablecoin.services` is 2 minutes. Messages are also equipped with a nonce for replay protection and to enable overwriting of stale messages.

## Resources

The code for the `dach` contract can be found at [github.com/dapphub/ds-dach](https://github.com/dapphub/ds-dach/), or in the [etherscan live deployment](https://etherscan.io/address/0x64043a98f097fD6ef0D3ad41588a6B0424723b3a#code)
The code for the `stablecoin.services` front end is hosted at [github.com/MrChico/stablecoin.services](https://github.com/MrChico/Stablecoin.services).

Both distributed under the AGPL license.

Documentation of the relaying api is provided at [`api.stablecoin.services`](https://api.stablecoin.services)

*Martin Lundfall, Andrew Cassetti, Lev Livnev*
