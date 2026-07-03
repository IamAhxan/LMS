import Image from 'next/image';
import React, { FC, useState } from 'react'
import avatarIcon from "../../../public/assets/client-1.jpg"
import { Input } from '@mui/material';
import { AiOutlineCamera } from 'react-icons/ai';
import { styles } from './../../../styles/style';

type Props = {
    avatar: string | null;
    user: any;
}

const ProfileInfo:FC<Props> = ({avatar, user}) => {
    const [name, setName] = useState(user && user.name)

    const imageHandler = async(e: any) => {
        console.log("Image Handler")
    }

    const handleSubmit = async (e: any) => {
        console.log("Submit")
    }
  return (
<>
    <div className='w-full flex justify-center'>
        <div className="relative">
            <Image
            src={user.avatar || avatar ? user.avatar.url || avatar: avatarIcon}
                        alt=""
                        className='w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full '
            />
            <input
            type='file'
            name=''
            id='avatar'
            className='hidden'
            onChange={imageHandler}
            accept="image/png, image/jpeg, image/webp"
            />
            <label htmlFor="avatar">
                <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
                    <AiOutlineCamera size={20} className='z-1' color='white' />
                </div>
            </label>
            </div>
    </div>
    <br />
    <br />

    <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleSubmit}>
            <div className="800px:w-[50%] m-auto block pb-4">
                <div className="w-[100%]">
                    <label className="block pb-2 text-black dark:text-white">
                        Full Name
                    </label>
                    <input type="text" className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required value={name} onChange={(e)=>setName(e.target.value)} />
                </div>
                <div className="w-[100%] pt-2">
                    <label className='block pb-2 text-black dark:text-white'>Email Address</label>
                    <input type="email" className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required value={user?.email} />
                </div>
                <input required value="Update" type="submit" className={`w-full 800px:w-[250px] h-[40px] border border-[#37a39a] text-center dark:text-white text-black rounded-[3px] mt-8 cursor-pointer`} />
            </div>
        </form>
    </div>
</>
    
  )
}

export default ProfileInfo