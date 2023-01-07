
let daoCarts;


export class daoFactory {
	constructor(dao) {
		this.dao = dao;
	}

	async getDao() {

		switch (this.dao) {
			case 'MONGO':
				const { default: mongoCartDao } = await import('../../daos/Cart/mongoCartDao.js');
				return daoCarts = mongoCartDao.getContainer();
				break;
			case 'FIREBASE':
				const { default: firebaseCartDao } = await import('../../daos/Cart/firebaseCartDao.js');
				return daoCarts = firebaseCartDao.getContainer();
				break;
			case 'MEMORY':
				const { default: memoryCartDao } = await import('../../daos/Cart/memoryCartDao.js');
				return daoCarts = memoryCartDao.getContainer();
				break;
			default:
				const { default: fileCartDao } = await import('../../daos/Cart/fileCartDao.js');
				return daoCarts = fileCartDao.getContainer('carts');
				break;
		}

	}
}



