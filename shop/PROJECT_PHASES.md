# SHOPNAME E-Commerce: สรุปขั้นตอนการพัฒนาแต่ละ Phase

เว็บขายเกมแบบ Full-stack ด้วย React + Vite + React Router + Supabase (PostgreSQL) สถานะปัจจุบัน: **ครบทั้ง 9 Phase แล้ว** (รวมการ Login ด้วย Username)

| Phase | หัวข้อ | สถานะ |
|---|---|---|
| 1 | UI Foundation | เสร็จ |
| 2 | Product (Home, Products, Detail) | เสร็จ |
| 3 | Cart | เสร็จ |
| 4 | Authentication | เสร็จ |
| 5 | Checkout | เสร็จ |
| 6 | Orders | เสร็จ |
| 7 | Profile, Wishlist, ยกเลิกออเดอร์ | เสร็จ |
| 8 | Admin (Layout, Dashboard, Products, Orders, Users, Analytics) | เสร็จ |
| 9 | Polish + README | เสร็จ |

---

## วิธีรันโปรเจกต์

```bash
cp .env.example .env        # ใส่ VITE_SUPABASE_ANON_KEY
npm install && npm run dev  # http://localhost:5173
```

หรือใช้ Docker:

```bash
docker compose up --build                       # dev  -> :5173
docker compose --profile prod up --build prod   # prod -> :8080
```

> Vite อ่านไฟล์ `.env` ตอนเริ่มทำงานเท่านั้น แก้ `.env` แล้วต้องรีสตาร์ต (Docker: `docker compose down` แล้ว `up` ใหม่)

---

## Phase 1: UI Foundation

**เป้าหมาย:** โครงเว็บ, routing, layout, design system

**ขั้นตอน**
1. สร้างโปรเจกต์ Vite + React, ติดตั้ง `react-router-dom`
2. วาง design tokens เป็น CSS variables ใน `index.css` (สีตาม brief, radius 10-14px, shadow บางๆ, ฟอนต์ Plus Jakarta Sans)
3. สร้าง `Navbar` (โลโก้ซ้าย, ลิงก์กลาง, ไอคอนขวา, badge ตะกร้า, hamburger บนมือถือ), `Footer`, `MainLayout` (มี skip link)
4. ตั้ง routing ทุกหน้าใน `AppRoutes.jsx` ใช้หน้า placeholder ไปก่อน และมี `ScrollToTop` + 404
5. คอมโพเนนต์พื้นฐาน: `Button`, `Loading`, `Icons` (inline SVG)

**ไฟล์หลัก:** `routes/AppRoutes.jsx`, `layouts/MainLayout.jsx`, `components/{Navbar,Footer,Button,Loading,Icons}.jsx`, `index.css`

**Commit แนะนำ:** `feat: setup project foundation and layout`

---

## Phase 2: Product

**เป้าหมาย:** หน้าแสดงสินค้า ค้นหา กรอง เรียง แบ่งหน้า

**ขั้นตอน**
1. ทำ data layer `productService.js` (เริ่มด้วย mock 16 เกมใน 4 หมวด: Action, RPG, Strategy, Indie) และ hook `useAsync` จัดการ loading/error/reload
2. คอมโพเนนต์: `ProductCard`, `ProductGrid` (skeleton, error + Try again, empty state), `ProductImage` (fallback เมื่อไม่มีรูป), `Rating`, `SearchBar` (debounce), `FilterPanel` (drawer บนมือถือ), `Pagination`, `CategoryCards`
3. หน้า: `Home` (Hero, Categories, Featured, Promo, Newsletter), `Products`, `ProductDetail`, `Categories`
4. เก็บ search/filter/sort/page ไว้ใน URL query (`/products?category=RPG&sort=rating`) แชร์ลิงก์และ refresh ได้
5. รูปสินค้า: วางไฟล์ `public/images/products/{id}.jpg` ถ้าไม่มีไฟล์จะใช้ placeholder

**Commit แนะนำ:** `feat: add product listing`, `feat: add product detail and filters`

> เสริมระหว่าง Phase: เพิ่ม Docker (`Dockerfile` 3 stage, `docker-compose.yml`, `nginx.conf` สำหรับ SPA fallback)

---

## Phase 3: Cart

**เป้าหมาย:** ตะกร้า จำนวน คูปอง สรุปยอด

