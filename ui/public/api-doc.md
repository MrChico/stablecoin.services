# api.stablecoin.services

The stablecoin.services api at https://api.stablecoin.services is a relaying service which accepts signed messages as specified by the [DACH contract](https://etherscan.io/address/0x64043a98f097fd6ef0d3ad41588a6b0424723b3a) and submits them to the ethereum blockchain.

Front end developers can integrate with this api to provide gas-free version of the following operations:

- Dai transfers
- Chai transfers
- Dai -> Eth uniswap trades
- Chai -> Eth uniswap trades
- Dai <-> Chai conversion

Instead, a dai or chai fee must be provided to pay for the cost of relaying. The necessary fee for an operation can be determined by calling the `<operation>/fee` GET method.

First time users which have not yet given the Dach contract an allowance can do so by using the `<operation>WithPermit` version of the appropriate operation. This first submits a `permit` message to the appropriate token contract before initiating the cheque, swap or conversion.

The api provides the following methods:

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Types](#types)
  - [Permit](#permit)
  - [Cheque](#cheque)
  - [Swap](#swap)
  - [Join/Exit](#joinexit)
- [GET methods:](#get-methods)
  - [/v1/daiChequeWithPermit/fee](#v1daichequewithpermitfee)
  - [/v1/daiSwapWithPermit/fee](#v1daiswapwithpermitfee)
  - [/v1/chaiChequeWithPermit/fee](#v1chaichequewithpermitfee)
  - [/v1/chaiSwapWithPermit/fee](#v1chaiswapwithpermitfee)
  - [/v1/chaiJoinWithPermit/fee](#v1chaijoinwithpermitfee)
  - [/v1/chaiExitWithPermit/fee](#v1chaiexitwithpermitfee)
  - [/v1/daiCheque/fee](#v1daichequefee)
  - [/v1/daiSwap/fee](#v1daiswapfee)
  - [/v1/chaiCheque/fee](#v1chaichequefee)
  - [/v1/chaiSwap/fee](#v1chaiswapfee)
  - [/v1/chaiJoin/fee](#v1chaijoinfee)
  - [/v1/chaiExit/fee](#v1chaiexitfee)
- [POST methods](#post-methods)
  - [/v1/daiChequeWithPermit](#v1daichequewithpermit)
  - [/v1/daiSwapWithPermit](#v1daiswapwithpermit)
  - [/v1/chaiChequeWithPermit](#v1chaichequewithpermit)
  - [/v1/chaiSwapWithPermit](#v1chaiswapwithpermit)
  - [/v1/chaiJoinWithPermit](#v1chaijoinwithpermit)
  - [/v1/chaiExitWithPermit](#v1chaiexitwithpermit)
  - [/v1/daiCheque](#v1daicheque)
  - [/v1/daiSwap](#v1daiswap)
  - [/v1/chaiCheque](#v1chaicheque)
  - [/v1/chaiSwap](#v1chaiswap)
  - [/v1/chaiJoin](#v1chaijoin)
  - [/v1/chaiExit](#v1chaiexit)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

The api accepts ERC712 signed messages. There are 5 different kinds of messages, `permit`, `cheque`, `swap`, `join`, and `exit`. For an example of how to generate ERC712 signed messages for these, you can look at the stablecoin.services source at https://github.com/MrChico/stablecoin.services/ 

## Types

### Permit

The permit comes in two forms, a `dai.permit` and a `chai.permit`, both comprised of the following fields:
- `Holder`, the `address` which is giving permission.
- `Spender`, the `address` to which permission is given.
- `expiry` (optional with default := `0`), the time the `permit` can no longer be submitted.
- `allowed` (optional with default := `true`), whether or not permission is given. Must be `true`.
- `v`
- `r`
- `s`, the signature details of the ERC712 `dai` or `chai` `permit`.

### Cheque

A `cheque` consists of:
- `sender`, the `address` sending dai/chai.
- `receiver`, the `address` receiving dai/chai.
- `amount`, a `string` or `number` representing the the dai/chai to be spent (with 18 decimal places).
- `nonce`, (optional with default := `0`) a `string` or `number` representing the dach nonce of the `sender`.
- `fee`, a `string` or `number` value of dai/chai to be given to the relayer. Must be at least `cheque/fee`.
- `relayer`, an `address` to which the fee will be delivered. Must be "0x09748c5b809fF520C7b85e92d5C3B73aCF940f7b".
- `v`
- `r`
- `s`, signature details of the ERC712 `dai` or `chai` `Cheque`.

### Swap

A `swap` consists of:
- `sender`, the `address` sending dai/chai.
- `amount`, a `string` or `number` representing the the dai/chai to sold on in the uniswap contract (with 18 decimal places).
- `min_eth`, a `string` or `number` representing the minimal eth to be received.
- `nonce`, (optional with default := `0`) a `string` or `number` representing the dach nonce of the `sender`.
- `fee`, a `string` or `number` value of dai/chai to be given to the relayer. Must be at least `swap/fee`.
- `relayer`, an `address` to which the fee will be delivered. Must be "0x09748c5b809fF520C7b85e92d5C3B73aCF940f7b".
- `v`
- `r`
- `s`, signature details of the ERC712 `dai` or `chai` `swap`.

### Join/Exit

A `join` or `exit` consists of:
- `sender`, the `address` converting dai to chai or vice versa.
- `receiver`, the `address` receiving dai/chai.
- `amount`, a `string` or `number` representing the the dai/chai to be spent (with 18 decimal places).
- `nonce`, (optional with default := `0`) a `string` or `number` representing the dach nonce of the `sender`.
- `fee`, a `string` or `number` value of dai/chai to be given to the relayer. Must be at least `join/fee`.
- `relayer`, an `address` to which the fee will be delivered. Must be "0x09748c5b809fF520C7b85e92d5C3B73aCF940f7b".
- `v`
- `r`
- `s`, signature details of the ERC712 `chaiJoin` or `chaiExit`.

## GET methods:

### /v1/daiChequeWithPermit/fee

#### Parameters:
None.

#### Returns 
The minimal dai fee required for a [`daiChequeWithPermit`](#v1daiChequeWithPermit) to be accepted (with 18 decimal places).

### /v1/daiSwapWithPermit/fee

#### Parameters:
None.

#### Returns 
The minimal dai fee required for a [`daiSwapWithPermit`](#v1daiSwapWithPermit) to be accepted (with 18 decimal places).

### /v1/chaiChequeWithPermit/fee

#### Parameters:
None.

#### Returns 
The minimal chai fee required for a [`chaiChequeWithPermit`](#v1chaiChequeWithPermit) to be accepted (with 18 decimal places).

### /v1/chaiSwapWithPermit/fee

#### Parameters:
None.

#### Returns 
The minimal chai fee required for a [`chaiSwapWithPermit`](#v1chaiSwapWithPermit) to be accepted (with 18 decimal places).

### /v1/chaiJoinWithPermit/fee

#### Parameters:
None.

#### Returns 
The minimal dai fee required for a [`chaiJoinWithPermit`](#v1chaiJoinWithPermit) to be accepted (with 18 decimal places).

- Note that the `permit` required for the `chaiJoinWithPermit` operation is that of the *Dai* contract.

### /v1/chaiExitWithPermit/fee

#### Parameters:
None.

#### Returns 
The minimal chai fee required for a [`chaiExitWithPermit`](#v1chaiExitWithPermit) to be accepted (with 18 decimal places).

- Note that the `permit` required for the `chaiExitWithPermit` operation is that of the *Chai* contract

### /v1/daiCheque/fee

#### Parameters:
None.

#### Returns 
The minimal dai fee required for a [`daiCheque`](#v1daiCheque) to be accepted (with 18 decimal places).

### /v1/daiSwap/fee

#### Parameters:
None.

#### Returns 
The minimal dai fee required for a [`daiSwap`](#v1daiSwap) to be accepted (with 18 decimal places).

### /v1/chaiCheque/fee

#### Parameters:
None.

#### Returns 
The minimal chai fee required for a [`chaiCheque`](#v1chaiCheque) to be accepted (with 18 decimal places).

### /v1/chaiSwap/fee

#### Parameters:
None.

#### Returns 
The minimal chai fee required for a [`chaiSwap`](#v1chaiSwap) to be accepted (with 18 decimal places).

### /v1/chaiJoin/fee

#### Parameters:
None.

#### Returns 
The minimal dai fee required for a [`chaiJoin`](#v1chaiJoin) to be accepted (with 18 decimal places).

### /v1/chaiExit/fee

#### Parameters:
None.

#### Returns 
The minimal chai fee required for a [`chaiExit`](#v1chaiExit) to be accepted (with 18 decimal places).

## POST methods

### /v1/daiChequeWithPermit

#### Parameters:

A json object containing a dai [`permit`](#permit) and dai [`cheque`](#cheque).

#### Returns

A json object containing the fields `success` and `message`, where `message` either contains an error message, or, if `success` is `true`, a `chequeHash` containing the hash of the transaction submitting the `permit` and `cheque`.

### /v1/daiSwapWithPermit

#### Parameters:

A json object containing a dai [`permit`](#permit) and dai [`swap`](#swap).

#### Returns

A json object containing the fields `success` and `message`, where `message` either contains an error message, or, if `success` is `true`, a `swapHash` containing the hash of the transaction submitting the `permit` and `swap`.

### /v1/chaiChequeWithPermit

#### Parameters:

A json object containing a chai [`permit`](#permit) and chai [`cheque`](#cheque).

#### Returns

A json object containing the fields `success` and `message`, where `message` either contains an error message, or, if `success` is `true`, a `chequeHash` containing the hash of the transaction submitting the `permit` and `cheque`.

### /v1/chaiSwapWithPermit

#### Parameters:

A json object containing a chai [`permit`](#permit) and chai [`swap`](#swap).

#### Returns

A json object containing the fields `success` and `message`, where `message` either contains an error message, or, if `success` is `true`, a `swapHash` containing the hash of the transaction submitting the `permit` and `swap`.

### /v1/chaiJoinWithPermit

#### Parameters:

A json object containing a dai [`permit`](#permit) and chai [`Join`](#joinexit).

#### Returns

A json object containing the fields `success` and `message`, where `message` either contains an error message, or, if `success` is `true`, a `joinHash` containing the hash of the transaction submitting the `permit` and `join`.

### /v1/chaiExitWithPermit

#### Parameters:

A json object containing a chai [`permit`](#permit) and chai [`Exit`](#joinexit).

#### Returns

A json object containing the fields `success` and `message`, where `message` either contains an error message, or, if `success` is `true`, a `exitHash` containing the hash of the transaction submitting the `permit` and `exit`.

### /v1/daiCheque

#### Parameters:

A json object containing a dai [`cheque`](#cheque).

#### Returns

A json object containing the fields `success` and `message`, where `message` either contains an error message, or, if `success` is `true`, a `chequeHash` containing the hash of the transaction submitting the `cheque`.

### /v1/daiSwap

#### Parameters:

A json object containing a dai [`swap`](#swap).

#### Returns

A json object containing the fields `success` and `message`, where `message` either contains an error message, or, if `success` is `true`, a `swapHash` containing the hash of the transaction submitting the `swap`.

### /v1/chaiCheque

#### Parameters:

A json object containing a chai [`cheque`](#cheque).

#### Returns

A json object containing the fields `success` and `message`, where `message` either contains an error message, or, if `success` is `true`, a `chequeHash` containing the hash of the transaction submitting the `cheque`.

### /v1/chaiSwap

#### Parameters:

A json object containing a chai [`swap`](#swap).

#### Returns

A json object containing the fields `success` and `message`, where `message` either contains an error message, or, if `success` is `true`, a `swapHash` containing the hash of the transaction submitting the `swap`.

### /v1/chaiJoin

#### Parameters:

A json object containing a chai [`Join`](#joinexit).

#### Returns

A json object containing the fields `success` and `message`, where `message` either contains an error message, or, if `success` is `true`, a `joinHash` containing the hash of the transaction submitting the `join`.

### /v1/chaiExit

#### Parameters:

A json object containing a chai [`Exit`](#joinexit).

#### Returns

A json object containing the fields `success` and `message`, where `message` either contains an error message, or, if `success` is `true`, a `exitHash` containing the hash of the transaction submitting the `exit`.
