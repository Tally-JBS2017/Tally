Template.profile.helpers({
  current_profile() {return Profiles.find({owner: Meteor.userId()})},
})
Template.profile.events({
  'click #new' : function (e, instance) {//this activates when you press the reset button
    var to_be_inserted = {name:'Default', owner: Meteor.userId()};
    Meteor.call('profiles.insert', Meteor.userId(), to_be_inserted);
  },
  'click #name_add' : function (e, instance) {//this updates the name field
    console.log('changing name')
    const name = instance.$('#name').val();
    instance.$('#name').val("");
    Meteor.call('profiles.name.update', Meteor.userId(), name)
  },
  'click #address_add' : function (e, instance) {//this updates the name field
    console.log('changing address')
    const address = instance.$('#address').val();
    instance.$('#address').val("");
    Meteor.call('profiles.address.update', Meteor.userId(), address)
  }
})
