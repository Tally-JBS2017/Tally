Template.election.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    contest:[], //this will hold all the elections
    t:{},//this would hold each seperate election

  });
  console.log("creating the template");
  console.dir(this.state);
});

Template.election.helpers({
  contest: function(){
    const instance = Template.instance();
    return instance.state.get("contest");
  }
});

Template.election.events({
  //this is
  "click .getElection": function(event,instance){
    const address = $(".addressInput").val();

    Meteor.apply("getElectionInfo", [address],{returnStubValue:true},
      function(error,result){
        console.dir(["getElectionInfo"],error,result);
        if(error){
          console.log("Error!!"+JSON.stringify(error)); return;
        }
        console.log(result);
        t = JSON.parse(result);
        console.dir(t);
        return instance.state.set("contest",t.contests);
      });
  },
})
