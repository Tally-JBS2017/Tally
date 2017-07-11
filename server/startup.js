Meteor.startup(function(){
// code to run on server at startup
Assets.getText('register.json', function(err, data) {
  var content = EJSON.parse(data);
  for(state in content){
    console.log('inserting', state);
    Cities.insert(state);
  }
});
});
