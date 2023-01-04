
let daoCarts;


export class daoFactory {
	constructor(dao) {
		this.dao = dao;
	}

	async getDao() {

		switch (this.dao) {
			case 'MONGO':
				const { default: mongoCartDao } = await import('../daos/mongoCartDao.js');
				return daoCarts = mongoCartDao.getContainer();
				break;
			case 'FIREBASE':
				const { default: firebaseCartDao } = await import('../daos/firebaseCartDao.js');
				return daoCarts = firebaseCartDao.getContainer();
				break;
			case 'MEMORY':
				const { default: memoryCartDao } = await import('../daos/memoryCartDao.js');
				return daoCarts = memoryCartDao.getContainer();
				break;
			default:
				const { default: fileCartDao } = await import('../daos/fileCartDao.js');
				return daoCarts = fileCartDao.getContainer('carts');
				break;
		}

	}
}



