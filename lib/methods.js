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
  'profiles.address.update'(user, new_address){//updating the name
    var current_profile = Profiles.findOne({owner: user});
    Profiles.update(current_profile,{$set: {address: new_address}});
  },
  'profiles.state.update'(user, new_state){//updating the name
    var current_profile = Profiles.findOne({owner: user});
    Profiles.update(current_profile,{$set: {state: new_state}});
  },
  'profiles.zip.update'(user, new_zip){//updating the name
    var current_profile = Profiles.findOne({owner: user});
    Profiles.update(current_profile,{$set: {zip: new_zip}});
  },
  'election.insert'(information){
    Election.insert(information);
  },

  'election.clear'(){
    Election.remove({});
  },
})
