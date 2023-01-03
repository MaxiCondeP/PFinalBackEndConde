import { Message } from "../models/messageDTO.js";
import { Server as SocketServer } from "socket.io";
import { httpServer } from "../../server.js";
import{daoProducts, daoMessages} from '../../server.js'


const logUsr = "";

export const socketChat = async (user) => {

  const io = new SocketServer(httpServer);

  io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");
    ///getFakerProducts();

    try {
      socket.server.emit("RENDER_PRODUCTS", await daoProducts.getDTOProduct(), logUsr);
      let chat = await daoMessages.getDTOMessage();
      socket.server.emit("RENDER_CHAT", chat);

    } catch (err) {
      console.log(err);
    }

    socket.on("ADD_PRODUCT", async (product) => {
      await daoProducts.save(product);
      io.sockets.emit("RENDER_PRODUCTS", await daoProducts.getDTOProduct());
    });

    socket.on("ADD_MESSAGE", async (message) => {
      let role;
      if(user.isAdmin){
        role= "user";
      }else{
        role="system";
      }
      const newMessage = new Message(
        user.email,
        user.name,
        user.age,
        user.avatar,
        role,
        message.text);
      await daoMessages.save(newMessage);
      let chat = await daoMessages.getDTOMessage();
      socket.server.emit("RENDER_CHAT", chat);
    });

  });

}
