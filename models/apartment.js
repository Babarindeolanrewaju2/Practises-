const mongoose = require("mongoose");
const { Schema } = mongoose;

const apartmentSchema = new Schema(
  {
    post_title: { type: String, required: true },
    post_slug: { type: String, required: true },
    post_content: { type: String },
    location_lat: { type: Number, default: 21.0239852 },
    location_lng: { type: Number, default: 105.791488 },
    location_address: { type: String },
    location_zoom: { type: String, default: "12" },
    location_state: { type: String },
    location_postcode: { type: String, maxlength: 15 },
    location_country: { type: String, maxlength: 50 },
    location_city: { type: String, maxlength: 50 },
    thumbnail_id: { type: String },
    gallery: { type: String },
    base_price: { type: Number },
    booking_form: { type: String, default: "instant", maxlength: 20 },
    number_of_guest: { type: Number },
    number_of_bedroom: { type: Number },
    number_of_bathroom: { type: Number },
    size: { type: Number },
    min_stay: { type: Number },
    max_stay: { type: Number },
    booking_type: { type: String, maxlength: 20 },
    extra_services: { type: String },
    apartment_type: { type: String },
    apartment_amenity: { type: String },
    enable_cancellation: { type: String, default: "0", maxlength: 10 },
    cancel_before: { type: Number },
    cancellation_detail: { type: String },
    checkin_time: { type: String, maxlength: 25 },
    checkout_time: { type: String, maxlength: 25 },
    rating: { type: Number },
    is_featured: { type: String, default: "0", maxlength: 3 },
    discount_by_day: { type: String },
    video: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Apartment", apartmentSchema);
