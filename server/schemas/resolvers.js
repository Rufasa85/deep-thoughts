const { User, Thought,Reaction } = require("../models");
const { AuthenticationError } = require("apollo-server-express")
const { signToken} = require('../utils/auth');

const resolvers = {
    Query: {
        helloWorld: () => {
            return 'Hello world!';
        },
        turtle: () => {
            return "I like turtles."
        },
        thoughts: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Thought.find(params).sort({ createdAt: -1 });
        },
        thought: async (parent, { id }) => {
            const params = { id };
            return Thought.findOne(params).sort({ createdAt: -1 });
        },
        users: async () => {
            return User.find().populate("friends").populate("thoughts");
        },
        user: async (parent, { username }) => {
            const params = username ? { username } : {};
            console.log(username);
            console.log(await User.findOne(params).populate("friends").populate("thoughts"))
            return User.findOne(params).populate("friends").populate("thoughts");
        },
        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('thoughts')
                .populate('friends');
          
              return userData;
            }
          
            throw new AuthenticationError('Not logged in');
          }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args)
            const token = signToken(user);
            return {token,user}
        },
        addThought: async (parent, args, context) => {
            if (context.user) {
              const thought = await Thought.create({ ...args, username: context.user.username });
          
              await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $push: { thoughts: thought._id } },
                { new: true }
              );
          
              return thought;
            }
          
            throw new AuthenticationError('You need to be logged in!');
          },
          addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            if (context.user) {
              const updatedThought = await Thought.findOneAndUpdate(
                { _id: thoughtId },
                { $push: { reactions: { reactionBody, username: context.user.username } } },
                { new: true, runValidators: true }
              );
          
              return updatedThought;
            }
          
            throw new AuthenticationError('You need to be logged in!');
          },
          addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                {  $addToSet: { friends: friendId }  },
                { new: true}
              ).populate("friends");
          
              return updatedUser;
            }
          
            throw new AuthenticationError('You need to be logged in!');
          },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return {token,user}
        },
    }
};

module.exports = resolvers;