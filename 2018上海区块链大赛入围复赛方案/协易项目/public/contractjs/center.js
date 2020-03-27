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
    if(!account){
      alert("请登录matemask")
    }
    console.log(account);
    console.log("注入web3成功");

  } else {
    // 告诉他们要安装 MetaMask 来使用我们的应用
    alert("请登录matemask")
  }
  var host = window.location.host
  var path = window.location.pathname;
  var num = path.lastIndexOf("/")
  var userName = path.substring(8, num)
  var protocolId = path.substring(num + 1, path.length);
  console.log(userName);
  console.log(protocolId);
  getUserProtocolSize(userName).then((res) => {
    $("#protocolSize").html(`${res}`)

  })
  getUserFloaterSize(userName).then((res) => {
    $("#floaterSize").html(`${res}`)

  })

  getAllProtocolInfo(userName, protocolId).then((res) => {
    let signerSize = res.info[4].c[0];
    let time = res.info[3].c[0]
    time = timestampToTime(res.info[3].c[0])
    let title = res.info[1]
    let content = res.info[2]
    let signer = res.allSigner
    if (title) {
      $("#myProtocol").html(`

                                          <div class="card-body">
                                              <ul class="blog-icons my-4">
                                                  <li>
                                                      <a href="#">
                                                          <i class="far fa-calendar-alt">${time}</i></a>
                                                  </li>
                                                  <li class="mx-2">
                                                      <a href="#">
                                                          <i class="far fa-comment">协议须签署人数</i> ${signerSize}</a>
                                                  </li>

                                              </ul>
                                              <h5 id="Title" class="card-title ">
                                                  <a href="single.html" class="text-dark font-weight-bold">${title}</a>
                                              </h5>
                                              <p id="content" class="card-text">${content}</p>
                                              <p id="signer" style="font-size: 0.8rem;text-align: right;">
                                                  签署人员：
                                                  <a>${signer}</a>
                                              </p>
                                              <p id="signerHref" style="font-size: 0.8rem;text-align: right;">
                                                  签署链接
                                                  <a href="">${host}/signprotocol/${userName}/${protocolId}</a>

                                              </p>

                                          </div>`);

    }


  });

  showAllProtocolAllInfo(userName).then(res => {
    var len = res.length;
    var id = len - 1;
    for (let i = 0; i < len; i++) {
      var time = res[i].info[3].c[0]
      time = timestampToTime(time)
      var title = res[i].info[1]
      $("#simpleProtocol").append(`
                        <li>
                        <a class="twitter" href="/center/${userName}/${i}">
                        <i class="far fa-clock"></i>
                        <span class="count">${time}  </span>${title}</a>
                        </li>`)
    }
  })
})
