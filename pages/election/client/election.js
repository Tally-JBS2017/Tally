Template.election.onCreated(function() {
  Meteor.subscribe('election');
  Meteor.subscribe("profiles", {owner:Meteor.userId()});
  // this.voiceDict = new ReactiveDict();
  // this.recognition_engine = new webkitSpeechRecognition();
  // this.voiceDict.set("recording_status", "inactive");
  if(Profiles.findOne({owner:Meteor.userId()}) != null){
    if((Profiles.findOne({owner:Meteor.userId()}).address != null) && (Profiles.findOne({owner:Meteor.userId()}).city != null) && (Profiles.findOne({owner:Meteor.userId()}).state != null) && (Profiles.findOne({owner:Meteor.userId()}).zip != null)){
      findpollinglocation(Profiles.findOne({owner:Meteor.userId()}).address,Profiles.findOne({owner:Meteor.userId()}).city,Profiles.findOne({owner:Meteor.userId()}).state,Profiles.findOne({owner:Meteor.userId()}).zip);
    }
  }
});

Template.election.helpers({
  contest: function() {
    return Election.find({userId:Meteor.userId()})
  },

  // ifInactive: function(){
  // const voiceDict = Template.instance().voiceDict
  // return voiceDict.get("recording_status") == "inactive";
  // },
  //
  // ifSpeaking: function(){
  //   const voiceDict = Template.instance().voiceDict
  //   return voiceDict.get("recording_status") == "speaking";
  // },
  //
  // isProcessing: function(){
  //   return Template.instance().voiceDict.get("recording_status") === "processing";
  // },

});

