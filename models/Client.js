import mongoose from "mongoose";
const { Schema } = mongoose;

const clientShema = new Schema({
  name: { type: String, required: true, minlength: 4, maxlength: 255 },
  debt: { type: Number, required: true, default: 0 },
  records: [
    new Schema({
      type: { type: String, required: true },
      value: { type: Number, required: true },
      description: { type: String, required: false },
      date: { type: String, required: true }
    })
  ]
});

// Modelo
const Client = mongoose.model("Client", clientShema);
export default Client;

/*const clientShema = new Schema({
  name: { type: String, required: true, minlength: 4, maxlength: 255 },
  debt: { type: Number, required: true, default: 0 },
  records: [
    new Schema({
      type: { type: String, required: true },
      value: { type: Number, required: true },
      description: { type: String, required: false },
      date: { type: String, required: true }
    })
  ]
});*/

/*const clientShema = new Schema({
  name: String,
  debt: Number,
  records: [
    new Schema({
      type: String,
      value: Number,
      description: String,
      date: String
    })
  ]
});*/
