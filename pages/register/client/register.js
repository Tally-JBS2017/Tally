import { ReactiveVar } from 'meteor/reactive-var';

Template.register.onCreated(function registerOnCreated() {
  Meteor.subscribe("profiles", {owner:Meteor.userId()});
  this.howtoreg= new ReactiveVar("");
  Meteor.subscribe("regis_voice_info");
})


Template.register.helpers({
  //this function's purpose is to allow the dynamic template to grab the right template name.
  page: function() {
    return Session.get("statepage");
  },

  regstyle: function() {
      return Template.instance().howtoreg.get();
    },

  // This fuction is what is used to populate the static-template with dynamic data.
  // For now it's using an array but we late we can pull the array from collections.
  pageData: function() {
    var page = Session.get("statepage")
    console.log(page+" is where we are getting data for");
    //When we get the collection and agree on a format we we swap out the manual data array for a collection grab

    var data = Statereginfo.findOne({abbr:page});
    if(!data) return;
    console.log("Page data is pulled from "+ data.toString());
    return {contentType:page, items:data};
  },

  profileloaded: function(){
    if((Profiles.findOne({owner:Meteor.userId()}) != null) && (Session.get("statepage") == undefined)){
      Session.set("statepage",Profiles.findOne({owner:Meteor.userId()}).state);
      console.log("The statepage session variable is: "+ Session.get("statepage"));
      Meteor.subscribe("Statereginfo",{abbr:Session.get("statepage")});
      console.log("Statepage = "+this.statepage);
    } else if(Session.get("statepage") != undefined){
      Meteor.subscribe("Statereginfo",{abbr:Session.get("statepage")});
    }
    return true;
  }
})

Template.register.events({
  'click #regisInfo'(elt,instance){
    const zip =instance.$("#zipcode").val();
    const dropstate =instance.$("#state").val();
    if(dropstate ==""){
      getState(zip, returnState);
    }else{
      returnState(dropstate);
    }
    //This is the code to grab the city and state from the users zipcode. Would love to store the info somehow.
    function getState(zip, callback){
      var state = ""
      var xmlhttp = new XMLHttpRequest();
      var url ='https://www.zipcodeapi.com/rest/js-blSPbA8GVwAcmTeVD6OiUmqwLP18G74SsWIDwRksnVEKOSFsYtLTPcpA2rJJyNB1/info.json/'+zip.toString()+'/degrees'
      xmlhttp.open("GET", url, true);
      xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              var locinfo = JSON.parse(this.responseText);
              var state = locinfo.state.toString();
              // var city = locinfo.city.toString();
              console.log("Zipcode is from this state: "+state);
              // console.log("Zipcode is from this city: "+city);
              callback(state);
          }
      };
      xmlhttp.send();
    }
    function returnState(data){
    Session.set("statepage",data);
    }
    console.log("active variable: "+Session.get("statepage"));
  },

  'click #online'(elt,instance){
    Template.instance().howtoreg.set("online");
  },
  'click #person'(elt,instance){
    Template.instance().howtoreg.set("person");
  },
  'click #mail'(elt,instance){
    Template.instance().howtoreg.set("mail");
  },


})

Template.registerHelper('sessionget', function (sessionvar) {
  return Session.get(sessionvar);
});

Template.registerHelper('stateDropdownmenu', function(){
  return '<select class="form-control" id = "state"><option value = ""> -- select an option -- </option> <option value="AL">Alabama</option> <option value="AK">Alaska</option><option value="AZ">Arizona</option><option value="AR">Arkansas</option><option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DE">Delaware</option><option value="FL">Florida</option><option value="GA">Georgia</option><option value="HI">Hawaii</option><option value="ID">Idaho</option><option value="IL">Illinois</option> <option value="IN">Indiana</option><option value="IA">Iowa</option><option value="KS">Kansas</option><option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="ME">Maine</option><option value="MD">Maryland</option><option value="MA">Massachusetts</option><option value="MI">Michigan</option> <option value="MN">Minnesota</option><option value="MS">Mississippi</option><option value="MO">Missouri</option><option value="MT">Montana</option><option value="NE">Nebraska</option><option value="NV">Nevada</option><option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NY">New York</option><option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option><option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option><option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TX">Texas</option><option value="UT">Utah</option><option value="VT">Vermont</option><option value="VA">Virginia</option><option value="WA">Washington</option><option value="WV">West Virginia</option><option value="WI">Wisconsin</option><option value="WY">Wyoming</option></select>';
})
