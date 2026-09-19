import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import shoot1 from "../assets/shoot2.png";
import { products, formatPrice } from "../data/products";
import { getProducts } from "../api/productApi";

export default function Shop() {
  const [backendProducts, setBackendProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setBackendProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <section className="page">

      {/* SHOP HERO */}
      <div
        style={{
          backgroundImage: `url(${shoot1})`,
        }}
        className="page-hero shop-page-hero"
      >
        <p className="red-kicker">
          HAVEN 07 / SHOP
        </p>

        <h1>
          THE
          <br />
          <em>DROP.</em>
        </h1>

        <p>
          Choose your piece, colour, size and quantity.
          Haven now works like a proper online store.
        </p>
      </div>

      <div className="section product-section">

        <div className="section-label">
          01 / ALL PRODUCTS
        </div>

        {/* SHOP INTRO */}
        <div className="shop-intro-row">

          <div>

            <p className="red-kicker">
              SHOP BY YOUR STYLE
            </p>

            <h2>
              FIND
              <br />
              <em>YOUR PIECE.</em>
            </h2>

          </div>

          <p className="shop-intro-copy">
            Tap any product to open its product page.
            There you can switch colours, choose a size,
            adjust quantity and add the exact variant to
            your bag.
          </p>

        </div>

        {/* BACKEND CONNECTION */}
        {loading && (
          <p>Loading products...</p>
        )}

        {/* HAVEN PRODUCTS */}
        <div className="product-grid shop-grid">

          {products.map((product) => {

            const lowestPrice = Math.min(
              ...product.variants.map(
                (variant) => variant.price
              )
            );

            return (

              <Link
                className="product-card shop-product-card"
                to={`/shop/${product.id}`}
                key={product.id}
              >

                {/* PRODUCT IMAGE */}
                <div className="product-image">

                  <img
                    src={product.variants[0].image}
                    alt={product.name}
                  />

                  {product.tag && (
                    <span>{product.tag}</span>
                  )}

                  <button
                    type="button"
                    aria-label={`View ${product.name}`}
                    onClick={(event) =>
                      event.preventDefault()
                    }
                  >
                    ↗
                  </button>

                </div>

             {/*PRODUCT INFO*/}
                <div className="product-info">

                  <div>

                    <h3>{product.name}</h3>

                    <p>
                      HAVEN / {product.category}
                    </p>
                   

                  </div>

                  <strong> 
                    FROM {formatPrice(lowestPrice)}
                  </strong>

                </div>

              </Link>

            );
          })}

        </div>

      </div>

    </section>
  );
}
