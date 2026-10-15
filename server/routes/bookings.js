const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('services.serviceId');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customerName, phone, serviceIds, bookingDate, bookingTime, notes } = req.body;
    
    const services = await Service.find({ _id: { $in: serviceIds } });
    if (services.length !== serviceIds.length) {
      return res.status(400).json({ error: 'One or more services not found' });
    }
    
    const bookingServices = services.map(s => ({
      serviceId: s._id,
      name: s.name,
      price: s.price,
      duration: s.duration
    }));
    
    const totalPrice = bookingServices.reduce((sum, s) => sum + s.price, 0);
    const totalDuration = bookingServices.reduce((sum, s) => sum + s.duration, 0);
    
    const booking = new Booking({
      customerName,
      phone,
      services: bookingServices,
      totalPrice,
      totalDuration,
      bookingDate: new Date(bookingDate),
      bookingTime,
      notes
    });
    
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { customerName, phone, serviceIds, bookingDate, bookingTime, status, notes } = req.body;
    
    let updateData = { customerName, phone, bookingDate: new Date(bookingDate), bookingTime, status, notes };
    
    if (serviceIds && serviceIds.length > 0) {
      const services = await Service.find({ _id: { $in: serviceIds } });
      if (services.length !== serviceIds.length) {
        return res.status(400).json({ error: 'One or more services not found' });
      }
      
      const bookingServices = services.map(s => ({
        serviceId: s._id,
        name: s.name,
        price: s.price,
        duration: s.duration
      }));
      
      updateData.services = bookingServices;
      updateData.totalPrice = bookingServices.reduce((sum, s) => sum + s.price, 0);
      updateData.totalDuration = bookingServices.reduce((sum, s) => sum + s.duration, 0);
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('services.serviceId');
    
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;