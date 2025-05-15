
/*


### Categories Computers

const products: IProduct[] = [
    {
        product_name: "HP 14\" Ultral Light Laptop for Students and Business",
        price: 239.99,
        discount: 26.00, // Discount from the typical price of $265.99
        description: "Intel Quad-Core, 8GB RAM, 192GB Storage (64GB eMMC + 128GB Ghost Manta SD Card), 1 Year Office 365, USB C, Win 11 S",
        model_year: 2023, // Model year
        slug: "hp-14-ultral-light-laptop",
        thumbnail: "https://m.media-amazon.com/images/I/81divYKpeTL._AC_SX466_.jpg", // Replace with actual link
        stock: 100, // Assumed stock quantity
        attributes: [
            { name: "Color", values: "Snowflake White" },
            { name: "Screen Size", values: "14 Inches" },
            { name: "CPU Model", values: "Intel Celeron N4120" },
            { name: "RAM Memory Installed Size", values: "8 GB" },
            { name: "Hard Disk Size", values: "64 GB eMMC + 128 GB SD Card" },
            { name: "Operating System", values: "Windows 11 Home" }
        ],
        star_rate: 4.1,
        about: "Lightweight laptop for students and business with good performance and a slim design.",
        category: "67d9449c69975e3a9c1c24b7",
        brand: "67d8edaa0bca92ccab1c9bc9"
    }
];

const products: IProduct[] = [
    {
        product_name: "HP 14 Laptop",
        price: 177.38,
        discount: 52.61, // Discount from the list price of $229.99
        description: "Intel Celeron N4020, 4 GB RAM, 64 GB Storage, 14-inch Micro-edge HD Display, Windows 11 Home, Thin & Portable, 4K Graphics, One Year of Microsoft 365 (14-dq0040nr, Snowflake White)",
        model_year: 2023, // Model year (can be adjusted if needed)
        slug: "hp-14-laptop",
        thumbnail: "https://m.media-amazon.com/images/I/815uX7wkOZS._AC_SX466_.jpg", // Replace with actual link
        stock: 80, // Assumed stock quantity
        attributes: [
            { name: "Color", values: "Snowflake White" },
            { name: "Screen Size", values: "14 Inches" },
            { name: "CPU Model", values: "Intel Celeron N4020" },
            { name: "RAM Memory Installed Size", values: "4 GB" },
            { name: "Hard Disk Size", values: "64 GB" },
            { name: "Operating System", values: "Windows 11 S" },
            { name: "Special Feature", values: "Micro-edge Bezel" }
        ],
        star_rate: 4,
        about: "<ul><li><strong>READY FOR ANYWHERE</strong> – With its thin and light design, 6.5 mm micro-edge bezel display, and 79% screen-to-body ratio, you’ll take this PC anywhere while you see and do more of what you love (1)</li>" +
    "<li><strong>MORE SCREEN, MORE FUN</strong> – With virtually no bezel encircling the screen, you’ll enjoy every bit of detail on this 14-inch HD (1366 x 768) display (2)</li>" +
    "<li><strong>ALL-DAY PERFORMANCE</strong> – Tackle your busiest days with the dual-core, Intel Celeron N4020—the perfect processor for performance, power consumption, and value (3)</li>" +
    "<li><strong>4K READY</strong> – Smoothly stream 4K content and play your favorite next-gen games with Intel UHD Graphics 600 (4) (5)</li>" +
    "<li><strong>STORAGE AND MEMORY</strong> – An embedded multimedia card provides reliable flash-based, 64 GB of storage while 4 GB of RAM expands your bandwidth and boosts your performance (6)</li></ul>",
        category: "67d9449c69975e3a9c1c24b7",
        brand: "67d8edaa0bca92ccab1c9bc9"
    }
];

const products: IProduct[] = [
    {
        product_name: "ASUS ROG Strix G16 Gaming Laptop",
        price: 1295.30,
        discount: 104.69,
        description: "165Hz Display, NVIDIA® GeForce RTX™ 4060, Intel Core i7-13650HX, 16GB DDR5, 1TB PCIe Gen4 SSD, Wi-Fi 6E, Windows 11, G614JV-AS74",
        model_year: 2023,
        slug: "asus-rog-strix-g16",
        thumbnail: "https://m.media-amazon.com/images/I/81GrCeuCzxL._AC_SX466_.jpg",
        stock: 100,
        attributes: [
            { name: "Color", values: "Eclipse Gray" },
            { name: "Screen Size", values: "16 Inches" },
            { name: "CPU Model", values: "Intel Core i7-13650HX" },
            { name: "RAM Memory Installed Size", values: "16 GB" },
            { name: "Hard Disk Size", values: "1 TB" },
            { name: "Operating System", values: "Windows 11 Home" },
            { name: "Special Feature", values: "Portable" },
            { name: "Graphics Card Description", values: "Dedicated" }
        ],
        star_rate: 5,
        about: "Power up your play with Windows 11, a 13th Gen Intel Core i7-13650HX processor, and an NVIDIA GeForce RTX 4060 Laptop GPU.",
        category: "67d9449c69975e3a9c1c24b7",
        brand: "67d8ec7d0bca92ccab1c9bba"
    }
];

POST http://localhost:8889/api/v1/products
Content-Type: application/json

{
  "product_name": "Acer Aspire 3 A315-24P-R7VH Slim Laptop",
  "price": 299.99,
  "discount": 7.00,
  "description": "15.6\" Full HD IPS Display | AMD Ryzen 3 7320U Quad-Core Processor | AMD Radeon Graphics | 8GB LPDDR5 | 128GB NVMe SSD | Wi-Fi 6 | Windows 11 Home in S Mode",
  "model_year": 2023,
  "slug": "acer-aspire-3-a315-24p-r7vh-slim-laptop",
  "thumbnail": "https://m.media-amazon.com/images/I/61gKkYQn6lL._AC_SX466_.jpg",
  "stock": 100,
  "attributes": [
    { "name": "Color", "values": "Silver" },
    { "name": "Screen Size", "values": "15.6 Inches" },
    { "name": "CPU Model", "values": "AMD Ryzen 3 7320U" },
    { "name": "RAM Memory Installed Size", "values": "8 GB" },
    { "name": "Hard Disk Size", "values": "128 GB" },
    { "name": "Operating System", "values": "Windows 11 S" },
    { "name": "Special Feature", "values": "Backlit Keyboard" },
    { "name": "Graphics Card Description", "values": "Integrated" }
  ],
  "star_rate": 4,
  "about": "<ul><li><strong>Purposeful Design</strong>: Travel with ease and look great doing it with the Aspire's 3 thin, light design.</li><li><strong>Ready-to-Go Performance</strong>: The Aspire 3 is ready-to-go with the latest AMD Ryzen 3 7320U Processor with Radeon Graphics—ideal for the entire family, with performance and productivity at the core.</li><li><strong>Visibly Stunning</strong>: Experience sharp details and crisp colors on the 15.6\" Full HD IPS display with 16:9 aspect ratio and narrow bezels.</li><li><strong>Internal Specifications</strong>: 8GB LPDDR5 Onboard Memory; 128GB NVMe solid-state drive storage to store your files and media.</li><li><strong>HD front-facing camera</strong>: The HD front-facing camera uses Acer’s TNR (Temporal Noise Reduction) technology for high-quality imagery in low-light conditions. Acer PurifiedVoice technology with AI Noise Reduction filters out any extra sound for clear communication over online meetings.</li><li><strong>Wireless Wi-Fi 6 Convenience</strong>: Maintain a strong, consistent wireless signal with Wi-Fi 6 (aka 802.11ax) and 2x2 MU-MIMO technology.</li><li><strong>Improved Thermals</strong>: With a 78% increase in fan surface area, enjoy an improved thermal system and an additional 17% thermal capacity. Allowing for longer, more efficient work sessions while not plugged in.</li></ul>",
  "category": "67d9449c69975e3a9c1c24b7",
  "brand": "67d8ed490bca92ccab1c9bc6"
}

POST http://localhost:8889/api/v1/products
Content-Type: application/json

{
  "product_name": "ASUS Chromebook CX1",
  "price": 142.84,
  "discount": 32.00,
  "description": "14\" FHD, Intel® Celeron N4500 Processor, 64GB Storage, 4GB RAM, ChromeOS, Transparent Silver, CX1400CKA-AS44F",
  "model_year": 2024,
  "slug": "asus-chromebook-cx1",
  "thumbnail": "https://m.media-amazon.com/images/I/71oYSGF0gVS._AC_SX466_.jpg",
  "stock": 100,
  "attributes": [
    { "name": "Color", "values": "Transparent Silver" },
    { "name": "Screen Size", "values": "14 Inches" },
    { "name": "CPU Model", "values": "Intel Celeron N4500" },
    { "name": "RAM Memory Installed Size", "values": "4 GB" },
    { "name": "Hard Disk Size", "values": "64 GB" },
    { "name": "Operating System", "values": "ChromeOS" },
    { "name": "Special Feature", "values": "Numeric Keypad, HD Audio" },
    { "name": "Graphics Card Description", "values": "Integrated" }
  ],
  "star_rate": 4,
  "about": "<ul><li><strong>Get Gemini Advanced</strong>: 2TB of cloud storage, and more for 3 months at no cost*</li><li><strong>Powered by the Intel Celeron N4500 Processor</strong> for smooth processing</li><li><strong>14-inch FHD</strong> (1920 x 1080) NanoEdge display</li><li><strong>180-degree lay-flat hinge</strong> for flexible working angles</li><li><strong>US Military grade standard MIL-STD 810H durability</strong></li><li><strong>Lightweight and ultraportable</strong> at just 3.59 lbs</li><li><strong>Up to 12-hour battery life</strong> to work throughout the day</li><li><strong>Fast 64GB eMMC storage and 4GB RAM</strong>, with fast and stable WiFi 6 + Bluetooth 5.2 connectivity</li><li><strong>1.4mm key travel</strong> for ergonomic typing</li><li><strong>Chromebooks have never had a virus</strong>, so you can breathe easy knowing your security and privacy are covered</li></ul>",
  "category": "67d9449c69975e3a9c1c24b7",
  "brand": "67d8ec7d0bca92ccab1c9bba"
}

POST http://localhost:8889/api/v1/products
Content-Type: application/json

{
  "product_name": "HP 15.6\" Business Laptop, Free Microsoft Office 2024 Lifetime License, Copilot AI Chat",
  "price": 430.00,
  "discount": 0,
  "description": "HD Touchscreen Display, Intel 6-Core i3-1215U 4.4 GHz, 16GB RAM, 1TB SSD, Long Battery Life, Windows 11 Pro",
  "model_year": 2024,
  "slug": "hp-15-business-laptop",
  "thumbnail": "https://m.media-amazon.com/images/I/71xEfn8Qi8L._AC_SX466_.jpg",
  "stock": 100,
  "attributes": [
    { "name": "Color", "values": "Silver" },
    { "name": "Screen Size", "values": "15.6 Inches" },
    { "name": "CPU Model", "values": "Intel Core i3-1215U" },
    { "name": "RAM Memory Installed Size", "values": "16 GB" },
    { "name": "Hard Disk Size", "values": "1 TB" },
    { "name": "Operating System", "values": "Windows 11 Pro" },
    { "name": "Special Feature", "values": "HD Audio" },
    { "name": "Graphics Card Description", "values": "Integrated" }
  ],
  "star_rate": 4,
  "about": "<ul><li><strong>Lifetime Office</strong>: Free Microsoft Office LTSC Profession Plus 2024 with Lifetime license. Including Word, Excel, OneNote, Outlook, PowerPoint, Publisher, Access. Office 2024 is pre-installed and activated, Key is not needed and provided. Please DO NOT install Office 365, which invalidates the Office 2024 license.</li><li><strong>Copilot</strong>: AI powered chat assistant. Copilot helps you be smarter, more productive, more creative, and more connected to the people and things around you.</li><li><strong>Processor</strong>: 12th Gen Intel Core i3-1215U Processor 1.2 GHz (6 Cores, 8 Threads, 10M Cache, up to 4.40 GHz).</li><li><strong>Display</strong>: 15.6\" diagonal, HD (1366 x 768), Touch, Micro-edge, BrightView, 250 nits, 45% NTSC.</li><li><strong>Memory</strong>: 16GB DDR4 RAM 3200MHz.</li><li><strong>Storage</strong>: 1TB PCIe NVMe M.2 Solid State Drive.</li><li><strong>Battery</strong>: Up to 5 hours mixed usage Battery life, HP Fast Charge: Go from 0 to 50% charge in approximately 45 minutes.</li></ul>",
  "category": "67d9449c69975e3a9c1c24b7",
  "brand": "67d8edaa0bca92ccab1c9bc9"
}


POST http://localhost:8889/api/v1/products
Content-Type: application/json

{
  "product_name": "ASUS Zenbook DUO Dual 14\" OLED 3K 120Hz Touchscreen Laptop",
  "price": 1699.00,
  "discount": 20,
  "description": "Intel Core Ultra 9 285H 32GB RAM 1TB SSD Inkwell Gray",
  "model_year": 2024,
  "thumbnail": "https://m.media-amazon.com/images/I/71VUFrGHwDL._AC_SX466_.jpg",
  "stock": 50,
  "attributes": [
    { "name": "Color", "values": "Inkwell Gray" },
    { "name": "Screen Size", "values": "14 Inches" },
    { "name": "CPU Model", "values": "Intel Core Ultra 9" },
    { "name": "RAM Memory Installed Size", "values": "32 GB" },
    { "name": "Hard Disk Size", "values": "1 TB" },
    { "name": "Operating System", "values": "Windows 11 Home" },
    { "name": "Special Feature", "values": "Dual Screen" },
    { "name": "Graphics Card Description", "values": "Integrated" }
  ],
  "star_rate": 5,
  "about": "<ul><li><strong>Multi-Screen Versatility</strong> — Find the mode that best suits your task and seamlessly switch between them. Expand your workspace with Dual Screen or Desktop Mode, share content effortlessly in Sharing Mode, or snap everything back into one for Laptop Mode.</li><li><strong>Everything-Built-In Portability</strong> — At 3.64 lb and a mere 0.57” thin, the DUO elevates portable dual-screen setups to the next level. With a detachable Bluetooth keyboard and built-in kickstand, you can take the Zenbook DUO just as you would with any laptop — plus a FHD IR front camera.</li><li><strong>Powerfully Productive</strong> — The Zenbook DUO delivers powerful performance and AI-ready features on Windows 11. The ultra-fast Intel Core Ultra 9 285H processor with Intel AI Boost NPU paired with Intel Arc graphics, enhances tasks with AI capabilities. With 1TB SSD storage and 32GB LPDDR5x RAM, you can explore more seamlessly.</li><li><strong>Dual 14” Lumina OLED Displays</strong> — Immerse yourself in unparalleled visuals with the Zenbook DUO's dual 16:10 touch displays boasting a 2880 x 1800 resolution, vibrant 500-nit HDR peak brightness, smooth 120Hz refresh rate, and Pantone validated 100% DCI-P3 color accuracy.</li><li><strong>Military-Grade Durability</strong> — Meeting US MIL-STD 810H military standards, the Zenbook DUO ensures unmatched reliability in harsh conditions. Rigorous testing enhances longevity, guaranteeing that your laptop is ready for work, travel, or relaxation both today and in the future.</li><li><strong>All-Day 75Wh Battery</strong> — Keep your stress levels low with an all-day battery that provides up to 16 hours of video playback in Laptop mode and 9 hours in Dual Screen mode. It's equipped with Fast-Charge technology, accessible through its versatile Thunderbolt 4 USB-C ports.</li><li><strong>Full I/O Ports</strong> — 2 Thunderbolt 4 | USB 3.2 Gen 1 Type-A | HDMI 2.1 TMDS | Combo Audio Jack.</li></ul>",
  "category": "67d9449c69975e3a9c1c24b7",
  "brand": "67d8ec7d0bca92ccab1c9bba"
}


POST http://localhost:8889/api/v1/products
Content-Type: application/json

{
  "product_name": "Dell Inspiron Touchscreen Laptop, 15.6\" Business & Student Laptop Computer",
  "price": 543.70,
  "discount": 10,
  "description": "Windows 11 Pro Laptop 32GB RAM 1TB SSD, Intel i5-1155G7 Processor, Full HD IPS Display, Numeric Keypad, HDMI, Carbon Black",
  "model_year": 2024,
  "slug": "dell-inspiron-touchscreen-laptop",
  "thumbnail": "https://m.media-amazon.com/images/I/61Wc1fDGJuL._AC_SX466_PIbundle-3,TopRight,0,0_SH20_.jpg",
  "stock": 50,
  "attributes": [
    { "name": "Color", "values": "Black" },
    { "name": "Screen Size", "values": "15.6 Inches" },
    { "name": "CPU Model", "values": "Intel Core i5" },
    { "name": "RAM Memory Installed Size", "values": "32 GB" },
    { "name": "Hard Disk Size", "values": "1 TB" },
    { "name": "Operating System", "values": "Windows 11 Pro" },
    { "name": "Special Feature", "values": "HD Audio" },
    { "name": "Graphics Card Description", "values": "Integrated" }
  ],
  "star_rate": 4,
  "about": "<ul><li><strong>Processor</strong> — Intel Quad-Core i5-1155G7 (4 cores, 8 threads, Max Boost Clock Up to 4.5GHz, 8 MB Cache). Your always-ready experience starts as soon as you open your device. Turn it on, boot up, and log in quickly.</li><li><strong>Display</strong> — 15.6\" Full HD (1920x1080), IPS, 220 nits, Narrow-Bezel, Anti-Glare, Touch Display; Integrated Intel UHD Graphics; supports external digital monitors via HDMI; the external digital monitor resolution is 1920x1080.</li><li><strong>Tech Specs</strong> — 2 x USB 3.2 Type-A, 1 x USB 2.0 Type-A port, HDMI 1.4 port, headphone/microphone combo jack, SD Card Reader; Wi-Fi 5 802.11ac + Bluetooth; 720p HD Webcam; Numeric Keypad.</li><li><strong>Operating System</strong> — Windows 11 Professional 64-bit is ideal for school education, designers, professionals, small businesses, programmers, casual gaming, streaming, online classes, remote learning, Zoom meetings, video conferences, and a one-year warranty from the manufacturer as well.</li><li><strong>Designed for the Office and Business</strong> — It ensures a stylish and innovative look, excellent portability, and is suitable for daily work and play. It is a great choice for businesses, offices, or students.</li></ul>",
  "category": "67d9449c69975e3a9c1c24b7",
  "brand": "67d8ed2f0bca92ccab1c9bc3"
}



POST http://localhost:8889/api/v1/products
Content-Type: application/json

{
  "product_name": "Lenovo IdeaPad 3i Chromebook, 15.6” FHD Display, Intel Celeron N4500, 8GB RAM, 64GB eMMC, 1920x1080 px, 720p Camera, Chrome OS, Abyss Blue",
  "price": 224.99,
  "discount": 65,
  "description": "Lenovo IdeaPad 3i Chromebook with a 15.6” FHD Display, Intel Celeron N4500 Processor, 8GB RAM, and 64GB eMMC storage. Runs Chrome OS in Abyss Blue color.",
  "model_year": 2023,
  "slug": "lenovo-ideapad-3i-chromebook",
  "thumbnail": "https://m.media-amazon.com/images/I/71bwzCMcQvL._AC_SX466_.jpg",
  "stock": 100,
  "attributes": [
    { "name": "Color", "values": "Blue" },
    { "name": "Screen Size", "values": "15.6 Inches" },
    { "name": "CPU Model", "values": "Intel Celeron N4500" },
    { "name": "RAM Memory Installed Size", "values": "8 GB" },
    { "name": "Hard Disk Size", "values": "64 GB" },
    { "name": "Operating System", "values": "Chrome OS" },
    { "name": "Special Feature", "values": "Narrow" },
    { "name": "Graphics Card Description", "values": "Integrated" }
  ],
  "star_rate": 4,
  "about": "<ul><li><strong>TOP PERFORMANCE, SLEEK DESIGN</strong>: Experience smooth multitasking and speedy performance with the Lenovo IdeaPad 3i Chromebook, perfect for work or play on the go.</li><li><strong>POWERFUL PROCESSING</strong>: The Intel Celeron N4500 processor's impressive capabilities ensure seamless operation and swift responsiveness.</li><li><strong>VIVID VISUALS WITH IMMERSIVE CLARITY</strong>: Vibrant visuals on the 15.6\" FHD 1920x1080 display deliver crisp images and sharp details for an enhanced visual experience.</li><li><strong>AMPLE STORAGE FOR YOUR DIGITAL WORLD</strong>: Enjoy convenient access to your files and applications with 64GB of eMMC storage, which provides space for documents, photos, videos, and more.</li><li><strong>VERSATILE CONNECTIVITY OPTIONS</strong>: Stay connected with a range of ports, including USB 3.2 Gen 1 and USB-C 3.2 Gen 1, that offer plenty of plug-ins for your accessories.</li><li><strong>ALL-DAY BATTERY LIFE FOR UNINTERRUPTED USAGE</strong>: The IdeaPad 3i Chromebook offers up to 10 hours of battery life so you can experience the freedom to work and play uninterrupted.</li><li><strong>ENHANCED DEVICE SECURITY</strong>: Protect your Chromebook from theft and unauthorized access with a physical laptop lock to enjoy peace of mind in any environment.</li></ul>",
  "category": "67d9449c69975e3a9c1c24b7",
  "brand": "67d8ea700bca92ccab1c9ba8"
}

POST http://localhost:8889/api/v1/products
Content-Type: application/json

{
  "product_name": "MSI Stealth 16 AI Studio 16” 120Hz UHD+ Mini LED Gaming Laptop: Intel Core Ultra 9-185H, NVIDIA Geforce RTX 4080, 64GB DDR5, 1TB NVMe SSD, Thunderbolt 4, Win 11 Pro: Star Blue A1VHG-027US",
  "price": 3048.07,
  "discount": 5,
  "description": "MSI Stealth 16 AI Studio 16” UHD+ Mini LED Gaming Laptop featuring Intel Core Ultra 9-185H, NVIDIA Geforce RTX 4080, 64GB DDR5, and 1TB SSD, running on Windows 11 Pro.",
  "model_year": 2023,
  "slug": "msi-stealth-16-ai-studio",
  "thumbnail": "https://m.media-amazon.com/images/I/71cWXOi88TL._AC_SX466_.jpg",
  "stock": 50,
  "attributes": [
    { "name": "Color", "values": "Blue" },
    { "name": "Screen Size", "values": "16 Inches" },
    { "name": "CPU Model", "values": "Intel Core Ultra 9-185H" },
    { "name": "RAM Memory Installed Size", "values": "64 GB" },
    { "name": "Hard Disk Size", "values": "1 TB" },
    { "name": "Operating System", "values": "Windows 11 Pro" },
    { "name": "Special Feature", "values": "Fingerprint Reader, Backlit Keyboard" },
    { "name": "Graphics Card Description", "values": "RTX 4080" }
  ],
  "star_rate": 5,
  "about": "<ul><li><strong>AI-Powered Performance</strong>: Harness the capabilities of the latest Intel Core Ultra 9 processor to effortlessly manage demanding tasks. Extend your productivity with the most powerful and reliable performance on the go.</li><li><strong>Power Your Passion</strong>: Intuitive navigation with faster performance, Windows 11 Pro is perfect for at home use or running a business.</li><li><strong>Beyond Fast</strong>: The NVIDIA GeForce RTX 4080 GPU powered by the Ada architecture unleashes the full glory of ray tracing, which simulates how light behaves in the real world.</li><li><strong>4K Display</strong>: The 16\" 4K UHD mini LED display offers an abundant color gamut, more vivid colors and faster display for the ultimate gaming experience.</li></ul>",
  "category": "67d9449c69975e3a9c1c24b7",
  "brand": "67d8edf50bca92ccab1c9bcf"
}


POST http://localhost:8889/api/v1/products
Content-Type: application/json

{
  "product_name": "Apple iMac 27-inch Retina 5K",
  "price": 540.00,
  "discount": 69,
  "description": "Apple iMac 27-inch Retina 5K Desktop MK472LL/A featuring Intel Core i5 3.2GHz, 16GB RAM, and 512GB SSD, with a 27-inch Retina 5K display.",
  "model_year": 2023,
  "slug": "apple-imac-27-inch-retina-5k",
  "thumbnail": "https://m.media-amazon.com/images/I/717q8QReNaL._AC_SX466_.jpg",
  "stock": 100,
  "attributes": [
    { "name": "Color", "values": "Silver" },
    { "name": "Screen Size", "values": "27 Inches" },
    { "name": "CPU Model", "values": "Intel Core i5" },
    { "name": "RAM Memory Installed Size", "values": "16 GB" },
    { "name": "Hard Disk Size", "values": "512 GB SSD" },
    { "name": "Operating System", "values": "Mac OS X" },
    { "name": "Graphics Card Description", "values": "AMD Radeon R9 M380" }
  ],
  "star_rate": 4,
  "about": "<ul><li><strong>27-inch Retina 5K Display</strong>: The iMac features a 27-inch diagonal Retina 5K display with IPS technology, delivering 5120x2880 resolution for stunning clarity.</li><li><strong>Processor</strong>: Powered by a 3.2GHz quad-core Intel Core i5 processor, ensuring smooth and efficient performance for all your tasks.</li><li><strong>Memory & Storage</strong>: Equipped with 16GB of 1867MHz DDR3 memory and 512GB of flash storage (SSD) for fast data access and ample storage space.</li><li><strong>Graphics</strong>: Comes with AMD Radeon R9 M380 graphics processor for impressive visual performance.</li><li><strong>Connectivity</strong>: Includes 802.11ac Wi-Fi wireless networking and Bluetooth 4.0 wireless technology for seamless connectivity.</li></ul>",
  "category": "67d9449c69975e3a9c1c24b7",
  "brand": "67d8ec5a0bca92ccab1c9bb7"
}

### Categories Tables

{
  "product_name": "Samsung Galaxy Tab A9+ Tablet 11",
  "price": 164.75,
  "discount": 55,
  "description": "Samsung Galaxy Tab A9+ Tablet with an 11-inch screen, upgraded chipset, quad speakers, and multi-window display.",
  "model_year": 2024,
  "thumbnail": "https://m.media-amazon.com/images/I/61d46oYQgdL._AC_SX466_.jpg",
  "stock": 100,
  "attributes": [
    { "name": "Color", "values": "Graphite" },
    { "name": "Screen Size", "values": "11 Inches" },
    { "name": "Memory Storage Capacity", "values": "64 GB" },
    { "name": "Display Resolution", "values": "1920 x 1200 (WUXGA)" }
  ],
  "star_rate": 4,
  "about": "<ul><li><strong>BIG SCREEN. FAMILY-SIZED FUN</strong>: Enjoy a bright and engaging 11-inch screen with 1920 x 1200 resolution, perfect for videos, games, and kids' fun time.</li><li><strong>RICH SOUND ALL AROUND</strong>: Quad speakers with Dolby Atmos deliver a cinema-like audio experience, whether you're listening to music, watching shows, or playing games.</li><li><strong>POWER FOR ALL YOU DO. STORAGE FOR ALL YOU LOVE</strong>: Featuring an upgraded chipset with options for 4GB RAM + 64GB storage or 8GB RAM + 128GB storage, and expandable storage up to 1TB, you can do more with your device.</li><li><strong>MULTITASKING MADE EASY</strong>: Open multiple apps at once with the multi-window display and seamlessly manage tasks like browsing the web, checking email, and taking notes all on one screen.</li><li><strong>LOVED BY KIDS. TRUSTED BY PARENTS</strong>: The Samsung Kids app provides a safe space for kids to learn and play, with colorful, playful content that stimulates young minds.</li><li><strong>SLIM. LIGHT. DURABLE</strong>: The lightweight, slim design of the Galaxy Tab A9+ makes it easy to carry and durable enough for everyday use, blending performance and portability perfectly.</li><li><strong>SHARE FILES IN A FLASH</strong>: With Quick Share, you can easily share files between devices, whether it's Android or iOS, with just a few taps.</li></ul>",
  "category": "67d944ab69975e3a9c1c24ba",
  "brand": "67d8ecaa0bca92ccab1c9bbd"
}


{
  "product_name": "Samsung Galaxy Tab S9 FE 10.9” 128GB WiFi Android Tablet",
  "price": 254.15,
  "discount": 3,
  "description": "Samsung Galaxy Tab S9 FE with a 10.9-inch display, powerful processor, S Pen, long battery life, and expandable storage.",
  "model_year": 2023,
  "thumbnail": "https://m.media-amazon.com/images/I/417bx91cc8L._AC_SX466_.jpg",
  "stock": 100,
  "attributes": [
    { "name": "Color", "values": "Gray" },
    { "name": "Screen Size", "values": "10.9 Inches" },
    { "name": "Memory Storage Capacity", "values": "6 GB" },
    { "name": "Display Resolution", "values": "2304 X 1440 (WUXGA+)" }
  ],
  "star_rate": 5,
  "about": "<ul><li><strong>CIRCLE IT, SEARCH IT, FIND IT. JUST LIKE THAT</strong>: Search for anything you see on your screen simply by circling it with Google Circle to Search.</li><li><strong>A SCREEN FOR ALL YOUR ADVENTURES</strong>: Enjoy a beautiful 10.9” display perfect for multitasking, gaming, and movie watching. Dual speakers enhance the experience.</li><li><strong>BUILT FOR ADVENTURE</strong>: IP68 rated for water and dust resistance, making it durable enough for any adventure.</li><li><strong>A BATTERY THAT KEEPS YOU IN CHARGE</strong>: Up to 18 hours of battery life with Super Fast Charging (full charge in under 90 minutes).</li><li><strong>POWER FOR ADVENTURE</strong>: Equipped with the latest Exynos chipset, ensuring seamless performance for your daily tasks and video chats.</li><li><strong>SMART TECH, BEAUTIFULLY MADE</strong>: A sleek and lightweight design that complements your style and personality.</li><li><strong>PEN-POINT PRECISION</strong>: The included S Pen offers high precision, perfect for drawing, note-taking, or document marking.</li></ul>",
  "category": "67d944ab69975e3a9c1c24ba",
  "brand": "67d8ecaa0bca92ccab1c9bbd"
}


{
  "product_name": "Google Pixel Tablet",
  "price": 279.00,
  "discount": 30.00,
  "description": "Google Pixel Tablet with an 11-inch screen, Google AI integration, long battery life, and 128GB storage.",
  "model_year": 2024,
  "thumbnail": "https://m.media-amazon.com/images/I/71XySfAlGuL._AC_SX466_.jpg",
  "stock": 100,
  "attributes": [
    { "name": "Color", "values": "Hazel" },
    { "name": "Screen Size", "values": "11 Inches" },
    { "name": "Memory Storage Capacity", "values": "128 GB" },
    { "name": "Display Resolution", "values": "2560x1600 Pixels" }
  ],
  "star_rate": 4.5,
  "about": "<ul><li><strong>Google AI Powered</strong>: Smooth streaming, high-quality video calls, and everyday tasks made easier with Google AI integration.</li><li><strong>11-Inch Screen</strong>: Brilliant colors and adaptive brightness for optimal viewing, perfect for streaming, editing, and multitasking with Split Screen.</li><li><strong>Smart AI Features</strong>: Search and interact with images, text, and videos with Google AI, including Magic Editor for photo editing.</li><li><strong>Boost Creativity and Productivity</strong>: Use Gemini for brainstorming, writing, planning, and more to enhance your creative process.</li><li><strong>Smart Home Control</strong>: Manage your compatible smart devices via voice or on-screen controls, including thermostats, lights, locks, and cameras.</li><li><strong>Optimized Android Experience</strong>: Enjoy your favorite apps on a larger screen and cast content with Chromecast built in. Charging Speaker Dock required for casting.</li><li><strong>Quick Share</strong>: Securely share photos, videos, and more between devices with Quick Share functionality.</li></ul>",
  "category": "67d944ab69975e3a9c1c24ba",
  "brand": "67d8f6104cbdecefa815b3d5"
}


{
  "product_name": "Lenovo Tab P12-2024",
  "price": 319.00,
  "discount": 11,
  "description": "Lenovo Tab P12-2024 with 12.7\" 3K display, 13MP camera, and 8GB memory, perfect for immersive entertainment and productivity.",
  "model_year": 2024,
  "thumbnail": "https://m.media-amazon.com/images/I/616SXS5m0eL._AC_SX466_.jpg",
  "stock": 100,
  "attributes": [
    { "name": "Color", "values": "Gray" },
    { "name": "Screen Size", "values": "12.7 Inches" },
    { "name": "Resolution", "values": "2944 x 1840 pixels" },
    { "name": "Memory Storage Capacity", "values": "128 GB" },
    { "name": "RAM", "values": "8 GB" },
    { "name": "Operating System", "values": "Android 13" }
  ],
  "star_rate": 5,
  "about": "<ul><li><strong>BIG DREAMS CALLING:</strong> The Lenovo Tab P12 delivers next-level visuals with 3K resolution, ideal for note-taking or gaming.</li><li><strong>EXPANSIVE ENTERTAINMENT:</strong> Enjoy vibrant visuals on the 12.7-inch LCD screen with Dolby Atmos quad speakers for immersive sound.</li><li><strong>POWERFUL PERFORMANCE:</strong> Enjoy smooth gameplay and multitasking with MediaTek Dimensity 7050 processor, 8 GB RAM, and 128 GB UFS storage.</li><li><strong>CAPTURE THE MOMENT:</strong> A 13MP ultra-wide front-facing camera with AI face tracking ensures clear video calls and recordings.</li><li><strong>SPLIT SCREEN PRODUCTIVITY:</strong> The 16:10 aspect ratio screen allows for up to four split screens, increasing productivity.</li><li><strong>SMART LEARNING:</strong> Draw, edit, and structure notes using the included Tab Pen Plus with palm rejection and tilt detection.</li><li><strong>IMMERSIVE READING EXPERIENCE:</strong> The Tab P12 enhances your reading experience with chromatic modes and a curated selection of background songs.</li></ul>",
  "category": "67d944ab69975e3a9c1c24ba",
  "brand": "67d8ea700bca92ccab1c9ba8"
}

{
  "product_name": "Lenovo Tab M11",
  "price": 199.00,
  "discount": 5,
  "description": "Lenovo Tab M11 with 11-inch WUXGA display, MediaTek Helio G88 processor, and 128GB SSD, designed for multitasking and entertainment.",
  "model_year": 2024,
  "thumbnail": "https://m.media-amazon.com/images/I/71Z05qTBxRL._AC_SX466_.jpg",
  "stock": 100,
  "attributes": [
    { "name": "Color", "values": "Luna Grey" },
    { "name": "Screen Size", "values": "11 Inches" },
    { "name": "Resolution", "values": "1920 x 1200 (WUXGA)" },
    { "name": "Memory Storage Capacity", "values": "128 GB" },
    { "name": "RAM", "values": "4 GB" },
    { "name": "Operating System", "values": "Android" }
  ],
  "star_rate": 4,
  "about": "<ul><li><strong>MULTITASKING MASTER:</strong> The Lenovo Tab M11 is a sleek, portable device perfect for switching between work and entertainment.</li><li><strong>POWER-PACKED PERFORMANCE:</strong> Powered by the MediaTek Helio G88 Octa-Core processor, this tablet delivers efficient performance for all your tasks.</li><li><strong>VIVID DISPLAY:</strong> The 11-inch 1920x1200 WUXGA display provides stunning clarity, making graphics, photos, and videos come to life.</li><li><strong>SEAMLESS PRODUCTIVITY:</strong> With 128GB SSD storage, the Lenovo Tab M11 ensures you can multitask without lag or slowdowns.</li><li><strong>PLUG AND PLAY:</strong> Easily connect accessories and transfer files with the USB-C port and 3.5mm audio jack.</li><li><strong>LONG BATTERY LIFE:</strong> Enjoy up to 10 hours of battery life, so you can work, stream, or play for longer.</li><li><strong>PREMIUM VIEWING:</strong> The ambient light sensor adjusts the display for optimal viewing in any lighting condition.</li></ul>",
  "category": "67d944ab69975e3a9c1c24ba",
  "brand": "67d8ea700bca92ccab1c9ba8"
}


{
  "product_name": "Microsoft Surface Pro 2-in-1 Laptop/Tablet (2024)",
  "price": 880.00,
  "discount": 12,
  "description": "Microsoft Surface Pro 2-in-1 laptop/tablet with a 13-inch touchscreen, Snapdragon X Plus processor, 16GB RAM, and 256GB storage, designed for AI-enhanced productivity.",
  "model_year": 2024,
  "thumbnail": "https://m.media-amazon.com/images/I/61OtnPzSv6L._AC_SX466_.jpg",
  "stock": 100,
  "attributes": [
    { "name": "Color", "values": "Platinum" },
    { "name": "Screen Size", "values": "13 Inches" },
    { "name": "Resolution", "values": "2880 x 1920" },
    { "name": "Memory Storage Capacity", "values": "256 GB" },
    { "name": "RAM", "values": "16 GB" },
    { "name": "Operating System", "values": "Windows 11 Copilot+" }
  ],
  "star_rate": 4,
  "about": "<ul><li><strong>AI-Powered Productivity:</strong> Experience enhanced performance with Copilot+ PC, integrating AI capabilities for greater productivity and security.</li><li><strong>Versatile 2-in-1 Design:</strong> The Surface Pro offers flexibility, transforming from tablet to laptop, or sketchbook, with a detachable Surface Pro Flex Keyboard (sold separately).</li><li><strong>Outstanding Performance:</strong> Powered by the Snapdragon X Plus (10 Core), faster than MacBook Air M3, with powerful NPU for seamless multitasking and performance.</li><li><strong>All-Day Battery Life:</strong> Enjoy up to 14 hours of battery life, with fast charging via Surface Connect or USB-C, keeping you productive all day long.</li><li><strong>AI-Enhanced Calls:</strong> Improve video call quality with Copilot+ by enhancing lighting, cancelling noise, and blurring distractions using Windows Studio Effects.</li><li><strong>Easy Document Retrieval:</strong> Quickly recall documents, emails, or web pages with an explorable timeline of your PC’s history (feature coming soon).</li></ul>",
  "category": "67d944ab69975e3a9c1c24ba",
  "brand": "67d8ea700bca92ccab1c9ba8"
}

{
  "product_name": "Microsoft Surface Pro 9 13\" Touch Tablet, Intel i7, 16GB/512GB, Platinum Bundle",
  "price": 2104.97,
  "discount": 43,
  "description": "Microsoft Surface Pro 9 with 13-inch PixelSense display, Intel Core i7 processor, 16GB RAM, and 512GB storage. Comes with Surface Pro Signature Mechanical Keyboard and 1-year CPS Enhanced Protection Pack.",
  "model_year": 2024,
  "thumbnail": "https://m.media-amazon.com/images/I/518TNZl06xL._AC_SX466_.jpg",
  "stock": 100,
  "attributes": [
    { "name": "Color", "values": "Platinum" },
    { "name": "Screen Size", "values": "13 Inches" },
    { "name": "Resolution", "values": "2880 x 1920" },
    { "name": "Memory Storage Capacity", "values": "512 GB" },
    { "name": "RAM", "values": "16 GB" },
    { "name": "Processor", "values": "Intel Core i7 (12th Gen)" },
    { "name": "Operating System", "values": "Windows 11" },
    { "name": "Bundle", "values": "Surface Pro Signature Mechanical Keyboard, 1-Year CPS Enhanced Protection Pack" }
  ],
  "star_rate": 4.5,
  "about": "<ul><li><strong>Versatile 2-in-1 Design:</strong> The Microsoft Surface Pro 9 combines the portability of a tablet with laptop functionality. It weighs only 1.94 lb and features a 13-inch PixelSense display, powered by the Intel Evo platform with a 12th Gen Intel Core i7 processor.</li><li><strong>Stunning Display & Interaction:</strong> Enjoy vibrant visuals on the 13\" touchscreen with Dolby Vision IQ and a 120Hz refresh rate. The Surface Slim Pen 2 (sold separately) provides a natural writing and drawing experience.</li><li><strong>Extended Battery Life & Advanced Connectivity:</strong> With up to 15.5 hours of battery life, the Surface Pro 9 delivers long-lasting performance. It includes USB-C, Thunderbolt 4 ports, Wi-Fi 6E, and Bluetooth 5.1 for fast connectivity.</li><li><strong>Practical Features for Everyday Use:</strong> The Surface Pro 9 comes with an adjustable Kickstand and seamless smartphone integration with Phone Link, making it ideal for classrooms, business meetings, and personal use.</li><li><strong>Extended Warranty:</strong> Includes the standard warranty along with a 1-year extension for added peace of mind.</li></ul>",
  "category": "67d944ab69975e3a9c1c24ba",
  "brand": "67d8edd80bca92ccab1c9bcc"
}

{
  "product_name": "SAMSUNG 12.2\" FHD 2-in-1 Touchscreen Chromebook Plus Laptop",
  "price": 399.00,
  "discount": 0,
  "description": "SAMSUNG 12.2\" FHD 2-in-1 Touchscreen Chromebook with Intel Celeron Processor, 4GB RAM, 224GB storage (64GB eMMC + 160GB Docking Station), Stylus Pen, Wireless Mouse, and more.",
  "model_year": 2024,
  "thumbnail": "https://m.media-amazon.com/images/I/81k+w98hRSL._AC_SX466_.jpg",
  "stock": 100,
  "attributes": [
    { "name": "Color", "values": "Silver" },
    { "name": "Screen Size", "values": "12.2 Inches" },
    { "name": "Resolution", "values": "1920 x 1200 Pixels" },
    { "name": "Memory Storage Capacity", "values": "128 GB" },
    { "name": "RAM", "values": "4 GB" },
    { "name": "Processor", "values": "Intel Celeron 3965Y" },
    { "name": "Operating System", "values": "Chrome OS" },
  ],
  "star_rate": 4,
  "about": "<ul><li><strong>12.2\" FHD Touchscreen Display:</strong> Navigate, create, and write naturally on the responsive touchscreen. Easily convert to tablet mode with a 360° hinge.</li><li><strong>Intel Celeron Processor 3965Y:</strong> Optimized energy usage allows for seamless multitasking, smooth streaming, and quick browsing.</li><li><strong>4GB LPDDR3 RAM:</strong> High-speed RAM ensures fast data processing, seamless multitasking, and responsive performance.</li><li><strong>224GB Storage:</strong> Includes 64GB eMMC, 128GB from the 7-in-1 docking station, and a 32GB MicroSD card adapter for fast data access and ample storage.</li><li><strong>720p HD Camera:</strong> Enjoy high-quality video calls and online meetings with the integrated camera.</li><li><strong>Chrome OS:</strong> A secure, fast, and simple operating system that offers built-in virus protection and cloud backups.</li><li><strong>Additional Accessories:</strong> Includes a Stylus Pen, Wireless Mouse, and 7-in-1 Docking Station with 128GB SSD, Type-C Data Cable, and 3-in-1 Charging Cable.</li></ul>",
  "category": "67d944ab69975e3a9c1c24ba",
  "brand": "67d8ecaa0bca92ccab1c9bbd"
}

POST http://your-api-endpoint.com/products HTTP/1.1
Content-Type: application/json
Authorization: Bearer your-auth-token

{
  "product_name": "SAMSUNG Galaxy Tab S10 Ultra 14.6”",
  "price": 915.00,
  "discount": 8,
  "description": "14.6-inch AMOLED Touchscreen, 256GB SSD Storage, 12GB RAM, MediaTek MT6989 Processor, Android 14 OS, 16-hour battery, Fingerprint Reader, Wi-Fi, Bluetooth, GPS, 12.0 MP Front Camera, 13.0 MP Rear Camera, S-Pen Included.",
  "model_year": 2024,
  "thumbnail": "https://m.media-amazon.com/images/I/51EfbOXjLkL._AC_SX466_.jpg",
  "stock": 100,
  "attributes": [
    { "name": "Color", "values": "Moonstone Gray" },
    { "name": "Screen Size", "values": "14.6 Inches" },
    { "name": "Resolution", "values": "2960 x 1848" },
    { "name": "Memory Storage Capacity", "values": "256 GB" },
    { "name": "RAM", "values": "12 GB" },
    { "name": "Processor", "values": "MediaTek MT6989 8-Core" },
    { "name": "Operating System", "values": "Android 14" }
  ],
  "star_rate": 4,
  "about": "<ul><li><strong>14.6\" AMOLED Touchscreen:</strong> Enjoy a stunning display with vibrant colors and clarity.</li><li><strong>256GB SSD Storage & 12GB RAM:</strong> Provides ample space and fast performance.</li><li><strong>Powerful Processor:</strong> The MediaTek MT6989 8-Core processor ensures smooth multitasking and gaming.</li><li><strong>Long-lasting Battery:</strong> Up to 16 hours of usage.</li><li><strong>Included S-Pen:</strong> Use the S-Pen for note-taking, drawing, and more.</li></ul>",
  "category": "67d944ab69975e3a9c1c24ba",
  "brand": "67d8ecaa0bca92ccab1c9bbd"
}


POST http://your-api-endpoint.com/products
Content-Type: application/json

{
  "product_name": "Microsoft Surface Pro 9 (2022)",
  "price": 1199.99,
  "discount": 0,
  "description": "Microsoft Surface Pro 9 (2022) offers a versatile 2-in-1 experience with an immersive 13\" touchscreen, Intel 12th Gen i7 processor, 16GB RAM, 256GB SSD, Windows 11, and Copilot AI for productivity.",
  "model_year": 2022,
  "thumbnail": "https://m.media-amazon.com/images/I/512L+IpqEfL._AC_SX466_.jpg",
  "stock": 100,
  "attributes": [
    { "name": "Color", "values": "Sapphire" },
    { "name": "Screen Size", "values": "13 Inches" },
    { "name": "Resolution", "values": "2880 x 1920 Pixels" },
    { "name": "Memory Storage Capacity", "values": "256 GB" },
    { "name": "RAM", "values": "16 GB" },
    { "name": "Processor", "values": "Intel Core i7-2640M" },
    { "name": "Operating System", "values": "Windows 11 Home" },
    { "name": "Graphics Card", "values": "Integrated Intel Graphics" }
  ],
  "star_rate": 4,
  "about": "<ul><li><strong>Copilot on Windows 11:</strong> AI-powered productivity assistant to simplify tasks and enhance efficiency.</li><li><strong>13\" Touchscreen:</strong> Adaptive color balance and immersive visuals.</li><li><strong>Adjustable Kickstand & Surface Pro Signature Keyboard:</strong> Transform between tablet and laptop modes with ease.</li><li><strong>Surface Slim Pen 2:</strong> Natural writing and drawing experience for note-taking and creative work.</li><li><strong>Dolby Vision IQ:</strong> Stunning picture quality with vivid colors and contrast.</li><li><strong>Intel Evo Platform:</strong> Powered by Intel 12th Gen Core i7 processor for seamless multitasking and demanding applications.</li></ul>",
  "category": "67d944ab69975e3a9c1c24ba", 
  "brand": "67d8edd80bca92ccab1c9bcc"
}

POST http://your-api-endpoint.com/products
Content-Type: application/json

{
  "product_name": "Microsoft Surface Pro 7",
  "price": 399.99,
  "discount": 14,
  "description": "Microsoft Surface Pro 7 is a next-gen laptop with the versatility of a studio and tablet. Powered by the 10th Gen Intel Core i5 processor, 8GB RAM, and 256GB SSD, it delivers performance in a slim and light design.",
  "model_year": 2020,
  "thumbnail": "https://m.media-amazon.com/images/I/71XWmBoBDWL._AC_SX466_.jpg",
  "stock": 100,
  "attributes": [
    { "name": "Color", "values": "Matte Black" },
    { "name": "Screen Size", "values": "12.3 Inches" },
    { "name": "Resolution", "values": "1920 x 1080 Pixels" },
    { "name": "Memory Storage Capacity", "values": "256 GB" },
    { "name": "RAM", "values": "8 GB" },
    { "name": "Processor", "values": "10th Gen Intel Core i5" },
    { "name": "Operating System", "values": "Windows 10, Free Upgrade to Windows 11" },
    { "name": "Camera", "values": "1080p Front/Rear Camera" }
  ],
  "star_rate": 4,
  "about": "<ul><li><strong>Versatility:</strong> 2-in-1 design for work and play. Use it as a laptop, tablet, or studio for drawing and note-taking.</li><li><strong>Powerful Performance:</strong> 10th Gen Intel Core i5 processor with 8GB RAM for faster multitasking and performance.</li><li><strong>All-Day Battery:</strong> Up to 10.5 hours of battery life with fast charging (about 80% in just over an hour).</li><li><strong>Connectivity:</strong> USB-C and USB-A ports for seamless connection to displays, docking stations, and more.</li><li><strong>Camera:</strong> 1080p front and rear cameras for clear video calls and recordings.</li><li><strong>Windows 11:</strong> Free upgrade to Windows 11 when available.</li></ul>",
  "category": "67d944ab69975e3a9c1c24ba",
  "brand": "67d8edd80bca92ccab1c9bcc"
}





*/

