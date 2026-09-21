import React from "react";
import { Link } from "react-router-dom";
import haven1 from "../assets/haven1.png";
import haven2 from "../assets/haven2.png";
import t1 from "../assets/t1.jpeg";
//import t2 from "../assets/t2.png";
import t3 from "../assets/t3.png";
import t4 from "../assets/t4.png";
import shoot3 from "../assets/shoot3.png";

const products = [
  [t1, "Haven Classic", "NEW DROP"],
  //[t2, "Haven 07", "SIGNATURE"],
  [t3, "Haven Street", "LIMITED"],
  [t4, "Haven Essential", "FEATURED"],
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <img
  src={shoot3}
  alt="Haven jersey collection"
  className="hero-image"
/>
        
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">HAVEN / NEW COLLECTION 07</p>
          <h1>WEAR<br /><em>YOUR</em><br />IDENTITY.</h1>
          <p className="hero-copy">
            Jerseys designed to stand out, built to breathe and made to last.
          </p>
          <Link className="primary-btn" to="/shop">EXPLORE THE DROP <span>↗</span></Link>
        </div>
        <div className="hero-side">FEEL THE DESIGN.......</div>
        <div className="hero-scroll">SCROLL TO EXPLORE ↓</div>
      </section>

      <div className="marquee">
        <div>HAVEN</div><span>✦</span><div>FEEL THE DESIGN</div><span>✦</span>
        <div>NO FADING</div><span>✦</span><div>BREATHABLE</div><span>✦</span>
        <div>HAVEN</div>
      </div>

      <section className="section home-intro">
        <div className="section-label">01 / THE HAVEN STANDARD</div>
        <div className="two-col">
          <div>
            <p className="red-kicker">MORE THAN A JERSEY.</p>
            <h2>IT'S A<br /><span>STATEMENT.</span></h2>
          </div>
          <div className="body-copy">
            <p>
              Haven brings expressive jersey design together with quality,
              comfort and attention to detail. Every piece is created to look
              distinctive while staying comfortable enough for everyday wear.
            </p>
            <p><strong>Feel the design.......</strong> is our promise.</p>
            <Link className="text-link" to="/about">DISCOVER OUR STORY ↗</Link>
          </div>
        </div>
      </section>

      <section className="image-split">
        <div className="split-copy">
          <p className="red-kicker">DESIGNED DIFFERENT.</p>
          <h2>DETAILS<br />MATTER.</h2>
          <p>
            From colour and sublimation to logo placement and finishing,
            every part of a Haven jersey is considered.
          </p>
          <Link className="outline-btn" to="/quality">SEE THE QUALITY ↘</Link>
        </div>
        <div className="split-image">
          <img src={haven1} alt="Haven jersey" />
        </div>
      </section>

      <section className="section">
        <div className="section-label">02 / FEATURED PRODUCTS</div>
        <div className="shop-head">
          <h2>THE<br /><em>DROP.</em></h2>
          <p>Explore selected Haven pieces from the collection.</p>
        </div>
        <div className="product-grid">
          {products.map(([image, name, tag]) => (
            <article className="product-card" key={name}>
              <div className="product-image">
                <img src={image} alt={name} />
                <span>{tag}</span>
              </div>
              <div className="product-info">
                <h3>{name}</h3>
                <p>HAVEN / JERSEY 07</p>
              </div>
            </article>
          ))}
        </div>
        <div className="center-link"><Link className="primary-btn" to="/shop">VIEW ALL PRODUCTS ↗</Link></div>
      </section>

      <section className="dark-feature">
        <div>
          <p className="red-kicker">THE HAVEN FIT</p>
          <h2>MADE FOR<br /><em>YOUR MOVE.</em></h2>
          <p>
            Check our detailed chest-width and body-length measurements before
            choosing your size.
          </p>
          <Link className="primary-btn" to="/shop">SHOP & FIND YOUR FIT ↗</Link>
        </div>
        <img src={haven2} alt="Haven jersey back" />
      </section>

      <section className="home-cta">
        <p>FEEL THE DESIGN.......</p>
        <h2>WELCOME<br /><em>TO HAVEN.</em></h2>
        <Link className="primary-btn" to="/contact">CONTACT HAVEN ↗</Link>
      </section>
    </>
  );
}
