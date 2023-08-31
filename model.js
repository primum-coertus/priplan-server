const monggose = require("mongoose");

module.exports = monggose.model("plan",
    {
        title:{type:String},
        plan:{type:String},
        start_date:{type:String},
        end_date:{type:String},
        is_completed:{type:Boolean}
    }
)
