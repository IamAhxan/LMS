import React, { useEffect, useState } from 'react'
import {useFormik} from "formik"
import * as Yup from "yup"
import {AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub} from "react-icons/ai"
import {FcGoogle} from "react-icons/fc"
import { styles } from '../../../styles/style'


type Props = {
    setRoute : (route:string)=>void;
}

const schema = Yup.object().shape({
    email: Yup.string().email("Invalid Email!").required("Please enter your email"),
    password: Yup.string().required("Please enter your password!").min(6),
})

const Login = ({setRoute}: Props) => {
        const [show, setShow] = useState(false)
        const formik = useFormik({
            initialValues:{email:"",password:""},
            validationSchema:schema,
            onSubmit:async({email,password})=>{
                console.log(email,password)
            }
        });
        const {errors, touched, values, handleChange, handleSubmit} = formik;


  return (
    <div className='w-full px-4'>
        <h1 className={`${styles.title}`}>
            Login with E-Learning
        </h1>
        <form onSubmit={handleSubmit} noValidate>
    <label htmlFor="email" className={`${styles.label}`}>Enter your Email</label>
    <input
      type="email"
      name="email"
      value={values.email}
      onChange={handleChange}
      id="email"
      placeholder="Enter your email"
      className={`${errors.email && touched.email && "border-red-500"} ${styles.input}`}
    />

    {errors.email && touched.email && (
      <span className="text-red-500 pt-2 block">{errors.email}</span>
    )}
    <div className="w-full mt-5 relative mb-1">
  <label htmlFor="password" className={`${styles.label}`}>Enter your Password</label>
  <input
      type={show ? "text" : "password"}
      name="password"
      value={values.password}
      onChange={handleChange}
      id="password"
      placeholder="Enter your Password"
      className={`${errors.password && touched.password && "border-red-500"} ${styles.input}`}
    />
    {
        show ? (
            <AiOutlineEyeInvisible
            size={20}
            className="absolute bottom-3 right-2 z-1 cursor-pointer text-black dark:text-white"
            onClick={()=>setShow(false)}
            />
        ) : (
            <AiOutlineEye
            size={20}
            className="absolute bottom-3 right-2 z-1 cursor-pointer text-black dark:text-white"
            onClick={()=>setShow(true)}
            />
        )
    }

    {errors.password && touched.password && (
      <span className="text-red-500 pt-2 block">{errors.password}</span>
    )}
    </div>

    <div className="w-full mt-5">
        <input type="submit" value="Login" className={`${styles.button}`} />
    </div>
    <br />
    <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
        Or join with
    </h5>
    <div className="flex items-center justify-center my-3">
        <FcGoogle size={30} className="mr-2 cursor-pointer" />
        <AiFillGithub size={30} className="cursor-pointer ml-2 text-black dark:text-white" />
    </div>
    <h5 className="text-center pt-4 font-Poppins ml-2 text-black dark:text-white">
        Not have an account?{" "}
        <span
          className="text-[#2190ff] cursor-pointer pl-1"
          onClick={() => setRoute("Sign-Up")}
        >
          Sign Up
        </span>
      </h5>
        </form>
        <br />
    </div>
  )
}

export default Login