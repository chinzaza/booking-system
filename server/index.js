require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const Service = require('./models/Service');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const seedServices = [
  { name: 'ตัดผมชาย', description: 'ตัดแต่งทรงผมชายร่วมสมัย พร้อมเซ็ต', price: 250, duration: 30 },
  { name: 'ตัดผมหญิง / ซอยผม', description: 'ออกแบบทรงผมและตัดแต่งตามสไตล์', price: 350, duration: 45 },
  { name: 'สระ-ไดร์', description: 'สระผมสะอาดพร้อมเป่าไดร์เซ็ตทรง', price: 150, duration: 20 },
  { name: 'ทำสีผมแฟชั่น', description: 'เปลี่ยนสีผมแฟชั่นพร้อมทรีตเมนต์บำรุง', price: 1200, duration: 120 },
  { name: 'ทรีตเมนต์บำรุงผมเสีย', description: 'อบไอน้ำและบำรุงล้ำลึกสำหรับผมแห้งเสีย', price: 600, duration: 45 },
  { name: 'นวดไทยแผนโบราณ', description: 'นวดผ่อนคลายกล้ามเนื้อทั่วร่างกาย', price: 350, duration: 60 },
  { name: 'นวดอโรมาน้ำมันหอมระเหย', description: 'นวดผ่อนคลายด้วยน้ำมันออร์แกนิก', price: 600, duration: 60 },
  { name: 'นวดฝ่าเท้า', description: 'กระตุ้นจุดสะท้อนฝ่าเท้าเพื่อสุขภาพ', price: 300, duration: 45 },
  { name: 'ขัดผิวขาวใสสมุนไพร', description: 'ผลัดเซลล์ผิวด้วยสมุนไพรธรรมชาติ', price: 700, duration: 60 },
  { name: 'นวดคอ บ่า ไหล่', description: 'เน้นแก้ปัญหาอาการออฟฟิศซินโดรม', price: 300, duration: 45 },
  { name: 'ล้างสี ดูดฝุ่น (ขนาด S-M)', description: 'ล้างตัวรถภายนอกพร้อมดูดฝุ่นภายใน', price: 200, duration: 45 },
  { name: 'ล้างสี ดูดฝุ่น (ขนาด L-XL / SUV)', description: 'สำหรับรถขนาดใหญ่หรือรถอเนกประสงค์', price: 250, duration: 60 },
  { name: 'เคลือบสีแว็กซ์พรีเมียม', description: 'เพิ่มความเงางามและปกป้องสีรถ', price: 400, duration: 45 },
  { name: 'ซักเบาะผ้า / ซักพรม', description: 'กำจัดคราบฝังลึกและกลิ่นอับภายในห้องโดยสาร', price: 1200, duration: 120 },
  { name: 'อบโอโซนฆ่าเชื้อภายใน', description: 'ฆ่าเชื้อโรคและกลิ่นไม่พึงประสงค์ในรถ', price: 300, duration: 30 },
  { name: 'จองห้องอ่านหนังสือส่วนตัว (รายชั่วโมง)', description: 'ห้องส่วนตัวเงียบสงบสำหรับอ่านหนังสือหรือทำงานกลุ่ม', price: 50, duration: 60 },
  { name: 'จองโต๊ะอ่านหนังสือโซนคอมพิวเตอร์', description: 'โต๊ะพร้อมปลั๊กไฟและอินเทอร์เน็ตความเร็วสูง', price: 30, duration: 60 },
  { name: 'บริการยืม-คืนหนังสือพิเศษ', description: 'ค่าธรรมเนียมบริการยืมหนังสือหายากหรือหนังสือต่างประเทศ', price: 20, duration: 15 },
  { name: 'เล่นบอร์ดเกม (แพ็กเกจเหมา 3 ชั่วโมง)', description: 'เล่นบอร์ดเกมได้ทุกเกมในร้านพร้อมแอดมินช่วยสอนกฎ', price: 150, duration: 180 },
  { name: 'จองโต๊ะจัดปาร์ตี้บอร์ดเกม (โซนพิเศษ)', description: 'โต๊ะใหญ่พิเศษสำหรับกลุ่มเพื่อน 4-8 คน พร้อมเครื่องดื่มต้อนรับ', price: 300, duration: 180 },
  { name: 'คอร์สสอนเล่นบอร์ดเกมกลยุทธ์', description: 'สอนเทคนิคการเล่นเกมแนว Strategy โดยผู้เชี่ยวชาญ', price: 200, duration: 120 }
];

async function seedDatabase() {
  try {
    const count = await Service.countDocuments();
    if (count === 0) {
      await Service.insertMany(seedServices);
      console.log('Seeded 21 services to database');
    } else {
      console.log(`Database already has ${count} services, skipping seed`);
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');
    await seedDatabase();
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});