import os from "os";
import { __dirname } from "../../server.js";


export const getInfo = (req, res) => {
    let args = process.argv;
    let platform = process.platform;
    let version = process.version;
    let memory = process.memoryUsage().rss;
    let path = process.execPath;
    let id = process.pid;
    let folder = process.cwd();
    let numCPUs = os.cpus().length;
    res.json({ args, platform, version, memory, path, id, folder, numCPUs })
}

export const redirectToInfo = (req, res) => {
    //DEVUELVO A LA PAGINA DE INFO
    res.sendFile(__dirname + "/public/info.html");
}
