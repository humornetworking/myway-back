var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const path = require('path'); 
const fs = require('fs'); 
const TruffleContract = require('truffle-contract'); 
const Web3 = require('web3'); 
const ethereumjsWallet = require('ethereumjs-wallet'); 
const ProviderEngine = require('web3-provider-engine'); 
const WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js'); 
const Web3Subprovider = require('web3-provider-engine/subproviders/web3.js'); 
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');

const RPC_SERVER = 'https://ropsten.infura.io/1SxTwCuMzyn3ARhwExLI'; 
const TOKEN_SALE_CONTRACT = require('./abi.json')
const privateKey = '33f86c16df11df8c74100036c8a70a8ac822d3f5139f1ab6636f458409ac706d'; 
const publicKey = '0x43Db0c23a5BaF89eaFc88B884f56Fd2c89274590'; //Address
const contractAddress = '0xdA40d5248481aC711091ABa490c446ded40f6466';

const wallet = ethereumjsWallet.fromPrivateKey(new Buffer(privateKey, 'hex')); 
const engine = new ProviderEngine(); 
engine.addProvider(new FilterSubprovider()); 
engine.addProvider(new WalletSubprovider(wallet, {})); 
engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(RPC_SERVER))); 
engine.start(); 

// configure app to use bodyParser()
// this will let us get the data from a POSTx
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



function loadContract(file, provider, address) { 
    return new Promise(function (resolve, reject) { 
        fs.readFile(file, 'utf-8', function (err, data) { 
            if (err) { 
                reject(err); 
            } else { 
                let contract = TruffleContract(JSON.parse(data)); 
                contract.setProvider(provider); 
                contract.defaults({ from: address, gas: 4500000 }); 
                resolve(contract); 
            } 
        }); 
    }); 
} 



//var newBook = '"La vida es ahora","0x43Db0c23a5BaF89eaFc88B884f56Fd2c89274590","ABC"';
totalTokenIssued().then(function(totalToken) { 
   console.log('totalToken=' + totalToken); 
}).catch(console.error);


app.post('/create-book', function(req, res){
	var obj = {};
	var titulo = req.body.titulo;
	var texto = req.body.texto;
	var checkoutID = req.body.checkoutID;
	
	const totalTokenIssued = async(function () { 
		let tokenSaleContract = await(loadContract(TOKEN_SALE_CONTRACT, engine, contractAddress)); 
		let tokenSale = await(tokenSaleContract.deployed()); 
		let totalTokenIssued = await(tokenSale.addBook("La vida es ahora","0x43Db0c23a5BaF89eaFc88B884f56Fd2c89274590","ABC",{value: 100, from: publicKey}));  //Le debo mandar GAS ???
		return totalTokenIssued.toString(); 
	}); 
	
	
	res.send(req.body);
});

app.use('/', express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);