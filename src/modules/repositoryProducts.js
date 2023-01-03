import{daoFactory} from '../modules/factoryProducts.js'
import { config } from '../../config.js'

const dao = config.PERSISTENCE;

export default class repositoryProducts {
    constructor(){
        this.factory=new daoFactory(dao);
    }

    
    async getDao(){

        return await this.factory.getDao();
    }
}