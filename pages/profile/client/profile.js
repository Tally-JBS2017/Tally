Template.profile.onCreated(function(){
  Meteor.subscribe('profiles', {owner:Meteor.userId()});
  this.updateProfile= new ReactiveDict();
  this.updateProfile.set("update_status", "off");
});
Template.profile.helpers({
  current_profile: function(){
    return Profiles.find({owner: Meteor.userId()})
  },
  ifUpdateOff: function(){
    const updateProfile = Template.instance().updateProfile;
    return updateProfile.get("update_status") == "off";
  },
  ifUpdateOn: function(){
    const updateProfile = Template.instance().updateProfile;
    return updateProfile.get("update_status") == "on";
  },
  userCheck: function(){
    if(typeof Profiles.findOne({owner:Meteor.userId()}) == 'undefined' || typeof Profiles.findOne({owner:Meteor.userId(),address:{$ne:""},zip:{$ne:""}, state:{$ne:""}}) == "undefined"){
      return false;
    }
    return true;
  },
  nameCheck: function(){
    if(typeof Profiles.findOne({owner:Meteor.userId(),name:{"$exists":true}}) == 'undefined' || typeof Profiles.findOne({owner:Meteor.userId(),name:{$ne:""}}) == "undefined"){
      return false;
    }
    return true;
  },
  addressCheck: function(){
    if(typeof Profiles.findOne({owner:Meteor.userId(),address:{"$exists":true}}) == 'undefined' || typeof Profiles.findOne({owner:Meteor.userId(),address:{$ne:""}}) == "undefined"){
      return false;
    }
    return true;
  },
   ageCheck: function(){
     if(typeof Profiles.findOne({owner:Meteor.userId(),age:{"$exists":true}}) == 'undefined' || typeof Profiles.findOne({owner:Meteor.userId(),age:{$ne:""}}) == "undefined"){
       return false;
     }
     return true;
  },
  cityCheck: function(){
    if(typeof Profiles.findOne({owner:Meteor.userId(),city:{"$exists":true}}) == 'undefined' || typeof Profiles.findOne({owner:Meteor.userId(),city:{$ne:""}}) == "undefined"){
      return false;
    }
    return true;
  },
  zipCheck: function(){
    if(typeof Profiles.findOne({owner:Meteor.userId(),zip:{"$exists":true}}) == 'undefined' || typeof Profiles.findOne({owner:Meteor.userId(),zip:{$ne:""}}) == "undefined"){
      return false;
    }
    return true;
  },
  stateCheck: function(){
    if(typeof Profiles.findOne({owner:Meteor.userId(),state:{"$exists":true}}) == 'undefined' || typeof Profiles.findOne({owner:Meteor.userId(),state:{$ne:""}}) == "undefined"){
      return false;
    }
    return true;
  },
})

