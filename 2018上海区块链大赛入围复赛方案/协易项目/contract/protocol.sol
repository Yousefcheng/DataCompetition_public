pragma solidity ^0.4.19;
contract Protocol {
    struct Content {
        string host;
        string title;
        string protocolText;
        uint creat_at;
        string[] signers;
        uint signersSize;
    }
    struct Floater {
        string host;
        string protocolText;
        uint creat_at;
        string[] signers;
    }
    mapping( string => mapping(uint => Content)) private protocols;
    mapping( string => mapping(uint => Floater)) private floater;
    mapping(string => uint) private protocolSize;
    mapping(string => uint) private floaterSize;
    Floater [] allFloater;


    function addProtocol(string userName,string title,string protocolText,uint signersSize) public {
        string[] memory signers;
        uint protocolId=protocolSize[userName];
        protocols[userName][protocolId]=Content({
            host : userName,
            title:title,
            protocolText : protocolText,
            creat_at: now,
            signers:signers,
            signersSize:signersSize
        });
        protocolSize[userName]++;
    }
    function addProtocolSigner(string userName,uint protocolId,string signer) public{
     require(protocols[userName][protocolId].signersSize>protocols[userName][protocolId].signers.length);
     protocols[userName][protocolId].signers.push(signer);
    }
    function getUserProtocolSize(string userName) public view returns (uint) {
        return protocolSize[userName];

    }
    function showProtocol(string userName,uint protocolId) public view returns (string,string,string,uint,uint){
        string memory host=protocols[userName][protocolId].host;
        string memory title=protocols[userName][protocolId].title;
        string memory protocolText=protocols[userName][protocolId].protocolText;
        uint creat_at=protocols[userName][protocolId].creat_at;
        uint signersSize=protocols[userName][protocolId].signersSize;
        return (host,title,protocolText,creat_at,signersSize);
    }
    function showProtocolSignersSize(string userName,uint protocolId) public view returns (uint) {
        if(protocols[userName][protocolId].signers.length>0){
            return protocols[userName][protocolId].signers.length;

        }else{
            return 0;
        }

    }
    function showProtocolSigners(string userName,uint protocolId,uint index) public view returns (string) {
        return protocols[userName][protocolId].signers[index];
    }

    //漂流瓶
    function addFloater(string userName,string protocolText) public {
        string[] memory signers;
        uint protocolId=floaterSize[userName];
        floater[userName][protocolId]=Floater({
            host : userName,
            protocolText : protocolText,
            creat_at: now,
            signers:signers
        });
        protocolSize[userName]++;
        allFloater.push(Floater({
            host : userName,
            protocolText : protocolText,
            creat_at: now,
            signers:signers
        }));
    }
    function addFloaterSigner(string userName,uint protocolId,string signer) public{
      floater[userName][protocolId].signers.push(signer);


    }
    function getUserFloaterSize(string userName) public view returns (uint) {
        return floaterSize[userName];

    }
    function showFloater(string userName,uint protocolId) public view returns (string,string,uint){
        string memory host=floater[userName][protocolId].host;
        string memory protocolText=floater[userName][protocolId].protocolText;
        uint creat_at=floater[userName][protocolId].creat_at;
        return (host,protocolText,creat_at);
    }
    function showFloaterSignersSize(string userName,uint protocolId) public view returns (uint) {

        return floater[userName][protocolId].signers.length;
    }
    function showFloaterSigners(string userName,uint protocolId,uint index) public view returns (string) {
        return floater[userName][protocolId].signers[index];
    }
    function getRandom(uint random) public returns (string,string,uint){
        string host=allFloater[random].host;
        string protocolText=allFloater[random].protocolText;
        uint creat_at=allFloater[random].creat_at;
        return (host,protocolText,creat_at);
    }
    function getAllFloaterSize() public returns (uint){
        return allFloater.length;
    }
}
