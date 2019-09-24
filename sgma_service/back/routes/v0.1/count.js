const countRouter = require('express').Router()
const subjectinfo = require('../../models/subject');
const userinfo = require('../../models/userinfo');
const fileinfo = require('../../models/file');

countRouter.get('/',(req,res,next)=>{
	console.log("get counter");
	var userCnt;
	var subjectCnt;
	var fileCnt;

	userinfo.countDocuments({})
		.then((cnt)=>{
			//console.log("userCnt",userCnt);
			//res.json({test:"test"})
					userCnt=cnt;
			subjectinfo.countDocuments({})
				.then((cnt)=>{
					subjectCnt=cnt;
					
					fileinfo.countDocuments({})
						.then((cnt)=>{
							fileCnt=cnt;
							res.json({
								subjectCnt:subjectCnt,
								userCnt:userCnt,
								fileCnt:fileCnt
							})
						})
						
					//res.json({subjectCnt,userCnt})

				})
		})
})

module.exports = countRouter;
