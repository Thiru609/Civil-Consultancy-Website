const express = require('express');
const multer = require('multer');
const router = express.Router();

let Application=require('../models/application');


const storage1 = multer.diskStorage({
  destination: '../public/apps',
  filename: function(req, file, cb){
    cb(null,path.basename(file.originalname) + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload1 = multer({
  storage:storage1,
  limits:{fileSize:1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('resume');

  //checking type OF FILE
function checkFileType(file, cb){
const filetypes = /pdf|doc|docx/;
const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
const mimetype = filetypes.test(file.mimetype);

if(mimetype && extname){
  return cb(null,true);
}  else{
  cb('err : PDF and Word Documents Only');
}
}

router.get('/apply',function(req, res){
res.render('job');
});

router.post('/apply', function(req,res){
  req.checkBody('profession','profession is required').notEmpty();
  req.checkBody('skill1','field is required').notEmpty();
  req.checkBody('skill2','field is required').notEmpty();
  req.checkBody('skill3','field is required').notEmpty();
  req.checkBody('skill4','field is required').notEmpty();


  let errors=req.validationErrors();

  if(errors){
    res.render('job',{
      title:'Fill the Form',
      errors:errors
    });
  } else{

  let job = new Application();
  job.profession = req.body.profession;
  job.skill1 = req.body.skill1;
  job.skill2 = req.body.skill2;
  job.skill3 = req.body.skill3;
  job.skill4 = req.body.skill4;
  job.link1 = req.body.link1;
  job.link2 = req.body.link2;


  job.save(function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success','Application Submitted');
      res.render('upload');
    }
  });}

});


module.exports = router;
