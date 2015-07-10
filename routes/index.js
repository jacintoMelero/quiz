var express = require('express');
var router = express.Router();
var quizController =require('../controllers/quiz_controller.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});
router.get('/author', function(req, res) {
  res.render('author');
});
router.param('quizId',quizController.load);
router.get('/quizes',quizController.index);
//router.get('/quizes/:quizId(\\d+)',quizController.index);
router.get('/quizes/:quizId(\\d+)/answer',quizController.answer);

module.exports = router;
