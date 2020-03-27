function addProtocol(userName, title, protocolText, signersSize) {
  return new Promise((resolve, reject) => {
    myContractInstance.addFloater(userName, title, protocolText, signersSize, function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function addProtocolSigner(userName, protocolId, signer) {
  return new Promise((resolve, reject) => {
    myContractInstance.addProtocolSigner(userName, protocolId, signer, function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function addProtocolSigner(userName, protocolId, signer) {
  return new Promise((resolve, reject) => {
    myContractInstance.addProtocolSigner(userName, protocolId, signer, function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function getUserProtocolSize(userName) {
  return new Promise((resolve, reject) => {
    myContractInstance.getUserProtocolSize(userName, function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function showProtocol(userName, protocolId) {
  return new Promise((resolve, reject) => {
    myContractInstance.showProtocol(userName, protocolId, function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function showProtocolSignersSize(userName, protocolId) {
  return new Promise((resolve, reject) => {
    myContractInstance.showProtocolSignersSize(userName, protocolId, function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function showProtocolSigners(userName, protocolId, index) {
  return new Promise((resolve, reject) => {
    myContractInstance.showProtocolSigners(userName, protocolId, index, function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function addFloater(userName, protocolText) {
  return new Promise((resolve, reject) => {
    myContractInstance.addFloater(userName, protocolText, function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function addFloaterSigner(userName, protocolId, signer) {
  return new Promise((resolve, reject) => {
    myContractInstance.addFloaterSigner(userName, protocolId, signer, function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function getUserFloaterSize(userName) {
  return new Promise((resolve, reject) => {
    myContractInstance.getUserFloaterSize(userName, function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function showFloater(userName, protocolId) {
  return new Promise((resolve, reject) => {
    myContractInstance.showFloater(userName, protocolId, function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function showFloaterSignersSize(userName, protocolId) {
  return new Promise((resolve, reject) => {
    myContractInstance.showFloaterSignersSize(userName, protocolId, function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function showFloaterSigners(userName, protocolId, index) {
  return new Promise((resolve, reject) => {
    myContractInstance.showFloaterSigners(userName, protocolId, index, function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function getRandom(random) {
  return new Promise((resolve, reject) => {
    myContractInstance.getRandom(random, function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function getAllFloaterSize() {
  return new Promise((resolve, reject) => {
    myContractInstance.getAllFloaterSize(function(err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}
async function getAllProtocolInfo(userName, id) {
  // await size=getUserProtocolSize(userName);
  var info = await showProtocol(userName, id);
  console.log(info[0] + info[1] + info[2]);
  var size = await showProtocolSignersSize(userName, id);
  size = size.c[0]
  console.log("size" + size);
  var allSigner = [];
  for (let i = 0; i < size; i++) {
    var signer = await showProtocolSigners(userName, id, i);
    allSigner.push(signer)

  }
  return {
    info: info,
    size: size,
    allSigner: allSigner
  }
}
async function getRandomfloater() {
  var allSize = await getAllFloaterSize();
  allSize = allSize.c[0]
  var random = Math.floor((Math.random() * allSize));
  var info = await getRandom(random);
  // console.log(allSize);
  // console.log(random);
  // console.log(info);
  return {
    info: info
  };
}
async function showAllfloaterAllInfo(userName) {
  var id = await getUserFloaterSize(userName);
  var info
  var size
  var allSigner
  var allInfo = []
  console.log(id);
  for (let j = 0; j < id; j++) {
    info = await showFloater(userName, j);
    size = await showFloaterSignersSize(userName, j);
    size = size.c[0]
    allSigner = [];
    console.log(info);
    console.log(size);
    for (let i = 0; i < size; i++) {
      var signer = await showFloaterSigners(userName, j, i);
      allSigner.push(signer)
    }
    allInfo.push({
      info: info,
      size: size,
      allSigner: allSigner,
    })
  }
  return allInfo
}
function timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y+M+D+h+m+s;
}
