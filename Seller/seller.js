function log(message) {
	document.getElementById("log").innerHTML=message;
	console.log(message);
}
  
function error(message) {
	$('#log').append($('<p>').addClass('dark-red').text(message));
    $('#log').scrollTop($('#log').prop('scrollHeight'));
}
  
function waitForReceipt(hash, cb) {
	web3.eth.getTransactionReceipt(hash, function (err, receipt) {
		if (err) {
			error(err);
		}
		if (receipt !== null) {
			// Transaction went through
			if (cb) {
				cb(receipt);
			}
		} else {
			// Try again in 1 second
			window.setTimeout(function () {
				waitForReceipt(hash, cb);
			}, 1000);
		}
	});
}

const address = "0x6044989D8e035Af4636CAcA8Dd5aa619603f5646";
  const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_productID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_productName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "addProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getProductListLength",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getSellerListLength",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getSystemOrderLength",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_productID",
				"type": "string"
			}
		],
		"name": "orderProduct",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "productList",
		"outputs": [
			{
				"internalType": "string",
				"name": "productID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "productName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "inStock",
				"type": "bool"
			},
			{
				"internalType": "address payable",
				"name": "sellerAddr",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "sellerList",
		"outputs": [
			{
				"internalType": "string",
				"name": "shopName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "sellerName",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_buyerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_phoneNo",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_shippingAddr",
				"type": "string"
			}
		],
		"name": "signUpAsBuyer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_shopName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_sellerName",
				"type": "string"
			}
		],
		"name": "signUpAsSeller",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "systemOrderList",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "orderID",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "productID",
				"type": "string"
			},
			{
				"internalType": "address payable",
				"name": "buyerAddr",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "transferTest",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
]

//---------- GETTERS -----------//

smartShopper = web3.eth.contract(abi).at(address);

function getSystemOrderList() {
    smartShopper.getSystemOrderLength((err, systemOrderListLength) => {
		systemOrderListLength = systemOrderListLength.toNumber()
		let content = ''
        for(let i = 0; i < systemOrderListLength; i++) {
            smartShopper.systemOrderList(i, (err, message) => {
                content += 
				`<div class="message-box" style="text-align: middle">
					<hr>
					<div>Order ID: ${message[0]}</div>
					<div>Product: ${message[1]}</div>
					<div>Address: ${message[2]}</div>
					<hr>
                </div>`
                if(i === systemOrderListLength - 1) document.querySelector('#systemOrderList').innerHTML = content
            })
        }
    })
}

//---------- SETTERS -----------//

$(function () {
  var smartShopper = web3.eth.contract(abi).at(address);
  $('#registerAsSeller').click(function (e) {
    e.preventDefault();
    if(web3.eth.defaultAccount === undefined) {
      return error("No accounts found. If you're using MetaMask, " +
      "please unlock it first and reload the page.");
    }
    log("Creating account...");
    
    smartShopper.signUpAsSeller.sendTransaction(document.getElementById("registerShopName").value, document.getElementById("registerSellerName").value, function (err, hash) {
      if (err) {
        return error(err);
      }
      waitForReceipt(hash, function () {
        log("Account Created. Start Having Fun..");
      });
    });
  });

  $('#addNewProduct').click(function (e) {
	// check error, no modification
    e.preventDefault();
    if(web3.eth.defaultAccount === undefined) {
      return error("No accounts found. If you're using MetaMask, " +
      "please unlock it first and reload the page.");
    }
    log("Adding new product...");

	// change function and parameters
    smartShopper.addProduct.sendTransaction(document.getElementById("addProductID").value, document.getElementById("addProductName").value, document.getElementById("addPrice").value, function (err, hash) {
      if (err) {
		log("\nFailed! You are not a seller.")
        return error(err);
      }
      waitForReceipt(hash, function () {
        log("Product Created. Enjoy your selling..");
      });
    });
  });

});