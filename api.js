const express = require("express");
const mongoose = require("mongoose");
const Apartment = require("./models/apartment");
const ApartmentAvailability = require("./models/apartmentAvailability");
const Hotel = require("./models/hotel");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/myapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define API routes
app.get("/api/apartments", async (req, res) => {
  try {
    const apartments = await Apartment.find();
    res.json(apartments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/apartments/:id", getApartment, (req, res) => {
  res.json(res.apartment);
});

app.post("/api/apartments", async (req, res) => {
  const apartment = new Apartment({
    post_title: req.body.post_title,
    post_slug: req.body.post_slug,
    post_content: req.body.post_content,
    location_lat: req.body.location_lat,
    location_lng: req.body.location_lng,
    location_address: req.body.location_address,
    location_zoom: req.body.location_zoom,
    location_state: req.body.location_state,
    location_postcode: req.body.location_postcode,
    location_country: req.body.location_country,
    location_city: req.body.location_city,
    thumbnail_id: req.body.thumbnail_id,
    gallery: req.body.gallery,
    base_price: req.body.base_price,
    booking_form: req.body.booking_form,
    number_of_guest: req.body.number_of_guest,
    number_of_bedroom: req.body.number_of_bedroom,
    number_of_bathroom: req.body.number_of_bathroom,
    size: req.body.size,
    min_stay: req.body.min_stay,
    max_stay: req.body.max_stay,
    booking_type: req.body.booking_type,
    extra_services: req.body.extra_services,
    apartment_type: req.body.apartment_type,
    apartment_amenity: req.body.apartment_amenity,
    enable_cancellation: req.body.enable_cancellation,
    cancel_before: req.body.cancel_before,
    cancellation_detail: req.body.cancellation_detail,
    checkin_time: req.body.checkin_time,
    checkout_time: req.body.checkout_time,
    rating: req.body.rating,
    is_featured: req.body.is_featured,
    discount_by_day: req.body.discount_by_day,
    video: req.body.video,
    author: req.body.author,
    status: req.body.status,
  });

  try {
    const newApartment = await apartment.save();
    res.status(201).json(newApartment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/api/apartments/:id/availability", getApartment, async (req, res) => {
  const apartmentAvailability = new ApartmentAvailability({
    post_id: res.apartment._id,
    check_in: req.body.check_in,
    check_out: req.body.check_out,
    price: req.body.price,
    booked: req.body.booked,
    status: req.body.status,
  });

  try {
    const newAvailability = await apartmentAvailability.save();
    res.status(201).json(newAvailability);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/api/apartments/:id/availability", getApartment, async (req, res) => {
  try {
    const availability = await ApartmentAvailability.find({
      post_id: req.params.id,
    });
    res.json(availability);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get(
  "/api/apartments/:id/availability/:availabilityId",
  getApartmentAvailability,
  (req, res) => {
    res.json(res.apartmentAvailability);
  }
);

app.patch(
  "/api/apartments/:id/availability/:availabilityId",
  getApartmentAvailability,
  async (req, res) => {
    if (req.body.check_in != null) {
      res.apartmentAvailability.check_in = req.body.check_in;
    }
    if (req.body.check_out != null) {
      res.apartmentAvailability.check_out = req.body.check_out;
    }
    if (req.body.price != null) {
      res.apartmentAvailability.price = req.body.price;
    }
    if (req.body.booked != null) {
      res.apartmentAvailability.booked = req.body.booked;
    }
    if (req.body.status != null) {
      res.apartmentAvailability.status = req.body.status;
    }

    try {
      const updatedAvailability = await res.apartmentAvailability.save();
      res.json(updatedAvailability);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

app.delete(
  "/api/apartments/:id/availability/:availabilityId",
  getApartmentAvailability,
  async (req, res) => {
    try {
      await res.apartmentAvailability.remove();
      res.json({ message: "Apartment availability deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

app.get("/api/hotels", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/hotels/:id", getHotel, (req, res) => {
  res.json(res.hotel);
});

app.post("/api/hotels", async (req, res) => {
  const hotel = new Hotel({
    post_title: req.body.post_title,
    post_slug: req.body.post_slug,
    post_content: req.body.post_content,
    location_lat: req.body.location_lat,
    location_lng: req.body.location_lng,
    location_address: req.body.location_address,
    location_zoom: req.body.location_zoom,
    location_state: req.body.location_state,
    location_postcode: req.body.location_postcode,
    location_country: req.body.location_country,
    location_city: req.body.location_city,
    thumbnail_id: req.body.thumbnail_id,
    gallery: req.body.gallery,
    base_price: req.body.base_price,
    extra_services: req.body.extra_services,
    hotel_star: req.body.hotel_star,
    hotel_logo: req.body.hotel_logo,
    video: req.body.video,
    policy: req.body.policy,
    checkin_time: req.body.checkin_time,
    checkout_time: req.body.checkout_time,
    min_day_booking: req.body.min_day_booking,
    min_day_stay: req.body.min_day_stay,
    nearby_common: req.body.nearby_common,
    nearby_education: req.body.nearby_education,
    nearby_health: req.body.nearby_health,
    nearby_top_attractions: req.body.nearby_top_attractions,
    nearby_restaurants_cafes: req.body.nearby_restaurants_cafes,
    nearby_natural_beauty: req.body.nearby_natural_beauty,
    nearby_airports: req.body.nearby_airports,
    faq: req.body.faq,
    enable_cancellation: req.body.enable_cancellation,
    cancel_before: req.body.cancel_before,
    cancellation_detail: req.body.cancellation_detail,
    property_type: req.body.property_type,
    hotel_facilities: req.body.hotel_facilities,
    hotel_services: req.body.hotel_services,
    rating: req.body.rating,
    author: req.body.author,
    status: req.body.status,
  });

  try {
    const newHotel = await hotel.save();
    res.status(201).json(newHotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/api/hotels/:id", getHotel, async (req, res) => {
  if (req.body.post_title != null) {
    res.hotel.post_title = req.body.post_title;
  }
  if (req.body.post_slug != null) {
    res.hotel.post_slug = req.body.post_slug;
  }
  if (req.body.post_content != null) {
    res.hotel.post_content = req.body.post_content;
  }
  if (req.body.location_lat != null) {
    res.hotel.location_lat = req.body.location_lat;
  }
  if (req.body.location_lng != null) {
    res.hotel.location_lng = req.body.location_lng;
  }
  if (req.body.location_address != null) {
    res.hotel.location_address = req.body.location_address;
  }
  if (req.body.location_zoom != null) {
    res.hotel.location_zoom = req.body.location_zoom;
  }
  if (req.body.location_state != null) {
    res.hotel.location_state = req.body.location_state;
  }
  if (req.body.location_postcode != null) {
    res.hotel.location_postcode = req.body.location_postcode;
  }
  if (req.body.location_country != null) {
    res.hotel.location_country = req.body.location_country;
  }
  if (req.body.location_city != null) {
    res.hotel.location_city = req.body.location_city;
  }
  if (req.body.thumbnail_id != null) {
    res.hotel.thumbnail_id = req.body.thumbnail_id;
  }
  if (req.body.gallery != null) {
    res.hotel.gallery = req.body.gallery;
  }
  if (req.body.base_price != null) {
    res.hotel.base_price = req.body.base_price;
  }
  if (req.body.extra_services != null) {
    res.hotel.extra_services = req.body.extra_services;
  }
  if (req.body.hotel_star != null) {
    res.hotel.hotel_star = req.body.hotel_star;
  }
  if (req.body.hotel_logo != null) {
    res.hotel.hotel_logo = req.body.hotel_logo;
  }
  if (req.body.video != null) {
    res.hotel.video = req.body.video;
  }
  if (req.body.policy != null) {
    res.hotel.policy = req.body.policy;
  }
  if (req.body.checkin_time != null) {
    res.hotel.checkin_time = req.body.checkin_time;
  }
  if (req.body.checkout_time != null) {
    res.hotel.checkout_time = req.body.checkout_time;
  }
  if (req.body.min_day_booking != null) {
    res.hotel.min_day_booking = req.body.min_day_booking;
  }
  if (req.body.min_day_stay != null) {
    res.hotel.min_day_stay = req.body.min_day_stay;
  }
  if (req.body.nearby_common != null) {
    res.hotel.nearby_common = req.body.nearby_common;
  }
  if (req.body.nearby_education != null) {
    res.hotel.nearby_education = req.body.nearby_education;
  }
  if (req.body.nearby_health != null) {
    res.hotel.nearby_health = req.body.nearby_health;
  }
  if (req.body.nearby_top_attractions != null) {
    res.hotel.nearby_top_attractions = req.body.nearby_top_attractions;
  }
  if (req.body.nearby_restaurants_cafes != null) {
    res.hotel.nearby_restaurants_cafes = req.body.nearby_restaurants_cafes;
  }
  if (req.body.nearby_natural_beauty != null) {
    res.hotel.nearby_natural_beauty = req.body.nearby_natural_beauty;
  }
  if (req.body.nearby_airports != null) {
    res.hotel.nearby_airports = req.body.nearby_airports;
  }
  if (req.body.faq != null) {
    res.hotel.faq = req.body.faq;
  }
  if (req.body.enable_cancellation != null) {
    res.hotel.enable_cancellation = req.body.enable_cancellation;
  }
  if (req.body.cancel_before != null) {
    res.hotel.cancel_before = req.body.cancel_before;
  }
  if (req.body.cancellation_detail != null) {
    res.hotel.cancellation_detail = req.body.cancellation_detail;
  }
  if (req.body.property_type != null) {
    res.hotel.property_type = req.body.property_type;
  }
  if (req.body.hotel_facilities != null) {
    res.hotel.hotel_facilities = req.body.hotel_facilities;
  }
  if (req.body.hotel_services != null) {
    res.hotel.hotel_services = req.body.hotel_services;
  }
  if (req.body.rating != null) {
    res.hotel.rating = req.body.rating;
  }
  if (req.body.author != null) {
    res.hotel.author = req.body.author;
  }
  if (req.body.status != null) {
    res.hotel.status = req.body.status;
  }

  try {
    const updatedHotel = await res.hotel.save();
    res.json(updatedHotel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/hotels/:id", getHotel, async (req, res) => {
  try {
    await res.hotel.remove();
    res.json({ message: "Hotel deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/apartments", async (req, res) => {
  try {
    const apartments = await Apartment.find();
    res.json(apartments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/apartments/:id", getApartment, (req, res) => {
  res.json(res.apartment);
});

app.post("/api/apartments", async (req, res) => {
  const apartment = new Apartment({
    post_title: req.body.post_title,
    post_slug: req.body.post_slug,
    post_content: req.body.post_content,
    location_lat: req.body.location_lat,
    location_lng: req.body.location_lng,
    location_address: req.body.location_address,
    location_zoom: req.body.location_zoom,
    location_state: req.body.location_state,
    location_postcode: req.body.location_postcode,
    location_country: req.body.location_country,
    location_city: req.body.location_city,
    thumbnail_id: req.body.thumbnail_id,
    gallery: req.body.gallery,
    base_price: req.body.base_price,
    booking_form: req.body.booking_form,
    number_of_guest: req.body.number_of_guest,
    number_of_bedroom: req.body.number_of_bedroom,
    number_of_bathroom: req.body.number_of_bathroom,
    size: req.body.size,
    min_stay: req.body.min_stay,
    max_stay: req.body.max_stay,
    booking_type: req.body.booking_type,
    extra_services: req.body.extra_services,
    apartment_type: req.body.apartment_type,
    apartment_amenity: req.body.apartment_amenity,
    enable_cancellation: req.body.enable_cancellation,
    cancel_before: req.body.cancel_before,
    cancellation_detail: req.body.cancellation_detail,
    checkin_time: req.body.checkin_time,
    checkout_time: req.body.checkout_time,
    rating: req.body.rating,
    is_featured: req.body.is_featured,
    discount_by_day: req.body.discount_by_day,
    video: req.body.video,
    author: req.body.author,
    status: req.body.status,
  });

  try {
    const newApartment = await apartment.save();
    res.status(201).json(newApartment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.patch("/api/apartments/:id", getApartment, async (req, res) => {
  if (req.body.post_title != null) {
    res.apartment.post_title = req.body.post_title;
  }
  if (req.body.post_slug != null) {
    res.apartment.post_slug = req.body.post_slug;
  }
  if (req.body.post_content != null) {
    res.apartment.post_content = req.body.post_content;
  }
  if (req.body.location_lat != null) {
    res.apartment.location_lat = req.body.location_lat;
  }
  if (req.body.location_lng != null) {
    res.apartment.location_lng = req.body.location_lng;
  }
  if (req.body.location_address != null) {
    res.apartment.location_address = req.body.location_address;
  }
  if (req.body.location_zoom != null) {
    res.apartment.location_zoom = req.body.location_zoom;
  }
  if (req.body.location_state != null) {
    res.apartment.location_state = req.body.location_state;
  }
  if (req.body.location_postcode != null) {
    res.apartment.location_postcode = req.body.location_postcode;
  }
  if (req.body.location_country != null) {
    res.apartment.location_country = req.body.location_country;
  }
  if (req.body.location_city != null) {
    res.apartment.location_city = req.body.location_city;
  }
  if (req.body.thumbnail_id != null) {
    res.apartment.thumbnail_id = req.body.thumbnail_id;
  }
  if (req.body.gallery != null) {
    res.apartment.gallery = req.body.gallery;
  }
  if (req.body.base_price != null) {
    res.apartment.base_price = req.body.base_price;
  }
  if (req.body.booking_form != null) {
    res.apartment.booking_form = req.body.booking_form;
  }
  if (req.body.number_of_guest != null) {
    res.apartment.number_of_guest = req.body.number_of_guest;
  }
  if (req.body.number_of_bedroom != null) {
    res.apartment.number_of_bedroom = req.body.number_of_bedroom;
  }
  if (req.body.number_of_bathroom != null) {
    res.apartment.number_of_bathroom = req.body.number_of_bathroom;
  }
  if (req.body.size != null) {
    res.apartment.size = req.body.size;
  }
  if (req.body.min_stay != null) {
    res.apartment.min_stay = req.body.min_stay;
  }
  if (req.body.max_stay != null) {
    res.apartment.max_stay = req.body.max_stay;
  }
  if (req.body.booking_type != null) {
    res.apartment.booking_type = req.body.booking_type;
  }
  if (req.body.extra_services != null) {
    res.apartment.extra_services = req.body.extra_services;
  }
  if (req.body.apartment_type != null) {
    res.apartment.apartment_type = req.body.apartment_type;
  }
  if (req.body.apartment_amenity != null) {
    res.apartment.apartment_amenity = req.body.apartment_amenity;
  }
  if (req.body.enable_cancellation != null) {
    res.apartment.enable_cancellation = req.body.enable_cancellation;
  }
  if (req.body.cancel_before != null) {
    res.apartment.cancel_before = req.body.cancel_before;
  }
  if (req.body.cancellation_detail != null) {
    res.apartment.cancellation_detail = req.body.cancellation_detail;
  }
  if (req.body.checkin_time != null) {
    res.apartment.checkin_time = req.body.checkin_time;
  }
  if (req.body.checkout_time != null) {
    res.apartment.checkout_time = req.body.checkout_time;
  }
  if (req.body.rating != null) {
    res.apartment.rating = req.body.rating;
  }
  if (req.body.is_featured != null) {
    res.apartment.is_featured = req.body.is_featured;
  }
  if (req.body.discount_by_day != null) {
    res.apartment.discount_by_day = req.body.discount_by_day;
  }
  if (req.body.video != null) {
    res.apartment.video = req.body.video;
  }
  if (req.body.author != null) {
    res.apartment.author = req.body.author;
  }
  if (req.body.status != null) {
    res.apartment.status = req.body.status;
  }

  try {
    const updatedApartment = await res.apartment.save();
    res.json(updatedApartment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/apartments/:id", getApartment, async (req, res) => {
  try {
    await res.apartment.remove();
    res.json({ message: "Apartment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getHotel(req, res, next) {
  let hotel;
  try {
    hotel = await Hotel.findById(req.params.id);
    if (hotel == null) {
      return res.status(404).json({ message: "Cannot find hotel" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.hotel = hotel;
  next();
}

async function getApartment(req, res, next) {
  let apartment;
  try {
    apartment = await Apartment.findById(req.params.id);
    if (apartment == null) {
      return res.status(404).json({ message: "Cannot find apartment" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.apartment = apartment;
  next();
}

// Middleware to get a specific apartment by ID
async function getApartment(req, res, next) {
  let apartment;
  try {
    apartment = await Apartment.findById(req.params.id);
    if (apartment == null) {
      return res.status(404).json({ message: "Apartment not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.apartment = apartment;
  next();
}

// Middleware to get a specific apartment availability record by ID
async function getApartmentAvailability(req, res, next) {
  let apartmentAvailability;
  try {
    apartmentAvailability = await ApartmentAvailability.findById(
      req.params.availabilityId
    );
    if (
      apartmentAvailability == null ||
      apartmentAvailability.post_id.toString() !== req.params.id
    ) {
      return res
        .status(404)
        .json({ message: "Apartment availability not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.apartmentAvailability = apartmentAvailability;
  next();
}

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