**ขั้นตอน**
1. `CartContext` เก็บลง localStorage (refresh แล้วไม่หาย) จำนวนไม่เกิน stock
2. `lib/pricing.js` เป็นที่คำนวณ subtotal / discount / shipping / total แห่งเดียว (ค่าส่ง $10, ฟรีเมื่อยอดหลังลดครบ $100)
3. `ToastContext` + `useAddToCart` ให้ปุ่ม Add to Cart มี feedback
4. คอมโพเนนต์: `CartItem`, `CouponForm`, `OrderSummary` (ใช้ซ้ำใน Checkout/Order Detail) และหน้า `Cart`
5. คูปองทดสอบ: `SAVE10`, `GAME20` (ครบ $50), `WELCOME5`

**Commit แนะนำ:** `feat: implement shopping cart`, `feat: add coupon support`

---

## Phase 4: Authentication

**เป้าหมาย:** สมัคร / ล็อกอิน / ออกจากระบบ / protected routes

**ขั้นตอน**
1. สร้าง Supabase client (`lib/supabase.js`) ใช้เฉพาะ **Project URL + anon key** ห้ามใช้ DB password หรือ `service_role` ในโค้ดฝั่งเว็บ
2. ฐานข้อมูล: ตาราง `profiles` (role, status), trigger สร้างโปรไฟล์อัตโนมัติเมื่อสมัคร, ฟังก์ชัน `is_admin()`, เปิด RLS
3. ล็อกคอลัมน์: ผู้ใช้แก้ได้แค่ `name, phone, address` (แก้ `role` เองไม่ได้)
4. `AuthContext` (session คงอยู่หลัง refresh), `authService`, `ProtectedRoute` (รองรับ `adminOnly`)
5. หน้า `Login`, `Register` พร้อม validation และ `FormField`
6. **Login ด้วย Username (เพิ่มภายหลัง):** ตาราง `profiles` มีคอลัมน์ `username` (3-20 ตัว: ตัวอักษร ตัวเลข `_` `.` ไม่สนตัวพิมพ์เล็กใหญ่, unique) ช่อง Login รับ "Email or username" ถ้าไม่มี `@` จะเรียก RPC `email_for_username` แปลงเป็นอีเมลก่อนเข้าสู่ระบบ หน้า Register มีช่อง Username พร้อมตรวจชื่อซ้ำด้วย `username_available` และ trigger จะสร้าง username ให้อัตโนมัติถ้าไม่ได้ระบุ
   - **ข้อแลกเปลี่ยน:** ฟังก์ชันแปลง username เป็นอีเมลต้องเรียกได้ก่อนล็อกอิน จึงมีคนเดาชื่อเพื่อดูอีเมลของ username นั้นได้ ถ้าต้องการเข้มขึ้นให้เพิ่ม rate limit

**ทำให้เป็น admin** (รันใน SQL Editor):
```sql
update public.profiles set role = 'admin' where email = 'your@email.com';
```

**Commit แนะนำ:** `feat: add authentication with Supabase`

---

## Phase 5: Checkout

**เป้าหมาย:** สั่งซื้อจริง บันทึกลงฐานข้อมูล ตัด stock

**ขั้นตอน**
1. ย้ายสินค้าจาก mock ขึ้น Supabase: ตาราง `categories`, `products`, `coupons`, `orders`, `order_items` (เลขออเดอร์ `ORD-10001`...) พร้อม RLS
2. `productService` เปลี่ยนเป็น query ฐานข้อมูลจริง (UI ไม่ต้องแก้)
3. ฟังก์ชัน `place_order` (RPC): ล็อกแถว ตรวจ stock คิดราคา/ส่วนลด/ค่าส่ง**จากราคาในฐานข้อมูล** สร้างออเดอร์ ตัด stock ในขั้นตอนเดียว ฝั่งเว็บส่งแค่ id, จำนวน, รหัสคูปอง
4. ฟังก์ชัน `validate_coupon` (RPC) ตรวจคูปองโดยไม่เปิดเผยทั้งตาราง
5. หน้า `Checkout` (ฟอร์มจัดส่ง 8 ช่อง, เลือกวิธีชำระเงิน 3 แบบ, ช่องบัตรเป็นแค่เดโม ไม่ส่ง/ไม่เก็บ), `OrderSuccess`, `validateCheckout`

**Commit แนะนำ:** `feat: implement checkout and order creation`, `fix: validate checkout form`

---

## Phase 6: Orders

**เป้าหมาย:** ประวัติคำสั่งซื้อและรายละเอียด

**ขั้นตอน**
1. `orderService`: `getMyOrders` (แบ่งหน้า 10 รายการ), `getOrderById`
2. คอมโพเนนต์: `OrderCard` (แถวในตาราง), `StatusBadge`, `OrderTimeline` (Confirmed → Processing → Shipped → Delivered, ถ้ายกเลิกจะแสดงข้อความแทน)
3. หน้า `Orders` และ `OrderDetail` (รายการสินค้า, ที่อยู่จัดส่ง, วิธีชำระเงิน, สรุปยอด)
4. ความปลอดภัยมาจาก RLS ลูกค้าเห็นเฉพาะออเดอร์ตัวเอง

