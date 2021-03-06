import {
  addNewConvoToStore,
  addOnlineUserToStore,
  updateTypingInStore,
  addSearchedUsersToStore,
  removeOfflineUserFromStore,
  addMessageToStore,
  readConversationInStore,
  readSenderConversationInStore,
} from "./utils/reducerFunctions";

// ACTIONS

const READ_CONVERSATION = "READ_CONVERSATION";
const READ_SENDER_CONVERSATION = "READ_SENDER_CONVERSATION";
const UPDATE_TYPING = "UPDATE_TYPING";
const GET_CONVERSATIONS = "GET_CONVERSATIONS";
const SET_MESSAGE = "SET_MESSAGE";
const ADD_ONLINE_USER = "ADD_ONLINE_USER";
const REMOVE_OFFLINE_USER = "REMOVE_OFFLINE_USER";
const SET_SEARCHED_USERS = "SET_SEARCHED_USERS";
const CLEAR_SEARCHED_USERS = "CLEAR_SEARCHED_USERS";
const ADD_CONVERSATION = "ADD_CONVERSATION";

// ACTION CREATORS

// Update reader's conversation
export const readConversation = (reader, sender) => {
  return {
    type: READ_CONVERSATION,
    payload: {reader, sender}
  }
}

// Update sender's conversation
export const readSenderConversation = (body) => {
  return {
    type: READ_SENDER_CONVERSATION,
    body,
  }
}

export const updateTyping = (body) => {
  return {
    type: UPDATE_TYPING,
    body,
  }
}

export const gotConversations = (conversations) => {
  return {
    type: GET_CONVERSATIONS,
    conversations,
  };
};

export const setNewMessage = (message, sender) => {
  return {
    type: SET_MESSAGE,
    payload: { message, sender: sender || null },
  };
};

export const addOnlineUser = (id) => {
  return {
    type: ADD_ONLINE_USER,
    id,
  };
};

export const removeOfflineUser = (id) => {
  return {
    type: REMOVE_OFFLINE_USER,
    id,
  };
};

export const setSearchedUsers = (users) => {
  return {
    type: SET_SEARCHED_USERS,
    users,
  };
};

export const clearSearchedUsers = () => {
  return {
    type: CLEAR_SEARCHED_USERS,
  };
};

// add new conversation when sending a new message
export const addConversation = (recipientId, newMessage) => {
  return {
    type: ADD_CONVERSATION,
    payload: { recipientId, newMessage },
  };
};

// REDUCER

const reducer = (state = [], action) => {
  switch (action.type) {
    case READ_CONVERSATION:
      return readConversationInStore(state, action.payload);
    case READ_SENDER_CONVERSATION:
      return readSenderConversationInStore(state, action.body);
    case UPDATE_TYPING:
      return updateTypingInStore(state, action.body);
    case GET_CONVERSATIONS:
      return action.conversations;
    case SET_MESSAGE:
      return addMessageToStore(state, action.payload);
    case ADD_ONLINE_USER: {
      return addOnlineUserToStore(state, action.id);
    }
    case REMOVE_OFFLINE_USER: {
      return removeOfflineUserFromStore(state, action.id);
    }
    case SET_SEARCHED_USERS:
      return addSearchedUsersToStore(state, action.users);
    case CLEAR_SEARCHED_USERS:
      return state.filter((convo) => convo.id);
    case ADD_CONVERSATION:
      return addNewConvoToStore(
        state,
        action.payload.recipientId,
        action.payload.newMessage
      );
    default:
      return state;
  }
};

export default reducer;
