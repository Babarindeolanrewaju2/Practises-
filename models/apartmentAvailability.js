const mongoose = require("mongoose");
const { Schema } = mongoose;

const apartmentAvailabilitySchema = new Schema(
  {
    post_id: { type: Schema.Types.ObjectId, ref: "Apartment", required: true },
    check_in: { type: Number, required: true },
    check_out: { type: Number },
    price: { type: String },
    booked: { type: Number },
    status: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ApartmentAvailability",
  apartmentAvailabilitySchema
);
