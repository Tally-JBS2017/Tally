Meteor.publish('Statereginfo',function(){
  return Statereginfo.find();
})

Meteor.publish('profiles',function(){
  return Profiles.find();
})


Meteor.publish('election',function(){
  return Election.find();
})

Meteor.publish('regis_voice_info', function(){
  return Regis_voice_info.find();
})
