"use client"
import { useState } from "react"
import { Laptop, Smartphone, Headphones, Camera, Watch, Tv, Gamepad, Home, ChevronRight, LaptopMinimal, PcCase, MemoryStick, Speaker, Monitor, Keyboard, Mouse, Armchair, Router, Gamepad2, Cable, Gift } from "lucide-react";
import { buildSlug } from "@/libs/slugify.helper";

const generateLink = (category: string, subcategory: string, title: string) => {
  // Link cho thương hiệu
  if (subcategory.toLowerCase().includes("thương hiệu")) {
    return `/products?category_slug=${buildSlug(category)}&brand_slug=${buildSlug(title)}`;
  }

      
  // Link cho giá bán
  if (subcategory.toLowerCase().includes("giá")) {
    if (title.includes("Dưới 500 nghìn")) return `products?category_slug=${buildSlug(category)}&price_lte=500000`;
    if (title.includes("500 nghìn đến 1 triệu")) return `products?category_slug=${buildSlug(category)}&price_gte=500000&price_lte=1000000`;
    if (title.includes("Dưới 1 triệu")) return `products?category_slug=${buildSlug(category)}&price_lte=1000000`;
    if (title.includes("1 triệu đến 2 triệu")) return `products?category_slug=${buildSlug(category)}&price_gte=1000000&price_lte=2000000`;
    if (title.includes("2 triệu đến 3 triệu")) return `products?category_slug=${buildSlug(category)}&price_gte=2000000&price_lte=3000000`;
    if (title.includes("3 triệu đến 4 triệu")) return `products?category_slug=${buildSlug(category)}&price_gte=3000000&price_lte=4000000`;
    if (title.includes("Trên 3 triệu")) return `products?category_slug=${buildSlug(category)}&price_gte=3000000`;
    if (title.includes("Trên 4 triệu")) return `products?category_slug=${buildSlug(category)}&price_gte=4000000`;
    if (title.includes("Trên 10 triệu")) return `products?category_slug=${buildSlug(category)}&price_gte=10000000`;
    if (title.includes("Dưới 15 triệu")) return `products?category_slug=${buildSlug(category)}&price_lte=15000000`;
    if (title.includes("Trên 20 triệu")) return `products?category_slug=${buildSlug(category)}&price_gte=20000000`;
    if (title.includes("15 triệu đến 20 triệu")) return `products?category_slug=${buildSlug(category)}&price_gte=15000000&price_lte=20000000`;
    if (title.includes("Dưới 5 triệu")) return `products?category_slug=${buildSlug(category)}&price_lte=5000000`;
    if (title.includes("5 triệu đến 10 triệu")) return `products?category_slug=${buildSlug(category)}&price_gte=5000000&price_lte=10000000`;
    if (title.includes("10 triệu đến 20 triệu")) return `products?category_slug=${buildSlug(category)}&price_gte=10000000&price_lte=20000000`;
    if (title.includes("20 triệu đến 30 triệu")) return `products?category_slug=${buildSlug(category)}&price_gte=20000000&price_lte=30000000`;
    if (title.includes("Trên 30 triệu")) return `products?category_slug=${buildSlug(category)}&price_gte=30000000`;
  }
      
  // Link mặc định theo search
  return `/products?category_slug=${buildSlug(category)}&search=${buildSlug(title)}`;
};    

