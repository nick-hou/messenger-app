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
      typing: false,
    };
  }

  handleChange = (event) => {
    this.setState({
      text: event.target.value,
      typing: (event.target.value ? true : false)
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if(this.state.typing !== prevState.typing) {
      this.props.updateTyping({
        conversationId: this.props.conversationId,
        typing: this.state.typing,
      });
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    // add sender user info if posting to a brand new convo
    const reqBody = {
      text: event.target.text.value,
      recipientId: this.props.otherUser.id,
      conversationId: this.props.conversationId,
      sender: this.props.conversationId ? null : this.props.user,
    };
    if(reqBody.text) {
      await this.props.postMessage(reqBody);
      this.setState({
        text: "",
        typing: false,
      });
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
    updateTyping: (body) => {
      dispatch(updateTyping(body))
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Input));
