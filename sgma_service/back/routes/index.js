const userinfoRouter = require('./userinfo');
const authRouter = require('./auth');
const router = require('express').Router();

router.use('/userinfo',userinfoRouter);
router.use('/auth',authRouter);

module.exports = router;
