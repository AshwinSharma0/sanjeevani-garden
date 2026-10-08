import mongoose from "mongoose";

const PlantSchema = new mongoose.Schema({

 name:String,

 scientificName:String,

 price:Number,

 originalPrice:Number,

 image:String,

 rating:Number,

 reviews:Number,

 benefits:[String],

 size:String,

 delivery:String,

 inStock:Boolean

});

export default mongoose.models.Plant ||

mongoose.model("Plant",PlantSchema);