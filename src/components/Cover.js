import React from 'react'
import { motion } from 'framer-motion'

const Cover = ({start}) => {
    const transition = { duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96], delay: 0.3 };
    const pageTransition = {
        in: {
            y: '-100vh',
            
            
        },
        out: {
            y: '100vh',
            
            
        }
    }

    return (
<div id='cover'></div>
    )
}

export default Cover
