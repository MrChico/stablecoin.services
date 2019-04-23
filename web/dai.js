var eth = new Eth(new Eth.HttpProvider('https://kovan.infura.io'));
var el = function(id){ return document.querySelector(id); };


// uncomment to enable MetaMask support:
if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
eth.setProvider(window.web3.currentProvider);
} else {
eth.setProvider(provider); // set to TestRPC if not available
}

var DaiABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"usr","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"usr","type":"address"},{"name":"wad","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"}],"name":"rely","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"nonces","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"holder","type":"address"},{"name":"spender","type":"address"},{"name":"nonce","type":"uint256"},{"name":"expiry","type":"uint256"},{"name":"allowed","type":"bool"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"}],"name":"deny","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"usr","type":"address"},{"name":"wad","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"usr","type":"address"},{"name":"wad","type":"uint256"}],"name":"push","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"move","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"wards","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"usr","type":"address"},{"name":"wad","type":"uint256"}],"name":"pull","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"symbol_","type":"string"},{"name":"name_","type":"string"},{"name":"version_","type":"string"},{"name":"chainId_","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"}];

var tokenInstance = eth.contract(DaiABI).at('0xaaeb56503ceb8852f802bdf050b8ff7d567716ed');

console.log(eth)

eth.accounts().then(function(accounts){
  el('#accountAddress').innerHTML = accounts[0];
  console.log(accounts)
  function updateBalanceHTML() {
    if(!tokenInstance) { return; }

    tokenInstance.balanceOf(accounts[0]).then(function(tokenBalance){
      el('#tokenBalance').innerHTML = Eth.fromWei(tokenBalance[0].toString(), 'ether');
    });
  }

  updateBalanceHTML();

  el('#balanceOf').addEventListener('click', function(){
    el('#balanceResponse').style.display = 'block';

    tokenInstance.balanceOf(el('#balanceAddress').value)
      .then(function(tokenBalance){
        el('#balanceResponse').innerHTML = 'Token balance is: ' + Eth.fromWei(tokenBalance[0].toString(), 'ether')
      })
      .catch(function(balanceError){
        el('#balanceResponse').innerHTML = 'Hmm.. there was an error: ' + String(balanceError);
      });
  });

  el('#transferTokens').addEventListener('click', function(){
    el('#transferResponse').style.display = 'block';

    tokenInstance.transfer(el('#transferAddress').value, el('#transferAmount').value)
      .then(function(transferTxHash) {
        el('#transferResponse').innerHTML = 'Transfering tokens with transaction hash: ' + String(transferTxHash);
      })
      .catch(function(transferError) {
        el('#transferResponse').innerHTML = 'Hmm.. there was an error: ' + String(transferError);
      });
  });

  tokenInstance.symbol().then(function(tokenSymbol){
    el('.tokenSymbol').innerHTML = tokenSymbol[0];
  });

  tokenInstance.name().then(function(tokenName){
    el('#tokenName').innerHTML = tokenName[0];
  });
  tokenInstance.totalSupply().then(function(tokenSupply){
    el('#totalSupply').innerHTML = Eth.fromWei(tokenSupply[0].toString(), 'ether');
    console.log(tokenSupply[0])
  });

});
