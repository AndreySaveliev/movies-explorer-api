const router = require('express').Router();
const { getMe, changeUserInfo } = require('../controllers/user');

router.get('/me', getMe);
router.patch('/me', changeUserInfo);

module.exports = router;
