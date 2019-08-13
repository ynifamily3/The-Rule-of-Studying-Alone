const docRouter = require('express').Router();
const docsRouter = require('express').Router();

docsRouter.get('/',(req,res)=>{
	res.json({test:"ss"});
});

docRouter.get('/',(req,res)=>{
	res.json({test:"test"});
});

docRouter.get('/:subject_name/:file_name',(req,res)=>{
});

docRouter.post('/:subject_name/:file_name',(req,res)=>{
});
module.exports = {docRouter,docsRouter};
