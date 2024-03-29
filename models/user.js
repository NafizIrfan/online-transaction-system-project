var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {

	unique_id: Number,
	fullname: String,
	email: String,
	username: String,
	password: String,
	passwordConf: String,
	balance: Number
}),
User = mongoose.model('User', userSchema);

module.exports = User;
