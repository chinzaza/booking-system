const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  services: [{
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    name: String,
    price: Number,
    duration: Number
  }],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalDuration: {
    type: Number,
    required: true,
    min: 1
  },
  bookingDate: {
    type: Date,
    required: true
  },
  bookingTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);