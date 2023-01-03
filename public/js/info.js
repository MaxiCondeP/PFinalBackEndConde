
///llamado a la api
let endPoint = "http://localhost:8080/info/api" 




const getInfo = async () => {
    const data = await fetch(endPoint);
    return await data.text();

}

let pArgs = document.querySelector("#pArgs");
let pSo = document.querySelector("#pSo");
let pNode = document.querySelector("#pNode");
let pMemory = document.querySelector("#pMemory");
let pPath = document.querySelector("#pPath");
let pDir = document.querySelector("#pDir");
let pId = document.querySelector("#pId");
let pNumCPUs= document.querySelector("#pNumCPUs");

getInfo().then((info) => {
    data = JSON.parse(info)
    pArgs.innerHTML = data.args;
    pSo.innerHTML = data.platform;
    pNode.innerHTML = data.version;
    pMemory.innerHTML = data.memory;
    pPath.innerHTML = data.path;
    pId.innerHTML = data.id;
    pDir.innerHTML = data.folder;
    pNumCPUs.innerHTML=data.numCPUs;

});