Template.election.events({
  "click .getElection": function clicked(event,instance){
    Meteor.call('election.clear',Meteor.userId());
    var xmlhttp = new XMLHttpRequest();
    //setting up the date
    const d = new Date();
    const month = d.getMonth()+1;
    const year = d.getFullYear();
    const day = d.getDay()+1;
    const fullDate = month + " " + day + " " + year;
    //this is for the user inputs
    const initialState = $("#state").val();
    var state = initialState.toUpperCase();
    switch(state){
      case "ALABAMA":
        state = "AL";
        break;
      case "ALASKA":
        state = "AK";
        break;
      case "ARIZONA":
        state = "AZ";
        break;
      case "ARKANSAS":
        state = "AR";
        break;
      case "CALIFORNIA":
        state = "CA";
        break;
      case "COLORADO":
        state = "CO";
        break;
      case "CONNECTICUT":
        state = "CT";
        break;
      case "DELAWARE":
        state = "DE";
        break;
      case "FLORIDA":
        state = "FL";
        break;
      case "GEORGIA":
        state = "GA";
        break;
      case "HAWAII":
        state = "HI";
        break;
      case "IDAHO":
        state = "ID";
        break;
      case "ILLINOIS":
        state = "IL";
        break;
      case "INDIANA":
        state = "IN";
        break;
      case "IOWA":
        state = "IA";
        break;
      case "KANSAS":
        state = "KS";
        break;
      case "KENTUCKY":
        state = "KY";
        break;
      case "LOUISIANA":
        state = "LA";
        break;
      case "MAINE":
        state = "ME";
        break;
      case "MARYLAND":
        state = "MD";
        break;
      case "MASSACHUSETTS":
        state = "MA";
        break;
      case "MICHIGAN":
        state = "MI";
        break;
      case "MINNESOTA":
        state = "MN";
        break;
      case "MISSISSIPPI":
        state = "MS";
        break;
      case "MISSOURI":
        state = "MO";
        break;
      case "MONTANA":
        state = "MT";
        break;
      case "NEBRASKA":
        state = "NE";
        break;
      case "NEVADA":
        state = "NV";
        break;
      case "NEW HAMPSHIRE":
        state = "NH";
        break;
      case "NEW JERSEY":
        state = "NJ";
        break;
      case "NEW MEXICO":
        state = "NM";
        break;
      case "NEW YORK":
        state = "NY";
        break;
      case "NORTH CAROLINA":
        state = "NC";
        break;
      case "NORTH DAKOTA":
        state = "ND";
        break;
      case "OHIO":
        state = "OH";
        break;
      case "OKLAHOMA":
        state = "OK";
        break;
      case "OREGON":
        state = "OR";
        break;
      case "PENNSYLVANIA":
        state = "PA";
        break;
      case "RHODE ISLAND":
        state = "RI";
        break;
      case "SOUTH CAROLINA":
        state = "SC";
        break;
      case "SOUTH DAKOTA":
        state = "SD";
        break;
      case "TENNESSEE":
        state = "TN";
        break;
      case "TEXAS":
        state = "TX";
        break;
      case "UTAH":
        state = "UT";
        break;
      case "VERMONT":
        state = "VT";
        break;
      case "VIRGINIA":
        state = "VA";
        break;
      case "WASHINGTON":
        state = "WA";
        break;
      case "WEST VIRGINIA":
        state = "WV";
        break;
      case "WISCONSIN":
        state = "WI";
        break;
      case "WYOMING":
        state = "WY";
    }

    const ElectionAPIkey = "aINkNgEHYqnSUX9TT7TEuSQus167GNvHRAdSjLpx";

    var url = "https://api.open.fec.gov/v1/election-dates/?min_election_date=" + fullDate +"&election_state=" + state + "&sort=election_date&page=1&api_key=aINkNgEHYqnSUX9TT7TEuSQus167GNvHRAdSjLpx&per_page=20"
    //this gets the election information
    xmlhttp.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        var electionInfo = JSON.parse(this.responseText);
        //var theState = electionInfo.contest[1].district.name.toString();
        for(i=0; i<electionInfo.results.length; i++){
          var seat= electionInfo.results[i].election_notes.toString();
          var date= electionInfo.results[i].election_date.toString();
          var apistate= electionInfo.results[i].election_state.toString();
          var type= electionInfo.results[i].election_type_full.toString();
          var userId = Meteor.userId();
          console.log(type);

        var information = {seat,date,apistate,type,userId}
        Meteor.call('election.insert',information);
        }

      }
    };
    xmlhttp.open("GET", url, true);//i set it to false so it has to wait for a reply
    //xmlhttp.timeout = 2000;
    xmlhttp.send();

    setTimeout(nothing,1000);
    function nothing(){
      if( Election.find({userId:Meteor.userId()}).count() == 0){ //this tells the user if their are elections in their state.
        document.getElementById("ifnothing").innerHTML = "Sorry, their are no elections at this state";
      }else{
        document.getElementById("ifnothing").innerHTML = " ";
      }
    }



    const zip =instance.$("#zipcode").val();
    const dropstate =instance.$("#state").val();
    const address =instance.$("#address").val();
    const city =instance.$("#city").val();
    findpollinglocation(address,city,dropstate,zip);
  },
  // 'click #recordAudioButton'(elt,instance){
  //   const voiceDict = Template.instance().voiceDict;
  //   var recognition_engine = Template.instance().recognition_engine;
  //   Template.instance().voiceDict.set("recording_status", "speaking");
  //   // var voice_data = new SpeechSynthesisUtterance(Regis_voice_info.findOne({abbr:page}).online);
  //   // var interim_result, final_result, stop_word;
  //   // stop_word="stop";
  //   recognition_engine.continuous = true;
  //   recognition_engine.lang = 'en-US';
  //   recognition_engine.on
  //   recognition_engine.onend = function(){
  //     console.log("ended");
  //   }
  //   recognition_engine.onstart = function(){
  //     console.log("started");
  //   }
  //   recognition_engine.onresult = function(event) {
  //     const text = event.results[0][0].transcript;
  //     console.log(text);
  //     //set voiceDict = processing
  //     if(voiceDict.get("processing_status") === "processing") return;
  //     voiceDict.set("processing_status", "processing");
  //     Meteor.call("sendJSONtoAPI_ai", text, { returnStubValue: true }, function(err, result){
  //       if(err){
  //         window.alert(err);
  //         return;
  //       }
  //       console.log(result.data.result.metadata.intentName);
  //       if(result.data.result.metadata.intentName == "stop"){
  //         voiceDict.set("recording_status", "inactive");
  //         recognition_engine.stop();
  //         return;
  //      } else{
  //         console.log(result);
  //         console.log(result.data.result.metadata.intentName);
  //         responsiveVoice.speak(result.data.result.speech, "UK English Male");
  //        }
  //       recognition_engine.stop();
  //       setTimeout(function(){
  //         voiceDict.set("processing_status", "not_processing");
  //         recognition_engine.start();
  //       }, 2000)
  //     })
  //   };
  //   recognition_engine.start();
  // },
  // 'click #stopRecordAudioButton'(elt,instance){
  //   var recognition_engine = Template.instance().recognition_engine;
  //   Template.instance().recognition_engine.stop();
  //   Template.instance().voiceDict.set("recording_status", "inactive");
  // }
})

