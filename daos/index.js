import dotenv from 'dotenv';
dotenv.config();

export let daoCart;
export let daoProd;
export let daoUsr;


switch (process.env.DATA_PERSISTENCE) {
    case 'FILE':
		const { default: fileCartDao } = await import('../daos/fileCartDao.js');
		const { default: fileProductDao } = await import('../daos/fileProductDao.js');

		daoCart = new fileCartDao();
		daoProd = new fileProductDao();
		break;
	case 'MONGO':
		const { default: mongoCartDao } = await import('../daos/mongoCartDao.js');
		const { default: mongoProductDao } = await import('../daos/mongoProductDao.js');
		const {default: mongoUsrDao}= await import('../daos/mongoUsrDao.js');

		daoCart = new mongoCartDao();
		daoProd = new mongoProductDao();
		daoUsr= new mongoUsrDao();
		break;
	case 'FIREBASE':
		const { default: firebaseCartDao } = await import('../daos/firebaseCartDao.js');
		const { default: firebaseProductDao } = await import('../daos/firebaseProductDao.js');
        

		daoCart = new firebaseCartDao();
		daoProd = new firebaseProductDao();
		break;
	default:
		const { default: memoryCartDao } = await import('../daos/memoryCartDao.js');
		const { default: memoryProductDao } = await import('../daos/memoryProductDao.js');

		daoCart = new memoryCartDao();
		daoProd = new memoryProductDao();
		break;
};


