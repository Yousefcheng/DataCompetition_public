window.addEventListener('load', function() {

  // 检查web3是否已经注入到(Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // 使用 Mist/MetaMask 的提供者
    // web3 = new Web3(web3.currentProvider);
    abi = [{
        "constant": false,
        "inputs": [{
            "name": "userName",
            "type": "string"
          },
          {
            "name": "protocolId",
            "type": "uint256"
          },
          {
            "name": "signer",
            "type": "string"
          }
        ],
        "name": "addFloaterSigner",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
            "name": "userName",
            "type": "string"
          },
          {
            "name": "protocolId",
            "type": "uint256"
          },
          {
            "name": "index",
            "type": "uint256"
          }
        ],
        "name": "showFloaterSigners",
        "outputs": [{
          "name": "",
          "type": "string"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
            "name": "userName",
            "type": "string"
          },
          {
            "name": "protocolId",
            "type": "uint256"
          },
          {
            "name": "index",
            "type": "uint256"
          }
        ],
        "name": "showProtocolSigners",
        "outputs": [{
          "name": "",
          "type": "string"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [{
            "name": "userName",
            "type": "string"
          },
          {
            "name": "protocolId",
            "type": "uint256"
          },
          {
            "name": "signer",
            "type": "string"
          }
        ],
        "name": "addProtocolSigner",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "userName",
          "type": "string"
        }],
        "name": "getUserFloaterSize",
        "outputs": [{
          "name": "",
          "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
            "name": "userName",
            "type": "string"
          },
          {
            "name": "protocolId",
            "type": "uint256"
          }
        ],
        "name": "showFloaterSignersSize",
        "outputs": [{
          "name": "",
          "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
            "name": "userName",
            "type": "string"
          },
          {
            "name": "protocolId",
            "type": "uint256"
          }
        ],
        "name": "showProtocol",
        "outputs": [{
            "name": "",
            "type": "string"
          },
          {
            "name": "",
            "type": "string"
          },
          {
            "name": "",
            "type": "string"
          },
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
            "name": "userName",
            "type": "string"
          },
          {
            "name": "protocolId",
            "type": "uint256"
          }
        ],
        "name": "showProtocolSignersSize",
        "outputs": [{
          "name": "",
          "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
            "name": "userName",
            "type": "string"
          },
          {
            "name": "protocolId",
            "type": "uint256"
          }
        ],
        "name": "showFloater",
        "outputs": [{
            "name": "",
            "type": "string"
          },
          {
            "name": "",
            "type": "string"
          },
          {
            "name": "",
            "type": "string"
          },
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [{
            "name": "userName",
            "type": "string"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "protocolText",
            "type": "string"
          }
        ],
        "name": "addProtocol",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "userName",
          "type": "string"
        }],
        "name": "getUserProtocolSize",
        "outputs": [{
          "name": "",
          "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [{
            "name": "userName",
            "type": "string"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "protocolText",
            "type": "string"
          },
          {
            "name": "region",
            "type": "string"
          }
        ],
        "name": "addFloater",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
    // web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    web3 = new Web3(web3.currentProvider);
    // var MyContract = web3.eth.contract(abi);
    console.log(web3.currentProvider);
    var myContractInstance = MyContract.at('0xef4b6b104645B01aB3398e795CFeF0FfE214E687');

    console.log("网页插入成功");
  } else {

    alert("请下载metamask");
  }

  // 现在你可以启动你的应用并自由访问 Web3.js:

})
