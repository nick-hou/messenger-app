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

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

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

export default socket;
