const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

const convoCache = {}; //userId: {lastFetch, data}
const convoMiddleware = async (req, res, next) => {
  if(!req.user) next();
  const userId = req.user.id;
  const user = await User.findByPk(userId);
  if(convoCache[userId]?.lastFetch > user.lastUpdate) {
    convoCache[userId].lastFetch = new Date();
    res.json(convoCache[userId].data);
  }
  convoCache[userId] = {lastFetch: new Date(), data: []};
  return next();
}

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", convoMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],

      // Sort messages within each conversation
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "ASC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length - 1].text;

      //set a for typing status of other participant, default false
      convoJSON.otherUserTyping = false;

      conversations[i] = convoJSON;
    }

    //Sort conversations by most recent message timestamp
    conversations.sort((a, b) => (b.messages[b.messages.length-1].createdAt - a.messages[a.messages.length-1].createdAt));

    convoCache[userId].data = conversations;
    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.put("/readMessages", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const senderId = req.user.id;
    const { reader, sender } = req.body;

    const conversation = await Conversation.findConversation(reader, sender)
    const receivedMessages = await Message.findAll({where:{conversationId:conversation.id}});

    receivedMessages.forEach(msg => {
      if(msg.senderId === sender) {
        msg.isRead = true;
        msg.save();
      }
    })

    User.refreshLastUpdate(reader);
    User.refreshLastUpdate(sender);

    // Front end doesn't need any data
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
