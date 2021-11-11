import pkg from 'lodash';
const { find, filter, includes } = pkg;
import userRepo from '../repos/userRepo.js';

const options = [
    { id: 1, text: 'REST' },
    { id: 2, text: 'Graphql' },
    { id: 3, text: 'Vue' },
    { id: 4, text: 'React' },
    { id: 5, text: 'Blue' },
    { id: 6, text: 'Purple' },
    { id: 7, text: 'Orange' },
]

const votes = [
    { userId: 1, optionId: 1, pollId: 1 },
    { userId: 1, optionId: 4, pollId: 2 }
]

const polls = [
    { id: 1, authorId: 1, title: 'Rest or GraphQL' },
    { id: 2, authorId: 2, title: 'SPA?' },
    { id: 3, authorId: 2, title: 'Best Color?' },
];

const pollOptions = [
    { pollId: 1, optionId: 1 },
    { pollId: 1, optionId: 2 },
    { pollId: 2, optionId: 3 },
    { pollId: 2, optionId: 4 },
    { pollId: 3, optionId: 5 },
    { pollId: 3, optionId: 6 },
    { pollId: 3, optionId: 7 }
]

const resolvers = {
    Query: {
        currentUser: (parent, args, context) => context.getUser(),
        polls: () => polls,
    },

    Mutation: {
        logout: (parent, args, context) => context.logout(),
        vote: (_, { pollId, optionId, userId }) => {
            const option = find(options, { id: optionId });
            if (!option) {
                throw new Error(`Couldn't find option with id ${optionId}`);
            }
            const user = userRepo.getUserById(userId);
            if (!user) {
                throw new Error(`Couldn't find user with id ${userId}`)
            }
            const poll = find(polls, { id: pollId });
            if (!poll) {
                throw new Error(`Couldn't find poll with id ${pollId}`)
            }
            option.voters.push(user);
            return poll;
        },
    },

    Option: {
        voters: option => {
            let optionVotes = filter(votes, { optionId: option.id })
            let validVoters = optionVotes.map((i) => i.userId)
            let result = userRepo.getUsers().filter(user => validVoters.includes(user.id))
            return result
        },
    },

    Poll: {
        options: poll => {
            let optionsOfPoll = filter(pollOptions, { pollId: poll.id })
            let validOptions = optionsOfPoll.map((i) => i.optionId)
            let result = options.filter(option => validOptions.includes(option.id))
            return result
        },
    },
};

export default resolvers