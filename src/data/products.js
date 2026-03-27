const products = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    weight: "1 kg",
    price: 39,
    oldPrice: 50,
    category: "Fruits & Vegetables",
    categorySlug: "fruits",
    discount: 22,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyopy9t6Z1BYK4tjyjLtcnbhBZeSy2sHiqwA&s"
  },
  {
    id: 2,
    name: "Organic Spinach",
    weight: "250 g",
    price: 29,
    oldPrice: 35,
    category: "Fruits & Vegetables",
    categorySlug: "fruits",
    discount: 17,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400"
  },
  {
    id: 3,
    name: "Potatoes",
    weight: "1 kg",
    price: 35,
    category: "Fruits & Vegetables",
    categorySlug: "fruits",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400"
  },
  {
    id: 4,
    name: "Onions",
    weight: "1 kg",
    price: 45,
    oldPrice: 55,
    discount: 18,
    category: "Fruits & Vegetables",
    categorySlug: "fruits",
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400"
  },
  {
    id: 5,
    name: "Carrots",
    weight: "500 g",
    price: 25,
    category: "Fruits & Vegetables",
    categorySlug: "fruits",
    image: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=400"
  },
  {
    id: 6,
    name: "Fresh Apples",
    weight: "1 kg",
    price: 120,
    oldPrice: 140,
    discount: 14,
    category: "Fruits & Vegetables",
    categorySlug: "fruits",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400"
  },
  {
    id: 7,
    name: "Strawberries",
    weight: "250 g",
    price: 150,
    oldPrice: 180,
    discount: 17,
    category: "Fruits & Vegetables",
    categorySlug: "fruits",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400"
  },

  // 🥛 Dairy
  {
    id: 8,
    name: "Milk",
    weight: "500 ml",
    price: 30,
    category: "Dairy & Eggs",
    categorySlug: "dairy",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400"
  },
  {
    id: 9,
    name: "Brown Eggs",
    weight: "6 pcs",
    price: 72,
    oldPrice: 80,
    discount: 10,
    category: "Dairy & Eggs",
    categorySlug: "dairy",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400"
  },
  {
    id: 10,
    name: "Paneer",
    weight: "200 g",
    price: 85,
    oldPrice: 100,
    discount: 15,
    category: "Dairy & Eggs",
    categorySlug: "dairy",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd3d6ancKt8HGJ5WZaUFJXUFHvYZjvF234qw&s"
  },
  {
    id: 11,
    name: "Butter",
    weight: "100 g",
    price: 55,
    category: "Dairy & Eggs",
    categorySlug: "dairy",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400"
  },
  {
    id: 12,
    name: "Cheese Slices",
    weight: "10 pcs",
    price: 110,
    category: "Dairy & Eggs",
    categorySlug: "dairy",
    image: "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400"
  },

  // 🛒 Grocery Essentials (NEW — what you asked)
  {
    id: 13,
    name: "Basmati Rice",
    weight: "5 kg",
    price: 450,
    oldPrice: 520,
    discount: 13,
    category: "Grocery",
    categorySlug: "grocery",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"
  },
  {
    id: 14,
    name: "Mustard Oil",
    weight: "1 L",
    price: 180,
    oldPrice: 200,
    discount: 10,
    category: "Grocery",
    categorySlug: "grocery",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlNvGH-o4elkdvMbhrwUtagVUd6t0YRDR7ng&s"
  },
  {
    id: 15,
    name: "Wheat Flour (Atta)",
    weight: "5 kg",
    price: 260,
    category: "Grocery",
    categorySlug: "grocery",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400"
  },
  {
    id: 16,
    name: "Toor Dal",
    weight: "1 kg",
    price: 140,
    category: "Grocery",
    categorySlug: "grocery",
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400"
  },
  {
    id: 17,
    name: "Sugar",
    weight: "1 kg",
    price: 45,
    category: "Grocery",
    categorySlug: "grocery",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3BvbTFmgVh4O3S6J71_o1luI6xr0eM5pnmw&s"
  },
  {
    id: 18,
    name: "Tea Powder",
    weight: "250 g",
    price: 120,
    category: "Grocery",
    categorySlug: "grocery",
    image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=400"
  }
  ,
  {
    id: 19,
    name: "Organic Spinach",
    weight: "250 g",
    price: 30,
    category: "Vegetables",
    categorySlug: "Vegetables",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop"
  },
    {
    id: 20,
    name: "Cauliflower",
    weight: "500 g",
    price: 40,
    category: "Vegetables",
    categorySlug: "Vegetables",
    image: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=300&h=300&fit=crop"
  }
];

export default products;