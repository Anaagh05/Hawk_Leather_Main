import { Product } from "../components/CartContext";

export const allProducts: Product[] = [
  // Bags
  {
    id: "1",
    name: "Classic Tote",
    price: 299,
    image: "https://images.unsplash.com/photo-1624687943971-e86af76d57de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwdG90ZSUyMGJhZ3xlbnwxfHx8fDE3NTk5NTU4ODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Bags",
    gender: "Women",
    description: "A timeless tote bag crafted from premium full-grain leather. Perfect for everyday use, it combines functionality with elegant design. The spacious interior accommodates all your essentials while maintaining a sleek silhouette.",
    features: [
      "Premium full-grain leather construction",
      "Spacious main compartment with zipper closure",
      "Interior slip pockets for organization",
      "Comfortable leather handles",
      "Protective metal feet on base",
      "Dimensions: 15\" x 12\" x 5\""
    ],
    details: [
      "Handcrafted by skilled artisans",
      "Vegetable-tanned leather",
      "Cotton canvas lining",
      "Solid brass hardware",
      "Made to develop a rich patina over time",
      "Lifetime warranty included"
    ]
  },
  {
    id: "2",
    name: "Minimal Wallet",
    price: 89,
    image: "https://images.unsplash.com/photo-1689844495806-321b5adaf5d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwcHVyc2UlMjB3YWxsZXR8ZW58MXx8fHwxNzU5OTkyNzcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Purses",
    gender: "Unisex",
    description: "A sleek, minimalist wallet designed for those who appreciate simplicity. This slim profile wallet holds all your essentials without the bulk, featuring RFID-blocking technology for added security.",
    features: [
      "RFID-blocking technology",
      "Slim, minimalist design",
      "6 card slots plus bill compartment",
      "Premium leather construction",
      "Contrast stitching detail",
      "Dimensions: 4.5\" x 3.5\" x 0.5\""
    ],
    details: [
      "Full-grain leather exterior",
      "Soft suede lining",
      "Hand-stitched edges",
      "Ages beautifully with use",
      "Available in multiple colors",
      "Lifetime warranty included"
    ]
  },
  {
    id: "3",
    name: "Signature Belt",
    price: 129,
    image: "https://images.unsplash.com/photo-1664286074176-5206ee5dc878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmVsdHxlbnwxfHx8fDE3NTk5OTI3NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Belts",
    gender: "Men",
    description: "An essential accessory crafted from a single piece of premium leather. This versatile belt features a timeless design that complements both casual and formal attire.",
    features: [
      "Single-piece leather construction",
      "Solid brass buckle",
      "1.5\" width - standard fit",
      "Available in multiple sizes",
      "Vegetable-tanned leather",
      "Reversible design (select styles)"
    ],
    details: [
      "Premium full-grain leather",
      "Hand-finished edges",
      "Tarnish-resistant hardware",
      "Develops unique patina",
      "Made to last generations",
      "Lifetime warranty included"
    ]
  },
  {
    id: "4",
    name: "Executive Briefcase",
    price: 449,
    image: "https://images.unsplash.com/photo-1611688599669-e0d5a0497670?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsZWF0aGVyJTIwYmFnfGVufDF8fHx8MTc1OTk1NTg3MXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Bags",
    gender: "Men",
    description: "A sophisticated briefcase designed for the modern professional. Featuring multiple compartments and a padded laptop sleeve, this briefcase combines classic styling with contemporary functionality.",
    features: [
      "Padded laptop compartment (fits up to 15\")",
      "Multiple interior pockets and organizers",
      "Detachable shoulder strap",
      "Lockable zipper closures",
      "Reinforced leather handles",
      "Dimensions: 16\" x 12\" x 4\""
    ],
    details: [
      "Premium bridle leather",
      "Shearling-lined laptop sleeve",
      "Solid brass fittings",
      "Water-resistant treatment",
      "Handcrafted construction",
      "Lifetime warranty included"
    ]
  },
  {
    id: "5",
    name: "Crossbody Messenger",
    price: 279,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1080",
    category: "Bags",
    gender: "Unisex",
    description: "A versatile crossbody messenger bag perfect for daily commutes and adventures. Features adjustable strap and multiple compartments for organized storage.",
    features: [
      "Adjustable crossbody strap",
      "Front flap with magnetic closure",
      "Interior padded tablet pocket",
      "Multiple card and pen slots",
      "External zippered pocket",
      "Dimensions: 13\" x 10\" x 3\""
    ],
    details: [
      "Full-grain leather construction",
      "Cotton canvas lining",
      "Antique brass hardware",
      "Weather-resistant",
      "Handmade quality",
      "Lifetime warranty included"
    ]
  },
  {
    id: "6",
    name: "Weekend Duffle",
    price: 389,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1080",
    category: "Bags",
    gender: "Men",
    description: "A spacious duffle bag for weekend getaways and short trips. Combines durability with style, featuring a large main compartment and convenient side pockets.",
    features: [
      "Large main compartment",
      "Separate shoe compartment",
      "Padded shoulder strap",
      "Dual top handles",
      "Multiple exterior pockets",
      "Dimensions: 22\" x 12\" x 11\""
    ],
    details: [
      "Heavy-duty leather construction",
      "Reinforced stress points",
      "YKK zippers",
      "Canvas bottom panel",
      "Travel-ready design",
      "Lifetime warranty included"
    ]
  },
  {
    id: "7",
    name: "Structured Satchel",
    price: 329,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1080",
    category: "Bags",
    gender: "Women",
    description: "A classic structured satchel with modern refinements. Features a top handle and detachable strap for versatile carrying options.",
    features: [
      "Structured silhouette",
      "Top handle and shoulder strap",
      "Front flap with clasp closure",
      "Interior zip and slip pockets",
      "Feet on base for protection",
      "Dimensions: 14\" x 10\" x 6\""
    ],
    details: [
      "Premium leather with structured core",
      "Suede interior lining",
      "Gold-tone hardware",
      "Signature embossed logo",
      "Artisan-crafted",
      "Lifetime warranty included"
    ]
  },
  {
    id: "8",
    name: "Compact Backpack",
    price: 349,
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1080",
    category: "Bags",
    gender: "Unisex",
    description: "A contemporary leather backpack that seamlessly transitions from work to weekend. Features padded straps and multiple compartments.",
    features: [
      "Padded adjustable straps",
      "Laptop sleeve (fits 13\")",
      "Top drawstring closure with flap",
      "Front zippered pocket",
      "Interior organization pockets",
      "Dimensions: 12\" x 16\" x 5\""
    ],
    details: [
      "Full-grain leather body",
      "Canvas back panel for comfort",
      "Brass buckles and closures",
      "Water-repellent finish",
      "Handcrafted details",
      "Lifetime warranty included"
    ]
  },
  // Purses
  {
    id: "9",
    name: "Bi-Fold Wallet",
    price: 79,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=1080",
    category: "Purses",
    gender: "Men",
    description: "A classic bi-fold wallet with ample storage for cards and cash. Timeless design meets modern functionality.",
    features: [
      "8 card slots",
      "2 bill compartments",
      "ID window",
      "Coin pocket with snap",
      "RFID protection",
      "Dimensions: 4.5\" x 3.5\" x 1\""
    ],
    details: [
      "Premium leather construction",
      "Contrast stitching",
      "Smooth interior lining",
      "Develops character with age",
      "Made to order available",
      "Lifetime warranty included"
    ]
  },
  {
    id: "10",
    name: "Card Holder",
    price: 59,
    image: "https://images.unsplash.com/photo-1612721411190-ffe0baf5a7c8?w=1080",
    category: "Purses",
    gender: "Unisex",
    description: "An ultra-slim card holder for the minimalist. Holds essential cards in a compact, elegant package.",
    features: [
      "4 card slots",
      "Center pocket for bills",
      "Ultra-slim design",
      "RFID blocking",
      "Pull-tab for easy access",
      "Dimensions: 4\" x 2.75\" x 0.25\""
    ],
    details: [
      "Premium full-grain leather",
      "Hand-burnished edges",
      "Available in multiple colors",
      "Fits front pocket perfectly",
      "Minimalist aesthetic",
      "Lifetime warranty included"
    ]
  },
  {
    id: "11",
    name: "Zip-Around Wallet",
    price: 119,
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=1080",
    category: "Purses",
    gender: "Women",
    description: "A secure zip-around wallet with generous storage capacity. Features multiple card slots and compartments.",
    features: [
      "12 card slots",
      "3 bill compartments",
      "Zippered coin pocket",
      "Full zip-around closure",
      "RFID protection",
      "Dimensions: 7.5\" x 4\" x 1\""
    ],
    details: [
      "Soft pebbled leather",
      "Fabric lining",
      "YKK zipper",
      "Multiple color options",
      "Organized interior",
      "Lifetime warranty included"
    ]
  },
  {
    id: "12",
    name: "Clutch Wallet",
    price: 99,
    image: "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=1080",
    category: "Purses",
    gender: "Women",
    description: "A versatile clutch wallet that transitions from day to evening. Removable wrist strap included.",
    features: [
      "10 card slots",
      "Phone compartment",
      "Zippered coin section",
      "Removable wrist strap",
      "Magnetic closure",
      "Dimensions: 8\" x 4.5\" x 1\""
    ],
    details: [
      "Smooth leather exterior",
      "Suede interior lining",
      "Gold hardware accents",
      "Convertible design",
      "Evening-ready elegance",
      "Lifetime warranty included"
    ]
  },
  {
    id: "13",
    name: "Money Clip Wallet",
    price: 69,
    image: "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=1080",
    category: "Purses",
    gender: "Men",
    description: "A sleek money clip wallet for those who prefer carrying cash. Minimal bulk with maximum style.",
    features: [
      "Stainless steel money clip",
      "4 card slots",
      "Slim profile design",
      "RFID blocking",
      "Front pocket friendly",
      "Dimensions: 4\" x 3\" x 0.4\""
    ],
    details: [
      "Premium leather exterior",
      "Magnetic money clip",
      "Hand-stitched details",
      "Available in classic colors",
      "Functional minimalism",
      "Lifetime warranty included"
    ]
  },
  // Belts
  {
    id: "14",
    name: "Casual Canvas Belt",
    price: 79,
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583c3?w=1080",
    category: "Belts",
    gender: "Unisex",
    description: "A casual belt featuring canvas body with leather trim. Perfect for weekend wear and casual outings.",
    features: [
      "Canvas construction",
      "Leather reinforcement",
      "Antique brass buckle",
      "1.5\" width",
      "Adjustable sizing",
      "Multiple color options"
    ],
    details: [
      "Durable canvas material",
      "Leather tip and keeper",
      "Casual aesthetic",
      "Machine washable canvas",
      "Versatile styling",
      "Lifetime warranty included"
    ]
  },
  {
    id: "15",
    name: "Dress Belt",
    price: 149,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1080",
    category: "Belts",
    gender: "Men",
    description: "An elegant dress belt for formal occasions. Features premium calf leather and polished buckle.",
    features: [
      "Premium calf leather",
      "Polished buckle",
      "1.25\" width",
      "Edge staining",
      "Available in black and brown",
      "Made in Italy"
    ],
    details: [
      "Italian leather",
      "Hand-painted edges",
      "Sterling silver buckle option",
      "Formal elegance",
      "Precision crafted",
      "Lifetime warranty included"
    ]
  },
  {
    id: "16",
    name: "Woven Leather Belt",
    price: 139,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1080",
    category: "Belts",
    gender: "Women",
    description: "A unique woven leather belt that adds texture and interest. Handcrafted using traditional braiding techniques.",
    features: [
      "Hand-woven leather",
      "Elastic stretch for comfort",
      "1.25\" width",
      "Antique finish buckle",
      "Adjustable fit",
      "Unique texture"
    ],
    details: [
      "Traditional braiding technique",
      "Full-grain leather strips",
      "Comfortable elastic core",
      "Artisan craftsmanship",
      "One-of-a-kind character",
      "Lifetime warranty included"
    ]
  },
  {
    id: "17",
    name: "Double Ring Belt",
    price: 99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1080",
    category: "Belts",
    gender: "Unisex",
    description: "A contemporary belt with double ring closure. Adjustable and stylish for casual wear.",
    features: [
      "Double D-ring closure",
      "Suede leather construction",
      "1.5\" width",
      "No buckle design",
      "Adjustable length",
      "Modern aesthetic"
    ],
    details: [
      "Soft suede finish",
      "Solid brass rings",
      "Versatile styling",
      "Easy adjustment",
      "Contemporary design",
      "Lifetime warranty included"
    ]
  },
  {
    id: "18",
    name: "Studded Belt",
    price: 159,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1080",
    category: "Belts",
    gender: "Unisex",
    description: "A bold statement belt featuring metal studs. Perfect for adding edge to any outfit.",
    features: [
      "Metal stud detailing",
      "Full-grain leather",
      "1.5\" width",
      "Antique brass hardware",
      "Handset studs",
      "Rock-inspired design"
    ],
    details: [
      "Premium leather base",
      "Individual stud placement",
      "Statement accessory",
      "Durable construction",
      "Edgy aesthetic",
      "Lifetime warranty included"
    ]
  }
];

export const getBagProducts = () => allProducts.filter(p => p.category === "Bags");
export const getPurseProducts = () => allProducts.filter(p => p.category === "Purses");
export const getBeltProducts = () => allProducts.filter(p => p.category === "Belts");
export const getFeaturedProducts = () => allProducts.slice(0, 4);