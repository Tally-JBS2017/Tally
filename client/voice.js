Template.voice.onCreated(function voiceOnCreated(){
  this.voiceDict = new ReactiveDict();
  this.recognition_engine = new webkitSpeechRecognition();
  this.voiceDict.set("recording_status", "inactive");
  // Session.set("onlinePage", .findOne({owner:Meteor.userId()}).state);
  Meteor.subscribe("profiles", {owner:Meteor.userId()});
  if((Profiles.findOne({owner:Meteor.userId()}) != null) && (Session.get("statepage") == undefined)){
  Session.set("statepage", Profiles.findOne({owner:Meteor.userId()}).state);
  Meteor.subscribe("Statereginfo", {abbr:Session.get("statepage")});
  // console.log("Statepage = "+this.statepage);
}
Meteor.subscribe("regis_voice_info");
})

Template.voice.helpers({
  ifInactive: function(){
    const voiceDict = Template.instance().voiceDict
    return voiceDict.get("recording_status") == "inactive";
  },

  ifSpeaking: function(){
    const voiceDict = Template.instance().voiceDict
    return voiceDict.get("recording_status") == "speaking";
  },

  isProcessing: function(){
    return Template.instance().voiceDict.get("recording_status") === "processing";
  },

})

Template.voice.events({
  'click #recordAudioButton'(elt,instance){
    console.log(Session.get("statepage"));
    const voiceDict = Template.instance().voiceDict;
    var recognition_engine = Template.instance().recognition_engine;
    Template.instance().voiceDict.set("recording_status", "speaking");
    var page, voice_data;
    // if(Router.current().url.match("register")){
      page = Session.get("statepage");

      voice_data = Regis_voice_info.findOne({abbr:page}).online;
    // }
    console.log(voice_data);
    recognition_engine.continuous = true;
    recognition_engine.lang = 'en-US';
    recognition_engine.on
    recognition_engine.onend = function(){
      console.log("ended");
    }
    recognition_engine.onstart = function(){
      console.log("started");
    }
    recognition_engine.onresult = function(event) {
      const text = event.results[0][0].transcript;
      console.log(text);
      //set voiceDict = processing
      if(voiceDict.get("processing_status") === "processing") return;
      voiceDict.set("processing_status", "processing");
      Meteor.call("sendJSONtoAPI_ai", text, { returnStubValue: true }, function(err, result){
        if(err){
          window.alert(err);
          return;
        }
        console.log(result.data.result.metadata.intentName);
        if(result.data.result.metadata.intentName == "register_online" && Router.current().url.match("register")){
         responsiveVoice.speak(voice_data, "US English Male");
       } else if(result.data.result.metadata.intentName == "stop"){
         voiceDict.set("recording_status", "inactive");
         recognition_engine.stop();
         return;
       } else{
          console.log(result);
          console.log(result.data.result.metadata.intentName);
          responsiveVoice.speak(result.data.result.speech, "US English Male", {rate: 1.05});
         }
        recognition_engine.stop();
        setTimeout(function(){
          voiceDict.set("processing_status", "not_processing");
          recognition_engine.start();
        }, 2000)
      })
    };
    recognition_engine.start();
  },
  'click #stopRecordAudioButton'(elt,instance){
    var recognition_engine = Template.instance().recognition_engine;
    Template.instance().recognition_engine.stop();
    Template.instance().voiceDict.set("recording_status", "inactive");
  },
})
