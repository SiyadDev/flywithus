// All editable business content lives here.

export const business = {
  name: 'Fly With Us',
  fullName: 'Fly With Us Tours & Travels',
  tagline: 'Your Sky, Our Service',
  script: 'Travel The World',
  address: 'Opp. Police Station, Mannarkkad, Palakkad, Kerala 678582',
  addressShort: 'Opp. Police Station, Mannarkkad',
  phones: [
    { label: '+91 94475 00151', tel: '+919447500151' },
    { label: '+91 95268 09621', tel: '+919526809621' },
  ],
  whatsapp: '919447500151',
  email: 'flywithusmkd@gmail.com',
  instagram: 'https://www.instagram.com/fly_withus__/',
  instagramHandle: '@fly_withus__',
  rating: 4.9,
  reviewCount: 121,
  reviewsUrl:
    'https://www.google.com/maps/search/?api=1&query=Fly+With+Us+Tours+%26+Travels+Mannarkkad',
  mapEmbed:
    'https://www.google.com/maps?q=Fly+With+Us+Tours+%26+Travels,+Mannarkkad,+Kerala+678582&output=embed',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Fly+With+Us+Tours+%26+Travels+Mannarkkad',
};

export const wa = (text: string) =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;

export type Service = {
  id: string;
  title: string;
  short: string;
  body: string;
  icon: string;
  image?: string;
};

export const services: Service[] = [
  {
    id: 'flights',
    title: 'Flight Tickets',
    short: 'Domestic & international',
    body: 'Gulf, holiday or home — we compare fares across airlines and book the route, timing and baggage that suit you.',
    icon: 'plane',
    image: '/images/flight-ticket.jpg',
  },
  {
    id: 'visa',
    title: 'Tourist & Visit Visa',
    short: 'UAE, GCC, Asia & more',
    body: 'Reliable help with tourist and visit visas — forms, documents and follow-up handled for you.',
    icon: 'visa',
    image: '/images/visa.jpg',
  },
  {
    id: 'attestation',
    title: 'Stamping & Attestation',
    short: 'Certificates, embassy, MEA',
    body: 'Get your documents valid and recognised abroad with trusted stamping and attestation.',
    icon: 'stamp',
    image: '/images/attestation.jpg',
  },
  {
    id: 'passport',
    title: 'Passport Services',
    short: 'New, renewal, urgent',
    body: 'First application, renewal or an urgent request — we streamline the process from form to appointment.',
    icon: 'passport',
  },
  {
    id: 'pcc',
    title: 'Police Clearance (PCC)',
    short: 'For jobs & visas abroad',
    body: 'Application support for Police Clearance Certificates required for overseas employment and visas.',
    icon: 'badge',
  },
  {
    id: 'medical',
    title: 'Visa Medical',
    short: 'Appointment booking',
    body: 'We book your pre-departure medical appointment and tell you exactly what to bring.',
    icon: 'medical',
  },
  {
    id: 'train',
    title: 'Train Tickets',
    short: 'Across India',
    body: 'Pick your train and class — we book it and send your e-ticket straight to your phone.',
    icon: 'train',
  },
  {
    id: 'bus',
    title: 'Bus Tickets',
    short: 'Interstate & sleeper',
    body: 'Flexible routes and live seat availability for comfortable bus journeys.',
    icon: 'bus',
  },
  {
    id: 'insurance',
    title: 'Travel Insurance',
    short: 'Medical, cancellation, baggage',
    body: 'Cover for medical emergencies, trip cancellations and lost baggage, so you travel with peace of mind.',
    icon: 'shield',
  },
  {
    id: 'resort',
    title: 'Resort Booking',
    short: 'Stays & getaways',
    body: 'Holiday stays and resort bookings to go with your tickets — one place for the whole trip.',
    icon: 'palm',
  },
];

export type Destination = {
  city: string;
  country: string;
  code: string;
  image: string;
  note: string;
};

export const destinations: Destination[] = [
  { city: 'Dubai', country: 'United Arab Emirates', code: 'DXB', image: '/images/dest/dubai.jpg', note: 'Tickets · Visit visa' },
  { city: 'Riyadh', country: 'Saudi Arabia', code: 'RUH', image: '/images/dest/riyadh.jpg', note: 'Tickets · Attestation' },
  { city: 'Doha', country: 'Qatar', code: 'DOH', image: '/images/dest/doha.jpg', note: 'Tickets · Visit visa' },
  { city: 'Muscat', country: 'Oman', code: 'MCT', image: '/images/dest/muscat.jpg', note: 'Tickets · Tourist visa' },
  { city: 'Kuala Lumpur', country: 'Malaysia', code: 'KUL', image: '/images/dest/kualalumpur.jpg', note: 'Holidays · Tourist visa' },
  { city: 'Singapore', country: 'Singapore', code: 'SIN', image: '/images/dest/singapore.jpg', note: 'Holidays · Tourist visa' },
  { city: 'Bangkok', country: 'Thailand', code: 'BKK', image: '/images/dest/bangkok.jpg', note: 'Holidays · Packages' },
  { city: 'Malé', country: 'Maldives', code: 'MLE', image: '/images/dest/maldives.jpg', note: 'Resorts · Honeymoons' },
];

