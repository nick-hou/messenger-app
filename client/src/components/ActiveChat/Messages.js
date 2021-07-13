import React, {useEffect, useState} from "react";
import { useDispatch } from 'react-redux'
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { readMessages } from "../../store/utils/thunkCreators";

const Messages = (props) => {
  const dispatch = useDispatch();

  const { messages, otherUser, userId } = props;

  const [lastMessageRead, setLastMessageRead] = useState({})

  useEffect(() => {
    setLastMessageRead(messages
        .filter(msg => (msg.senderId===userId && msg.isRead))
        .pop())
  }, [messages, userId])

  useEffect(() => {
    dispatch(readMessages({
      reader: userId,
      sender: otherUser.id,
    }));
  }, [messages.length, otherUser, userId, dispatch])

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUserPic={otherUser.photoUrl}
            isLastRead={lastMessageRead ? message.id===lastMessageRead.id : false}
          />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
      {props.otherUserTyping &&
        <OtherUserBubble text={'...'} otherUser={otherUser} />
      }
    </Box>
  );
};

export default Messages;
