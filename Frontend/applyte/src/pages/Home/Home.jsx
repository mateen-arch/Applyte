import React from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import Pricing from './Pricing'
import Testimonial from './Testimonial'
import Footer from './Footer'
import Features from './Feature'

const Home = () => {
  return (
    <>
        <Navbar/>
        <Hero/>
        <Features/>
        <Pricing/>
        <Testimonial/>
        <Footer/>
    </>
  )
}

export default Home