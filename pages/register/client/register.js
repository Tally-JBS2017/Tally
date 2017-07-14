import { ReactiveVar } from 'meteor/reactive-var';

Template.register.onCreated(function registerOnCreated() {
  Meteor.subscribe("Statereginfo");
  Meteor.subscribe("profiles");
  this.statepage= new ReactiveVar("");
  this.howtoreg= new ReactiveVar("");
  // console.log(Profiles.findOne({owner:Meteor.userId()}));
  if(Profiles.findOne({owner:Meteor.userId()}) != null){
    this.statepage = Profiles.findOne({owner:Meteor.userId()}).state;
    // console.log("Statepage = "+this.statepage);
  }
  this.recognition= new ReactiveVar("");
  this.voiceDict = new ReactiveDict();
  //set the status of the recording
  //inactive - user is not speaking or the recognition has ended
  //speaking - user is speaking
  //waiting - wait for the result from Google Speech API
  this.voiceDict.set("recording_status", "inactive");
})

Template.register.helpers({
  //this function's purpose is to allow the dynamic template to grab the right template name.
    page: function() {
      return Template.instance().statepage.get();
    },

    regstyle: function() {
        return Template.instance().howtoreg.get();
      },
  // This fuction is what is used to populate the static-template with dynamic data.
  // For now it's using an array but we late we can pull the array from collections.
  pageData: function() {
    // var page = Template.instance().statepage.get();
    var page = Template.instance().statepage;
    //When we get the collection and agree on a format we we swap out the manual data array for a collection grab
    var data = Statereginfo.findOne({abbr:page});
    console.log(data);
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
})

Template.register.events({

  'click #regisInfo'(elt,instance){
    const zip =instance.$("#zipcode").val();
    getState(zip, Template.instance().statepage, returnState);
    //This is the code to grab the city and state from the users zipcode. Would love to store the info somehow.
    function getState(zip, reactvar, callback){
      var state = ""
      var xmlhttp = new XMLHttpRequest();
      var url ='https://www.zipcodeapi.com/rest/js-blSPbA8GVwAcmTeVD6OiUmqwLP18G74SsWIDwRksnVEKOSFsYtLTPcpA2rJJyNB1/info.json/'+zip.toString()+'/degrees'
      xmlhttp.open("GET", url, true);
      xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              var locinfo = JSON.parse(this.responseText);
              var state = locinfo.state.toString();
              var city = locinfo.city.toString();
              //console.log(state);
              //console.log(city);
              callback(reactvar, state);
          }
      };
      xmlhttp.send();
    }
    function returnState(reactvar, data){
      reactvar.set(data);
    }

    //this state variable is just so we don't spam the API
    // var state= "MA";
    // console.log(state);
    /*sets the current instance's statepage reactive variable to users state.
    This allows blaze to populate the dynamic template with the correct info */
    console.log("active variable:"+Template.instance().statepage.get());
  },
  'click #recordAudioButton'(elt,instance){
    var recognition = new webkitSpeechRecognition();
     recognition.onresult = function(event){
       const text = event.results[0][0].transcript;
       Meteor.call("sendJSONtoAPI_ai", text, { returnStubValue: true }, function(err, result){
         if(err){
           window.alert(err);
           return;
         }
         console.log(result);
         console.log(result.data.result.metadata.intentName);
         //console.log(result.data.result.speech);
         var msg = new SpeechSynthesisUtterance(result.data.result.speech);
         window.speechSynthesis.speak(msg);
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