// Sample categories data
const menu = [
  {
    name: "Laptop",
    icon: <Laptop className="h-4 w-4" />,
    subcategories: [
      { name: "Thương hiệu", items: ["ASUS", "ACER", "MSI", "LENOVO", "DELL", "HP-Pavilion", "LG-Gram"]},
      { name: "Giá bán", items: ["Dưới 15 triệu", "Từ 15 triệu đến 20 triệu", "Trên 20 triệu"] },
      { name: "CPU Intel - AMD", items: ["Intel i3", "Intel i5", "Intel i7", "AMD Ryzen"] },
      { name: "Nhu cầu sử dụng", items: ["Đồ họa", "Học sinh - Sinh viên", "Mỏng nhẹ cao cấp"] },
      { name: "Linh kiện Laptop", items: ["Ram laptop", "SSD laptop", "Ổ cứng di động"] },
      { name: "Laptop ASUS", items: ["ASUS OLED Series", "Vivobook Series", "Zenbook Series"] },
      { name: "Laptop ACER", items: ["Aspire Series", "Swift Series"] },
      { name: "Laptop MSI", items: ["Modem Series", "Prestige Series"] },
      { name: "Laptop Lenovo", items: ["Thinkbook Series", "Ideapad Series", "Thinkpad Series", "Yoga Series"] },
      { name: "Laptop Dell", items: ["inspirion Series", "Vostro Series", "Latitude Series", "XPS Series"] },
    ].map((subcategory) => ({
      ...subcategory,
      items: subcategory.items.map((item) => ({
        title: item,
        link: generateLink("Laptop", subcategory.name, item),
      })),
    })),
  },
   {
    name: "PC GVN",
    icon: <PcCase className="h-4 w-4" />,
    subcategories: [
      { name: "KHUYẾN MÃI HOT", items: ["PC RTX 5090", "PC RTX 5080", "PC RTX 5070", "PC GVN RTX 5070Ti", "PC RTX 4060"] },
      { name: "PC KHUYẾN MÃI", items: ["BTF i7 - 4070Ti Super", "I5 - 4060", "I5 - 4060Ti", "PC RX 6600 - 12TR690", "PC RX 6500 - 9TR990"] },
      { name: "PC theo cấu hình VGA", items: ["PC sử dụng VGA 1650", "PC sử dụng VGA 3050", "PC sử dụng VGA 3060", "PC sử dụng VGA RX 6600", "PC sử dụng VGA RX 6500", "PC sử dụng VGA RX 4060", "PC sử dụng VGA RX 4070", "PC sử dụng VGA RX 4080", "PC sử dụng VGA RX 4090"] },
      { name: "A.I PC - GVN", items: ["PC GVN X ASUS - PBA", "PC GVN X MSI"] },
      { name: "PC theo CPU Intel", items: ["PC Core I3", "PC Core I5", "PC Core I7", "PC Core I9", "PC Ultra 7", "PC Ultra 9"] },
      { name: "PC theo CPU AMD", items: ["PC AMD R3", "PC AMD R5", "PC AMD R7", "PC AMD R9"] },
      { name: "PC Văn phòng", items: ["Homework Athlon", "Homework R3", "Homework R5", "Homework I5"] },
    ].map((subcategory) => ({
      ...subcategory,
      items: subcategory.items.map((item) => ({
        title: item,
        link: generateLink("PC", subcategory.name, item),
      })),
    })),
  },
  
  {
    name: "Main, CPU, VGA",
    icon: <PcCase className="h-4 w-4" />,
    subcategories: [
      { name: "VGA RTX 50 SERIES", items: ["RTX 5090", "RTX 5080", "RTX 5070Ti", "RTX 5070", "RTX 5060Ti"] },
      { name: "VGA(Trên 12GB VRAM)", items: ["RTX 4070 SUPER (12GB)", "RTX 4070Ti SUPER (16GB)", "RTX 4080 SUPER (16GB)", "RTX 4090 SUPER (24GB)"] },
      { name: "VGA(Dưới 12GB VRAM)", items: ["RTX 4060Ti (8-16GB)", "RTX 4060 (8GB)", "RTX 3060 (12GB)", "RTX 3050 (6-8GB)", "RTX 1650 (4GB)", "GT 710 / GT 1030 (2-4GB)"] },
      { name: "VGA - Card màn hình", items: ["NVIDIA Quato", "AMD Radeon"] },
      { name: "Bo mạch chủ Intel", items: ["Z890", "Z790", "B760", "H610", "X299X"] },
      { name: "Bo mạch chủ AMD", items: ["AMD X870 (Mới)", "AMD X670", "AMD X570", "AMD B650 (Mới)", "AMD B550", "AMD A320", "AMD TRX40"] },
      { name: "CPU - Bộ vi xử lý Intel", items: ["CPU Intel Core Ultra Series 2", "CPU Intel 9", "CPU Intel 7", "CPU Intel 5", "CPU Intel 3"] },
      { name: "CPU - Bộ vi xử lý AMD", items: ["CPU AMD Athlon", "CPU AMD R3", "CPU AMD R5", "CPU AMD R7", "CPU AMD R9"] },
    ].map((subcategory) => ({
      ...subcategory,
      items: subcategory.items.map((item) => ({
        title: item,
        link: generateLink("CPU", subcategory.name, item),
      })),
    })),
  },
  {
    name: "Case, Nguồn, Tản",
    icon: <PcCase className="h-4 w-4" />,
    subcategories: [
      { name: "Case - Theo Thương hiệu", items: ["Case ASUS", "Case Corsair", "Case Lianli", "Case NZXT", "Case Inwin", "Case Thermaltake"].map((item) => ({title: item, link: `products?category_slug=case&brand_slug=${item.split(" ")[1].toLowerCase()}`}))},
      { name: "Case - Theo giá", items: ["Dưới 1 triệu", "1 triệu đến 2 triệu", "Trên 2 triệu"].map((item) => {
        if (item === "Dưới 1 triệu") {
          return { title: item, link: "products?category_slug=case&price_lte=1000000" };
        } else if (item === "1 triệu đến 2 triệu") {
          return { title: item, link: "products?category_slug=case&price_gte=1000000&price_lte=2000000" };
        } else if (item === "Trên 2 triệu") {
          return { title: item, link: "products?category_slug=case&price_gte=2000000" };
        }
        return { title: item, link: "products?category_slug=case" };
      })},
      { name: "Nguồn - Theo Thương hiệu", items: ["Nguồn ASUS", "Nguồn DeepCool", "Nguồn NZXT", "Nguồn MSI"].map((item) => ({title: item, link: `products?category_slug=nguon&brand_slug=${item.split(" ")[1].toLowerCase()}`})) },
      { name: "Nguồn - Theo công suất", items: ["Từ 400w - 500w", "Từ 500w - 600w", "Từ 700w - 800w", "Trên 1000w"].map((item) => {
        if (item === "Từ 400w - 500w") {
          return { title: item, link: "products?category_slug=nguon&capacity_gte=400&capacity_lte=500" };
        } else if (item === "Từ 500w - 600w") {
          return { title: item, link: "products?category_slug=nguon&capacity_gte=500&capacity_lte=600" };
        } else if (item === "Từ 700w - 800w") {
          return { title: item, link: "products?category_slug=nguon&capacity_gte=700&capacity_lte=800" };
        } else if (item === "Trên 1000w") {
          return { title: item, link: "products?category_slug=nguon&capacity_gte=1000" };
        }
        return { title: item, link: "products?category_slug=nguon" };
      }) },
      { name: "Phụ kiện PC", items: ["Dây LED", "Dây rise - Dựng VGA", "Giá đỡ VGA", "Keo tản nhiệt"].map((item) => ({title: item, link: `products?category_slug=phu-kien&search=${buildSlug(item)}`})) },
      { name: "Loại tản nhiệt", items: ["Tản nhiệt AIO 240mm", "Tản nhiệt AIO 280mm", "Tản nhiệt AIO 360mm", "Tản nhiệt AIO 420mm", "Tản nhiệt khí", "Fan RGB"].map((item) => ({title: item, link: `products?category_slug=tan-nhiet&search=${buildSlug(item)}`})) },
    ],
  },
  {
    name: "Ổ cứng, RAM, Thẻ nhớ",
    icon: <MemoryStick className="h-4 w-4" />,
    subcategories: [
      { name: "Dung lượng RAM", items: ["8GB", "16GB", "32GB", "64GB"] },
      { name: "Loại RAM", items: ["DDR4", "DDR5"] },
      { name: "Thương hiệu RAM", items: ["Corsair", "Kingston", "G.Skill", "PNY"] },
      { name: "Dung lượng HDD", items: ["HDD 1TB", "HDD 2TB", "HDD 4TB - 6TB", "HDD trên 8TB"] },
      { name: "Thương hiệu HDD", items: ["Wester Digital", "Seagate", "Toshiba"] },
      { name: "Dung lượng SSD", items: ["120GB - 128GB", "250GB - 256GB", "480GB - 512GB", "960GB - 1TB", "2TB", "Trên 2TB"] },
      { name: "Thương hiệu SSD", items: ["Samsung", "Wester Digital", "Kingston", "Corsair", "PNY"] },
      { name: "Thẻ nhớ / USB", items: ["Sandisk"] },
      { name: "Ổ cứng di động", items: [] },
    ].map((subcategory) => ({
      ...subcategory,
      items: subcategory.items.map((item) => ({
        title: item,
        link: generateLink("o-cung", subcategory.name, item),
      })),
    })),
  },
  {
    name: "Loa, Micro, Webcam",
    icon: <Speaker className="h-4 w-4" />,
    subcategories: [
      { name: "Thương hiệu loa", items: ["Edifier", "Raze", "Logitech", "SoundMax"] },
      { name: "Kiểu Loa", items: ["Loa vi tính", "Loa Bluetooth", "Loa Soundbar", "Loa mini", "Sub phụ (Loa trầm)"] },
      { name: "Webcam", items: ["Độ phân giải 4k", "Độ phân giải Full HD (1080p)", "Độ phân giải 720p"] },
      { name: "Microphone", items: ["Micro HyperX"] },
    ].map((subcategory) => ({
      ...subcategory,
      items: subcategory.items.map((item) => ({
        title: item,
        link: generateLink("loa", subcategory.name, item),
      })),
    })),
  },
  {
    name: "Màn hình",
    icon: <Monitor className="h-4 w-4" />,
    subcategories: [
      { name: "Thương hiệu sản xuất", items: ["LG", "Asus", "Samsung", "Dell", "Gigabyte", "MSI", "Acer", "Lenovo"] },
      { name: "Giá tiền", items: ["Dưới 5 triệu", "5 triệu đến 10 triệu", "10 triệu đến 20 triệu", "20 triệu đến 30 triệu", "Trên 30 triệu"] },
      { name: "Độ phân giải", items: ["Màn hình Full HD", "Màn hình 2K 1440p", "Màn hình 4K UHD", "Màn hình 6K"] },
      { name: "Tần số quét", items: ["60Hz", "75Hz", "100Hz", "144Hz", "240Hz"] },
      { name: "Màn hình cong", items: ["24\" Curved", "27\" Curved", "32\" Curved", "Trên 32\" Curved"] },
      { name: "Kích thước", items: ["Màn hình 22\"", "Màn hình 24\"", "Màn hình 27\"", "Màn hình 29\"", "Màn hình 32\"", "Màn hình trên 32\""] },
      { name: "Màn hình đồ họa", items: ["Màn hình đồ họa 24\"", "Màn hình đồ họa 27\"", "Màn hình đồ họa 32\""] },
      { name: "Phụ kiện màn hình", items: ["Giá treo màn hình", "Phụ kiện dây HDMI,DP,LAN"] },
      { name: "Màn hình di động", items: ["Full HD 1080p", "2K 1440p", "Có cảm ứng"] },
    ].map((subcategory) => ({
      ...subcategory,
      items: subcategory.items.map((item) => ({
        title: item,
        link: generateLink("man-hinh", subcategory.name, item),
      })),
    })),
  },
  {
    name: "Bàn phím",
    icon: <Keyboard className="h-4 w-4" />,
    subcategories: [
      { name: "Thương hiệu", items: ["Logitech", "Razer", "ASUS", "Dare-U", "FL-Esports", "Corsair", "E-Dra", "Cidoo", "Machenike"] },
      { name: "Giá tiền", items: ["Dưới 1 triệu", "1 triệu đến 2 triệu", "2 triệu đến 3 triệu", "3 triệu đến 4 triệu", "Trên 4 triệu"] },
      { name: "Kết nối", items: ["Bluetooth", "Wireless"] },
      { name: "Phụ kiện bàn phím cơ", items: ["Keycaps", "Dwarf Factory", "Kê tay"] },
    ].map((subcategory) => ({
      ...subcategory,
      items: subcategory.items.map((item) => ({
        title: item,
        link: generateLink("ban-phim", subcategory.name, item),
      })),
    })),
  },
  {
    name: "Chuột + Lót chuột",
    icon: <Mouse className="h-4 w-4" />,
    subcategories: [
      { name: "Thương hiệu", items: ["Logitech", "Razer", "Corsair", "Pulsar", "Microsoft", "Dare U"] },
      { name: "Chuột theo giá tiền", items: ["Dưới 500 nghìn", "500 nghìn đến 1 triệu", "2 triệu đến 3 triệu", "Trên 3 triệu"] },
      { name: "Loại chuột", items: ["Chuột chơi game", "Chuột văn phòng"] },
      { name: "Logitech", items: ["Logitech Gaming", "Logitech Văn phòng"] },
      { name: "Thương hiệu lót chuột", items: ["GEARVN", "ASUS", "Steelseries", "Dare-U", "Razer"] },
      { name: "Các loại lót chuột", items: ["Mềm", "Cứng", "Dày", "Mỏng", "Viền có led"] },
      { name: "Lót chuột theo size", items: ["Nhỏ", "Vừa", "Lớn"] },
    ].map((subcategory) => ({
      ...subcategory,
      items: subcategory.items.map((item) => ({
        title: item,
        link: generateLink("chuot", subcategory.name, item),
      })),
    })),
  },
  {
    name: "Tai nghe",
    icon: <Headphones className="h-4 w-4" />,
    subcategories: [
      { name: "Thương hiệu", items: ["ASUS", "HyperX", "Corsair", "Razer"] },
      { name: "Tai nghe theo giá", items: ["Dưới 1 triệu", "1 triệu đến 2 triệu", "2 triệu đến 3 triệu", "3 triệu đến 4 triệu", "Trên 4 triệu"] },
      { name: "Kiểu kết nối", items: ["Tai nghe Wireless", "Tai nghe Bluetooth"] },
      { name: "Kiểu tai nghe", items: ["Tai nghe Over-ear", "Tai nghe Gaming In-ear"] },
    ].map((subcategory) => ({
      ...subcategory,
      items: subcategory.items.map((item) => ({
        title: item,
        link: generateLink("tai-nghe", subcategory.name, item),
      })),
    })),
  },
  {
    name: "Ghế - Bàn",
    icon: <Armchair className="h-4 w-4" />,
    subcategories: [
      { name: "Thương hiệu ghế Gaming", items: ["Corsair", "Warrior", "E-Dra", "DXRacer", "Cougar", "AKRaing"] },
      { name: "Thương hiệu ghế CTH", items: ["Warrior", "Sihoo", "E-Dra"] },
      { name: "Kiểu ghế", items: ["Ghế công thái học", "Ghế Gaming"] },
      { name: "Bàn Gaming", items: ["Bàn Gaming DXRacer", "Bàn Gaming E-Dra", "Bàn Gaming Warrior"] },
      { name: "Bàn công thái học", items: ["Bàn CTH Warrior", "Phụ kiện bàn ghế"] },
      { name: "Giá tiền", items: ["Dưới 5 triệu", "5 triệu đến 10 triệu", "Trên 10 triệu"] },
    ].map((subcategory) => ({
      ...subcategory,
      items: subcategory.items.map((item) => ({
        title: item,
        link: generateLink("ghe", subcategory.name, item),
      })),
    })),
  },
  {
    name: "Phần mềm mạng",
    icon: <Router className="h-4 w-4" />,
    subcategories: [
      { name: "Thương hiệu sản xuất", items: ["Asus", "LinkSys", "TP-LINK", "Mercusys"] },
      { name: "Router Wi-Fi", items: ["Gaming", "Phổ thông", "Xuyên tường", "Router Mesh Pack", "Router WiFi 5", "Router WiFi 6"] },
      { name: "USB Thu sóng - Card mạng", items: ["USB WiFi", "Card WiFi", "Dây cáp mạng"] },
      { name: "Microsoft Office", items: ["Microsoft Office 365", "Office Home 2024"] },
      { name: "Microsoft Windows", items: ["Windows 11 Home", "Windows 11 Pro"] },
    ].map((subcategory) => ({
      ...subcategory,
      items: subcategory.items.map((item) => ({
        title: item,
        link: generateLink("thiet-bi-vp", subcategory.name, item),
      })),
    })),
  },
  {
    name: "Handheld, Console",
    icon: <Gamepad2 className="h-4 w-4" />,
    subcategories: [
      { name: "Handheld PC", items: ["Rog Ally", "MSI Claw", "Legion Go"] },
      { name: "Tay cầm", items: ["Tay cầm Playstation", "Tay cầm Rapoo", "Tay cầm DareU"] },
      { name: "Vô lăng lái xe, máy bay", items: [] },
      { name: "Sony Playstation", items: ["Sony PS5 chính Thương hiệu", "Tay cầm chính Thương hiệu"] },
    ].map((subcategory) => ({
      ...subcategory,
      items: subcategory.items.map((item) => ({
        title: item,
        link: generateLink("console", subcategory.name, item),
      })),
    })),
  },
  {
    name: "Phụ kiện(Hub,sạc,cáp...",
    icon: <Cable className="h-4 w-4" />,
    subcategories: [
      { name: "Hub,sạc,cáp", items: ["Hub chuyển đổi", "Dây cáp", "Củ sạc"] },
      { name: "Quạt cầm tay, Quạt mini", items: [] },
    ].map((subcategory) => ({
      ...subcategory,
      items: subcategory.items.map((item) => ({
        title: item,
        link: generateLink("phu-kien", subcategory.name, item),
      })),
    })),
  },
  {
    name: "Dịch vụ và thông tin khác",
    icon: <Gift className="h-4 w-4" />,
    subcategories: [
      { name: "Dịch vụ", items: ["Dịch vụ kỹ thuật tại nhà", "Dịch vụ sửa chữa"] },
      { name: "Chính sách", items: ["Chính sách bảo hành", "Chính sách giao hàng", "Chính sách đổi trả"] },
    ].map((subcategory) => ({
      ...subcategory,
      items: subcategory.items.map((item) => ({
        title: item,
        link: `pages/${buildSlug(item)}`,
      })),
    })),
  },
]
//console.log('menu===>', menu);

