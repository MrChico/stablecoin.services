import config from '../config.json';
const API_URL = config.API_URL;

export const daiChequeFee = async function() {
    const request = await fetch(`${API_URL}/v1/daiCheque/fee`)
    return request.json()
}

export const daiPermitAndChequeFee = async function() {
    const request = await fetch(`${API_URL}/v1/daiPermitAndCheque/fee`)
    return request.json()
}

export const swapFee = async function() {
    const request = await fetch(`${API_URL}/v1/daiSwap/fee`)
    return request.json()
}

export const daiPermitAndSwapFee = async function() {
    const request = await fetch(`${API_URL}/v1/daiPermitAndCheque/fee`)
    return request.json()
}

export const daiCheque = async function(data) {
    console.log(data)
    const request = await fetch(`${API_URL}/v1/daiCheque`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    return request.json()
}

export const daiPermitAndCheque = async function(data) {
    const request = await fetch(`${API_URL}/v1/daiPermitAndCheque`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    return request.json()
}

export default {
    daiChequeFee,
    swapFee
}
