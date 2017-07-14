Meteor.publish('Statereginfo',function(){
  return Statereginfo.find();
})

Meteor.publish('profiles',function(){
  return profiles.find();
})


Meteor.publish('election',function(){
  return election.find();
})
