Meteor.publish('Statereginfo',function(){
  return Statereginfo.find();
})
// Meteor.publish('Statereginfo',function(state){
//   return Statereginfo.find({abbr:state});
// })

Meteor.publish('profiles',function(){
  return Profiles.find();
})


Meteor.publish('election',function(){
  return Election.find();
})


Meteor.publish('politicians',function(){
  return Politicians.find();
})

Meteor.publish('bills',function(){
  return Bills.find();
})
