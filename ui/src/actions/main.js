import Web3 from "web3";
import { signDachTransferPermit, signCheque, signSwap } from '../utils/web3Utils';
import { cheque, permitAndCheque } from '../utils/apiUtils';

export const transfer = async function() {
    const { store } = this.props
    const dachApproved = store.get('dachApproved')

    console.log('transfer', dachApproved)

    if (!dachApproved) {
        try {
            const signedPermit = await signDachTransferPermit.bind(this)(true)
            try {
                // metamask race condition
                setTimeout(async () => {
                    const signedCheque = await signCheque.bind(this)()

                    // POST /permit_and_transfer
                    const result = await permitAndCheque({
                        permit: signedPermit,
                        cheque: signedCheque
                    })
                    console.log('permitAndCheque', result)
                }, 100)
            } catch(e) {
                console.log(e)
            }
        } catch(e) {
            console.log(e)
        }
    } else {
        try {
            const signedCheque = await signCheque.bind(this)()

            // POST /transfer
            const result = await cheque({ cheque: signedCheque })
            console.log('cheque', result)
        } catch(e) {
            console.log(e)
        }
    }
}

export const swap = async function() {
    const { store } = this.props
    const dachApproved = store.get('dachApproved')

    if (!dachApproved) {
        try {
            const signedPermit = await signDachTransferPermit.bind(this)(true)
            try {
                // metamask race condition
                setTimeout(async () => {
                    const signedSwap = await signSwap.bind(this)()

                    // POST /permit_and_swap
                }, 100)
            } catch(e) {
                console.log(e)
            }
        } catch(e) {
            console.log(e)
        }
    } else {
        try {
            const signedSwap = await signSwap.bind(this)()

            // POST /swap
        } catch(e) {
            console.log(e)
        }
    }
}

export default {
    transfer,
    swap
}
