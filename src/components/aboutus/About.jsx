import React from "react";
import styles from "./about.module.css";

const About = () => {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.textSection}>
          <p className={styles.subtitletwo}>Rooted in Nature, Nurtured with Care.</p>
          <p className={styles.description}>
            At <span className={styles.highlight}>Mrittika Naturals ,</span> we believe that nature holds the answers to true well-being. Inspired by the rich traditions of Indian healing and the wisdom of sustainable living, our journey began with a simple mission to bring you the purest forms of nature, untouched by harmful chemicals or synthetic shortcuts.
          </p>
          <p className={styles.description}>
            Born from the soil ("Mrittika" means "earth" in Sanskrit), our brand is more than just a name — it's a promise. A promise to reconnect you with the purity of nature through thoughtfully crafted products that nourish your body, mind, and soul.
          </p>

          <p className={styles.description}>
            We source our ingredients directly from farmers, forests, and fields, ensuring that every powder, oil, and extract you receive is clean, potent, and ethically produced. Our products are handcrafted in small batches, maintaining traditional techniques that preserve the full strength of natural nutrients.
          </p>

          <p className={styles.subtitletwo}>Expanding Our Roots — From Local Fields to Global Markets</p>

          <p className={styles.description}>
            Mrittika Naturals has grown from a grassroots initiative into a trusted name across both domestic and international markets.
          </p>

          <p className={styles.description}>
            We proudly distribute our products across India through local retailers, wellness stores, and online platforms, ensuring that every corner of the country has access to clean, natural alternatives.

          </p>
          <p className={styles.description}>
            Beyond India, we’ve also begun exporting our products to international markets, sharing the richness of Indian botanicals and traditional formulations with a growing global audience. Our commitment to purity and authenticity has helped us build strong relationships with international distributors, wellness boutiques, and eco-conscious consumers across countries.
          </p>

          <p className={styles.description}>
            We aim to continue expanding our global footprint while staying true to our roots — supporting sustainable farming communities, preserving traditional knowledge, and delivering nature’s best to every doorstep.
          </p>

          <p className={styles.subtitletwo}>Why Choose Mrittika Naturals?</p>
          <ul className={styles.featureList}>
            <li>100% natural & cruelty-free ingredients</li>
            <li>No added chemicals, colors, or artificial fragrances</li>
            <li>Sustainable sourcing directly from rural communities</li>
            <li>
              Traditional recipes, modern packaging
            </li>
            <li>Small-batch, handcrafted production</li>
            <li>Domestic and international distribution network</li>
          </ul>
          <div className={styles.highlightedSection}>
            <p>
              We’re not just creating products — we’re building a <span className={styles.highlight}>community</span> that values purity simplicity, and <span className={styles.highlight}>harmony with nature</span>.
            </p>
            <p className={styles.tagline}>
              Welcome to the world of <span className={styles.brandName}>Mrittika</span> — where the <span className={styles.brandName}>earth heals</span>.
            </p>
          </div>

          <div className={styles.dividerbottom}></div>
          <p className={styles.subtitletwo}>Meet the Founder</p>

          <div className={styles.highlightedSection}>
            <p>
              <span className={styles.highlight}>Mrittika Naturals</span> was founded by <span className={styles.highlight}>Dhiman Deka, </span> a passionate changemaker with a deep commitment to sustainability, rural empowerment, and the natural wealth of Northeast India.
            </p>
            <p className={styles.description}>
              An engineering graduate from the National Institute of Technology, Dhiman brings a solid background in waste management and environmental responsibility. He is also a co-owner of a plastic waste recycling partnership firm based in Guwahati, where he has worked extensively to build sustainable solutions for plastic waste challenges.
            </p>
            <p className={styles.description}>
              But his vision reaches far beyond Waste Management. With a strong desire to uplift farmers, preserve traditional agricultural knowledge, and give local, natural products from the Northeast the recognition they truly deserve, Mrittika Naturals was born.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
