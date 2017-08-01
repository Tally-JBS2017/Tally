import { ReactiveVar } from 'meteor/reactive-var';

Template.register.onCreated(function registerOnCreated() {
  Meteor.subscribe("profiles", {owner:Meteor.userId()});
  this.howtoreg= new ReactiveVar("");
  // console.log(Profiles.findOne({owner:Meteor.userId()}));
//   if((Profiles.findOne({owner:Meteor.userId()}) == null) && (Session.get("statepage") == undefined)){
//     Session.set("statepage", Profiles.findOne({owner:Meteor.userId()}).state);
//     Meteor.subscribe("Statereginfo", {abbr:Session.get("statepage")});
//   console.log("Statepage = "+this.statepage);
// }
  //this.recognition= new ReactiveVar("");
  // this.voiceDict = new ReactiveDict();
  // this.recognition_engine = new webkitSpeechRecognition();
  // //set the status of the recording
  // //inactive - user is not speaking or the recognition has ended
  // //speaking - user is speaking
  // //waiting - wait for the result from Google Speech API
  // this.voiceDict.set("recording_status", "inactive");
  Meteor.subscribe("regis_voice_info");
})


Template.register.helpers({
  //this function's purpose is to allow the dynamic template to grab the right template name.
  page: function() {
    return Session.get("statepage");
  },

  regstyle: function() {
      return Template.instance().howtoreg.get();
    },

  // This fuction is what is used to populate the static-template with dynamic data.
  // For now it's using an array but we late we can pull the array from collections.
  pageData: function() {
    var page = Session.get("statepage")
    console.log(page+" is where we are getting data for");
    //When we get the collection and agree on a format we we swap out the manual data array for a collection grab

    var data = Statereginfo.findOne({abbr:page});
    if(!data) return;
    console.log("Page data is pulled from "+ data.toString());
    return {contentType:page, items:data};
  },

  // ifInactive: function(){
  //   const voiceDict = Template.instance().voiceDict
  //   return voiceDict.get("recording_status") == "inactive";
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

  profileloaded: function(){
    if((Profiles.findOne({owner:Meteor.userId()}) != null) && (Session.get("statepage") == undefined)){
      Session.set("statepage",Profiles.findOne({owner:Meteor.userId()}).state);
      console.log("The statepage session variable is: "+ Session.get("statepage"));
      Meteor.subscribe("Statereginfo",{abbr:Session.get("statepage")});
      console.log("Statepage = "+this.statepage);
    } else if(Session.get("statepage") != undefined){
      Meteor.subscribe("Statereginfo",{abbr:Session.get("statepage")});
    }
    return true;
  }
})
Template.register.events({
  'click #regisInfo'(elt,instance){
    const zip =instance.$("#zipcode").val();
    const dropstate =instance.$("#state").val();
    if(dropstate ==""){
      getState(zip, returnState);
    }else{
      returnState(dropstate);
    }
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
    Session.set("statepage",data);
    }
    console.log("active variable: "+Session.get("statepage"));
  },
  // 'click #recordAudioButton'(elt,instance){
  //   const voiceDict = Template.instance().voiceDict;
  //   var recognition_engine = Template.instance().recognition_engine;
  //   Template.instance().voiceDict.set("recording_status", "speaking");
  //   var page = Session.get("statepage");
  //   // var voice_data = new SpeechSynthesisUtterance(Regis_voice_info.findOne({abbr:page}).online);
  //   var voice_data = Regis_voice_info.findOne({abbr:page}).online;
  //   console.log(voice_data);
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
  //       if(result.data.result.metadata.intentName == "register_online"){
  //        //  window.speechSynthesis.speak(voice_data);
  //        responsiveVoice.speak(voice_data, "US English Male");
  //        //if text=="stop"
  //      } else if(result.data.result.metadata.intentName == "stop"){
  //        voiceDict.set("recording_status", "inactive");
  //        recognition_engine.stop();
  //        return;
  //      } else{
  //         console.log(result);
  //         console.log(result.data.result.metadata.intentName);
  //         // console.log(result.data.result.speech);
  //         // var msg = new SpeechSynthesisUtterance(result.data.result.speech);
  //         // window.speechSynthesis.speak(msg);
  //         responsiveVoice.speak(result.data.result.speech, "US English Male", {rate: 1.05});
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
  // },
  'click #online'(elt,instance){
    Template.instance().howtoreg.set("online");
  },
  'click #person'(elt,instance){
    Template.instance().howtoreg.set("person");
  },
  'click #mail'(elt,instance){
    Template.instance().howtoreg.set("mail");
  },


})

Template.registerHelper('sessionget', function (sessionvar) {
  return Session.get(sessionvar);
});

Template.registerHelper('stateDropdownmenu', function(){
  return '<select class="form-control" id = "state"><option value = ""> -- select an option -- </option> <option value="AL">Alabama</option> <option value="AK">Alaska</option><option value="AZ">Arizona</option><option value="AR">Arkansas</option><option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DE">Delaware</option><option value="FL">Florida</option><option value="GA">Georgia</option><option value="HI">Hawaii</option><option value="ID">Idaho</option><option value="IL">Illinois</option> <option value="IN">Indiana</option><option value="IA">Iowa</option><option value="KS">Kansas</option><option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="ME">Maine</option><option value="MD">Maryland</option><option value="MA">Massachusetts</option><option value="MI">Michigan</option> <option value="MN">Minnesota</option><option value="MS">Mississippi</option><option value="MO">Missouri</option><option value="MT">Montana</option><option value="NE">Nebraska</option><option value="NV">Nevada</option><option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NY">New York</option><option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option><option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option><option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TX">Texas</option><option value="UT">Utah</option><option value="VT">Vermont</option><option value="VA">Virginia</option><option value="WA">Washington</option><option value="WV">West Virginia</option><option value="WI">Wisconsin</option><option value="WY">Wyoming</option></select>';
})
