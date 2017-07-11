Template.profile.helpers({
  current_profile() {return Profiles.find({owner: Meteor.userId()})},
})

Template.profile.events({
  'click #new' : function (e, instance) {//this activates when you press the reset button
    var to_be_inserted = {name:'Default', owner: Meteor.userId()};
    Meteor.call('profiles.insert', Meteor.userId(), to_be_inserted);
  },
  'click #name_add' : function (e, instance) {//this updates the name field
    const name = instance.$('#name').val();
    instance.$('#name').val("");
    Meteor.call('profiles.name.update', name)
  },
  'click #address_add' : function (e, instance) {//this updates the name field
    const address = instance.$('#address').val();
    instance.$('#address').val("");

    Meteor.call('profiles.address.update', Meteor.userId(), address)
  },
  'click #state_add' : function (event, instance){
    console.log('changing state');
    const state = instance.$('#state').val();
    Meteor.call('profiles.state.update',state)
    instance.$('#state').val("");

    Meteor.call('election.clear');
    var xmlhttp = new XMLHttpRequest();
    //setting up the date for today so the api knows what date to start from
    const d = new Date();
    const month = d.getMonth()+1;
    const year = d.getFullYear();
    const day = d.getDay()+1;
    const fullDate = month + " " + day + " " + year;
    const ElectionAPIkey = "aINkNgEHYqnSUX9TT7TEuSQus167GNvHRAdSjLpx";

    var url = "https://api.open.fec.gov/v1/election-dates/?min_election_date=" + fullDate + "&election_state=" + state + "&sort=election_date&page=1&api_key=aINkNgEHYqnSUX9TT7TEuSQus167GNvHRAdSjLpx&per_page=20"

    xmlhttp.onreadystatechange = function(){
      console.log('here');
      if(this.readyState == 4 && this.status == 200){
        var electionInfo = JSON.parse(this.responseText);
        //var theState = electionInfo.contest[1].district.name.toString();
        for(i=1; i<electionInfo.results.length; i++){
          var seat= electionInfo.results[i].election_notes.toString();
          var date= electionInfo.results[i].election_date.toString();
          var apistate= electionInfo.results[i].election_state.toString();
          var type= electionInfo.results[i].election_type_full.toString();

        var information = {seat,date,apistate,type}
        Meteor.call('election.insert',information);
        }
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  },
  'click #zip_add' : function (e, instance) {//this updates the name field
    const zip = instance.$('#zip').val();
    instance.$('#zip').val("");
    if(!isNaN(zip) & zip.length == 5){
        Meteor.call('profiles.zip.update', zip)
    }else{
      alert("This zip code is not a valid input. ")
    }
  },
})
