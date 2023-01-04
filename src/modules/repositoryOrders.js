import { daoFactory } from '../modules/factoryOrders.js'
import { config } from '../../config.js'

const dao = config.PERSISTENCE;

export default class repositoryOrders {
    constructor() {
        this.factory = new daoFactory(dao);
    }


    async getDao() {

        return await this.factory.getDao();
    }
}