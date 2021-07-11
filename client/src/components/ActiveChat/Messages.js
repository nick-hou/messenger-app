import React, {useEffect} from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { readMessages } from "../../store/utils/thunkCreators";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  // Find last message read by other user. returns undefined if none have been read
  const lastMessageRead = messages
    .filter(msg => (msg.senderId===userId && msg.readStatus))
    .pop();

  // Make post request to read messages every time <messages> is loaded
  useEffect(() => {
    console.log("useeffect")
    const reqBody = {
      userId,
      otherUserId: otherUser.id
    };
    readMessages(reqBody);
  }, [messages, otherUser, userId])

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
    </Box>
  );
};

export default Messages;
