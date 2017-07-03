Template.profile.helpers({
  current_profile() {return Profiles.find({owner: Meteor.userId()})},
})
Template.profile.events({
  'click #new' : function (e, instance) {
    var to_be_inserted = {name:'Default', picture: 'images/default_profile.jpg', likes: [], owner: Meteor.userId()};
    Meteor.call('profiles.insert', Meteor.userId(), to_be_inserted);
  },
  'click #name_add' : function (e, instance) {
    console.log('changing name')
    const name = instance.$('#name').val();
    instance.$('#name').val("");
    Meteor.call('profiles.name.update', Meteor.userId(), name)
  }
})
