
import{OrderContainer} from '../../containers/Order/fileOrderContainer.js'

export default class fileOrderDao extends OrderContainer{
    constructor(){
        super("orders");
    }
}