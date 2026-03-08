 import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  days: Number,
  perDayBase: Number,
  addons: { activities: Number, buffer: Number },
  allocationPercent: { food: Number, stay: Number, transport: Number, misc: Number },
  totalBudget: Number,
  breakdown: {
    food: Number,
    stay: Number,
    transport: Number,
    misc: Number,
    addons: { activities: Number, buffer: Number },
  },
}, { _id: false });

const RouteSchema = new mongoose.Schema({
  start: { lat: Number, lng: Number },
  end: { lat: Number, lng: Number },
  distanceKm: Number,
  rate: Number,
  cost: Number,
}, { _id: false });

const BookingSchema = new mongoose.Schema({
  refId: { type: String, required: true },
  title: String,
  type: { type: String, enum: ['trip', 'service'], required: true },
  ts: { type: Date, default: Date.now },
}, { _id: true });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String }, // ✅ new field
  status: { type: String },
  budget: BudgetSchema,
  route: RouteSchema,
  bookings: [BookingSchema],
  lastKnownLocation: { lat: Number, lng: Number, accuracy: Number },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
