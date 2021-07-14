import React, { Component } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postMessage, updateTyping } from "../../store/utils/thunkCreators";

const styles = {
  root: {
    justifySelf: "flex-end",
    marginTop: 15,
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20,
  },
};

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      isTyping: false,
    };
  }

  handleChange = (event) => {
    this.setState({
      text: event.target.value,
      isTyping: (event.target.value ? true : false)
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if(this.state.isTyping !== prevState.isTyping) {
      this.props.updateTyping({
        conversationId: this.props.conversationId,
        isTyping: this.state.isTyping,
      });
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const text = event.target.text.value;
    if(text) {
      const {otherUser, conversationId, user} = this.props;

      await this.props.postMessage({
        text,
        receipientId: otherUser.id,
        conversationId,
        sender: conversationId ? null : user,
      });

      this.setState({text: "", isTyping: false})
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <form className={classes.root} onSubmit={this.handleSubmit}>
        <FormControl fullWidth hiddenLabel>
          <FilledInput
            classes={{ root: classes.input }}
            disableUnderline
            placeholder="Type something..."
            value={this.state.text}
            name="text"
            onChange={this.handleChange}
          />
        </FormControl>
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversations: state.conversations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    postMessage: (message) => {
      dispatch(postMessage(message));
    },
    updateTyping: ({conversationId, isTyping}) => {
      dispatch(updateTyping({conversationId, isTyping}))
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Input));
