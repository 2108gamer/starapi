const { model, Schema } = require("mongoose");
 
let transcript = new Schema({
    user: String,
    url: String,
    closedBy: String,
    fecha: String,
    staff: String

})
 
module.exports = model("Transcripts", transcript);