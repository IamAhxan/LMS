"use client"
import React, { FC, useState } from 'react'
import Protected from '../hooks/useProtected'
import Heading from '../utils/Heading'
import Header from '../components/Header'
import Profile from "../components/Profile/Profile"
import { useSelector } from 'react-redux'
import Footer from '../components/Route/Footer'

type Props = {}

const page: FC<Props> = (props) => {
     const [open, setOpen] = useState(false)
     const [activeItem, setActiveItem] = useState(5)
     const [route, setRoute] = useState("Login");
     const {user} = useSelector((state:any)=>state.auth)
  return (
    <div className='min-h-screen flex flex-col justify-between'>
      <Protected>
         <Heading
      title={`${user?.name} | E-Learning`}
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
      <Profile user={user}/>
      <Footer />
      </Protected>
    </div>
  )
}

export default page
