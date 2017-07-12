Meteor.startup(function(){
// code to run on server at startup

  // var content = JSON.parse(Assets.getText('register.json'));
  // for(state in content){
  //   console.log('inserting', state);
  //   Statereginfo.insert(state);
  // }

  Statereginfo.remove({});
  var fs = Npm.require('fs');
  fs.readFile('../../../../../server/register.json', 'utf8', Meteor.bindEnvironment(function (err, data) {
    //if (err) throw err;
    stateData = JSON.parse(data);
    // console.log(stateData);
    for(i = 0; i< stateData.states.length;i++){
      console.log('inserting '+ stateData.states[i].abbr);
      Statereginfo.insert(stateData.states[i]);
    }
    console.log(Statereginfo.findOne().stateName);
  }));
});
