var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = new mongoose.Schema({

    local : {
        username : String,
        password : String
    },

    signUpDate : {
        type: Date,
        default : Date.now()
    },

    profileInfo : {
        height : Number,
        weight : Number,
        date : Date,
        BMI : Number,
        age : Number,
        zip : String
    },

    creator : {
        type : ObjectId,
        ref : 'User'
    }

});

userSchema.methods.generateHash = function(password) {
    //Create salted hash of password by hashing plaintext password
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.validPassword = function(password) {
    //Hash entered password, compare with stored hash
    return bcrypt.compareSync(password, this.local.password);
};
//Compile user schema into mongoose model object
var User = mongoose.model('User', userSchema);
//add export so other code can use it
module.exports = User;

