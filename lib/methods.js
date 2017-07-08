Meteor.methods({
  'profiles.insert'(user, profile){ //profile page setting up a new profile
    var current = Profiles.findOne({owner: user});
    if(current != undefined){
      Profiles.remove(current);
    }
    Profiles.insert(profile);
  },
  'profiles.name.update'(user, new_name){//updating the name
    var current_profile = Profiles.findOne({owner: user});
    Profiles.update(current_profile,{$set: {name: new_name}});
  },

  'election.insert'(information){
    Election.insert(information);
  },

  'election.clear'(){
    Election.remove({});
  },
})
