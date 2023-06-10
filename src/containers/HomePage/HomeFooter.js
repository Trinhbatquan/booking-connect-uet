import React from 'react'
import {AiOutlineMail} from 'react-icons/ai'

import './HomeFooter.scss'

const HomeFooter = () => {
  return (
    <div className='homeFooter-container'>
      <div className='homeFooter-content'>
        <p className='font-semibold text-black text-lg'>Thiết kế bởi: Sinh viên UET</p>
        <p className='font-semibold text-black text-lg flex items-center justify-start gap-2'>
            Mọi thông tin cần tư vấn, vui lòng liên hệ: {" "}
            <a className=""
                    href="mailto:19020641@vnu.edu.vn" 
                    alt="Mail"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <AiOutlineMail className="text-blue-700 text-2xl"/>
                </a>
        </p>
      </div>
    </div>
  )
}

export default HomeFooter
