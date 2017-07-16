Meteor.startup(function(){
// code to run on server at startup
  //The following code populates Statereginfo with all the info we collected.
  function htmlStates(callback){
    Statereginfo.remove({});
    var fs = Npm.require('fs');
    fs.readFile('../../../../../server/register.json', 'utf8', Meteor.bindEnvironment(function (err, data) {
      //if (err) throw err;
      stateData = JSON.parse(data);
      // console.log(stateData);
      for(i = 0; i< stateData.states.length;i++){
        console.log('inserting '+ stateData.states[i].abbr+" into Statereginfo");
        // console.log('inserting '+ stateData.states[i].abbr);
        Statereginfo.insert(stateData.states[i]);
        // console.log("inserted: "+Statereginfo.findOne({stateName:stateData.states[i].stateName}).stateName);
      }
      // console.log(Statereginfo.findOne({stateName:"Alaska"}).stateName);
      callback();
    }))};
  function nonhtmlStates(){
    // This code adds the json file with no html tags about how to vote for each state to a collection.
    Regis_voice_info.remove({});
    var fs = Npm.require('fs');
    fs.readFile('../../../../../server/register_voice.json', 'utf8', Meteor.bindEnvironment(function (err, data){
      registerVoiceData = JSON.parse(data);
      for(i = 0; i< registerVoiceData.states.length; i++){
        console.log('inserting '+ registerVoiceData.states[i].abbr+" into Regis_voice_info");

        Regis_voice_info.insert(registerVoiceData.states[i]);
      }
    }))};
    htmlStates(nonhtmlStates);
});
