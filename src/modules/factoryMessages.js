
let daoMessages;

export class daoFactory {
	constructor(dao) {
		this.dao = dao;
	}

	async getDao() {

		switch (this.dao) {
			case 'MONGO':
				const { default: mongoMessageDao } = await import('../daos/mongoMessageDao.js');
				return daoMessages = mongoMessageDao.getContainer();
				break;
			case 'FIREBASE':
				const { default: firebaseMessageDao } = await import('../daos/firebaseMessageDao.js');
				return daoMessages = firebaseMessageDao.getContainer();
				break;
			case 'MEMORY':
				const { default: memoryMessageDao } = await import('../daos/memoryMessageDao.js');
				return daoMessages = memoryMessageDao.getContainer();
				break;
			default:
				const { default: fileMessageDao } = await import('../daos/fileMessageDao.js');
				return daoMessages = fileMessageDao.getContainer('messages');
				break;
		}

	}
}