// BEGIN create DATA

import mongoose from 'mongoose'
import {env} from "../helpers/env.helper"
import Brand from '../models/brand.model';
import { IBrand } from '../types/type';
import { buildSlug } from '../helpers/slugify.helper';

//Step 1: Ket noi Database su dung mongoose
const mongooseDbOptions = {
    autoIndex: true, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
    
  };
  mongoose
    .connect(env.MONGODB_URI as string, mongooseDbOptions)
    .then(() => {
      console.log('Connected to MongoDB');
      //should listen app here
    })
    .catch((err) => {
      console.error('Failed to Connect to MongoDB', err);
    });

  
const brands = [
  { brand_name: 'ASUS', description: 'Thương hiệu Đài Loan nổi bật với laptop, linh kiện và thiết bị gaming.' },
  { brand_name: 'ACER', description: 'Hãng máy tính đến từ Đài Loan, nổi tiếng với dòng Aspire và Predator.' },
  { brand_name: 'MSI', description: 'Chuyên về laptop và linh kiện gaming hiệu năng cao.' },
  { brand_name: 'LENOVO', description: 'Tập đoàn công nghệ Trung Quốc, nổi bật với dòng ThinkPad và Legion.' },
  { brand_name: 'DELL', description: 'Thương hiệu Mỹ với các dòng laptop như XPS, Alienware và Inspiron.' },
  { brand_name: 'HP-Pavilion', description: 'Dòng laptop phổ thông của HP, thiết kế đẹp và hiệu năng ổn định.' },
  { brand_name: 'LG', description: 'Thương hiệu Hàn Quốc, nổi bật với dòng laptop LG Gram siêu nhẹ.' },
  { brand_name: 'GIGABYTE', description: 'Hãng linh kiện và laptop gaming AORUS đến từ Đài Loan.' },

  { brand_name: 'Edifier', description: 'Hãng loa chất lượng cao, thiết kế sang trọng, âm thanh rõ.' },
  { brand_name: 'Raze', description: 'Thương hiệu loa và phụ kiện gaming (có thể là Razer?).' },
  { brand_name: 'Logitech', description: 'Thương hiệu toàn cầu về phụ kiện máy tính, loa và thiết bị ngoại vi.' },
  { brand_name: 'SoundMax', description: 'Hãng loa phổ biến tại Việt Nam, giá tốt, dễ tiếp cận.' },

  { brand_name: 'Corsair', description: 'Hãng Mỹ chuyên case, RAM, SSD và thiết bị gaming cao cấp.' },
  { brand_name: 'Lianli', description: 'Chuyên case máy tính chất lượng cao, thiết kế nhôm nguyên khối.' },
  { brand_name: 'NZXT', description: 'Hãng case hiện đại, tối giản, airflow tốt.' },
  { brand_name: 'Inwin', description: 'Case máy tính với thiết kế độc đáo, sáng tạo.' },
  { brand_name: 'Thermaltake', description: 'Hãng phần cứng nổi bật với case, tản nhiệt và phụ kiện PC.' },

  { brand_name: 'DeepCool', description: 'Hãng nguồn và tản nhiệt phổ biến tại Việt Nam, giá tốt.' },

  { brand_name: 'Kingston', description: 'Hãng nổi tiếng với RAM và SSD chất lượng cao.' },
  { brand_name: 'G.Skill', description: 'RAM hiệu năng cao cho dân chơi PC, nổi bật với dòng Trident Z.' },
  { brand_name: 'PNY', description: 'RAM và SSD tầm trung, ổn định và dễ tiếp cận.' },

  { brand_name: 'Wester Digital', description: 'Hãng ổ cứng nổi tiếng nhất thế giới, đa dạng dòng sản phẩm.' },
  { brand_name: 'Seagate', description: 'Đối thủ lớn của WD, ổ cứng HDD/SSD phổ biến toàn cầu.' },
  { brand_name: 'Toshiba', description: 'Hãng Nhật Bản, chuyên ổ cứng giá tốt, độ bền ổn.' },

  { brand_name: 'Samsung', description: 'Hãng công nghệ hàng đầu Hàn Quốc, SSD tốc độ cao.' },

  { brand_name: 'ANKKO', description: 'Thương hiệu bàn phím cơ giá rẻ, dành cho người mới.' },
  { brand_name: 'AULA', description: 'Bàn phím gaming RGB giá tốt, thiết kế đa dạng.' },
  { brand_name: 'Dare-U', description: 'Bàn phím cơ giá rẻ, nổi bật ở thị trường Việt Nam.' },
  { brand_name: 'Durgod', description: 'Thương hiệu phím cơ Trung Quốc, build tốt, gõ sướng.' },
  { brand_name: 'FL-Esports', description: 'Bàn phím cơ custom đẹp, layout hiện đại.' },
  { brand_name: 'Cidoo', description: 'Phím cơ pre-built nổi bật với switch chất lượng.' },
  { brand_name: 'E-Dra', description: 'Thương hiệu Việt Nam về bàn phím và ghế gaming.' },
  { brand_name: 'Machenike', description: 'Thương hiệu gaming Trung Quốc, bàn phím, laptop.' },
  { brand_name: 'Leopold', description: 'Phím cơ cao cấp từ Hàn Quốc, nổi tiếng về build và cảm giác gõ.' },
  { brand_name: 'Stellseries', description: 'Hãng gaming gear nổi tiếng từ Đan Mạch.' },
  { brand_name: 'Rapoo', description: 'Thương hiệu phụ kiện giá rẻ đến từ Trung Quốc.' },
  { brand_name: 'VGN', description: 'Hãng phím cơ giá rẻ, build ổn, thiết kế trẻ trung.' },

  { brand_name: 'Warrior', description: 'Ghế gaming phổ biến tại Việt Nam, giá rẻ dễ tiếp cận.' },
  { brand_name: 'DXRacer', description: 'Ghế gaming cao cấp, nổi bật trong giới eSports.' },
  { brand_name: 'Cougar', description: 'Ghế và phụ kiện gaming mạnh về thiết kế.' },
  { brand_name: 'AKRaing', description: 'Ghế gaming tầm trung, hỗ trợ tốt cho game thủ.' },
  { brand_name: 'Sihoo', description: 'Ghế công thái học (ergonomic) chuyên dùng cho dân văn phòng.' },

  { brand_name: 'Microsoft', description: 'Hãng phần mềm số 1 thế giới, nổi bật với Windows, Office.' },
  { brand_name: 'LinkSys', description: 'Thương hiệu router mạng nổi tiếng từ Mỹ.' },
  { brand_name: 'TP-LINK', description: 'Thiết bị mạng giá tốt, phổ biến tại Việt Nam.' },
  { brand_name: 'Mercusys', description: 'Hãng con của TP-Link, thiết bị mạng giá rẻ.' },

  { brand_name: 'Rog Ally', description: 'Thiết bị chơi game cầm tay chạy Windows do ASUS sản xuất.' },
  { brand_name: 'Legion Go', description: 'Thiết bị chơi game cầm tay của Lenovo, cạnh tranh với Steam Deck.' }
];
//step 2: Su dung cac model de ket noi den collection
const postData = async () => {  
  
   //insert brands to data mongoBD
 for(let i = 0; i < brands.length; i++) {
    const brand = new Brand({
      brand_name: brands[i].brand_name,
      description: brands[i].description,
      slug: buildSlug(brands[i].brand_name)
    });
    await brand.save();
    console.log(`Create brands ${i} successfully !`);
  }

   /* const currentBrands = await Brand.find();
   const currentCategories = await Category.find();

     for (let i = 1; i <= 15; i++) {

    let productName = faker.commerce.productName()+i;
    
    const brand = currentBrands[Math.floor(Math.random() * currentBrands.length)];
    const category = currentCategories[Math.floor(Math.random() * currentCategories.length)];

    const fakeProduct = {
      product_name: productName,
      price: faker.commerce.price({ min: 100, max: 1200 }),
      discount: faker.number.int({ min: 1, max: 50 }),
      category: category._id,
      brand_id: brand._id,
      description: faker.commerce.productDescription(),
      model_year: faker.helpers.fromRegExp('2[0-9]{3}'),
      stock: faker.number.int({ min: 1, max: 200 }), // Thêm trường stock
      thumbnail: 'https://picsum.photos/400/400', // Thêm trường thumbnail
      slug: faker.helpers.slugify(productName), // Tạo slug từ productName
    }
   
    const product = new Product(fakeProduct);
    await product.save();
    console.log(`Create Product ${i} successfully !`);
    
  } */
  
}
try {
  postData();
} catch (error) {
  console.log('<<=== 🚀 error ===>>',error);
}