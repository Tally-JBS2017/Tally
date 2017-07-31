Template.informMeLayout.onCreated(function(){
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

Template.informMeLayout.helpers({
  page: function() {
    return Session.get("mypoliornah");
    // return Template.instance().statepage;
  },

  // This fuction is what is used to populate the static-template with dynamic data.
  // For now it's using an array but we late we can pull the array from collections.
  pageData: function() {
    var page = Session.get("mypoliornah");
    console.log(page+" is where we are getting data for");
    //When we get the collection and agree on a format we we swap out the manual data array for a collection grab
    // var data = "nil";
    var data = {address: Profiles.findOne({owner:Meteor.userId()}).address,city: Profiles.findOne({owner:Meteor.userId()}).city ,dropstate: Profiles.findOne({owner:Meteor.userId()}).state, zip: Profiles.findOne({owner:Meteor.userId()}).zip}
    console.log("Page data is pulled from "+data.toString());
    return {contentType:page, items:data};
  },

  profileloaded: function(){
    if((Profiles.findOne({owner:Meteor.userId()}) != null)){
      Meteor.subscribe("profiles", {owner:Meteor.userId()});
    }
    Session.set("mypoliornah","informMe");
    return true;
  }
})
Template.informMe.helpers({
  informed: function(){
    return Politicians.find({userId:this.Meteor.userId()});
  },
  cosponsor: function(){
    return Bills.find({userId:this.Meteor.userId()});
  },
  additionalInfo: function(){
    return PoliInfo.find({userId:this.Meteor.userId()});
  },
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
          Session.set('url', url);
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
