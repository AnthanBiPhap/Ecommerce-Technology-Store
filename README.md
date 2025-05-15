# Ecommerce Technology Store

Ecommerce Technology Store là một dự án website bán hàng công nghệ, bao gồm hệ thống quản lý sản phẩm, người dùng, và đơn hàng. Dự án được tổ chức thành ba phần chính:

* **backend-api** (Node.js): API backend, xử lý logic và giao tiếp với database.
* **frontend** (Next.js): Giao diện người dùng, hiển thị sản phẩm và trang thanh toán.
* **react-admin** (Express + Node.js): Trang quản trị để quản lý sản phẩm, đơn hàng, và người dùng.

## 📂 Cấu trúc thư mục

```
/ecommerce-technology-store
|-- /backend-api (Node.js)
|-- /front-end (Next.js)
|-- /react-admin (Express + Node.js)
|-- .gitignore
|-- README.md
```

## 🚀 Cài đặt và chạy dự án

### 1. Clone repository

```bash
git clone https://github.com/your-username/ecommerce-technology-store.git
cd ecommerce-technology-store
```

### 2. Cài đặt dependencies

```bash
cd backend-api
npm install
cd ../front-end
npm install
cd ../react-admin
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` theo `.env.example` trong mỗi thư mục và điền các biến môi trường cần thiết (API keys, database URIs, v.v.).

### 4. Chạy server

```bash
cd backend-api
npm start
```

```bash
cd front-end
npm run dev
```

```bash
cd react-admin
npm start
```

## 📌 Ghi chú

* Đảm bảo đã cài đặt Node.js và MongoDB trên máy tính.
* Kiểm tra cấu hình CORS nếu ecommerce-frontend và backend chạy trên các port khác nhau.

## 💡 Đóng góp

Mọi đóng góp đều được hoan nghênh! Hãy tạo pull request hoặc báo lỗi nếu bạn gặp vấn đề.

## 📄 License

Dự án này được phát hành theo giấy phép MIT.
