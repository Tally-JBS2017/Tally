import { ReactiveVar } from 'meteor/reactive-var';

Template.register.onCreated(function registerOnCreated() {
  this.statepage= new ReactiveVar("");
});

Template.register.helpers({
  //this function's purpose is to allow the dynamic template to grab the right template name.
  page: function() {
      return Template.instance().statepage.get();
    },
  // This fuction is what is used to populate the static-template with dynamic data.
  // For now it's using an array but we late we can pull the array from collections.
  pageData: function() {
    var page = Template.instance().statepage.get();
  //When we get the collection and agree on a format we we swap out the manual data array for a collection grab
    var data = {
      "MA": [{step:"What you need to Register online",stepdescrip:"register online you dummy"}],
    };
    return {contentType:page, items:data[page]};
  }

});

Template.register.events({
  'click button'(elt,instance){
    const zip =instance.$("#zipcode").val();

    /*
    //This is the code to grab the city and state from the users zipcode. Would love to store the info somehow.
    var xmlhttp = new XMLHttpRequest();
    var url ='https://www.zipcodeapi.com/rest/js-blSPbA8GVwAcmTeVD6OiUmqwLP18G74SsWIDwRksnVEKOSFsYtLTPcpA2rJJyNB1/info.json/'+zip.toString()+'/degrees'
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var locinfo = JSON.parse(this.responseText);
            var state = locinfo.state.toString();
            var city = locinfo.city.toString();
            console.log(state);
            console.log(city);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    */

    //this state variable is just so we don't spam the API
    var state= "MA";
    /*sets the current instance's statepage reactive variable to users state.
    This allows blaze to populate the dynamic template with the correct info */
    Template.instance().statepage.set(state);
    //console.log("active variable:"+Template.instance().statepage.get());
  }
});
