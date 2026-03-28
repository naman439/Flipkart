import React from 'react';
import Link from 'next/link';

export default function CategorySubNav({ categorySlug }) {
  // Mock sub-category mappings based on Flipkart screens
  const subCategoryData = {
    'mobiles': [
      { name: 'Smartphones', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/mobile/h/d/9/-original-imagtc2qzpz2ffqq.jpeg' },
      { name: 'Keypad Phones', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/mobile/k/w/k/-original-imagg2abzhj2fpgs.jpeg' },
      { name: 'Cases & Covers', img: 'https://rukminim2.flixcart.com/image/128/128/k3rmm4w0/cases-covers/back-cover/w/s/d/spigen-acs00080-original-imafmtt4tz2fmmzz.jpeg' },
      { name: 'Screen Guards', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/screen-guard/screen-guard/c/r/d/pg-105-02-tempered-glass-for-apple-iphone-13-13-pro-14-gorilla-original-imagzzfzqzhzjtzd.jpeg' },
      { name: 'Power Banks', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/power-bank/d/a/f/-original-imagky3e8yp5ebvr.jpeg' }
    ],
    'electronics': [
      { name: 'Laptops', img: 'https://rukminim2.flixcart.com/image/128/128/l5h2xdc0/computer/y/i/8/-original-imag7n2hyzyffyxy.jpeg' },
      { name: 'Tablets', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/tablet/o/f/5/-original-imagm9vzvzb4zb3f.jpeg' },
      { name: 'Headphones', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/headphone/s/p/c/-original-imagg5jy66mzmhzg.jpeg' },
      { name: 'Smartwatches', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/smartwatch/c/5/t/-original-imagpeqysghztzwx.jpeg' },
      { name: 'Speakers', img: 'https://rukminim2.flixcart.com/image/128/128/l2ghgnk0/speaker/mobile-tablet-speaker/r/z/6/-original-imagdth4qbzdzf2v.jpeg' }
    ],
    'appliances': [
      { name: 'ACs', img: 'https://rukminim2.flixcart.com/flap/128/128/image/48ea111.jpg' },
      { name: 'Inverters', img: 'https://rukminim2.flixcart.com/flap/128/128/image/1d19830.jpg' },
      { name: 'Fridges', img: 'https://rukminim2.flixcart.com/flap/128/128/image/78eb171.png' },
      { name: 'Fans', img: 'https://rukminim2.flixcart.com/flap/128/128/image/78db191.jpg' },
      { name: 'Televisions', img: 'https://rukminim2.flixcart.com/flap/128/128/image/3b1450a.png' },
      { name: 'Washing Machines', img: 'https://rukminim2.flixcart.com/flap/128/128/image/9e604ec03ff28d61.jpg' }
    ],
    'fashion': [
      { name: 'T-Shirts', img: 'https://rukminim2.flixcart.com/flap/128/128/image/72b8c59f2a991873.jpg' },
      { name: 'Jeans', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/jean/r/a/b/38-eps-black-03-urbano-fashion-original-imaghwgxgemzkqjz.jpeg' },
      { name: 'Shoes', img: 'https://rukminim2.flixcart.com/flap/128/128/image/49340f1a94ac8bc5.jpeg' },
      { name: 'Watches', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/watch/z/p/j/-original-imagpcdgbnzzv28r.jpeg' },
      { name: 'Accessories', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/belt/2/h/q/36-formal-men-s-genuine-leather-belt-k1-1-tq-36-k-d-1-tq-original-imahyg8b3zt8aebx.jpeg' }
    ],
    '2-wheelers': [
      { name: 'Helmets', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/helmet/p/y/m/-original-imaggj7hf8qyzv8z.jpeg' },
      { name: 'Riding Gears', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/biking-glove/2/a/1/-original-imagna4e7n6fyyqy.jpeg' },
      { name: 'Vehicle Covers', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/vehicle-cover/y/f/h/1-royal-enfield-classic-350-red-black-bike-cover-water-resis-original-imagqg5z2z4h7fzr.jpeg' },
      { name: 'Cleaning Care', img: 'https://rukminim2.flixcart.com/image/128/128/kxrfr0w0/vehicle-cleaner/m/8/n/500-dashboard-polish-wavex-original-imaga5u8fyzqhqyq.jpeg' }
    ],
    'home-kitchen': [
      { name: 'Decor', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/showpiece-figurine/s/6/r/5-brass-nandi-statue-nandi-idol-god-nandi-bull-vridhab-statue-of-original-imahysf5yfzjpf7x.jpeg' },
      { name: 'Kitchenware', img: 'https://rukminim2.flixcart.com/image/128/128/l5jxt3k0/kitchen-container-set/d/j/u/clear-plastic-storage-containers-for-kitchen-pantry-storage-original-imagg5h68s7p7aht.jpeg' },
      { name: 'Furnishings', img: 'https://rukminim2.flixcart.com/image/128/128/kbb49zk0/bedsheet/u/y/t/maroon-leaf-maroon-leaf-flat-bella-casa-original-imafsmjgzbmgzhhy.jpeg' }
    ],
    'beauty': [
      { name: 'Makeup', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/foundation/z/e/h/30-superstay-full-coverage-liquid-foundation-maybelline-new-original-imagq9zh3hgxbbhz.jpeg' },
      { name: 'Skincare', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/face-wash/s/y/l/-original-imagm9gzfzzzyzb2.jpeg' },
      { name: 'Fragrances', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/perfume/m/w/x/100-long-lasting-edp-eau-de-parfum-villain-men-original-imagkfxzwzhy4f8p.jpeg' }
    ],
    'toys-baby': [
      { name: 'Toys', img: 'https://rukminim2.flixcart.com/image/128/128/kid-toy/y/x/r/wndg-plstc-tys-j14-wonder-plastic-toys-original-imadf6623h5yzcch.jpeg' },
      { name: 'Diapers', img: 'https://rukminim2.flixcart.com/image/128/128/diaper/f/5/m/pampers-active-baby-large-64-pampers-original-imado6zy3uwn4ztz.jpeg' }
    ],
    'groceries': [
      { name: 'Staples', img: 'https://rukminim2.flixcart.com/image/128/128/kfcv6vk0/dal-pulses/z/z/q/1-masoor-dal-urad-dal-tata-sampann-unpolished-original-imafvtfgh2bzzh3j.jpeg' },
      { name: 'Snacks', img: 'https://rukminim2.flixcart.com/image/128/128/kzrbiq80/snack-savourie/g/p/p/-original-imagbq2xhyjygfhn.jpeg' }
    ],
    'books': [
      { name: 'Fiction', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/book/1/5/l/fiction-factory-original-imagy4t99hq8fhqg.jpeg' },
      { name: 'Non-Fiction', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/book/h/8/d/the-psychology-of-money-original-imaguzghzhhzszy6.jpeg' },
      { name: 'Educational', img: 'https://rukminim2.flixcart.com/image/128/128/kufuikw0/book/0/6/q/lucant-general-knowledge-original-imag7k9pzyzz4h9x.jpeg' }
    ],
    'auto-accessories': [
      { name: 'Car Care', img: 'https://rukminim2.flixcart.com/image/128/128/kxrfr0w0/vehicle-cleaner/m/8/n/500-dashboard-polish-wavex-original-imaga5u8fyzqhqyq.jpeg' },
      { name: 'Wiper Blades', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/wiper-blade/n/8/y/frameless-bosch-original-imahyvhzqhczqzhq.jpeg' },
      { name: 'Air Compressors', img: 'https://rukminim2.flixcart.com/image/128/128/xif0q/tyre-inflator/9/8/a/portable-12v-dc-air-compressor-pump-digital-display-tyre-original-imahf2zvzfzyqzhc.jpeg' }
    ],
    'sports-fitness': [
      { name: 'Footballs', img: 'https://rukminim2.flixcart.com/image/128/128/jxzfx8w0/football/y/q/4/4-430-storm-1-1-nivia-original-imafgaufzgcfk6zh.jpeg' },
      { name: 'Yoga Mats', img: 'https://rukminim2.flixcart.com/image/128/128/kdqafe80/yoga-mat/e/q/t/premium-extra-thick-anti-slip-6-mat-for-gym-workout-yoga-original-imafukhvzymhfytj.jpeg' },
      { name: 'Dumbbells', img: 'https://rukminim2.flixcart.com/image/128/128/kg2l47k0/dumbbell/8/h/k/pvc-dumbbell-set-for-home-gym-fitness-equipment-fixed-weight-original-imafwcth6zfcyfz9.jpeg' }
    ],
    'furniture': [
      { name: 'Beds', img: 'https://rukminim2.flixcart.com/image/128/128/bed/d/u/m/queen-sw-bed-01-sparrow-world-original-imaehzuzgz3s6wgb.jpeg' },
      { name: 'Sofas', img: 'https://rukminim2.flixcart.com/image/128/128/sofa-set/3/g/w/grey-cotton-fabric-sf010-grey-urban-ladder-original-imaer6f6rgg7cgzq.jpeg' },
      { name: 'Wardrobes', img: 'https://rukminim2.flixcart.com/image/128/128/wardrobe-closet/h/s/m/particle-board-hw92-hometown-original-imaenyhbcfzfgg67.jpeg' }
    ]
  };

  const currentSubs = subCategoryData[categorySlug] || subCategoryData['fashion'];

  return (
    <div style={{ background: 'white', padding: '16px 20px', display: 'flex', gap: '30px', overflowX: 'auto', borderBottom: '1px solid #f0f0f0' }} className="no-scrollbar">
      {currentSubs.map((sub, idx) => (
        <Link href={`/products?category=${categorySlug}&q=${sub.name}`} key={idx} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 80 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src={sub.img} alt={sub.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = 'https://dummyimage.com/64x64/f0f0f0/666.png&text=Icon'; }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#212121', whiteSpace: 'nowrap' }}>{sub.name}</span>
        </Link>
      ))}
    </div>
  );
}
