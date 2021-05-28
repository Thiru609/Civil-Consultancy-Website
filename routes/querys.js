const express = require('express');
const router = express.Router();

let Query=require('../models/query');



//add form
router.get('/ask', function(req, res){
  res.render('query',{
    title:'Ask a query'
  });
});


// submit
router.post('/ask', function(req,res){
  req.checkBody('subject','Subject is required').notEmpty();
 req.checkBody('emailq','Email is required').notEmpty();
 req.checkBody('emailq','Enter Valid Email').isEmail();
  req.checkBody('qbody','Post a Query').notEmpty();

  let errors=req.validationErrors();

  if(errors){
    res.render('query',{
      title:'Ask a query',
      errors:errors
    });
  } else{

  let querys = new Query();
  querys.subject = req.body.subject;
  querys.emailq = req.body.emailq;
  querys.qbody = req.body.qbody;

  querys.save(function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success','Query Submitted');
      res.redirect('/');
    }
  });}

});

module.exports = router;
