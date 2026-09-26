import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProduct, formatPrice } from "../data/products";
import { useCart } from "../context/CartContext";

const sizeGuide = [
  ["S", "52 cm", "70 cm"],
  ["M", "56 cm", "73 cm"],
  ["L", "60 cm", "76 cm"],
  ["XL", "64 cm", "79 cm"],
  ["XXL", "68 cm", "82 cm"],
  ["XXXL", "72 cm", "86 cm"],
  ["XXXXL", "76 cm", "90 cm"],
];

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const product = getProduct(productId);

  const { addToCart } = useCart();

  const [selectedColor, setSelectedColor] = useState(
    product?.variants?.[0]?.color || ""
  );

  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.[0] || ""
  );

  const [quantity, setQuantity] = useState(1);
  const [showGuide, setShowGuide] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <section className="page empty-page">
        <h1>
          PRODUCT
          <br />
          <em>NOT FOUND.</em>
        </h1>

        <Link className="primary-btn" to="/shop">
          BACK TO SHOP ↗
        </Link>
      </section>
    );
  }

  const colors = product.variants || [];
  const sizes = product.sizes || [];

  const variant =
    product.variants?.find(
      (item) => item.color === selectedColor
    ) || product.variants?.[0];

  const changeColor = (color) => {
    setSelectedColor(color);
    setAdded(false);
  };

  const handleAddToCart = () => {
    if (!variant || !selectedSize) return;

    addToCart({
      key: `${product.id}-${selectedColor}-${selectedSize}`,

      productId: product.id,

      name: product.name,

      image: variant.image,

      color: selectedColor,

      size: selectedSize,

      price: variant.price ?? product.price,

      quantity: quantity,
    });

    setAdded(true);
  };

  const buyNow = () => {
    if (!variant || !selectedSize) return;

    addToCart({
      key: `${product.id}-${selectedColor}-${selectedSize}`,

      productId: product.id,

      name: product.name,

      image: variant.image,

      color: selectedColor,

      size: selectedSize,

      price: variant.price ?? product.price,

      quantity: quantity,
    });

    navigate("/checkout");
  };

  return (
    <section className="page product-detail-page">
      <div className="product-detail-wrap">

        <Link className="back-link" to="/shop">
          ← BACK TO SHOP
        </Link>

        <div className="product-detail">

          {/* PRODUCT IMAGE */}
          <div className="product-detail-image">

            <img
              src={
                variant?.image ||
                product.variants?.[0]?.image
              }
              alt={`${product.name} - ${selectedColor}`}
            />

            {product.tag && (
              <span>{product.tag}</span>
            )}

          </div>

          {/* PRODUCT INFORMATION */}
          <div className="product-detail-info">

            <p className="red-kicker">
              HAVEN / {product.category}
            </p>

            <h1>{product.name}</h1>

            <div className="detail-price">
              {formatPrice(
                variant?.price ?? product.price
              )}
            </div>

            <p className="detail-description">
              {product.description}
            </p>

            {/* COLOUR */}
            <div className="selection-block">

              <div className="selection-heading">
                <strong>COLOUR</strong>

                <span>{selectedColor}</span>
              </div>

              <div className="color-options">

                {colors.map((color) => (

                  <button
                    key={color.color}
                    type="button"
                    title={color.color}
                    className={`color-swatch ${
                      selectedColor === color.color
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      changeColor(color.color)
                    }
                  >

                    <img
                      src={color.image}
                      alt={color.color}
                    />

                  </button>

                ))}

              </div>

            </div>

            {/* SIZE */}
            <div className="selection-block">

              <div className="selection-heading">

                <strong>SIZE</strong>

                <button
                  type="button"
                  className="guide-trigger"
                  onClick={() =>
                    setShowGuide(true)
                  }
                >
                  VIEW SIZE GUIDE ↗
                </button>

              </div>

              <div className="size-options">

                {sizes.map((size) => (

                  <button
                    key={size}
                    type="button"
                    className={`size-option ${
                      selectedSize === size
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedSize(size);
                      setAdded(false);
                    }}
                  >
                    {size}
                  </button>

                ))}

              </div>

            </div>

            {/* QUANTITY */}
            <div className="selection-block">

              <div className="selection-heading">
                <strong>QUANTITY</strong>
              </div>

              <div className="quantity-control">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      Math.max(1, q - 1)
                    )
                  }
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => q + 1)
                  }
                >
                  +
                </button>

              </div>

            </div>

            {/* PURCHASE BUTTONS */}
            <div className="purchase-actions">

              <button
                className="primary-btn"
                type="button"
                onClick={handleAddToCart}
                disabled={
                  !variant || !selectedSize
                }
              >
                {added
                  ? "ADDED TO CART ✓"
                  : "ADD TO CART"}

                <span>+</span>
              </button>

              <button
                className="outline-btn"
                type="button"
                onClick={buyNow}
                disabled={
                  !variant || !selectedSize
                }
              >
                BUY NOW ↗
              </button>

            </div>

            {/* PRODUCT NOTES */}
            <div className="product-notes">

              <div>
                <span>01</span>
                COLOUR MAY CHANGE PRICE
              </div>

              <div>
                <span>02</span>
                SIZE MAY ALSO CHANGE PRICE
              </div>

              <div>
                <span>03</span>
                BREATHABLE / GOOD QUALITY
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* SIZE GUIDE MODAL */}
      {showGuide && (

        <div
          className="modal-backdrop"
          onClick={() =>
            setShowGuide(false)
          }
        >

          <div
            className="size-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              type="button"
              onClick={() =>
                setShowGuide(false)
              }
            >
              ×
            </button>

            <p className="red-kicker">
              HAVEN / FIT
            </p>

            <h2>
              SIZE
              <br />
              <em>GUIDE.</em>
            </h2>

            <p className="modal-note">
              Measure a similar top flat across the
              chest and from shoulder to bottom before
              choosing your size.
            </p>

            <div className="table-wrap">

              <table>

                <thead>

                  <tr>
                    <th>SIZE</th>
                    <th>CHEST WIDTH</th>
                    <th>LENGTH</th>
                  </tr>

                </thead>

                <tbody>

                  {sizeGuide.map(
                    ([size, chest, length]) => (

                      <tr key={size}>
                        <td>{size}</td>
                        <td>{chest}</td>
                        <td>{length}</td>
                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}