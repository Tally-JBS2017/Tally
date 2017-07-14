Template.informMe.onCreated(function(){
  Meteor.subscribe('politicians');
  Meteor.call('politicians.clear');
})

Template.informMe.helpers({
  informed(){
    return Politicians.find()
  }
})

Template.informMe.events({
  "click .searchbar": function(event,instance){

    var xmlhttp = new XMLHttpRequest();
    const input = $(".search").val();
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
        for(i=1; i<electionInfo.results.length; i++){
          name = electionInfo.results[i].name.toString(); //this gets name of politician
          console.log(name);
          if(input.toUpperCase()==name.toUpperCase()){
            id = electionInfo.results[i].id.toString(); //this is getting the politican id
            console.log(id);
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
          }
        }

      }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("X-API-Key", "oxGeSNpCtE6M2IH11GwHh5xrvWiDiqSp6L9a3IWw ");
    xmlhttp.send();

  }

})
