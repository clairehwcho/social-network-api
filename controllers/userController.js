const { User, Thought } = require('../models');

module.exports = {
    // Get all users
    getUsers (req, res) {
        User.find()
            .then((users) => {
                return res.json(users);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Get a single user by its _id and populated thought and friend data
    getSingleUser (req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('thoughts')
            .populate('friends')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with this id found' })
                    : res.json(user)
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Create a new user
    createUser (req, res) {
        User.create(req.body)
            .then((user) => {
                return res.json(user)
            })
            .catch((err) => {
                return res.status(500).json(err)
            });
    },
    // Update a user by its _id
    updateUser (req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with this id found' })
                    : res.json({
                        updatedUser: user,
                        message: 'User updated'
                    })
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Delete a user by its _id
    deleteUser (req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) => {
                if (!user) {
                    res.status(404).json({ message: 'No user with this id found' })
                }
                // Remove a user's associated thoughts when deleted
                Thought.deleteMany({ _id: { $in: user.thoughts } })
                return res.json({
                    deletedUser: user,
                    message: 'User and thoughts deleted'
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    // Add a new friend to a user's friend list
    addFriend (req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with this id found' })
                    : res.json({
                        updatedUser: user,
                        message: 'Friend added'
                    })
            )
            .catch((err) => {
                return res.status(500).json(err)
            });
    },
    // Remove a friend from a user's friend list
    removeFriend (req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with this id found' })
                    : res.json({
                        updatedUser: user,
                        message: 'Friend removed'
                    })
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
};