# ระบบจองคิวหลายบริการ (Multi-Service Booking System)

ระบบจัดการจองคิวสำหรับธุรกิจที่ให้บริการหลายประเภทพร้อมกัน เช่น ร้านตัดผม, สปา, คลินิกความงาม เป็นต้น พัฒนาด้วย Node.js, Express, MongoDB (Mongoose) และ Frontend แบบ Vanilla JS พร้อม Tailwind CSS CDN

### ข้อมูลรายชื่อสมาชิก
ชิษณุพงศ์ เจริญฐิติรัตน์ 660910488 
ศิรวัฒน์ มกรกิจวิบูลย์ 660910505 
ชินภัทร ศุภพฤกษ์พงศ์ 660910538

---## 📸 ภาพหลักฐานการดีบัก (Debugging Screenshots)
### 1. ภาพหน้าจอหน้าหลัก / รายการบริการ
![Services Page](./screenshots/services-page.png)

### 2. ภาพหน้าจอการจองคิว / Modal เพิ่มการจอง
![Booking Page](./screenshots/booking-page.png)

### 3. ภาพการทดลอง
![API Test](./screenshots/API-Test.png)

### 4. MongoDB
![MongoDB](./screenshots/MongoDB.png)


## 📋 ภาพรวมของแอปพลิเคชัน

### ฟีเจอร์หลัก
- **จัดการบริการ (Services CRUD)**: เพิ่ม แก้ไข ลบ แสดงรายการบริการ พร้อมระบุราคาและระยะเวลา
- **จัดการการจองคิว (Bookings CRUD)**: ลูกค้าสามารถจองหลายบริการในครั้งเดียว ระบบคำนวณราคารวมและระยะเวลารวมอัตโนมัติ
- **ระบบสถานะการจอง**: รองรับ 4 สถานะ - รอดำเนินการ, ยืนยันแล้ว, เสร็จสิ้น, ยกเลิก
- **UI 響應式**: ใช้งานได้ทั้ง Desktop และ Mobile

### เทคโนโลยีที่ใช้
| ส่วน | เทคโนโลยี |
|------|-----------|
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Frontend | HTML5, Vanilla JavaScript (ES6+) |
| CSS Framework | Tailwind CSS (CDN) |
| Font | Sarabun (Google Fonts) |
| Dev Tools | nodemon |

---

## 🚀 วิธีติดตั้งและรันโปรเจกต์

### ข้อกำหนดเบื้องต้น
- Node.js v18+ 
- npm หรือ yarn
- บัญชี MongoDB Atlas (หรือ MongoDB local)

### 1. Clone และเข้าสู่โฟลเดอร์โปรเจกต์
```bash
cd booking-system
```

### 2. ติดตั้ง dependencies
```bash
cd server
npm install
```

### 3. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` ในโฟลเดอร์ `server/` (หรือใช้ไฟล์ที่มีอยู่แล้ว):
```env
MONGODB_URI=mongodb+srv://auto1sirawat_db_user:1HzJbwFRUusvxpZX@cluster0.dbash7t.mongodb.net/?retryWrites=true&w=majority
PORT=5000
```

