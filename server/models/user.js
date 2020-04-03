const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    email: String,
    password: String,
    nickname: String,
    epicname: String,
    image: String,
    account_id: String,
    role: String
});

module.exports = mongoose.model("User", userSchema);