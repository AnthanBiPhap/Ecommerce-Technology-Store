import { CategoryMenu } from "./ui/CategoryMenu";
import MainBanners from "./ui/MainBanners";
import PromoBox from "./ui/PromoBox";
import CategoryBox from "./ui/CategoryBox";
import ProductBox from "./ui/ProductBox";
import FlashSaleBox from "./ui/FlashSaleBox";
import TechBoxSmall from "./ui/techNew/TechBoxSmall";
import BestSaleBox from "./ui/BestSaleBox";
import { Suspense } from "react";




export default function Home() {
  
  const promoBoxs = [
    {
      name: 'thang_04_layout_web__01',
      imgUri: 'http://localhost:8889/uploads/services/thang_04_layout_web__01.webp',
      link: '/pages/bang-gia-thu-san-pham-cu'
    },
    {
      name: 'thang_04_layout_web__02',
      imgUri: 'http://localhost:8889/uploads/services/thang_04_layout_web__02.webp',
      link: '/collections/ban-phim'
    },
    {
      name: 'thang_04_layout_web__03',
      imgUri: 'http://localhost:8889/uploads/services/thang_04_layout_web__03.webp',
      link: '/products/pc-gvn-intel-i5-12400f-vga-rtx-4060'
    },
    {
      name: 'thang_04_layout_web__04',
      imgUri: 'http://localhost:8889/uploads/services/thang_04_layout_web__04.webp',
      link: '/collections/laptop'
    },
    {
      name: 'thang_04_layout_web__05',
      imgUri: 'http://localhost:8889/uploads/services/thang_04_layout_web__05.webp',
      link: '/collections/laptop'
    },
    {
      name: 'thang_04_banner_ver_2024_500x250',
      imgUri: 'http://localhost:8889/uploads/services/thang_04_banner_ver_2024_500x250.webp',
      link: '/pages/gvn-gaming-festival'
    },
    {
      name: 'thang_04_layout_web__06',
      imgUri: 'http://localhost:8889/uploads/services/thang_04_layout_web__06.webp',
      link: '/products/pc-gvn-intel-i3-12100f-vga-rx-6500xt'
    },
    {
      name: 'thang_04_layout_web__07',
      imgUri: 'http://localhost:8889/uploads/services/thang_04_layout_web__07.webp',
      link: '/collections/chuot'
    },
    {
      name: 'thang_04_layout_web__08',
      imgUri: 'http://localhost:8889/uploads/services/thang_04_layout_web__08.webp',
      link: '/collections/man-hinh'
    },
  ];

  return (
    <div className="grid justify-center bg-gray-100 pt-2 pb-2">
      <div className="w-[1200px]">
        <div className="flex gap-x-2">
          <CategoryMenu />
          <div>
            <MainBanners />
            <div className="h-[163px] flex gap-x-5">
              {promoBoxs.slice(3,5).map((item, index) => (
                <PromoBox 
                  key={index}
                  name={item.name}
                  imgUri={item.imgUri}
                  link={item.link}
                />
              ))}
            </div> 
          </div>
          <div className="h-[326px] grid grid-cols-1 gap-y-5">
            {promoBoxs.slice(0,3).map((item, index) => (
              <PromoBox 
                key={index}
                name={item.name}
                imgUri={item.imgUri}
                link={item.link}
              />
            ))}
          </div>
        </div>
        <div className="h-[163px] flex gap-x-5">
          {promoBoxs.slice(5,9).map((item, index) => (
            <PromoBox 
              key={index}
              name={item.name}
              imgUri={item.imgUri}
              link={item.link}
            />
          ))}
        </div>
        <Suspense fallback={<div>Loading Flash Sale...</div>}>
          <FlashSaleBox />
        </Suspense>
        <Suspense fallback={<div>Loading Flash Sale...</div>}>
          <BestSaleBox />
        </Suspense>
        <Suspense fallback={<div>Loading Flash Sale...</div>}>
          <ProductBox 
          title="PC"
          type="pc"
          />
        </Suspense>
        <Suspense fallback={<div>Loading Flash Sale...</div>}>
          <ProductBox 
          title="Laptop"
          type="laptop"
          />
        </Suspense>
        <Suspense fallback={<div>Loading Flash Sale...</div>}>
          <ProductBox 
          title="Chuột máy tính"
          type="chuot"
          />
        </Suspense>
        <Suspense fallback={<div>Loading Flash Sale...</div>}>
          <ProductBox 
          title="Bàn Phím"
          type="ban-phim"
          />
        </Suspense>
        
        <Suspense fallback={<div>Loading Flash Sale...</div>}>
          <CategoryBox />
        </Suspense>
        <Suspense fallback={<div>Loading Flash Sale...</div>}>
          <TechBoxSmall />
        </Suspense>
      </div>
    </div>
  );
}
