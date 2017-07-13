<<<<<<< HEAD
Meteor.startup(function(){

});
=======
Meteor.startup(function(){
// code to run on server at startup
  //The following code populates Statereginfo with all the info we collected.
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
>>>>>>> 491e0cebe0c6cc24f8f2a8775864d7435c262785
