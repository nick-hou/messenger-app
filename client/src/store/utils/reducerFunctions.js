export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      typing: {user1: false, user2: false},
      latestMessageText: message.text,
    };
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      newState.push({ otherUser: user, messages: [] });
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      return {
        ...convo,
        id: message.conversationId,
        messages: [...convo.messages, message],
        latestMessageText: message.text,
        otherUserTyping: false,
      }
    }
    return convo;
  });
};

const readMessages = (convo, sender) => {
  return {
    ...convo,
    messages: convo.messages.map(msg => {
      if(msg.senderId === sender) {
        return {
          ...msg,
          isRead: true,
        };
      }
      return msg;
    })
  }
}

// Update reader's store
export const readConversationInStore = (state, {reader, sender}) => {
  return state.map((convo) => {
    if(convo.otherUser.id === sender) {
      return readMessages(convo, sender);
    }
    return convo;
  })
}

// Update sender's store
export const readSenderConversationInStore = (state, {reader, sender}) => {
  return state.map((convo) => {
    if(convo.otherUser.id === reader) {
      return readMessages(convo, sender);
    }
    return convo;
  })
}

export const updateTypingInStore = (state, {conversationId, isTyping}) => {
  return state.map((convo) => {
    if(convo.id === conversationId) {
      return {
        ...convo,
        otherUserTyping: isTyping,
      };
    }
    return convo;
  })
}
