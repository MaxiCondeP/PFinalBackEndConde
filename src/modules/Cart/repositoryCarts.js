import{daoFactory} from './factoryCarts.js'
import { config } from '../../../config.js'

const dao = config.PERSISTENCE;

export default class repositoryCarts {
    constructor(){
        this.factory=new daoFactory(dao);
    }

    
    async getDao(){

        return await this.factory.getDao();
    }
}