### 4. รันโปรเจกต์
**Development Mode (Auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

### 5. เข้าใช้งาน
เปิดเบราว์เซอร์ไปที่: `http://localhost:5000`

---

## 📁 โครงสร้างโปรเจกต์

```
booking-system/
├── server/
│   ├── index.js              # Entry point
│   ├── package.json
│   ├── .env
│   ├── models/
│   │   ├── Service.js        # Service Schema
│   │   └── Booking.js        # Booking Schema
│   └── routes/
│       ├── services.js       # Service API Routes
│       └── bookings.js       # Booking API Routes
└── public/
    ├── index.html            # Main HTML
    ├── css/
    └── js/
        └── app.js            # Frontend Logic
```

---

## 🔌 API Endpoints

### Services (บริการ)
Base URL: `/api/services`

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| GET | `/api/services` | ดึงรายการบริการทั้งหมด |
| GET | `/api/services/:id` | ดึงข้อมูลบริการตาม ID |
| POST | `/api/services` | สร้างบริการใหม่ |
| PUT | `/api/services/:id` | อัปเดตข้อมูลบริการ |
| DELETE | `/api/services/:id` | ลบบริการ |

**Request Body (POST/PUT):**
```json
{
  "name": "ตัดผม",
  "description": "ตัดผมชาย/หญิง ทรงใหม่",
  "price": 150,
  "duration": 30
}
```

---

### Bookings (การจองคิว)
Base URL: `/api/bookings`

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| GET | `/api/bookings` | ดึงรายการจองคิวทั้งหมด |
| GET | `/api/bookings/:id` | ดึงข้อมูลการจองตาม ID (พร้อม populate service) |
| POST | `/api/bookings` | สร้างการจองใหม่ |
| PUT | `/api/bookings/:id` | อัปเดตการจอง (รวมเปลี่ยนบริการได้) |
| PATCH | `/api/bookings/:id/status` | อัปเดตเฉพาะสถานะ |
| DELETE | `/api/bookings/:id` | ลบการจอง |

**Request Body (POST):**
```json
{
  "customerName": "สมชาย ใจดี",
  "phone": "0812345678",
  "serviceIds": ["service_id_1", "service_id_2"],
  "bookingDate": "2025-01-15",
  "bookingTime": "14:30",
  "notes": "ขอช่างผู้ชายครับ"
}
```

**Request Body (PUT):**
```json
{
  "customerName": "สมชาย ใจดี",
  "phone": "0812345678",
  "serviceIds": ["service_id_1", "service_id_2", "service_id_3"],
  "bookingDate": "2025-01-15",
  "bookingTime": "15:00",
  "status": "confirmed",
  "notes": "เปลี่ยนเวลาครับ"
}
```

**Request Body (PATCH /status):**
```json
{
  "status": "confirmed"
}
```

---

## 🗄️ Database Schema

### Service Collection
```javascript
{
  name: String,           // required
  description: String,    // optional
  price: Number,          // required, min: 0
  duration: Number,       // required, min: 1 (minutes)
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Collection
```javascript
{
  customerName: String,   // required
  phone: String,          // required
  services: [{            // array of selected services
    serviceId: ObjectId,  // ref: Service
    name: String,
    price: Number,
    duration: Number
  }],
  totalPrice: Number,     // auto-calculated
  totalDuration: Number,  // auto-calculated
  bookingDate: Date,      // required
  bookingTime: String,    // required (HH:mm)
  status: String,         // enum: pending, confirmed, completed, cancelled
  notes: String,          // optional
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌱 Seed Data (ข้อมูลตัวอย่างอัตโนมัติ)

ระบบมีฟีเจอร์ **Auto-seed 21 Services** เมื่อเชื่อมต่อ MongoDB และฐานข้อมูลว่างเปล่า จะเพิ่มบริการจาก 5 หมวดหมู่อัตโนมัติ:

| หมวดหมู่ | จำนวน | รายการตัวอย่าง |
|----------|--------|----------------|
| ร้านเสริมสวย & บาร์เบอร์ | 5 | ตัดผมชาย, ตัดผมหญิง, สระ-ไดร์, ทำสีผม, ทรีตเมนต์ |
| สปา & นวดเพื่อสุขภาพ | 5 | นวดไทย, นวดอโรมา, นวดฝ่าเท้า, ขัดผิว, นวดคอไหล่ |
| คาร์แคร์ & ดูแลรถยนต์ | 5 | ล้างรถ S-M/L-XL, เคลือบแว็กซ์, ซักเบาะ, อบโอโซน |
| ห้องสมุด | 3 | จองห้องส่วนตัว, โต๊ะโซนคอมพิวเตอร์, ยืมหนังสือพิเศษ |
| ร้านบอร์ดเกม | 3 | เล่นเหมา 3ชม., จองโต๊ะปาร์ตี้, คอร์สสอนกลยุทธ์ |

> **หมายเหตุ**: ข้อมูลจะถูกเพิ่มครั้งเดียวตอนรันเซิร์ฟเวอร์ครั้งแรก (ตรวจสอบจาก `Service.countDocuments() === 0`)

