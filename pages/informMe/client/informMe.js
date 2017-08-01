Template.informMe.onCreated(function(){
  Meteor.subscribe('politicians');
  Meteor.subscribe('bills');
  Meteor.subscribe('poliinfo');
  Meteor.call('politicians.clear');
  Meteor.call('bills.clear');
  Meteor.call('poliinfo.clear');
  this.voiceDict = new ReactiveDict();
  this.recognition_engine = new webkitSpeechRecognition();
  this.voiceDict.set("recording_status", "inactive");
})

Template.informMe.helpers({
  informed: function(){
    return Politicians.find();
  },
  cosponsor: function(){
    return Bills.find();
  },
  additionalInfo: function(){
    return PoliInfo.find();
  },
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

Template.informMe.events({
  "click .searchbar": function(event,instance){
    Meteor.call('poliinfo.clear')
    Meteor.call('politicians.clear');
    Meteor.call('bills.clear');
    const input = $(".search").val();
    const state = instance.$('#state').val();
    const position = instance.$('#position').val();
    var xmlhttp = new XMLHttpRequest();

    Meteor.call('informMeGeneral',state, position, function(err, result){
      if(err){
        window.alert(err);
        return;
      }
      console.log("hello");
      console.log(result);

      for(i=0; i<result.data.results.length; i++){
        name = result.data.results[i].name.toString(); //this gets name of politician
        console.log(name);
        //if(input.toUpperCase()==name.toUpperCase()){
        id = result.data.results[i].id.toString(); //this is getting the politican id
        var src = 'https://theunitedstates.io/images/congress/225x275/' + id + '.jpg';//we are getting pictures from this github page
        //var img = document.createElement('img');
        //.src = src;
        //div.appendChild(img);
        var role = result.data.results[i].role.toString();

        var party = result.data.results[i].party.toString();

        var nextElection = result.data.results[i].next_election.toString();

        var information = {name,role,party,nextElection,src};
        Meteor.call('politicians.insert',information);
      }
    });
  },
  'click #recordAudioButton'(elt,instance){
    const voiceDict = Template.instance().voiceDict;
    var recognition_engine = Template.instance().recognition_engine;
    Template.instance().voiceDict.set("recording_status", "speaking");
    // var voice_data = new SpeechSynthesisUtterance(Regis_voice_info.findOne({abbr:page}).online);
    // var interim_result, final_result, stop_word;
    // stop_word="stop";
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
        if(result.data.result.metadata.intentName == "stop"){
          voiceDict.set("recording_status", "inactive");
          recognition_engine.stop();
          return;
        } else{
          console.log(result);
          console.log(result.data.result.metadata.intentName);
          responsiveVoice.speak(result.data.result.speech, "UK English Male");
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
}),

Template.trow.events({
  "click .moreInfo": function(event,instance){
    Meteor.call('poliinfo.clear')
    Meteor.call('politicians.clear');
    Meteor.call('bills.clear');
    var input = this.t.name;
    const state = $('#state').val();
    const position = $('#position').val();

    Meteor.call('informMeGeneral',state, position, function(err, result){
      if(err){
        window.alert(err);
        return;
      }
      var id;
      console.log(result);
      for(i=0; i<result.data.results.length; i++){
        name = result.data.results[i].name.toString(); //this gets name of politician
        if(input.toUpperCase()==name.toUpperCase()){
          id = result.data.results[i].id.toString(); //this is getting the politican id
          var src = 'https://theunitedstates.io/images/congress/225x275/' + id + '.jpg';//we are getting pictures from this github page
          console.log(src);
          var role = result.data.results[i].role.toString();
          console.log(role);
          var party = result.data.results[i].party.toString();
          console.log(party);
          var nextElection = result.data.results[i].next_election.toString();
          console.log(nextElection);
          var information = {name,role,party,nextElection,src};
          Meteor.call('politicians.insert',information);
          i = result.data.results.length;
          getBills(id);
          getPoliInfo(id);
        }
      }
    });

    function getBills(id){//this is for getting the bills the politician supports
      Meteor.call('informMeBills', id, function(err, result){
        if(err){
          window.alert(err);
          return;
        }
        console.log(result);
        for(i=0; i<result.data.results[0].bills.length; i++){

          var title = result.data.results[0].bills[i].title.toString(); //this gets name of politician
          var summary = result.data.results[0].bills[i].summary.toString();
          if(!summary){
            summary = "Summary Unavaliable";
          }
          var information = {title,summary};
          Meteor.call('bills.insert',information);
        }
      });
    }

    function getPoliInfo(id){
      Meteor.call('informMeMore', id, function(err, result){
        if(err){
          window.alert(err);
          return;
        }
        console.log(result);
        var url = result.data.results[0].url.toString();
        console.log(url);
        Session.set('url', url);
        for(i=0; i<result.data.results[0].roles[0].committees.length; i++){
          var committee =result.data.results[0].roles[0].committees[i].name.toString();

          var information = {committee};
          Meteor.call('poliinfo.insert',information);
        }
      });


    }
    Router.go('/politician');
  },
})