**Commit แนะนำ:** `feat: add order history and order detail`

---

## Phase 7: Profile, Wishlist, ยกเลิกออเดอร์

**ขั้นตอน**
1. **Profile:** `userService.updateProfile`, หน้า `Profile` (โหมดดู/แก้ไข, อีเมลแก้ไม่ได้)
2. **Wishlist:** ตาราง `wishlists` (RLS เฉพาะของตัวเอง, `user_id` default เป็น `auth.uid()`), `WishlistContext` (optimistic update + rollback), หัวใจบนการ์ดและหน้า Product Detail, badge ใน Navbar, หน้า `Wishlist`
3. **ยกเลิกออเดอร์:** ฟังก์ชัน `cancel_order` (RPC) ตรวจเจ้าของ + ต้องเป็น Pending + คืน stock + เปลี่ยนสถานะ, ปุ่มใน Order Detail พร้อม `ConfirmModal`

**Commit แนะนำ:** `feat: add profile and wishlist`, `feat: allow customers to cancel pending orders`

---

## Phase 8: Admin

**เป้าหมาย:** หลังบ้านสำหรับจัดการร้าน (เข้าได้เฉพาะ role `admin` และฐานข้อมูลตรวจสิทธิ์ซ้ำอีกชั้น)

**ขั้นตอน (รอบที่ 1)**
1. `AdminLayout` (sidebar แยกจากหน้าร้าน, ครอบด้วย `ProtectedRoute adminOnly`), Navbar หน้าร้านมีลิงก์ Admin เฉพาะ admin
2. Dashboard: ฟังก์ชัน `admin_dashboard()` สรุปรายได้/ออเดอร์/ผู้ใช้/สินค้า, กราฟ 6 เดือน, ออเดอร์และผู้ใช้ล่าสุด กราฟเป็น SVG เอง (`BarChart`) ไม่เพิ่ม package
3. Products CRUD: ค้นหา กรอง เรียง แบ่งหน้า ฟอร์ม validation และ `ConfirmModal` ก่อนลบ (สินค้าที่เคยมีออเดอร์ลบไม่ได้ ให้ตั้งเป็น Draft)

**ขั้นตอน (รอบที่ 2)**
4. Orders: เปลี่ยนสถานะด้วย RPC `admin_set_order_status` (ยกเลิกแล้วคืน stock, เปิดออเดอร์ที่ยกเลิกแล้วไม่ได้)
5. Users: ค้นหา กรอง ดูรายละเอียด เปลี่ยน role / disable ด้วย RPC `admin_update_user` (แก้ของตัวเองไม่ได้) และ trigger กันบัญชีที่ถูกปิดสั่งซื้อ
6. Analytics: RPC `admin_analytics` กราฟเส้นรายได้ 12 เดือน (`LineChart`), กราฟแท่งออเดอร์, สัดส่วนหมวด, Top 5 สินค้า

**Commit แนะนำ:** `feat: add admin dashboard and product management`, `feat: add admin orders, users and analytics`

---

## Phase 9: Polish

**เป้าหมาย:** ความสมบูรณ์ ความเสถียร การเข้าถึง และเอกสาร

**ที่ทำ**
1. **Loading / Error / Empty states:** ตรวจครบทุกหน้าที่ดึงข้อมูล (Home, Products, Detail, Orders, Wishlist, Admin ทุกหน้า) และเพิ่ม `ErrorBoundary` กันหน้าขาวเมื่อ render พัง
2. **Animation:** fade-in เมื่อเปลี่ยนหน้า, hover การ์ดสินค้า, modal/toast เข้าเบาๆ (ปิดอัตโนมัติถ้าผู้ใช้ตั้ง reduced motion)
3. **Accessibility:** ย้าย focus ไปเนื้อหาหลักเมื่อเปลี่ยนหน้า, focus trap ใน Modal, title ของแท็บเปลี่ยนตามหน้า (และชื่อสินค้า)
4. **Performance:** แยก code ตาม route ด้วย `React.lazy` (Cart, Checkout, Orders, Profile, Wishlist, Admin ทั้งหมด), แยก vendor chunk (`react`, `supabase`) เพื่อแคชได้ดี, รูป lazy + async decode
5. **ความปลอดภัยฐานข้อมูล:** รัน Supabase security advisors แล้วเก็บกวาดสิทธิ์ฟังก์ชัน trigger ที่ไม่จำเป็น ส่วนฟังก์ชัน RPC ที่เหลือจำเป็นต้องเรียกได้และตรวจสิทธิ์ภายในเอง
6. **README.md** สำหรับ Portfolio (Overview, Features, Tech Stack, Schema, Installation, Env, Docker, Demo account, Resume summary)

