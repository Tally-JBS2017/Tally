Template.election.onCreated(function() {
  Meteor.subscribe('election');
  // this.state = new ReactiveDict();
  // this.state.setDefault({
  //   contest:[], //this will hold all the elections
  //   t:{},//this would hold each seperate election
  //
  // });
  //
  // console.log("creating the template");
  // console.dir(this.state);
});

Template.election.helpers({
/*
  contest: function(){
    const instance = Template.instance();
    return instance.state.get("contest");
  },
*/
  contest() {
    return Election.find()
  },
});

Template.election.events({
  "click .getElection": function(event,instance){
    Meteor.call('election.clear');
    var xmlhttp = new XMLHttpRequest();
    //setting up the date
    const d = new Date();
    const month = d.getMonth()+1;
    const year = d.getFullYear();
    const day = d.getDay()+1;
    const fullDate = month + " " + day + " " + year;
    //this is for the user inputs
    const state = $(".state").val();


    const ElectionAPIkey = "aINkNgEHYqnSUX9TT7TEuSQus167GNvHRAdSjLpx";

    var url = "https://api.open.fec.gov/v1/election-dates/?min_election_date=" + fullDate +"&election_state=" + state + "&sort=election_date&page=1&api_key=aINkNgEHYqnSUX9TT7TEuSQus167GNvHRAdSjLpx&per_page=20"

    xmlhttp.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        var electionInfo = JSON.parse(this.responseText);
        //var theState = electionInfo.contest[1].district.name.toString();
        for(i=1; i<electionInfo.results.length; i++){
          var seat= electionInfo.results[i].election_notes.toString();
          var date= electionInfo.results[i].election_date.toString();
          var apistate= electionInfo.results[i].election_state.toString();
          var type= electionInfo.results[i].election_type_full.toString();
          console.log(type);

        var information = {seat,date,apistate,type}
        Meteor.call('election.insert',information);
        }
      }
    };

  /* this was from the old google api.
    var url =  "https://www.googleapis.com/civicinfo/v2/voterinfo?key=" + ElectionAPIkey + "&address=" +address+"&electionId=" + electionId;
    xmlhttp.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        //https://www.googleapis.com/civicinfo/v2/voterinfo?key=AIzaSyDYoZw_sdVIOmvB1yxnFvdBwNxf9hB7T1M&address=269%20South%20St.%20Waltham%20MA&electionId=2000
        var electionInfo = JSON.parse(this.responseText);
        //var theState = electionInfo.contest[1].district.name.toString();
        console.log(electionInfo.contests.length);
        for(i=1; i<electionInfo.contests.length; i++){
          var type = electionInfo.contests[i].type.toString();
          var office = electionInfo.contests[i].office.toString();
        console.log(type);
        console.log(office);
        var information = {type:type, office:office}
        Meteor.call('election.insert',information);
        }
      }
    };
    */
    xmlhttp.open("GET", url, false);//i set it to false so it has to wait for a reply
    xmlhttp.send();
    if( Election.find().count() == 0){ //this tells the user if their are elections in their state.
      document.getElementById("ifnothing").innerHTML = "Sorry, their are no elections at this state";
    }
  },
})
