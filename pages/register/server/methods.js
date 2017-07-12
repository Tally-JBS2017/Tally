Meteor.methods({

    "sendJSONtoAPI_ai": function(text){
        //validation for the option
        return HTTP.call("POST", "https://api.api.ai/v1/query/",
            {
                headers: {
                    "Authorization": "Bearer" + Meteor.settings.APIAI_key, //API.ai token here (from API.ai account)
                    "Content-Type": "application/json; charset=utf-8"
                },
                data: {
                  "query": text,
                  "lang": "en",
                  "sessionId": "1234567890"
            }
        })
    },

})