**ที่ยังต้องทำเอง**
- ทดสอบ responsive บนอุปกรณ์/เบราว์เซอร์จริง (Desktop, Tablet, Mobile) เพราะยังไม่ได้เปิดดูภาพจริง
- ใส่ screenshots ลง README และรูปสินค้าใน `public/images/products/`
- เปิด **Leaked password protection** ใน Supabase (Authentication → Policies หรือ Password security ถ้าแผนรองรับ)
- Push ขึ้น GitHub พร้อม commit ที่สื่อความหมาย

---

## โครงสร้างฐานข้อมูลปัจจุบัน

```text
profiles ─┬─ orders ── order_items ── products ── categories
          └─ wishlists ─────────────── products
coupons (เข้าถึงผ่าน RPC เท่านั้น)

profiles มีคอลัมน์ username (unique) สำหรับ Login
```

| ฟังก์ชัน | หน้าที่ |
|---|---|
| `is_admin()` | ใช้ใน RLS policy |
| `handle_new_user()` | trigger สร้างโปรไฟล์ตอนสมัคร |
| `validate_coupon(code, subtotal)` | ตรวจคูปอง |
| `place_order(items, shipping, payment, coupon)` | สร้างออเดอร์ + ตัด stock |
| `cancel_order(order_id)` | ลูกค้ายกเลิกออเดอร์ Pending + คืน stock |
| `username_available(username)` | ตรวจชื่อผู้ใช้ซ้ำตอนสมัคร |
| `email_for_username(username)` | แปลง username เป็นอีเมลตอน Login |
| `admin_dashboard()` / `admin_analytics()` | สรุปข้อมูลสำหรับ admin |
| `admin_set_order_status(order_id, status)` | admin เปลี่ยนสถานะ (ยกเลิก = คืน stock) |
| `admin_update_user(user_id, role, status)` | admin เปลี่ยน role / disable |
| `block_disabled_orders()` | trigger กันบัญชีที่ถูกปิดสั่งซื้อ |

---

## ปัญหาที่เจอบ่อยและวิธีแก้

| อาการ | สาเหตุ / วิธีแก้ |
|---|---|
| เปิด `index.html` ตรงๆ แล้วหน้าขาว | ต้องรันผ่าน `npm run dev` หรือ Docker |
| `Failed to resolve import "@supabase/supabase-js"` ใน Docker | volume `node_modules` เก่า รัน `docker compose down -v` แล้ว `up --build` |
| ขึ้น "Supabase is not configured" | ยังไม่มี `.env` หรือยังไม่ได้รีสตาร์ต container หลังแก้ |
| สมัครแล้วขึ้น `email rate limit exceeded` | Supabase จำกัดอีเมลยืนยัน ปิด Confirm email ที่ Authentication → Providers → Email หรือสร้างผู้ใช้ใน Dashboard แบบ Auto Confirm |
| ล็อกอินไม่ได้หลังสมัคร | ยังไม่ได้ยืนยันอีเมล (ถ้าเปิด Confirm email) |
| Login ด้วย username แล้วขึ้น Invalid login credentials | username ไม่มีอยู่ หรือรหัสผ่านผิด (ระบบใช้ข้อความเดียวกัน) ลองด้วยอีเมลเพื่อตรวจ |
| เข้า `/admin` แล้วถูกเด้งกลับหน้าแรก | บัญชีนี้ยังไม่ใช่ admin ให้รัน SQL ตั้ง role ในหัวข้อ Phase 4 |
| ลบสินค้าไม่ได้ | สินค้านั้นเคยมีออเดอร์ ให้ตั้งสถานะเป็น Draft แทน |

---

## ข้อควรระวังด้านความปลอดภัย

- ห้ามใส่ DB password หรือ `service_role` key ในโค้ดเว็บและห้าม commit `.env` (อยู่ใน `.gitignore` แล้ว)
- ถ้าเคยวางรหัสผ่านฐานข้อมูลในที่สาธารณะหรือในแชต ให้ Reset ที่ Project Settings → Database
- ราคา ส่วนลด และ stock คำนวณที่ฝั่งฐานข้อมูลเสมอ ไม่เชื่อค่าจากเบราว์เซอร์
- ไม่เก็บรหัสผ่านหรือเลขบัตรเครดิตในฐานข้อมูลของเรา (ช่องบัตรเป็นเดโม)
