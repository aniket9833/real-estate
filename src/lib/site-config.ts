export const siteConfig = {
  name: 'AVASYA Property',
  tagline: 'Trusted Land & Home Deals in Akola',
  subTagline: 'Verified plots, honest guidance, clear documentation.',
  description: 'Helping you invest safely in your dream property.',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+91 77579 37993',
  phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER || '+91 9175707057',
  email: 'avasyahomes@gmail.com',
  address: 'Umari Rd, Naka, Chhoti Umari, Akola, Maharashtra 444005',
  officeHours: 'Mon – Sat, 10:00 AM – 7:00 PM',
  mapEmbedUrl:
    'https://www.google.com/maps/place/Avasya+Property/@20.7138374,77.0194957,17z/data=!3m1!4b1!4m6!3m5!1s0x3bd72f5889b6f6a9:0xb33361969c41854d!8m2!3d20.7138374!4d77.0194957!16s%2Fg%2F11x7x7_ldn?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D',
};

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];
