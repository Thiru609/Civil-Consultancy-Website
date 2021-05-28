let mongoose = require('mongoose');

//article schema
let querySchema = mongoose.Schema({
  subject:{
    type: String,
    required: true
  },
  emailq:{
    type: String,
    required: true
  },
  qbody:{
    type: String,
    required: true
  }
});

let Query = module.exports=mongoose.model('query', querySchema);
