const userinfoRouter = require('./userinfo');
const authRouter = require('./auth');
//const soupRouter = require('./soup');
const {docRouter,docsRouter,soupRouter,searchRouter} = require('./doc');
const router = require('express').Router();


router.use('/userinfo',userinfoRouter);
router.use('/auth',authRouter);
//router.use('/soup',soupRouter);
router.use('/doc',docRouter);
router.use('/docs',docsRouter);
router.use('/soup',soupRouter);
router.use('/search',searchRouter);

module.exports = router;
