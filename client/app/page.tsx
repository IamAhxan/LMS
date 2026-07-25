/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, {FC, useState} from 'react';
import Heading from './utils/Heading';
import Header from './components/Header';
import Hero from './components/Route/Hero'
import Courses from './components/Route/Courses'
import Reviews from './components/Route/Reviews'
import Footer from './components/Route/Footer'
import FAQ from './components/FAQ/FAQ'

// interface Props{

// }

const Page= () => {
 const [open, setOpen] = useState(false)
 const [activeItem, setActiveItem] = useState(0)
 const [route, setRoute] = useState("Login");
 

  return (
    <div>
      <Heading
      title='ELearning'
      description='ELearning is an online learning platform'
      keywords="Programming, MERN, Redux, Machine Learning"
      />
      <Header
      open={open}
      setOpen={setOpen}
      activeItem={activeItem}
      route={route}
      setRoute={setRoute}
      />
      <Hero />
      <Courses/>
      <Reviews/>
      <FAQ/>
      <Footer/>
    </div>
  )
};

export default Page;