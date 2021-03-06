var models=require('../models/models.js');
//get quizes question

exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
    where: {id: Number(quizId)},
    include: [{model: models.Comment}]
  }).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        console.log(quiz.Comments);
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
	console.log("index");
	console.log(req.query.search);
  var search;
	if(req.query.search!=undefined){
		search=req.query.search.replace(' ','%');
		search='%'+search+'%';
    //console.log("busqueda: "+search);
	}
	else{
    console.log("else");
		search='%';
	}
  models.Quiz.findAll({where:["pregunta like ?",search]}).then(
    function(quizes) {
      res.render('quizes/index', { quizes: quizes,errors:[]});
    }
  ).catch(function(error) { next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz,errors:[]});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado,errors:[]});
};

exports.new = function(req,res){
  var quiz=models.Quiz.build({
    pregunta:"pregunta",respuesta:"respuesta",tema: "tema"
  });
  res.render('quizes/new',{quiz:quiz,errors:[]});
};

exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  var errors = quiz.validate();//ya qe el objeto errors no tiene then(
  if (errors){
    var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
    for (var prop in errors) errores[i++]={message: errors[prop]};
    res.render('quizes/new', {quiz: quiz, errors: errores});
  }
  else {
    quiz // save: guarda en DB campos pregunta y respuesta de quiz
    .save({fields: ["pregunta", "respuesta","tema"]})
    .then( function(){ res.redirect('/quizes')}) ;
  }
};
exports.edit = function(req,res){
    var quiz=req.quiz;
    res.render('quizes/edit',{quiz: quiz, errors:[]});
};
exports.update = function(req,res){
  console.log(req.quiz.pregunta);
  //var quiz = req.body.quiz;
  req.quiz.pregunta=req.body.quiz.pregunta;
  req.quiz.respuesta=req.body.quiz.respuesta;
  req.quiz.tema=req.body.quiz.tema;

  var errors = req.quiz.validate();
  if(errors){
    res.render('quizes/edit',{quiz: quiz, errors: errors});
  }
  else{
    req.quiz
      .save(
        {fields: ["pregunta","respuesta","tema"]}
      )
      .then(
        function(){
          res.redirect('/quizes');
        }
      );
  }
};
exports.destroy = function(req,res){
  req.quiz.destroy().then(function (){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};
