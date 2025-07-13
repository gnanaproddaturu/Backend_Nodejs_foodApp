
import mongoose from "mongoose";

const vendorSchema =  new mongoose.Schema({
    username :{
        type : String,
        required : true,
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    password  :{
        type : String,
        required : true
    },
    firm : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Firm"
        }
    ]

})


vendorSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  }
});



const Vendor = mongoose.model("Vendor" , vendorSchema)

export default Vendor ; 