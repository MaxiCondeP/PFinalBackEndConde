
import{OrderContainer} from '../containers/fileOrderContainer.js'

export default class fileOrderDao extends OrderContainer{
    constructor(){
        super("orders");
    }
}