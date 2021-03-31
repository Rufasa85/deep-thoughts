const { User, Thought } = require("../models");

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
            const params =  { id };
            return Thought.findOne(params).sort({ createdAt: -1 });
        },
        users: async () => {
            return User.find().populate("friends").populate("thoughts");
        },
        user: async (parent, { username }) => {
            const params = username ? { username } : {};
            console.log(username);
            console.log(await User.findOne(params).populate("friends").populate("thoughts"))
            return  User.findOne(params).populate("friends").populate("thoughts");
        }
    }
};

module.exports = resolvers;