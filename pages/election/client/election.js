Template.election.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    contest:[], //this will hold all the elections
    t:{},//this would hold each seperate election

  });

  console.log("creating the template");
  console.dir(this.state);
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
    const streetNumber = $(".streetNumber").val();//this is for the street and number
    const city = $(".city").val();
    const state = $(".state").val();
    const zipCode = $(".zipCode").val();
    const address = streetNumber + " " + city + " " + state

    const ElectionAPIkey = "aINkNgEHYqnSUX9TT7TEuSQus167GNvHRAdSjLpx";

    var url = "https://api.open.fec.gov/v1/election-dates/?min_election_date=" + fullDate + "&sort=election_date&page=1&api_key=aINkNgEHYqnSUX9TT7TEuSQus167GNvHRAdSjLpx&per_page=20"

    xmlhttp.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        var electionInfo = JSON.parse(this.responseText);
        //var theState = electionInfo.contest[1].district.name.toString();
        for(i=1; i<electionInfo.results.length; i++){
          var seat= electionInfo.results[i].election_notes.toString();
          var date= electionInfo.results[i].election_date.toString();
          var state= electionInfo.results[i].election_state.toString();



        var information = {seat,date,state}
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
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

  },
})
