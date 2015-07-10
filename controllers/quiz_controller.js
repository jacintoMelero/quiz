var models=require('../models/models.js');
//get quizes question

exports.load = function (req , res ,next,quizId){
	models.Quiz.find(quizId).then(function(quiz){
		if(quiz){
			req.quiz=quiz;
		}
		else{
			next(new Error('No existe quiz '+quizId));
		}
	}).catch(function(error){next(error)});
};
exports.index = function (req , res ){
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index.ejs',{quizes:quizes});
	});
};
exports.show = function (req , res ){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show',{quiz: quiz});
	});
};
//get quizes answer
exports.answer = function (req , res ){
  models.Quiz.find(req.params.quizId).then(function(quiz){
    if(req.query.respuesta === quiz[0].respuesta){
      res.render('quizes/answer',{quiz:req.quiz,respuesta:'Correcta'});
    }
    else{
      res.render('quizes/answer',{quiz:req.quiz,respuesta:'Incorrecta'});
    }
  });
};
