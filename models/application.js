const mongoose =  require('mongoose');

//user schema
const AppSchema =  mongoose.Schema({
  profession:{
    type: String,
    required: true
  },
  skill1:{
  type: String,
    required: true
  },
  skill2:{
    type: String,
    required: true
  },
  skill3:{
    type: String,
    required: true
  },
  skill4:{
  type: String,
    required: true
  },
  link1:{
    type: String,
    required: false
  },
  link2:{
    type: String,
    required: false
  },
  resume: {
    data: Buffer,
    contentType: String
  }
});

const App = module.exports = mongoose.model('App', AppSchema);
