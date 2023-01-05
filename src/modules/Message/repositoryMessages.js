import{daoFactory} from './factoryMessages.js'
import { config } from '../../../config.js'

const dao = config.PERSISTENCE;
export default  class repositoryMessages {
     constructor (){
        this.factory=new daoFactory(dao);
    }

    async getDao(){

        return await this.factory.getDao();
    }
    
}