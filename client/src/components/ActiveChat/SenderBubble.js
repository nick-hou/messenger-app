import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";

const useStyles = (isLastRead) => makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  date: {
    fontSize: 11,
    color: "#BECCE2",
    fontWeight: "bold",
    marginBottom: 5
  },
  text: {
    fontSize: 14,
    color: "#91A3C0",
    letterSpacing: -0.2,
    padding: 8,
    fontWeight: "bold"
  },
  bubble: {
    background: "#F4F6FA",
    borderRadius: "10px 10px 0 10px"
  },
  readIcon: {
    height: '16px',
    width: '16px',
    borderRadius: '8px',
    opacity: isLastRead ? 1 : 0,
  }
}));

const SenderBubble = (props) => {
  const classes = useStyles(props.isLastRead)();
  const { time, text } = props;
  return (
    <Box className={classes.root}>
      <Typography className={classes.date}>{time}</Typography>
      <Box className={classes.bubble}>
        <Typography className={classes.text}>{text}</Typography>
      </Box>
      <img
        src={props.otherUserPic}
        className={classes.readIcon}
        alt="contact icon"
      />
    </Box>
  );
};

export default SenderBubble;
