import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  readSenderConversation,
  updateTyping
} from "./store/conversations";
var CryptoJS = require("crypto-js");

const createSocket = async () => {
  const token = await localStorage.getItem("messenger-token");
  const socket = io(window.location.origin, {query:{token}});

  socket.on("connect", () => {
      console.log("connected to server");
      socket.sendBuffer = [];

      socket.on("add-online-user", (id) => {
        store.dispatch(addOnlineUser(id));
      });

      socket.on("remove-offline-user", (id) => {
        store.dispatch(removeOfflineUser(id));
      });
      socket.on("new-message", (data) => {
        const bytes  = CryptoJS.AES.decrypt(data.message, 'secret key 123');
        const decryptedMessage = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        store.dispatch(setNewMessage(decryptedMessage, data.sender));
      });

      socket.on("read-convo", (body) => {
        store.dispatch(readSenderConversation(body))
      })

      socket.on("update-typing", (body) => {
        store.dispatch(updateTyping(body))
      })

  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error: ${err.message}`);
  });
  return socket;
}

const socket = createSocket();

export default socket;
