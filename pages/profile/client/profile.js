Template.profile.helpers({
  current_profile() {return Profiles.find({owner: Meteor.userId()})},
})
Template.profile.events({
  'click #new' : function (e, instance) {//this activates when you press the reset button
    var to_be_inserted = {name:'Default', owner: Meteor.userId()};
    Meteor.call('profiles.insert', to_be_inserted);
  },
  'click #name_add' : function (e, instance) {//this updates the name field
    const name = instance.$('#name').val();
    instance.$('#name').val("");
    Meteor.call('profiles.name.update', name)
  },
  'click #address_add' : function (e, instance) {//this updates the name field
    const address = instance.$('#address').val();
    instance.$('#address').val("");
    Meteor.call('profiles.address.update', address)
  },
  'click #state_add' : function (e, instance) {//this updates the name field
    const state = instance.$('#state').val();
    instance.$('#state').val("");
    Meteor.call('profiles.state.update', state)
  },
  'click #zip_add' : function (e, instance) {//this updates the name field
    const zip = instance.$('#zip').val();
    instance.$('#zip').val("");
    if(!isNaN(zip) & zip.length == 5){
        Meteor.call('profiles.zip.update', zip)
    }else{
      alert("This is not a valid input. ")
    }
  }
})