function findpollinglocation(address,city,dropstate,zip){
  load(address,city,dropstate,zip);

  function load(address,city,dropstate,zip) {
    gapi.client.setApiKey('AIzaSyDYoZw_sdVIOmvB1yxnFvdBwNxf9hB7T1M');
    lookup(address+' '+city+' '+dropstate+' '+zip, renderResults);
  };

  function lookup(address, callback) {
   var electionId = 2000;
   var req = gapi.client.request({
       'path' : '/civicinfo/v2/voterinfo',
       'params' : {'electionId' : electionId, 'address' : address}
   });
  req.execute(callback);
  };

  function renderResults(response, rawResponse) {
   if (!response || response.error) {
     return;
   }
   var normalizedAddress = response.normalizedInput.line1 + ' ' + response.normalizedInput.city + ', ' + response.normalizedInput.state + ' ' + response.normalizedInput.zip;
   if(response.pollingLocations == null){
     var pollingreturn = 'Could not find polling place for ' + normalizedAddress
   }else if (response.pollingLocations.length > 0) {
     var pollingLocation = response.pollingLocations[0].address;
     var pollingAddress = pollingLocation.locationName + ', ' + pollingLocation.line1 + ' ' + pollingLocation.city + ', ' + pollingLocation.state + ' ' + pollingLocation.zip;
     var pollingreturn='<p> '+pollingAddress+ ' </p>';
   }else{
     var pollingreturn = 'Could not find polling place for ' + normalizedAddress
   }
     Session.set("pollingloc", pollingreturn);
  };
};

function findrepbyaddress(address, city, dropstate, zip, includeOffices, levels, roles){
  load(address, city, dropstate, zip, includeOffices, levels, roles);

  function load(address, city, dropstate, zip, includeOffices, levels, roles) {
    gapi.client.setApiKey('AIzaSyDYoZw_sdVIOmvB1yxnFvdBwNxf9hB7T1M');
    lookup(address+' '+city+' '+dropstate+' '+zip, includeOffices, levels, roles, renderResults);
  };

  // Address: String, includeOfficees:Boolean, Levels:String, Roles:String
  function lookup(address, includeOffices, levels, roles, callback) {
   var req = gapi.client.request({
       'path' : '/civicinfo/v2/representatives',
       'params' : {'includeOffices' : includeOffices, 'address' : address, 'levels' : levels, 'roles' : roles }
   });
  req.execute(callback);
  };

  function renderResults(response, rawResponse) {
   if (!response || response.error) {
     return;
   }
   var normalizedAddress = response.normalizedInput.line1 + ' ' + response.normalizedInput.city + ', ' + response.normalizedInput.state + ' ' + response.normalizedInput.zip;
   if(response.pollingLocations == null){
     var pollingreturn = 'Could not find polling place for ' + normalizedAddress
   }else if (response.pollingLocations.length > 0) {
     var pollingLocation = response.pollingLocations[0].address;
     var pollingAddress = pollingLocation.locationName + ', ' + pollingLocation.line1 + ' ' + pollingLocation.city + ', ' + pollingLocation.state + ' ' + pollingLocation.zip;
     var pollingreturn='<p> '+pollingAddress+ ' </p>';
   }else{
     var pollingreturn = 'Could not find polling place for ' + normalizedAddress
   }
     Session.set("myrepinfo", pollingreturn);
  };
};
