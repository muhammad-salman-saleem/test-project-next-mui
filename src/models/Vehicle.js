import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  carModel: { type: String, required: true, minlength: 3 },
  price: { type: Number, required: true },
  phone: { type: String, required: true, length: 11 },
  city: { type: String, required: true },
  pictureUrls: { type: [String], required: true },
});

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
