export const chequeFee = async function() {
    const request = await fetch('http://localhost:8000/v1/cheque/fee')
    console.log(request)
    return await request.json();
}

export default {
    chequeFee
}
