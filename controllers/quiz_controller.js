//get quizes question
exports.question = function (req , res ){
  console.log('controller');
  res.render('quizes/question',{pregunta:'¿Capital de Italia?'});
};
//get quizes answer
exports.answer = function (req , res ){
  if(req.query === 'Roma'){
    res.render('quizes/answer',{respuesta:'Correcta'});
  }
  else{
    res.render('quizes/answer',{respuesta:'Incorrecta'});
  }
};
