const express = require('express');
const router = express.Router();

let Article=require('../models/article');
let User=require('../models/user');


//add form
router.get('/add', function(req, res){
  res.render('add_article',{
    title:'Add Article'
  });
});


// submit
router.post('/add', function(req,res){
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  let errors=req.validationErrors();

  if(errors){
    res.render('add_article',{
      title:'Add Article',
      errors:errors
    });
  } else{

  let article = new Article();
  article.title = req.body.title;
  article.author = req.user._id;
  article.body = req.body.body;

  article.save(function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success','Article Added');
      res.redirect('/');
    }
  });}

});

//edit form
router.get('/edit/:id', function(req, res){
 Article.findById(req.params.id, function(err, article){
   res.render('edit_article',{
     title:'Edit Article',
     article:article
   });
 });
});

//post update
router.post('/edit/:id', function(req,res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query ={_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success','Article Updated')
      res.redirect('/');
    }
  });

});

//delete
router.delete('/:id', function(req, res){
  let query = {_id:req.params.id}

  Article.deleteOne(query, function(err){
    if(err){
    console.log(err);
  }
  res.send('Success');
  });
});

//single article display
router.get('/:id', function(req, res){
 Article.findById(req.params.id, function(err, article){
   User.findById(article.author, function(err, user){
      res.render('article',{
       article: article,
       author: user.name
     });
   });
  });
});


module.exports = router;
