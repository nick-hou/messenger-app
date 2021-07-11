import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  readSenderConversation,
  updateTyping
} from "./store/conversations";

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
    store.dispatch(setNewMessage(data.message, data.sender));
  });

  socket.on("read-convo", (data) => {
    store.dispatch(readSenderConversation(data.reader, data.sender))
  })

  socket.on("update-typing", (body) => {
    store.dispatch(updateTyping(body.conversationId, body.typing))
  })
});

export default socket;
