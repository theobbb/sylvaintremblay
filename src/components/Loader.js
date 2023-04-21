import { useEffect, useState } from "react";
import { motion } from "framer-motion"
import Preload from '../utils/preload'
import Spinner from "./Spinner";


const transition = { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] };

const Loader = ({ prc, setLoading }) => {


  const [videoReady, setVideoReady] = useState(false)


  const video = document.createElement('video');
  video.src = 'https://cdn.sanity.io/files/r9dm8hy5/production/4de5aa38136be7c69bacdbd78ae7debb5991a211.mp4';
  useEffect(() => {
    video.oncanplaythrough = () => {
      setVideoReady(true)
    }
  }, [setVideoReady])


  

  useEffect(() => {
    //const video = document.getElementById('video');
    //document.addEventListener('click', () => {setLoading(false)})
    //video.onended = () => { setLoading(false); console.log('end') }
    
})
console.log(prc)
    return (
      
        <motion.div
          initial={{ opacity:0, y: 0 }}
          animate={{ opacity:1, y: 0 }}
          exit={{ opacity:0, y: '-100vh' }}
          transition={transition}
          //onAnimationComplete={() => setLoading(false)}
          className="loader"
        >
          <div className='perc'>
              <h3>{prc + ' / 100'}</h3>
              {prc == 100 && (
                <motion.div 
                style={{cursor: 'pointer', display: 'flex', width: 'fit-content', zIndex: 0}}
                initial={{y: '-100%', opacity: 0, rotate: 90}}
                animate={{y: 0, opacity: 1}}
                transition={transition} 
                onClick={() => setLoading(false)}>
                  <Arrow />
                </motion.div>
                
              )}
          </div>

          {videoReady && (
            
            <video id='video' src={video.src} muted loop autoPlay></video>
           
          )}


        </motion.div>
      
    )
  };
const Arrow = () => (
  <svg fill='none' width="60" height="60">
      <path d='M5,30 L55,30 M43,20 L55,30 L43,40' strokeWidth='2px' stroke='black' strokeLinecap="round"/>
  </svg>
)

export default Loader

//import { useSpring, animated } from 'react-spring'
