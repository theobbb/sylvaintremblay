import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import React, { useState, useEffect, useRef, useContext } from 'react'
import cn from 'classnames'
import './style.scss'
import sanityClient from '../../../client.js'
import Spinner from '../../../components/Spinner'
import { Lang } from '../../../components/Context'
import { Arrow } from '../../../components/Arrow'
import { Box, ButtonBase, useMediaQuery } from '@mui/material'

const transition = { duration: .7, ease: [0.43, 0.13, 0.23, 0.96] }

const Carousel = () => {

    const [data, setData] = useState(null)
    useEffect(() => {
        sanityClient
        .fetch(`*[_type == "carousel"]{
            _id,
            title,
            dimensions,
            serie->{title},
            'order': order,
            images[]{
              _key,
              asset->{
                  _id,
                  'url': url + '?format=auto&fm=webp',
                  'w': metadata.dimensions.width,
                  'h': metadata.dimensions.height
              }
            },
            videos[]{
              _key,
              asset->{
                  _id,
                  url,
              }
          },
          } | order(order asc)`)
        .then((data) => {setData(data)})
        .catch(console.error)
    }, [])

    const [[index, direction], setIndex] = useState([0,0]);

    function paginate(x) {

      let newIndex = index + x;
      
      if (newIndex < 0) newIndex = data.length - 1;
      if (newIndex > data.length - 1) newIndex = 0;
      setIndex([newIndex, x])

    }

    const matchDownMD = useMediaQuery(theme=>theme.breakpoints.down('md'))


        return data? (
          <div className='carousel' 
          
          >
            <Box className='dots' sx={{display: 'flex'}}>
            {matchDownMD && <>

<motion.div className='prev' whileTap={{scale: 0.9 }} onClick={() => paginate(-1)}>
  <Arrow deg={180} />
</motion.div>
<motion.div className='next' whileTap={{scale: 0.9 }} onClick={() => paginate(1)}>
                   <Arrow />
              </motion.div>
</>}
              {data.map((slide, i) => (

                <motion.div 
                
                animate={i===index?{opacity: 1, scale: 1.2}:{opacity: 0.4}}
                whileTap={{scale:0.9}}
                onClick={() => setIndex(([oldIndex, direction]) => {
                
                  console.log(oldIndex < i? -1:1)
                  return ([i, oldIndex > i? -1:1])
                })} 
                className={`dot ${i===index?'active':''}`}>

                </motion.div>

              ))}
            </Box>

            
                {!matchDownMD && <>

                <motion.div className='prev' whileTap={{scale: 0.9 }} onClick={() => paginate(-1)}>
                  <Arrow deg={180} />
                </motion.div>
                <motion.div className='next' whileTap={{scale: 0.9 }} onClick={() => paginate(1)}>
                   <Arrow />
              </motion.div></>}
            
                <motion.div 
              //animate={{x: -100*index}}
              
              transition={transition}
               className='background'></motion.div>
              
            <AnimatePresence initial={false} custom={direction}>

            {data.map((slide, i) => i === index && (

              <Slide paginate={paginate} key={slide._id} slide={slide} direction={direction} />
              
            ))}
            </AnimatePresence>

          </div>
          
        ) : (<Spinner />)
}

const Slide = ({slide, direction, paginate}) => {
  const lang = useContext(Lang);


  const [format, setFormat] = useState()

  function resize() {
    setFormat(slide.images[0].asset.w > slide.images[0].asset.h*1.5 || window.innerWidth < 1100 ? 'horizontal':'vertical')
  }

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () =>  window.removeEventListener('resize', resize)
  }, [])
  
  const variants = {
  
    enter: direction => ({
        x: direction > 0 ? window.innerWidth : -window.innerWidth,
        opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: direction => ({
      
        zIndex: 0,
        x: direction < 0 ? window.innerWidth : -window.innerWidth,
        opacity: 0
      
    })
  };

  const [ready, setReady] = useState(true);

  const [selected, setSelected] = useState();
  const [section, setSection] = useState();

  const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

  

  return (
    <motion.div 

              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 1.4, ease: [0.43, 0.13, 0.23, 0.96] }}
              //onAnimationStart={() => setReady(false)}
              //onAnimationComplete={() => setReady(true)}
              className={`slide ${format}`}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1)
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1)
                }
              }}
              
              >

                      <div className='main'>
                        
                      
                          
                          <motion.div className='img' initial={{opacity: 0}} animate={{opacity: 1}} transition={transition} >
                            <motion.img key={slide} initial={{scale: 2}} animate={{scale: 1}} src={slide.images[0].asset.url} />
                          </motion.div>
                          
                          <motion.div 
                          transition={{delay: 0, ...transition}} 
                          animate={{opacity:1}} 
                          initial={{opacity:0}}
                          
                          className='text'>
                            <h4 className='title'>{slide.title}</h4>
                            <h5 className='dims'>{slide.dimensions + (lang === 'fr'?' po':' in')}</h5>
                            <h5 className='serie'>{slide.serie.title[lang]}</h5>
                          </motion.div>
                        
                          
                      </div>
                       
                      {<div className={cn('content', {selected: section === 'imgs'})}>
                      

                          {slide.images && slide.images.length > 1 && <div className={cn('imgs', {selected: section === 'imgs'})}>
                          {slide.images.map((img, index) => index!==0 && (
                           
                              <motion.div transition={{delay: .1+.1*index , ...transition}} 
                              animate={{opacity:1}} 
                              onClick={() => {
                                if (selected !== img._key) {
                                  setSelected(img._key); 
                                  setSection('imgs');
                                } else {
                                  setSelected(null); 
                                  setSection(null);
                                }
                                }}
                                
                              initial={{opacity:0}} 
                              className={cn('img', {selected: img._key === selected})}>
                               <ButtonBase sx={{width: '100%', height: '100%'}}>
                                <img src={img.asset.url} />
                                </ButtonBase>
                              </motion.div>
                              
                            
                          ))}
                          </div>}
                          
                        
                        
                      
                      

                        {slide.videos && <div className={cn('videos', {selected: section === 'videos'})}>
                          {slide.videos.map((video, index) => (
                            <motion.div
                            
                            onClick={() => {
                                if (selected !== video._key) {
                                  setSelected(video._key); 
                                  setSection('video');
                                } else {
                                  setSelected(null); 
                                  setSection(null);
                                }
                                }}
                            exit={{opacity:0}}
                            animate={ready? {opacity:1, y: 0}:{opacity:0}} 
                            initial={{opacity:0}} 
                            transition={{delay: .4 + .4*index , ...transition}}
                            className={cn('video', {selected: video._key === selected})}>
                              <video autoPlay muted loop src={video.asset.url} />
                            </motion.div>
                          ))}
                        </div>}
                        </div>}
                
                   
                   
                    
                  
              </motion.div>
  )
}




export default Carousel
