const router = require('express').Router();
const {
    getUsers,
    getSingleUser,
    createUser,
    deleteUser,
    addReaction,
    removeReaction,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUser).delete(deleteUser);

// /api/users/:userId/assignments
router.route('/:userId/assignments').post(addReaction);

// /api/users/:userId/assignments/:assignmentId
router.route('/:userId/assignments/:assignmentId').delete(removeReaction);

module.exports = router;
