import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <div className='grid grid-cols-1 justify-center'>
      <div className='h-62 flex justify-center'>
        <div className='w-[1200px] grid grid-cols-12 mt-6 mb-6 text-[14px]'>
          <div className='col-span-2 grid grid-rows-6 items-center'>
            <h1 className='font-bold hover:text-red-500 cursor-pointer'>VỀ GEARVN</h1>
            <p className='hover:text-red-500'><Link href='/pages/gioi-thieu'>Giới thiệu</Link></p>
            <p className='hover:text-red-500'><Link href='/pages/tuyen-dung'>Tuyển dụng</Link></p>
            <p className='hover:text-red-500'><Link href='/pages/lien-he'>Liên hệ</Link></p>
          </div>
          <div className='col-span-2 grid grid-rows-6 items-center'>
            <h1 className='font-bold hover:text-red-500 cursor-pointer'>CHÍNH SÁCH</h1>
            <p className='hover:text-red-500'><Link href='/pages/chinh-sach-bao-hanh'>Chính sách bảo hành</Link></p>
            <p className='hover:text-red-500'><Link href='/pages/chinh-sach-giao-hang'>Chính sách giao hàng</Link></p>
            <p className='hover:text-red-500'><Link href='/pages/chinh-sach-bao-mat'>Chính sách bảo mật</Link></p>
          </div>
          <div className='col-span-2 grid grid-rows-6 items-center'>
            <h1 className='font-bold hover:text-red-500 cursor-pointer'>THÔNG TIN</h1>
            <p className='hover:text-red-500'><Link href='/pages/he-thong-cua-hang'>Hệ thống cửa hàng</Link></p>
            <p className='hover:text-red-500'><Link href='/pages/huong-dan-mua-hang'>Hướng dẫn mua hàng</Link></p>
            <p className='hover:text-red-500'><Link href='/pages/huong-dan-thanh-toan'>Hướng dẫn thanh toán</Link></p>
            <p className='hover:text-red-500'><Link href='/pages/huong-dan-tra-gop'>Hướng dẫn trả góp</Link></p>
          </div>
          <div className='col-span-3 grid grid-rows-6 items-center'>
            <h1 className='hover:text-red-500 cursor-pointer'><strong>TỔNG ĐÀI HỖ TRỢ</strong> <span>(8:00 - 21:00)</span></h1>
            <div className='flex gap-x-1'>
              <p className='w-18'>Mua hàng: </p>
              <Link href='/pages/lien-he'><span className='font-bold text-[#1982F9] hover:text-red-500'>1900.5301</span></Link>
            </div>
            <div className='flex gap-x-1'>
              <p className='w-18'>Bảo hành: </p>
              <Link href='/pages/lien-he'><span className='font-bold text-[#1982F9] hover:text-red-500'>1900.5325</span></Link>
            </div>
            <div className='flex gap-x-1'>
              <p className='w-18'>Khiếu nại: </p>
              <Link href='/pages/lien-he'><span className='font-bold text-[#1982F9] hover:text-red-500'>1800.6173</span></Link>
            </div>
            <div className='flex gap-x-1'>
              <p className='w-18'>Email: </p>
              <Link href='https://mail.google.com'><span className='font-bold text-[#1982F9] hover:text-red-500'>cskh@gearvn.com</span></Link>
            </div>
          </div>
          <div className='col-span-3 grid grid-rows-6 items-center'>
            <h1 className='font-bold hover:text-red-500 cursor-pointer'>ĐƠN VỊ VẬN CHUYỂN</h1>
            <div className='flex gap-0.5'>
              <div className="relative w-[73px] h-[35px]">
                <Image
                alt="ship_1"
                src="http://localhost:8889/uploads/shippings/ship_1.webp"
                fill
                sizes="(max-width: 768px) 100vw, 73px"
                />
              </div>
              <div className="relative w-[73px] h-[35px]">
                <Image
                alt='ship_2'
                src='http://localhost:8889/uploads/shippings/ship_2.webp'
                fill
                sizes="(max-width: 768px) 100vw, 73px"
                />
              </div>
              <div className="relative w-[73px] h-[35px]">
                <Image
                alt='ship_3'
                src='http://localhost:8889/uploads/shippings/ship_3.webp'
                fill
                sizes="(max-width: 768px) 100vw, 73px"
                />
              </div>
              <div className="relative w-[73px] h-[35px]">
                <Image
                alt='ship_4'
                src='http://localhost:8889/uploads/shippings/ship_4.webp'
                fill
                sizes="(max-width: 768px) 100vw, 73px"
                />
              </div>
            </div>
            <h1 className='font-bold hover:text-red-500 cursor-pointer'>PHƯƠNG THỨC THANH TOÁN</h1>
            <div className='flex gap-0.5'>
              <div className="relative w-[73px] h-[35px]">
                <Image
                alt='pay_1'
                src='http://localhost:8889/uploads/payment_methods/pay_1.webp'
                fill
                sizes="(max-width: 768px) 100vw, 73px"
                />
              </div>
              <div className="relative w-[73px] h-[35px]">
                <Image
                alt='pay_2'
                src='http://localhost:8889/uploads/payment_methods/pay_2.webp'
                fill
                sizes="(max-width: 768px) 100vw, 73px"
                />
              </div>
              <div className="relative w-[73px] h-[35px]">
                <Image
                alt='pay_3'
                src='http://localhost:8889/uploads/payment_methods/pay_3.webp'
                fill
                sizes="(max-width: 768px) 100vw, 73px"
                />
              </div>
              <div className="relative w-[73px] h-[35px]">
                <Image
                alt='pay_4'
                src='http://localhost:8889/uploads/payment_methods/pay_4.webp'
                fill
                sizes="(max-width: 768px) 100vw, 73px"
                />
              </div>
            </div>
            <div className='flex gap-0.5'>
              <div className="relative w-[73px] h-[35px]">
                <Image
                alt='pay_5'
                src='http://localhost:8889/uploads/payment_methods/pay_5.webp'
                fill
                sizes="(max-width: 768px) 100vw, 73px"
                />
              </div>
              <div className="relative w-[73px] h-[35px]">
                <Image
                alt='pay_6'
                src='http://localhost:8889/uploads/payment_methods/pay_6.webp'
                fill
                sizes="(max-width: 768px) 100vw, 73px"
                />
              </div>
              <div className="relative w-[73px] h-[35px]">
                <Image
                alt='pay_7'
                src='http://localhost:8889/uploads/payment_methods/pay_7.webp'
                fill
                sizes="(max-width: 768px) 100vw, 73px"
                />
              </div>
              <div className="relative w-[73px] h-[35px]">
                <Image
                alt='pay_8'
                src='http://localhost:8889/uploads/payment_methods/pay_8.webp'
                fill
                sizes="(max-width: 768px) 100vw, 73px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='h-22 flex justify-center'>
        <div className='w-[1200px]'>
          <div className='text-gray-200'>
            <hr />
          </div>
          <div className='flex items-center mt-6 mb-6 gap-x-2'>
            <div className='w-44'>
              <h1 className='font-bold text-[14px]'>KẾT NỐI VỚI CHÚNG TÔI</h1>
            </div>
            <div className='flex flex-1 items-center justify-between'>
              <div className='flex gap-x-2'>
                <Link href='https://www.facebook.com/gearvnhcm'>
                  <Image 
                  alt='facebook'
                  src='http://localhost:8889/uploads/social_network/facebook_1_0e31d70174824ea184c759534430deec.webp'
                  width={32}
                  height={32}
                  className="cursor-pointer"
                  />
                </Link>
                <Link href='https://www.tiktok.com/@gearvn.store'>
                  <Image 
                  alt='tiktok'
                  src='http://localhost:8889/uploads/social_network/tiktok_logo_fe1e020f470a4d679064cec31bc676e4.webp'
                  width={32}
                  height={32}
                  />
                </Link>
                <Link href='https://bit.ly/GearvnVideos'>
                  <Image 
                  alt='youtube'
                  src='http://localhost:8889/uploads/social_network/youtube_1_d8de1f41ca614424aca55aa0c2791684.webp'
                  width={32}
                  height={32}
                  />
                </Link>
                <Link href='https://zalo.me/450955578960321912'>
                  <Image 
                  alt='icon_zalo'
                  src='http://localhost:8889/uploads/social_network/icon_zalo__1__f5d6f273786c4db4a3157f494019ab1e.webp'
                  width={32}
                  height={32}
                  />
                </Link>
                <Link href='https://www.facebook.com/groups/VietnamGamingConner'>
                  <Image 
                  alt='group'
                  src='http://localhost:8889/uploads/social_network/group_1_54d23abd89b74ead806840aa9458661d.webp'
                  width={32}
                  height={32}
                  />
                </Link>
              </div>
              <div>
                <Link href='http://online.gov.vn/Home'>
                  <Image 
                  alt='logo_bct'
                  src='http://localhost:8889/uploads/logos/logo_bct.webp'
                  width={132}
                  height={52}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
