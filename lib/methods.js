Meteor.methods({
  'profiles.insert'(user, profile){
    var current = Profiles.findOne({owner: user});
    if(current != undefined){
      Profiles.remove(current);
    }
    Profiles.insert(profile);
  },
  'profiles.name.update'(user, new_name){
    var current_profile = Profiles.findOne({owner: user});
    Profiles.update(current_profile,{$set: {name: new_name}});
  }
})
