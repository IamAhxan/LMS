import React, { FC } from 'react'
import {styles} from "../../../../styles/style"
import { AddCircle } from '@mui/icons-material';
import {toast} from "react-hot-toast"

type Props = {
    benefits: {title: string}[];
    setBenefits: (benefits: {title:string}[])=>void,
    prerequisites: {title: string}[];
    setPrerequisites: (prerequisites: {title:string}[])=>void,
    active: number;
    setActive: (active:number)=>void;

}

const CourseData:FC<Props> = ({benefits, setBenefits, prerequisites, setPrerequisites, active, setActive}) => {

    const handleBenefitChange = (index: number, value:any)=>{
        const updatedBenefits = [...benefits];
        updatedBenefits[index].title = value;
        setBenefits(updatedBenefits)
    }
    const handleAddBenefits = () =>{
        setBenefits([...benefits, {title: ''}])
    }

    const handlePrerequisiteChange = (index: number, value:any)=>{
        const updatedPrerequisites = [...prerequisites];
        updatedPrerequisites[index].title = value;
        setPrerequisites(updatedPrerequisites)
    }
        const handleAddPrerequisite = () =>{
        setPrerequisites([...prerequisites, {title: ''}])
    }

    const prevButton = () => {
        setActive(active-1)
    }
    const handleOptions = () => {
        if(benefits[benefits.length-1]?.title !== "" && prerequisites[prerequisites.length -1]?.title !== ""){
            setActive(active +1)
        }else{
            toast.error("Please fill all the fields")
        }
    }


   
  return (
    <div className='w-[80%] m-auto mt-24 block'>
        <div className="">
            <label htmlFor="email" className={`${styles.label} text-[20px]`}>What are the benefits for students in this course?</label>
            <br />
            {
                benefits.map((benefit:any, index: any)=>(
                    <input type="text" 
                    key={index} name="Benefit" placeholder="you'll be able to build a full stack app" required className={`${styles.input} my-2`} value={benefit.title} onChange={((e)=>handleBenefitChange(index, e.target.value))} />
                ))
            }
            <AddCircle
            style={{margin:"10px 0px", cursor:"pointer", width:"30px"}}
                onClick={handleAddBenefits}
                                className='dark:text-white'
                />
        </div>
                <div className="">
            <label htmlFor="email" className={`${styles.label} text-[20px]`}>What are the prerequisites for this course?</label>
            <br />
            {
                prerequisites.map((prerequisite:any, index: any)=>(
                    <input type="text" 
                    key={index} name="prerequisite" placeholder="you must ..." required className={`${styles.input} my-2`} value={prerequisite.title} onChange={((e)=>handlePrerequisiteChange(index, e.target.value))} />
                ))
            }
            <AddCircle
            style={{margin:"10px 0px", cursor:"pointer", width:"30px"}}
                onClick={handleAddPrerequisite}
                className='dark:text-white'
                />
        </div>
        <div className="w-full flex items-center justify-between">
            <div className="w-full 800px:w-[100px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-white rounded mt-8 cursor-pointer" onClick={()=>prevButton()}>Prev</div>
            <div className="w-full 800px:w-[100px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-white rounded mt-8 cursor-pointer" onClick={()=>handleOptions()}>Prev</div>
        </div>
    </div>
  )
}

export default CourseData