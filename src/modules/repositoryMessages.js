import{daoFactory} from '../modules/factoryMessages.js'
import parseArgs from "minimist";

const options = { default: { PORT: 8080, MODE: "fork", DAO: "MONGO" }, alias: { p: "PORT", m: "MODE", d: "DAO" } }
const args = parseArgs(process.argv.slice(2), options);
const dao = args.DAO.toUpperCase();

export default  class repositoryMessages {
     constructor (){
        this.factory=new daoFactory(dao);
    }

    async getDao(){

        return await this.factory.getDao();
    }
    
}