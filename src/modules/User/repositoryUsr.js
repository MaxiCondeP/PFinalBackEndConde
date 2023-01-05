import{daoFactory} from './factoryUsr.js'
import { config } from '../../../config.js'

const dao = config.PERSISTENCE;

export default class repositoryUsr {
    constructor(){
        this.factory=new daoFactory(dao);
    }

    
    async getDao(){

        return await this.factory.getDao();
    }
}