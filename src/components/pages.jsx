import React from "react";
import Hero from "./Hero";
import AboutUs from "./About";
import ContactUs from "./Contact";
import Footer from "./Footer";

const LandingPage = () => {
  return <>
    <div className="bg-white rounded-xl shadow-lg overflow-hidden"><Hero /><AboutUs /><ContactUs /><div style={styles.footerWrapper}><Footer /></div></div>
  </>;
};

const styles = {
  footerWrapper: { border: "15px solid white", boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)" },
};
export default LandingPage;