// Draft lists — please review with the team before launch.
export const checklists: { id: string; title: string; items: string[] }[] = [
  {
    id: 'visa',
    title: 'Tourist / Visit Visa',
    items: [
      'Passport (valid for at least 6 months)',
      'Passport-size photo, white background',
      'Confirmed return ticket',
      'Hotel booking or host’s address',
      'Host’s passport & visa copy (visit visa)',
      'Recent bank statement, if asked',
    ],
  },
  {
    id: 'passport',
    title: 'Passport (new / renewal)',
    items: [
      'Aadhaar card',
      'Proof of address',
      'Proof of date of birth (birth certificate / SSLC)',
      'Old passport (for renewal)',
      'Mobile number & email for appointment',
    ],
  },
  {
    id: 'attestation',
    title: 'Stamping & Attestation',
    items: [
      'Original certificates to be attested',
      'Passport copy',
      'Visa copy, if available',
      'Authorisation letter (if someone else submits)',
    ],
  },
  {
    id: 'pcc',
    title: 'Police Clearance (PCC)',
    items: [
      'Original passport + copy',
      'Proof of current address',
      'Passport-size photos',
      'Visa / job offer copy, if available',
    ],
  },
  {
    id: 'medical',
    title: 'Visa Medical',
    items: [
      'Original passport + copy',
      'Passport-size photos',
      'Visa or employer details',
      'Previous medical reports, if any',
    ],
  },
  {
    id: 'flights',
    title: 'Flight Ticket',
    items: [
      'Passenger names exactly as on passport',
      'Passport copy (international)',
      'Valid visa copy (international)',
      'Preferred travel dates & airport',
    ],
  },
];

export const steps = [
  {
    n: '01',
    title: 'Tell us your plan',
    body: 'WhatsApp, call, or walk into our office opposite the Police Station.',
  },
  {
    n: '02',
    title: 'We do the legwork',
    body: 'Best fares, paperwork, appointments and follow-ups — all handled by our team.',
  },
  {
    n: '03',
    title: 'You fly',
    body: 'Tickets and documents in your hand, with us a message away the whole trip.',
  },
];

export const faqs = [
  {
    q: 'How do I book with Fly With Us?',
    a: 'Send us a WhatsApp message using the booking form on this page, call us, or visit our office in Mannarkkad. We reply with options and confirm everything before booking.',
  },
  {
    q: 'Do I have to visit the office?',
    a: 'Not for most tickets — we can handle flights, trains and buses over WhatsApp. For visas, passports, attestation and PCC we may need to see original documents.',
  },
  {
    q: 'How long does a visa take?',
    a: 'It depends on the country and visa type. Tell us where you’re going and we’ll give you a realistic timeline before you apply.',
  },
  {
    q: 'Can you book for my whole family or a group?',
    a: 'Yes. Share the number of travellers and dates, and we’ll find seats together and handle everyone’s documents.',
  },
  {
    q: 'Can you help with urgent passport or travel needs?',
    a: 'Yes — message us as early as possible. We’ll tell you the fastest available route and what you need to bring.',
  },
  {
    q: 'Which documents should I bring?',
    a: 'Use the document checklist above for a quick idea. Requirements change by country and purpose, so we always confirm the exact list with you.',
  },
];

// Paste real Google reviews here (copy exactly, with the reviewer's first name).
// The reviews carousel appears automatically once this list has entries.
export const reviews: { name: string; text: string; when?: string }[] = [];

export const photoCredits = [
  { what: 'Sky', who: 'Harry Knight (CC0)', url: 'https://commons.wikimedia.org/wiki/File:In_flight_above_scattered_clouds_(Unsplash).jpg' },
  { what: 'Dubai', who: 'imran shahabuddin (CC BY 2.0)', url: 'https://commons.wikimedia.org/wiki/File:Burj_Khalifa_(worlds_tallest_building)_and_the_Dubai_skyline_(25781049892).jpg' },
  { what: 'Riyadh', who: 'B.alotaby (CC BY-SA 4.0)', url: 'https://commons.wikimedia.org/wiki/File:Riyadh_Skyline_showing_the_King_Abdullah_Financial_District_(KAFD)_and_the_famous_Kingdom_Tower_.jpg' },
  { what: 'Doha', who: 'Zairon (CC BY 4.0)', url: 'https://commons.wikimedia.org/wiki/File:Doha_Skyline_02.jpg' },
  { what: 'Muscat', who: 'Mostafameraji (CC BY-SA 4.0)', url: 'https://commons.wikimedia.org/wiki/File:Muttrah-Muscat_%D9%85%D8%B7%D8%B1%D8%AD%D8%8C_%D9%85%D8%B3%D9%82%D8%B7_15.jpg' },
  { what: 'Kuala Lumpur', who: 'CEphoto, Uwe Aranas (CC BY-SA 3.0)', url: 'https://commons.wikimedia.org/wiki/File:Kuala_Lumpur_Malaysia_Petronas-Twin-Towers-01.jpg' },
  { what: 'Singapore', who: 'Basile Morin (CC BY-SA 4.0)', url: 'https://commons.wikimedia.org/wiki/File:Marina_Bays_Sands_Hotel_and_skyline_of_the_Central_Business_District_Singapore.jpg' },
  { what: 'Bangkok', who: 'Diego Delso (CC BY-SA 3.0)', url: 'https://commons.wikimedia.org/wiki/File:Templo_Wat_Arun,_Bangkok,_Tailandia,_2013-08-22,_DD_30.jpg' },
  { what: 'Maldives', who: 'Martin Falbisoner (CC BY-SA 4.0)', url: 'https://commons.wikimedia.org/wiki/File:Diamonds_Thudufushi_Beach_and_Water_Villas,_May_2017_-01.jpg' },
];
