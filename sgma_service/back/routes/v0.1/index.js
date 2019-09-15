const userinfoRouter = require('./userinfo');
const authRouter = require('./auth');
//const soupRouter = require('./soup');
const {docRouter,docsRouter} = require('./doc');
const router = require('express').Router();


router.use('/userinfo',userinfoRouter);
router.use('/auth',authRouter);
//router.use('/soup',soupRouter);
router.use('/doc',docRouter);
router.use('/docs',docsRouter);

module.exports = router;
