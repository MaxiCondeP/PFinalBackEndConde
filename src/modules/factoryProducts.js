
let daoProducts;

export class daoFactory {
	constructor(dao) {
		this.dao = dao;
	}

	async getDao() {

		switch (this.dao) {
			case 'MONGO':
				const { default: mongoProductDao } = await import('../daos/mongoProductDao.js');
				return daoProducts = mongoProductDao.getContainer();
				break;
			case 'FIREBASE':
				const { default: firebaseProductDao } = await import('../daos/firebaseProductDao.js');
				return daoProducts = firebaseProductDao.getContainer();
				break;
			case 'MEMORY':
				const { default: memoryProductDao } = await import('../daos/memoryProductDao.js');
				return daoProducts = memoryProductDao.getContainer();
				break;
			default:
				const { default: fileProductDao } = await import('../daos/fileProductDao.js');
				return daoProducts = fileProductDao.getContainer('products');
				break;
		}

	}
}



