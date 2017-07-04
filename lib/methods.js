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
  },
  "getElectionInfo":
  function(address){
    const electionId = 2000; //this is used to look up a specific type of election
    const ElectionAPIkey = AIzaSyDYoZw_sdVIOmvB1yxnFvdBwNxf9hB7T1M;
    const url =  "https://www.googleapis.com/civicinfo/v2/voterinfo?key=" + ElectionAPIkey + "&address=" +address+"&electionId=" + electionId;
    //https://www.googleapis.com/civicinfo/v2/voterinfo?key=AIzaSyDYoZw_sdVIOmvB1yxnFvdBwNxf9hB7T1M&address=269%20South%20St.%20Waltham%20MA&electionId=2000
    console.log(url);
    const z = Meteor.http.call("get", url);
      return z.content;
  },
})
