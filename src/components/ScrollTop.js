import { AnimatePresence, motion } from 'framer-motion'
import React, { useState, useEffect } from 'react'

import { Arrow } from './Arrow'

export const ScrollTop = ({scrollTop}) => {

    const [visible, setVisible] = useState(false)

    function scroll() {
        
        setVisible(window.scrollY > window.innerHeight)
    }

    useEffect(() => {
        scroll()
        window.addEventListener('scroll', scroll);
        return () => window.removeEventListener('scroll', scroll)
    }, [])

    return (
        <AnimatePresence>
            {visible && (
            <motion.div 
            transition={{duration: .5, ease: [0.43, 0.13, 0.23, 0.96]}} 
            initial={{y: 300, opacity: 0}} 
            animate={{y: 0, opacity: 1}} 
            exit={{y: 300, opacity: 0}} 
            onClick={scrollTop}
            className='scroll-top'>
            
                <Arrow deg={-90} />
                
            </motion.div>
        
            )}
        </AnimatePresence>
    )
}

