'use client';

import Link from 'next/link';

export default function Footer() {
  const footerLinks = [
    {
      title: 'ABOUT',
      links: ['Contact Us', 'About Us', 'Careers', 'Flipkart Stories', 'Press', 'Corporate Information']
    },
    {
      title: 'GROUP COMPANIES',
      links: ['Myntra', 'Cleartrip', 'Shopsy']
    },
    {
      title: 'HELP',
      links: ['Payments', 'Shipping', 'Cancellation & Returns', 'FAQ']
    },
    {
      title: 'CONSUMER POLICY',
      links: ['Cancellation & Returns', 'Terms Of Use', 'Security', 'Privacy', 'Sitemap']
    }
  ];

  return (
    <footer style={{ background: '#172337', color: 'white', padding: '40px 0 20px', fontSize: 12 }}>
      <div className="main-container footer-grid-responsive" style={{ borderBottom: '1px solid #454d5e', paddingBottom: 40, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20 }}>
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 style={{ color: '#878787', marginBottom: 15, fontWeight: 400 }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.links.map(link => (
                  <li key={link}>
                    <Link href="#" style={{ color: 'white', textDecoration: 'none' }}>{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="footer-address-section" style={{ display: 'flex', gap: 20 }}>
          <div style={{ flex: 1, borderLeft: '1px solid #454d5e', paddingLeft: 20 }}>
            <h4 style={{ color: '#878787', marginBottom: 15, fontWeight: 400 }}>Mail Us:</h4>
            <p style={{ lineHeight: 1.5 }}>
              Flipkart Internet Private Limited,<br />
              Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
              Outer Ring Road, Bengaluru, 560103, Karnataka, India
            </p>
          </div>

          <div style={{ flex: 1, paddingLeft: 10 }}>
            <h4 style={{ color: '#878787', marginBottom: 15, fontWeight: 400 }}>Registered Office:</h4>
            <p style={{ lineHeight: 1.5 }}>
              Flipkart Internet Private Limited,<br />
              Bengaluru, 560103, Karnataka, India<br />
              CIN : U51109KA2012PTC066107<br />
              Telephone: 044-45614700
            </p>
          </div>
        </div>
      </div>

      <div className="main-container footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', gap: 25, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#ff9f00' }}>🛒</span> Become a Seller
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
             <span style={{ color: '#ff9f00' }}>⭐</span> Advertise
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
             <span style={{ color: '#ff9f00' }}>🎁</span> Gift Cards
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
             <span style={{ color: '#ff9f00' }}>❓</span> Help Center
          </div>
        </div>
        
        <div>© 2007-2025 Flipkart.com</div>
        
        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment-method_69e7bc.svg" alt="Payments" style={{ height: 20 }} />
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .footer-grid-responsive { display: flex !important; flex-direction: column !important; gap: 32px !important; }
          .footer-address-section { flex-direction: column !important; gap: 20px !important; }
          .footer-address-section > div { border-left: none !important; padding-left: 0 !important; }
          .footer-bottom { justify-content: center !important; text-align: center !important; }
        }
      `}</style>
    </footer>
  );
}
