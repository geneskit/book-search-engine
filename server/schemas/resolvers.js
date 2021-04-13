// Define the query and mutation functionality to work with the Mongoose models.
const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select("-__v -password");
                return userData;
            }
            throw new AuthenticationError('Not logged in.');
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const t = signToken(user);
            return { t, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            const pw = await user.isCorrectPassword(password);
            if (!user) {
                throw new AuthenticationError('Unable to log in. Incorrect email.');
            }
            if (!pw) {
                throw new AuthenticationError('Unable to log in. Incorrect password.');
            }
        },
        saveBook: async (parent, { input }, {user}) => {
            if (user) {
                const updateU = await User.findByIdAndUpdate(
                    {
                        _id: user._id
                    },
                    {
                        $addToSet: { savedBooks: input }
                    },
                    {
                        new: true, 
                        runValidators: true
                    }
                )
                return updateU;
            }
            else {
                throw new AuthenticationError('Please log in!');
            }
        }
    },
}

module.export = resolvers;