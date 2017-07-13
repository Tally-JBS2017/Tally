Meteor.methods({
  'profiles.insert'(profile){ //profile page setting up a new profile
    var current = Profiles.findOne({owner: Meteor.userId()});
    if(current != undefined){
      Profiles.remove(current);
    }
    Profiles.insert(profile);
  },
  'profiles.name.update'(new_name){//updating the name
    var current_profile = Profiles.findOne({owner: Meteor.userId()});
    Profiles.update(current_profile,{$set: {name: new_name}});
  },
  'profiles.address.update'(new_address){//updating the name
    var current_profile = Profiles.findOne({owner: Meteor.userId()});
    Profiles.update(current_profile,{$set: {address: new_address}});
  },
  'profiles.state.update'(new_state){//updating the name
    var current_profile = Profiles.findOne({owner: Meteor.userId()});
    Profiles.update(current_profile,{$set: {state: new_state}});
  },
  'profiles.zip.update'(new_zip){//updating the name
    var current_profile = Profiles.findOne({owner: Meteor.userId()});
    Profiles.update(current_profile,{$set: {zip: new_zip}});
  },
  'election.insert'(information){
    Election.insert(information);
  },

  'election.clear'(){
    Election.remove({});
  }
});
