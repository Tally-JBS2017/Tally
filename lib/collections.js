Statereginfo = new Meteor.Collection("statereginfo");
Profiles = new Meteor.Collection("profiles");
Election = new Meteor.Collection("election");
Politicians = new Meteor.Collection("politicians");
Bills = new Meteor.Collection("bills");
PoliInfo = new Meteor.Collection('poliinfo')
Regis_voice_info = new Meteor.Collection("regis_voice_info");
Pollingloc = new Meteor.Collection("pollingloc");

// Schema = {};
// Schema.User = new SimpleSchema({
//     emails: {
//         type: Array,
//         // For accounts-password, either emails or username is required, but not both. It is OK to make this
//         // optional here because the accounts-password package does its own validation.
//         // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
//         optional: true
//     },
//     "emails.$": {
//         type: Object
//     },
//     "emails.$.address": {
//         type: String,
//         regEx: SimpleSchema.RegEx.Email
//     },
//     "emails.$.verified": {
//         type: Boolean
//     },
//     // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
//     registered_emails: {
//         type: Array,
//         optional: true
//     },
//     'registered_emails.$': {
//         type: Object,
//         blackbox: true
//     },
//     profile: {
//         type: Schema.UserProfile,
//         optional: true
//     },
// });
// Meteor.users.attachSchema(Schema.User);
