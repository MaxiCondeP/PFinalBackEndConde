
let daoUsr;

export class daoFactory {
	constructor(dao) {
		this.dao = dao;
	}

	async getDao() {

		switch (this.dao) {
			case 'MONGO':
				const { default: mongoUsrDao } = await import('../daos/mongoUsrDao.js');
				return daoUsr = mongoUsrDao.getContainer();
				break;
			case 'FIREBASE':
				const { default: firebaseUsrDao } = await import('../daos/firebaseUsrDao.js');
				return daoUsr = firebaseUsrDao.getContainer();
				break;
			case 'MEMORY':
				const { default: memoryUsrDao } = await import('../daos/memoryUsrDao.js');
				return daoUsr = memoryUsrDao.getContainer();
				break;
			default:
				const { default: fileUsrDao } = await import('../daos/fileUsrDao.js');
				return daoUsr = fileUsrDao.getContainer('Usr');
				break;
		}

	}
}


