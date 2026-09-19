import A1 from "../assets/a1.png";
import A2 from "../assets/a2.png";
import A3 from "../assets/a3.png";
import A4 from "../assets/a4.png";

import J1 from "../assets/j1.png";
import J2 from "../assets/j2.png";

import polo from "../assets/polo.png";
import pinDown from "../assets/pindown.png";
import cap from "../assets/cap.png";
import cap2 from "../assets/cap2.png";
import cap3 from "../assets/cap3.png";

import t1 from "../assets/t1.jpeg";
import t2 from "../assets/t2.png";
import t3 from "../assets/t3.png";
import t4 from "../assets/t4.png";
import t5 from "../assets/t5.png";
import t6 from "../assets/t6.png";

import shorts from "../assets/s.png";

const topSizes = ["S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"];
const shortsSizes = ["M", "L", "XL", "XXL"];
const joggerSizes = ["M", "L", "XL", "XXL"];

export const products = [
  {
    id: "bonsai-no-7",
    name: "Haven Bonsai No.7 Army Tees",
    category: "Tops",
    description:
      "Haven Bonsai No. 7 shirts designed for comfort, quality and everyday style.",
    price: 30000,

    variants: [
      {
        color: "Green",
        image: A1,
        price: 30000,
      },
      {
        color: "Whitish Grey",
        image: A2,
        price: 30000,
      },
      {
        color: "Grey",
        image: A3,
        price: 32000,
      },
      {
        color: "Red",
        image: A4,
        price: 34500,
      },
    ],

    sizes: topSizes,

    sizeGuide: {
      S: "52cm chest / 70cm length",
      M: "56cm chest / 73cm length",
      L: "60cm chest / 76cm length",
      XL: "64cm chest / 79cm length",
      XXL: "68cm chest / 82cm length",
      XXXL: "72cm chest / 86cm length",
      XXXXL: "76cm chest / 90cm length",
    },
  },

  {
    id: "haven-polo",
    name: "Haven Bonsai No.7 Shirts",
    category: "Tops",
    description:
      "Haven Polo designed for comfort, quality and everyday style.",
    price: 30000,

    variants: [
      {
        color: "Polo",
        image: polo,
        price: 30000,
      },
    ],

    sizes: topSizes,

    sizeGuide: {
      S: "52cm chest / 70cm length",
      M: "56cm chest / 73cm length",
      L: "60cm chest / 76cm length",
      XL: "64cm chest / 79cm length",
      XXL: "68cm chest / 82cm length",
      XXXL: "72cm chest / 86cm length",
      XXXXL: "76cm chest / 90cm length",
    },
  },

  {
    id: "haven-track-pants",
    name: "Haven Track Pants",
    category: "Joggers",
    description:
      "Haven track pants made for comfort, movement and everyday wear.",
    price: 35000,

    variants: [
      {
        color: "Black",
        image: J1,
        price: 30000,
      },
      {
        color: "Grey",
        image: J2,
        price: 33000,
      },
    ],

    sizes: joggerSizes,
  },

  {
    id: "haven-trucker-cap",
    name: "Haven Trucker Cap",
    category: "Accessories",
    description:
      "The Haven Trucker Cap — complete your Haven look.",
    price: 8000,

    variants: [
      {
        color: "Pink",
        image: cap,
        price: 8000,
      },
       {
        color: "Green",
        image: cap2,
        price: 8000,
      },
       {
        color: "Grey",
        image: cap3,
        price: 8000,
      },
    ],

    sizes: ["One Size"],

    sizeGuide: {
      "One Size": "Adjustable",
    },
  },

  {
    id: "haven-female-pin-down",
    name: "Haven Female Pin-Down",
    category: "Women",
    description:
      "Haven long sleeve female pin-down designed for a clean and comfortable fit.",
    price: 20000,

    variants: [
      {
        color: "Black",
        image: pinDown,
        price: 20000,
      },
    ],

    sizes: ["XS", "S", "L", "XL"],

    sizeGuide: {
      XS: "Extra Small",
      S: "Small",
      L: "Large",
      XL: "Extra Large",
    },
  },

  {
    id: "haven-shorts",
    name: "Haven Shorts",
    category: "Shorts",
    description:
      "Haven shorts designed for comfort and everyday movement.",
    price: 20000,

    variants: [
      {
        color: "Grey",
        image: shorts,
        price: 20000,
      },
      {
        color: "Red",
        image: shorts,
        price: 20000,
      },
      {
        color: "Green",
        image: shorts,
        price: 20000,
      },
    ],

    sizes: shortsSizes,

    sizeGuide: {
      M: '30–32"',
      L: '33–35"',
      XL: '36–38"',
      XXL: '39–42"',
    },
  },

  {
    id: "haven-army-tees",
    name: "Haven Jerseys",
    category: "Tops",
    description:
      "Haven Jerseys available in different colours.",
    price: 30000,

    variants: [
      {
        color: "White and Black",
        image: t1,
        price: 30000,
      },
      {
        color: "LightBlue",
        image: t4,
        price: 30000,
      },
      {
        color: "White and Pink",
        image: t5,
        price: 30000,
      },
      {
        color: "White and Red",
        image: t6,
        price: 31000,
      },
      {
        color: "Black and Red",
        image: t3,
        price: 33000,
      },
    ],

    sizes: topSizes,

    sizeGuide: {
      S: "52cm chest / 70cm length",
      M: "56cm chest / 73cm length",
      L: "60cm chest / 76cm length",
      XL: "64cm chest / 79cm length",
      XXL: "68cm chest / 82cm length",
      XXXL: "72cm chest / 86cm length",
      XXXXL: "76cm chest / 90cm length",
    },
  },


];

export const formatPrice = (price) =>
  `₦${price.toLocaleString()}`;

export const getProduct = (id) =>
  products.find((product) => product.id === id);

export const getColors = (product) => {
  if (!product?.variants) return [];

  return product.variants.map(
    (variant) => variant.color
  );
};