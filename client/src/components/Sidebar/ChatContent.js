import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = (numUnread, otherUserTyping) => makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: numUnread ? theme.palette.important.main : theme.palette.secondary.main,
    fontWeight: numUnread ? theme.typography.button.fontWeight : "",
    fontStyle: otherUserTyping ? "italic" : "",
    letterSpacing: -0.17,
  },
  notification: {
    height: 20,
    minWidth: 20,
    padding: theme.spacing(0, 1),
    backgroundColor: "#3F92FF",
    marginRight: 10,
    color: "white",
    fontSize: 10,
    letterSpacing: -0.5,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    opacity: numUnread ? 1 : 0,
  }
}));

const ChatContent = (props) => {
  const { conversation } = props;
  const { latestMessageText, otherUser, otherUserTyping } = conversation;

  const numUnread = conversation.messages.filter(msg => {
    return (!msg.isRead && (msg.senderId===otherUser.id))
  }).length;

  const classes = useStyles(numUnread, otherUserTyping)();

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {otherUserTyping
            ? "Typing..."
            : latestMessageText
          }
        </Typography>
      </Box>
      <Box className={classes.notification}>
        {numUnread}
      </Box>
    </Box>
  );
};

export default ChatContent;
