
let daoProducts;

export class daoFactory {
	constructor(dao) {
		this.dao = dao;
	}

	async getDao() {

		switch (this.dao) {
			case 'MONGO':
				const { default: mongoProductDao } = await import('../../daos/Product/mongoProductDao.js');
				return daoProducts = mongoProductDao.getContainer();
				break;
			case 'FIREBASE':
				const { default: firebaseProductDao } = await import('../../daos/Product/firebaseProductDao.js');
				return daoProducts = firebaseProductDao.getContainer();
				break;
			case 'MEMORY':
				const { default: memoryProductDao } = await import('../../daos/Product/memoryProductDao.js');
				return daoProducts = memoryProductDao.getContainer();
				break;
			default:
				const { default: fileProductDao } = await import('../../daos/Product/fileProductDao.js');
				return daoProducts = fileProductDao.getContainer('products');
				break;
		}

	}
}