Template.profile.events({
   'click #submit_all' : function (e, instance) {//this created a profile the first time and then updates every field
    check(update);
    function check(callback){//we use a callback function to make sure that the profile is added before it is updated.
      if(Profiles.findOne({owner:Meteor.userId()}) == null){
        var to_be_inserted = {name:'', owner: Meteor.userId(), address:'', state:'', zip:'', city:'', age:''};
        Meteor.call('profiles.insert', to_be_inserted);
      }
      if(instance.$('#name').val() == "" && typeof Profiles.findOne({owner:Meteor.userId(),name:{$ne:""}}) == "undefined"){
        alert("Please provide an input for all fields.");
        return
      }
      else if(instance.$('#age').val() == "" && typeof Profiles.findOne({owner:Meteor.userId(),age:{$ne:""}}) == "undefined"){
        alert("Please provide an input for all fields.");
        return
      }
      else if(instance.$('#state').val() == "" && typeof Profiles.findOne({owner:Meteor.userId(),state:{$ne:""}}) == "undefined"){
        alert("Please provide an input for all fields.");
        return
      }
      else if(instance.$('#address').val() == "" && typeof Profiles.findOne({owner:Meteor.userId(),address:{$ne:""}}) == "undefined"){
        alert("Please provide an input for all fields.");
        return
      }
      else if(instance.$('#city').val() == "" && typeof Profiles.findOne({owner:Meteor.userId(),city:{$ne:""}}) == "undefined"){
        alert("Please provide an input for all fields.");
        return
      }
      else if(instance.$('#zip').val() == "" && typeof Profiles.findOne({owner:Meteor.userId(),zip:{$ne:""}}) == "undefined"){
        alert("Please provide an input for all fields.");
        return
      }
      else if((isNaN(instance.$('#zip').val()) || instance.$('#zip').val().length != 5) && instance.$('#zip').val() != ''|| (isNaN(instance.$('#age').val()) && instance.$('#age').val() != '')){
        alert("You have an invalid input.");
        return
      }
      Template.instance().updateProfile.set("update_status", "off");
      callback();
    }
    function update(){//this is where everything is updated
      if(!(instance.$('#name').val() == "")){//if the field is not empty
        const name = instance.$('#name').val();//save the value and call the meteor update function
        Meteor.call('profiles.name.update', name)
        instance.$('#name').val("");//reset the input area
      }
      if(!(instance.$('#city').val() == "")){//if the field is not empty
        const city = instance.$('#city').val();//save the value and call the meteor update function
        Meteor.call('profiles.city.update', city)
        instance.$('#city').val("");//reset the input area
      }
      if(!(instance.$('#age').val() == "")){
        const age = instance.$('#age').val();
        instance.$('#age').val("");
        Meteor.call('profiles.age.update', age)
      }
      if(!(instance.$('#address').val() == "")){
        const address = instance.$('#address').val();
        Meteor.call('profiles.address.update', address)
        instance.$('#address').val("");
      }
      if(!(instance.$('#state').val() == "")){
        const state = instance.$('#state').val();

        Meteor.call('profiles.state.update', state)
        instance.$('#state').val("");
        Meteor.call('election.clear', Meteor.userId()); //Steven's Code
        var xmlhttp = new XMLHttpRequest();
        //setting up the date for today so the api on the elections page knows what date to start from
        const d = new Date();
        const month = d.getMonth()+1;
        const year = d.getFullYear();
        const day = d.getDay()+1;
        const fullDate = month + " " + day + " " + year;
        const ElectionAPIkey = "aINkNgEHYqnSUX9TT7TEuSQus167GNvHRAdSjLpx";

        var url = "https://api.open.fec.gov/v1/election-dates/?min_election_date=" + fullDate + "&election_state=" + state + "&sort=election_date&page=1&api_key=aINkNgEHYqnSUX9TT7TEuSQus167GNvHRAdSjLpx&per_page=20"

        xmlhttp.onreadystatechange = function(){
          if(this.readyState == 4 && this.status == 200){
            var electionInfo = JSON.parse(this.responseText);
            console.log("this is the electionInfo: " + electionInfo);
            //var theState = electionInfo.contest[1].district.name.toString();
            for(i=1; i<electionInfo.results.length; i++){
              var seat= electionInfo.results[i].election_notes.toString();
              var date= electionInfo.results[i].election_date.toString();
              var apistate= electionInfo.results[i].election_state.toString();
              var type= electionInfo.results[i].election_type_full.toString();
              var userId = Meteor.userId();
              var information = {seat,date,apistate,type,userId}
              Meteor.call('election.insert',information);
            }
          }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
      }
      if(!(instance.$('#zip').val() == "")){
        const zip = instance.$('#zip').val();
        instance.$('#zip').val("");
        Meteor.call('profiles.zip.update', zip)
      }

    }
  },

  'click #update' : function (e, instance) {//this created a profile the first time and then updates every field
    Template.instance().updateProfile.set("update_status", "on");
  },

})

Template.registerHelper('getyoutubevideo', function () {
  Meteor.subscribe('profiles', {owner:Meteor.userId()});
  Meteor.subscribe("Statereginfo", {abbr:Profiles.findOne({owner:Meteor.userId()}).state});
  return Statereginfo.findOne({abbr:Profiles.findOne({owner:Meteor.userId()}).state}).youtube.toString();
});
