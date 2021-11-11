import pkg from 'lodash';
const { find} = pkg;

const users = [
    { id: '1', firstName: 'Tom', lastName: 'Coleman' },
    { id: '2', firstName: 'Sashko', lastName: 'Stubailo' },
    { id: '3', firstName: 'Mikhail', lastName: 'Novikov' },
];

export default {
    getUsers: () => users,
    getUserById: (id) => find(users, { id: id })
}