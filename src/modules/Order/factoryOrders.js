
let daoOrders;


export class daoFactory {
    constructor(dao) {
        this.dao = dao;
    }

    async getDao() {

        switch (this.dao) {
            case 'MONGO':
                const { default: mongoOrderDao } = await import('../../daos/Order/mongoOrderDao.js');
                return daoOrders = mongoOrderDao.getContainer();
                break;
            case 'FIREBASE':
                const { default: firebaseOrderDao } = await import('../../daos/Order/firebaseOrderDao.js');
                return daoOrders = firebaseOrderDao.getContainer();
                break;
            case 'MEMORY':
                const { default: memoryOrderDao } = await import('../../daos/Order/memoryOrderDao.js');
                return daoOrders = memoryOrderDao.getContainer();
                break
            default:
                const { default: fileOrderDao } = await import('../../daos/Order/fileOrderDao.js');
                return daoOrders = fileOrderDao.getContainer('Orders');
                break;
        }

    }
}

