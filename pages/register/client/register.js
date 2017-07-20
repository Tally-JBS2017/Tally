import { ReactiveVar } from 'meteor/reactive-var';

Template.register.onCreated(function registerOnCreated() {
  Meteor.subscribe("Statereginfo");
  Meteor.subscribe("profiles");
  this.howtoreg= new ReactiveVar("");
  // console.log(Profiles.findOne({owner:Meteor.userId()}));
  this.recognition= new ReactiveVar("");
  this.voiceDict = new ReactiveDict();
  //set the status of the recording
  //inactive - user is not speaking or the recognition has ended
  //speaking - user is speaking
  //waiting - wait for the result from Google Speech API
  this.voiceDict.set("recording_status", "inactive");
  // Meteor.subscribe("Statereginfo");
  Meteor.subscribe("regis_voice_info");
})


Template.register.helpers({
  //this function's purpose is to allow the dynamic template to grab the right template name.
  page: function() {
    return Session.get("statepage");
    // return Template.instance().statepage;
  },

  regstyle: function() {
      return Template.instance().howtoreg.get();
      // return Template.instance().howtoreg;
    },

  // This fuction is what is used to populate the static-template with dynamic data.
  // For now it's using an array but we late we can pull the array from collections.
  pageData: function() {
    var page = Session.get("statepage")
    console.log(page+" is where we are getting data for");
    //When we get the collection and agree on a format we we swap out the manual data array for a collection grab
    var data = Statereginfo.findOne({abbr:page});
    console.log("Page data is pulled from "+data.toString());
    return {contentType:page, items:data};
  },

  ifInactive: function(){
    const voiceDict = Template.instance().voiceDict
    return voiceDict.get("recording_status") == "inactive";
  },

  ifSpeaking: function(){
    const voiceDict = Template.instance().voiceDict
    return voiceDict.get("recording_status") == "speaking";
  },

  profileloaded: function(){
    if((Profiles.findOne({owner:Meteor.userId()}) != null) && (Session.get("statepage") == undefined)){
      Session.set("statepage",Profiles.findOne({owner:Meteor.userId()}).state);
      Meteor.subscribe("Statereginfo",{abbr:Session.get("statepage")});
      // console.log("Statepage = "+this.statepage);
    }
    return true;
  }
})
Template.register.events({

  'click #regisInfo'(elt,instance){
    const zip =instance.$("#zipcode").val();
    getState(zip, returnState);
    //This is the code to grab the city and state from the users zipcode. Would love to store the info somehow.
    function getState(zip, callback){
      var state = ""
      var xmlhttp = new XMLHttpRequest();
      var url ='https://www.zipcodeapi.com/rest/js-blSPbA8GVwAcmTeVD6OiUmqwLP18G74SsWIDwRksnVEKOSFsYtLTPcpA2rJJyNB1/info.json/'+zip.toString()+'/degrees'
      xmlhttp.open("GET", url, true);
      xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              var locinfo = JSON.parse(this.responseText);
              var state = locinfo.state.toString();
              // var city = locinfo.city.toString();
              console.log("Zipcode is from this state: "+state);
              // console.log("Zipcode is from this city: "+city);
              callback(state);
          }
      };
      xmlhttp.send();
    }
    function returnState(data){
      // Meteor.subscribe("Statereginfo", reactvar);
      Session.set("statepage",data);
    }
    //this state variable is just so we don't spam the API
    // var state= "MA";
    // console.log(state);
    /*sets the current instance's statepage reactive variable to users state.
    This allows blaze to populate the dynamic template with the correct info */
    console.log("active variable: "+Session.get("statepage"));
  },

  'click #recordAudioButton'(elt,instance){
    var recognition = new webkitSpeechRecognition();
    var page = Session.get("statepage");
    // var voice_data = new SpeechSynthesisUtterance(Regis_voice_info.findOne({abbr:page}).online);
    var voice_data = Regis_voice_info.findOne({abbr:page}).online;
    console.log(voice_data);
     recognition.onresult = function(event){
       const text = event.results[0][0].transcript;
       Meteor.call("sendJSONtoAPI_ai", text, { returnStubValue: true }, function(err, result){
         if(err){
           window.alert(err);
           return;
         }
         console.log(result.data.result.metadata.intentName);
         if(result.data.result.metadata.intentName == "register_online"){
          //  window.speechSynthesis.speak(voice_data);
          responsiveVoice.speak(voice_data, "UK English Male");
         } else{
           console.log(result);
           console.log(result.data.result.metadata.intentName);
           //console.log(result.data.result.speech);
           var msg = new SpeechSynthesisUtterance(result.data.result.speech);
           window.speechSynthesis.speak(msg);
         }
       })
     };
     recognition.start();
     Template.instance().recognition = recognition;
     Template.instance().voiceDict.set("recording_status", "speaking");
  },

  'click #stopRecordAudioButton'(elt,instance){
    Template.instance().recognition.stop();
    Template.instance().voiceDict.set("recording_status", "inactive");
  },

  'click #online'(elt,instance){
    Template.instance().howtoreg.set("online");
  },
  'click #person'(elt,instance){
    Template.instance().howtoreg.set("person");
  },
  'click #mail'(elt,instance){
    Template.instance().howtoreg.set("mail");
  }


})
