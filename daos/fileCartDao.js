
import{CartContainer} from '../controllers/fileCartController.js'

export default class fileProductDao extends CartContainer{
    constructor(){
        super("carts");
    }
}