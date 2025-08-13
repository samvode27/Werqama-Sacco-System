import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutUs from '../components/AboutUs';
import WhyUs from '../components/WhyUs';
import Services from '../components/Services';
import Membership from '../components/Membership';
import NewsEvents from '../components/NewsEvents';
import ContactUs from '../components/ContactUs';
import Footer from '../components/Footer';
import '../styles/Landing.css';

function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <section id="hero" className="section">
          <Hero />
        </section>

        <section id="about" className="section">
          <AboutUs />
        </section>

        <section id="whyus" className="section">
          <WhyUs />
        </section>

        <section id="services" className="section bg-light">
          <Services />
        </section>

        <section id="membership" className="section">
          <Membership />
        </section>

        <section id="news" className="section bg-light">
          <NewsEvents />
        </section>

        <section id="contact" className="section">
          <ContactUs />
        </section>
      </main>

      <Footer />
    </>
  );
}

export default HomePage;
