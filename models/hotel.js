const mongoose = require("mongoose");
const { Schema } = mongoose;

const hotelSchema = new Schema(
  {
    post_title: { type: String, required: true },
    post_slug: { type: String, required: true },
    post_content: { type: String },
    location_lat: { type: Number, default: 21.0239852 },
    location_lng: { type: Number, default: 105.791488 },
    location_address: { type: String },
    location_zoom: { type: String, default: "12" },
    location_state: { type: String },
    location_postcode: { type: String },
    location_country: { type: String },
    location_city: { type: String },
    thumbnail_id: { type: String },
    gallery: { type: String },
    base_price: { type: Number },
    extra_services: { type: String },
    hotel_star: { type: Number },
    hotel_logo: { type: String },
    video: { type: String },
    policy: { type: String },
    checkin_time: { type: String },
    checkout_time: { type: String },
    min_day_booking: { type: Number },
    min_day_stay: { type: Number },
    nearby_common: { type: String },
    nearby_education: { type: String },
    nearby_health: { type: String },
    nearby_top_attractions: { type: String },
    nearby_restaurants_cafes: { type: String },
    nearby_natural_beauty: { type: String },
    nearby_airports: { type: String },
    faq: { type: String },
    enable_cancellation: { type: String },
    cancel_before: { type: Number },
    cancellation_detail: { type: String },
    property_type: { type: String },
    hotel_facilities: { type: String },
    hotel_services: { type: String },
    rating: { type: Number },
    is_featured: { type: Boolean, default: false },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);
