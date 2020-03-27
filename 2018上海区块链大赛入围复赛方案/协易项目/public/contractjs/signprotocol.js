var myContractInstance, MyContract
window.addEventListener('load', function() {
  var abi = [{
      "constant": true,
      "inputs": [],
      "name": "getAllFloaterSize",
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
          "name": "protocolText",
          "type": "string"
        }
      ],
      "name": "addFloater",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
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
      "name": "addFloaterSigner",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
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
          "name": "signersSize",
          "type": "uint256"
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
        "name": "random",
        "type": "uint256"
      }],
      "name": "getRandom",
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
      }],
      "name": "getUserProtocolSize",
      "outputs": [{
        "name": "",
        "type": "uint256"
      }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]

  // 检查web3是否已经注入到(Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    web3 = new Web3(web3.currentProvider);
    MyContract = web3.eth.contract(abi);
    myContractInstance = MyContract.at('0x50f582ed34ef21ce434ccf9607f1e6bb9b47fa29');
    console.log(myContractInstance);
    var account = web3.eth.accounts[0];
    console.log(account);
    console.log("注入web3成功");

  } else {
    // 告诉他们要安装 MetaMask 来使用我们的应用
    alert("请登录matemask")
  }
  var signer;
  var path = window.location.pathname;
  var num = path.lastIndexOf("/")
  var userName = path.substring(14, num)
  var protocolId = path.substring(num + 1, path.length);
  $.ajax({
    type: "get",
    url: "/getsession",
    success: function(result) {
      signer = result.username
      console.log(result);
    }
  })
  $("#sign").click(function() {
    addProtocolSigner(userName, protocolId, signer)
  })
  getAllProtocolInfo(userName, protocolId).then((res) => {
    var time = timestampToTime(res.info[3].c[0])
    $("#time").html(time)
    $("#title").html(res.info[1])
    $("#signers").html(res.allSigner)
    $("#content").html(res.info[2])
    console.log(res);
  })




});
