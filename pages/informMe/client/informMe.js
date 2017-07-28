Template.informMe.onCreated(function(){
  Meteor.subscribe('politicians');
  Meteor.subscribe('bills');
  Meteor.subscribe('poliinfo');
  Meteor.call('politicians.clear',Meteor.userId());
  Meteor.call('bills.clear',Meteor.userId());
  Meteor.call('poliinfo.clear',Meteor.userId());
  this.voiceDict = new ReactiveDict();
  this.recognition_engine = new webkitSpeechRecognition();
  this.voiceDict.set("recording_status", "inactive");
})

Template.informMe.helpers({
  informed: function(){
    return Politicians.find({userId:Meteor.userId()});
  },
  cosponsor: function(){
    return Bills.find({userId:Meteor.userId()});
  },
  additionalInfo: function(){
    return PoliInfo.find({userId:Meteor.userId()});
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

})

Template.informMe.events({
  "click .searchbar": function(event,instance){
    Meteor.call('poliinfo.clear',Meteor.userId())
    Meteor.call('politicians.clear',Meteor.userId());
    Meteor.call('bills.clear',Meteor.userId());
    const input = $(".search").val();
    const state = instance.$('#state').val();
    const position = instance.$('#position').val();
    var xmlhttp = new XMLHttpRequest();
    var id;
    const url = 'https://api.propublica.org/congress/v1/members/'+position+'/'+state+'/current.json';
    xmlhttp.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        var electionInfo = JSON.parse(this.responseText);

        for(i=0; i<electionInfo.results.length; i++){
          name = electionInfo.results[i].name.toString(); //this gets name of politician
          console.log(name);
          //if(input.toUpperCase()==name.toUpperCase()){
            id = electionInfo.results[i].id.toString(); //this is getting the politican id
            console.log(electionInfo);
            var src = 'https://theunitedstates.io/images/congress/225x275/' + id + '.jpg';//we are getting pictures from this github page
            //var img = document.createElement('img');
            //.src = src;
            //div.appendChild(img);
            var role = electionInfo.results[i].role.toString();

            var party = electionInfo.results[i].party.toString();

            var nextElection = electionInfo.results[i].next_election.toString();
            var userId = Meteor.userId();
            var information = {name,role,party,nextElection,src,url,userId};
            Meteor.call('politicians.insert',information);
            //i = electionInfo.results.length;
            //getBills(id);

          //}
        }


      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("X-API-Key", "oxGeSNpCtE6M2IH11GwHh5xrvWiDiqSp6L9a3IWw ");
    xmlhttp.send();
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
  // },

}),

Template.trow.events({
  "click .moreInfo": function(event,instance){
    Meteor.call('poliinfo.clear',Meteor.userId());
    Meteor.call('politicians.clear',Meteor.userId());
    Meteor.call('bills.clear',Meteor.userId());
    var xmlhttp = new XMLHttpRequest();
    var input = this.t.name;
    const state = $('#state').val();
    const position = $('#position').val();


    var id;
    const url = 'https://api.propublica.org/congress/v1/members/'+position+'/'+state+'/current.json';


    xmlhttp.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        var electionInfo = JSON.parse(this.responseText);
        for(i=0; i<electionInfo.results.length; i++){
          name = electionInfo.results[i].name.toString(); //this gets name of politician
          if(input.toUpperCase()==name.toUpperCase()){
            id = electionInfo.results[i].id.toString(); //this is getting the politican id
            console.log(electionInfo);
            var src = 'https://theunitedstates.io/images/congress/225x275/' + id + '.jpg';//we are getting pictures from this github page
            console.log(src);
            var role = electionInfo.results[i].role.toString();
            console.log(role);
            var party = electionInfo.results[i].party.toString();
            console.log(party);
            var nextElection = electionInfo.results[i].next_election.toString();
            console.log(nextElection);
            var userId = Meteor.userId();
            var information = {name,role,party,nextElection,src,userId};
            Meteor.call('politicians.insert',information);
            i = electionInfo.results.length;
            getBills(id);
            getPoliInfo(id);
          }
        }


      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("X-API-Key", "oxGeSNpCtE6M2IH11GwHh5xrvWiDiqSp6L9a3IWw ");
    xmlhttp.send();


    function getBills(id){//this is for getting the bills the politician supports
      console.log(id);
      var http = new XMLHttpRequest();
      const api ='https://api.propublica.org/congress/v1/members/'+id+'/bills/cosponsored.json';

      http.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
          var electionInfo = JSON.parse(this.responseText);
          console.log(electionInfo);
          for(i=0; i<electionInfo.results[0].bills.length; i++){

            var title = electionInfo.results[0].bills[i].title.toString(); //this gets name of politician

            var summary = electionInfo.results[0].bills[i].summary.toString();
            if(!summary){
              summary = "Summary Unavaliable";
            }
            var userId = Meteor.userId();
            var information = {title,summary,userId};

            Meteor.call('bills.insert',information);
          }
        }
      };
      http.open("GET", api, true);
      http.setRequestHeader("X-API-Key", "oxGeSNpCtE6M2IH11GwHh5xrvWiDiqSp6L9a3IWw ");
      http.send();
      //if(Bills.find().count() == 0){
        //document.getElementById("noBills").innerHTML = "Sorry,their are no Bills currently cosponsored by this person"
      //}
    }

    function getPoliInfo(id){
      console.log(id);
      var htp = new XMLHttpRequest();
      var httpApi ='https://api.propublica.org/congress/v1/members/'+ id +'.json';

      htp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
          var electionInfo = JSON.parse(this.responseText);

          console.log(electionInfo);
          var url = electionInfo.results[0].url.toString();
          console.log(url);
          document.getElementById("url").innerHTML = url;
          for(i=0; i<electionInfo.results[0].roles[0].committees.length; i++){
            var committee =electionInfo.results[0].roles[0].committees[i].name.toString();
            var district = electionInfo.results[0].roles[0].district.toString();
            var userId = Meteor.userId();
            var information = {committee, district,userId};
            Meteor.call('poliinfo.insert',information);
          }
        }
      };
      htp.open("GET", httpApi, true);
      htp.setRequestHeader("X-API-Key", "oxGeSNpCtE6M2IH11GwHh5xrvWiDiqSp6L9a3IWw ");
      htp.send();

    }
    Router.go('/politician');
  },
})
