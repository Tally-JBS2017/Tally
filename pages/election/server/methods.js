Meteor.methods({
  "getElectionInfo":
  function(address){
    const electionId = 2000; //this is used to look up a specific type of election
    const ElectionAPIkey = AIzaSyDYoZw_sdVIOmvB1yxnFvdBwNxf9hB7T1M;
    const url =  "https://www.googleapis.com/civicinfo/v2/voterinfo?key=" + ElectionAPIkey + "&address=" +address+"&electionId=" + electionId;
    //https://www.googleapis.com/civicinfo/v2/voterinfo?key=AIzaSyDYoZw_sdVIOmvB1yxnFvdBwNxf9hB7T1M&address=269%20South%20St.%20Waltham%20MA&electionId=2000
    console.log(url);
    const z = Meteor.http.call("get", url);
      return z.content;
  }

})
