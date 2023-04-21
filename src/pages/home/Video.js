import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";

const Video = () => {
    const transition = { duration: 1, ease: [0.43, 0.13, 0.23, 0.96] };




    const videoAnim = {
        initial: {opacity:0, y: '100%'},
        animate: {opacity:1, y: 0},
        exit: {opacity:0, x: '-100%'}
    }

    
    return (
        
        <motion.div 
        key='video'
        
        initial='initial'
        animate='animate'
        exit='exit'
        variants={videoAnim}
        transition= {transition}
        className='video'
        onAnimationEnd={()=> {console.log('end')}}
        
        >
    
        
            {<video id='video' src={process.env.PUBLIC_URL + '/img/ny_1.mp4'} muted autoPlay preload={'auto'}></video>}
            <span className='caption'>-Sarah Cawley</span>
            
            </motion.div> 

        
        
        
    )
    
}

export default Video
