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
    myContractInstance = MyContract.at('0xd758185572cce52d5d8c8e6b9472f805f9df7781');
    console.log(myContractInstance);
    var account = web3.eth.accounts[0];
    console.log(account);
    console.log("注入web3成功");

  } else {
    // 告诉他们要安装 MetaMask 来使用我们的应用
    alert("请登录matemask")
  }
  $("#addFloater").click(function() {
    var content = $("#demo-message").val();
    // var userName=window.location.pathname;
    addFloater("cheng", content);
  })
  getRandomfloater().then((res) => {
    $("#userName").html("用户：" + res.info[0])
    $("#content").html(res.info[1])
  })
  showAllfloaterAllInfo("cheng").then((res) => {
    console.log(res);
    for (let i = 0; i < res.length; i++) {
      // var time = new Date(res[i].info[2].c[0])
      var time = timestampToTime(res[i].info[2].c[0])
      console.log(time);
      $("#allFloater").append(`<tr>
              <td>${res[i].info[0]}</td>
              <td>${res[i].info[1]}</td>
              <td>${time}</td>
              <td>${res[i].allSigner}</td>

              </tr>`);

    }
  });

})
