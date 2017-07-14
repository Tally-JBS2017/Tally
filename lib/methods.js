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
  'profiles.age.update'(new_age){//updating the name
    var current_profile = Profiles.findOne({owner: Meteor.userId()});
    Profiles.update(current_profile,{$set: {age: new_age}});
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
  },

  'election.count'(){
    Election.find().count();
  },

  "sendJSONtoAPI_ai": function(text){
      //validation for the option
      return HTTP.call("POST", "https://api.api.ai/v1/query/",
          {
              headers: {
                  "Authorization": "Bearer" + "70d122e9ce4b472eaacadadacec74086", //API.ai token here (from API.ai account)
                  "Content-Type": "application/json; charset=utf-8"
              },
              data: {
                "query": text,
                "lang": "en",
                "sessionId": "1234567890"
          }
      })
  },
});
