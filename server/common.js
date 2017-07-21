Schema = {};
SimpleSchema.messages({
   "invalidAccount": "That is not a valid email address.",
})
Schema.User = new SimpleSchema({
    username: {
        type: String,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    emails: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        //regEx: SimpleSchema.RegEx.Email,
        custom: function(){
         var valid_website = ["brandeis", "gmail" , "yahoo", "msn"];
         var valid = false;
         for(i=0; i<valid_website.length; i++){
           if(this.value.includes(valid_website[i])){
             valid = true;
           }
        }
        if(valid != true){
           return "invalidAccount"
        }
      }
    },
    "emails.$.verified": {
        type: Boolean
    },
    // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
    registered_emails: {
        type: Array,
        optional: true
    },
    'registered_emails.$': {
        type: Object,
        blackbox: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    heartbeat: {
        type: Date,
        optional: true
    }
});
Meteor.users.attachSchema(Schema.User);
