
let daoOrders;


export class daoFactory {
    constructor(dao) {
        this.dao = dao;
    }

    async getDao() {

        switch (this.dao) {
            case 'MONGO':
                const { default: mongoOrderDao } = await import('../daos/mongoOrderDao.js');
                return daoOrders = mongoOrderDao.getContainer();
                break;
            case 'FIREBASE':
                const { default: firebaseOrderDao } = await import('../daos/firebaseOrderDao.js');
                return daoOrders = firebaseOrderDao.getContainer();
                break;
            case 'MEMORY':
                const { default: memoryOrderDao } = await import('../daos/memoryOrderDao.js');
                return daoOrders = memoryOrderDao.getContainer();
                break
            default:
                const { default: fileOrderDao } = await import('../daos/fileOrderDao.js');
                return daoOrders = fileOrderDao.getContainer('Orders');
                break;
        }

    }
}