export function CategoryMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  let timeout: NodeJS.Timeout;

  return (
    <div className="w-64 mb-2 bg-white rounded-md border shadow-sm relative">
        <ul className="space-y-1">
          {menu.map((category) => (
            <li
              key={category.name}
              /* className="relative" //thêm trường relative thì ô cửa sổ hover sẽ nằm bên cạnh button */
              onMouseEnter={() => {
                setActiveCategory(category.name);
                clearTimeout(timeout);
              }}
              onMouseLeave={() => {
                timeout = setTimeout(() => {
                  setActiveCategory(null);
                }, 200);
              }}
            >
              <button className="w-full flex items-center justify-between px-4 py-1 text-sm hover:bg-slate-100 focus:bg-slate-100 focus:outline-none cursor-pointer">
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span>{category.name}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>

              {/* Submenu */}
              {activeCategory === category.name && (
                <div
                  className="absolute left-full top-0 w-[944px] h-[480px] bg-white border rounded-md shadow-md z-49"
                  style={{ marginLeft: "5px" }}
                >
                  <div className="p-4">
                    <div className="grid grid-cols-5">
                      {category.subcategories.map((subcategory) => (
                        <div 
                        className="mb-5"
                        key={subcategory.name}>
                          <h4 className="font-medium text-sm mb-1 text-red-500">{subcategory.name}</h4>
                          <ul className="space-y-1">
                            {subcategory.items.map((item) => (
                              <li key={item.title}>
                                <a
                                  href={item.link}
                                  className="text-sm text-black hover:text-red-500"
                                >
                                  {item.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>  
  )
}







