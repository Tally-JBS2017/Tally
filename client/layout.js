Template.layout.helpers({
  onPage1: function(){
    return Router.current().url.match(/(register|election|informMe|politician|profile)/);
  }
})
