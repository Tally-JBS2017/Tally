Template.politician.onCreated(function(){
  Meteor.subscribe('politicians');
  Meteor.subscribe('bills');
  Meteor.subscribe('poliinfo');

})

Template.politician.helpers({
  informed(){
    return Politicians.find({userId:Meteor.userId()});
  },
  cosponsor(){
    return Bills.find({userId:Meteor.userId()});
  },
  additionalInfo(){
    return PoliInfo.find({userId:Meteor.userId()});
  },
  findDistrict(){
    return PoliInfo.findOne({userId:Meteor.userId()}).district;
  },
  url: function(){
    return PoliInfo.findOne({userId:Meteor.userId()}).url;
  },
  senate(){
    if(PoliInfo.find().fetch().length>0){
      return true;
    }else{
      return false;
    }
  },

})

Template.politician.events({
  /*"click .searchbar": function(event,instance){
    Meteor.call('poliinfo.clear',Meteor.userId())
    Meteor.call('politicians.clear',Meteor.userId());
    Meteor.call('bills.clear',Meteor.userId());
    var xmlhttp = new XMLHttpRequest();
     input = location.search.substring[6];
    input = input.replace(/\+/g, '%20'); // 'Friday%20September%2013th'
    input = decodeURIComponent(input);
    const state = instance.$('#state').val();
    const position = instance.$('#position').val();


    var id;
    const url = 'https://api.propublica.org/congress/v1/members/'+position+'/'+state+'/current.json';


    xmlhttp.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        var electionInfo = JSON.parse(this.responseText);
        var div = document.getElementById("picture");
        while(div.firstChild){//this will first wipe all the images off
          div.removeChild(div.firstChild);
        }
        for(i=0; i<electionInfo.results.length; i++){
          name = electionInfo.results[i].name.toString(); //this gets name of politician
          console.log(name);
          if(input.toUpperCase()==name.toUpperCase()){
            id = electionInfo.results[i].id.toString(); //this is getting the politican id
            console.log(electionInfo);
            var src = 'https://theunitedstates.io/images/congress/225x275/' + id + '.jpg';//we are getting pictures from this github page
            var img = document.createElement('img');
            img.src = src;
            div.appendChild(img);
            var role = electionInfo.results[i].role.toString();
            console.log(role);
            var party = electionInfo.results[i].party.toString();
            console.log(party);
            var nextElection = electionInfo.results[i].next_election.toString();
            console.log(nextElection);

            var information = {name,role,party,nextElection};
            Meteor.call('politicians.insert',information);
            i = electionInfo.results.length;
            getBills(id);
            getPoliInfo(id);
          }
        }


      }
    };
    console.log(id + " hello");
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("X-API-Key", "oxGeSNpCtE6M2IH11GwHh5xrvWiDiqSp6L9a3IWw ");
    xmlhttp.send();

    setTimeout(find,2000);
    function find(){
      if(Politicians.find().count() == 0){
        document.getElementById("noPolitician").innerHTML = "Sorry,their is no politician by that name";
      }else{
        document.getElementById("noPolitician").innerHTML = " ";
      }
    }


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

            var information = {title,summary};
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

            var district =electionInfo.results[0].roles[0].district.toString();
            console.log("this is inserting district" + district);
            var information = {committee,district};
            Meteor.call('poliinfo.insert',information);
          }
        }
      };
      htp.open("GET", httpApi, true);
      htp.setRequestHeader("X-API-Key", "oxGeSNpCtE6M2IH11GwHh5xrvWiDiqSp6L9a3IWw ");
      htp.send();

    }

  }*/
})
