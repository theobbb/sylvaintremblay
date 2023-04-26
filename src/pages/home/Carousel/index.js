import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import React, { useState, useEffect, useRef, useContext } from 'react'
import cn from 'classnames'
import './style.scss'
import sanityClient from '../../../client.js'
import Spinner from '../../../components/Spinner'
import { Lang } from '../../../components/Context'
import { Arrow } from '../../../components/Arrow'
import { Box, ButtonBase, useMediaQuery } from '@mui/material'
import { Link } from 'react-router-dom'

const transition = { duration: .7, ease: [0.43, 0.13, 0.23, 0.96] }

const Carousel = () => {

    const [data, setData] = useState(null)
    useEffect(() => {
        sanityClient
        .fetch(`*[_type == "carousel"]{
            _id,
            title,
            dimensions,
            'serie': {
              'title': serie->title,
              'slug': serie->slug
            } ,

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

    const [interacted, setInteracted] = useState(false);
    
    useEffect(() => {
      if (interacted) {
        const timeout = setTimeout(() => {
          setInteracted(false)
        }, 10000)
        return () => clearTimeout(timeout)
      }
    }, [interacted])

    const [inView, setInView] = useState(false);

    const containerRef = useRef(null);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return console.log('no ref');
      const observer = new IntersectionObserver(
        ([entry]) => {
          setInView(entry.isIntersecting);
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.5, // adjust threshold as needed
        }
      );
      if (container) {
        observer.observe(container);
      }
      return () => {
        observer.unobserve(container);
      };
    }, [containerRef]);

    console.log(inView)


    const matchDownMD = useMediaQuery(theme=>theme.breakpoints.down('md'))


        return data? (
          <div className='carousel' 
          ref={containerRef}
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

              <Slide paginate={paginate} key={slide._id} slide={slide} direction={direction} {...{interacted, setInteracted, inView}} />
              
            ))}
            </AnimatePresence>

          </div>
          
        ) : (<Spinner />)
}


const Slide = ({slide, direction, paginate, interacted, setInteracted, inView}) => {
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

  


  const timer = 3000;

  const [itemKeys, setItemKeys] = useState(0);

  useEffect(() => {
    const imagesKeys = slide.images?.slice(1).map(image => image._key)
    const videosKeys = slide.videos?.map(video => video._key)
    const keys = [...(imagesKeys || []), ...(videosKeys || [])]
    setItemKeys(keys)
  }, [slide])

  useEffect(() => {
    if (interacted || !inView) return;
    

    
    //setItemCount(slide.images.length + slide.videos.length)

    const intervalId = setTimeout(() => {
      const lastIndex = itemKeys.indexOf(selected)
      let newSelected = 0;
      if (lastIndex === itemKeys.length - 1) return paginate(1);
      if (lastIndex === -1 && itemKeys.length > 0) newSelected = itemKeys[0];
       
      newSelected = itemKeys[lastIndex + 1] || itemKeys[0]
      const newType = slide.images.find(image => image._key === newSelected)?'imgs':'video'
      setSelected(newSelected)
      setSection(newType)

      
    }, timer);

    return () => clearInterval(intervalId);
  }, [itemKeys, selected, interacted, inView]);

  

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
                            <h4 className='title'>
                            <Link to={lang==='fr'? `/oeuvres/${slide.serie.slug[lang].current}`:`/en/works/${slide.serie.slug[lang].current}`}>
                            {slide.title}
                            </Link>
                            </h4>
                            <h5 className='dims'>{slide.dimensions + (lang === 'fr'?' po':' in')}</h5>
                            <h5 className='serie'>
                            <Link to={lang==='fr'? `/oeuvres/${slide.serie.slug[lang].current}`:`/en/works/${slide.serie.slug[lang].current}`}>
                            {slide.serie.title[lang]}
                            </Link>
                            </h5>
                            
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
                                setInteracted(true);
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
                                setInteracted(true);
                                }}
                            exit={{opacity:0}}
                            animate={ready? {opacity:1, y: 0}:{opacity:0}} 
                            initial={{opacity:0}} 
                            transition={{delay: .4 + .4*index , ...transition}}
                            className={cn('video', {selected: video._key === selected})}>
                            <ButtonBase disableRipple sx={{width: '100%', height: '100%'}}>
                              <video disableRemotePlayback autoPlay muted loop src={video.asset.url} />
                              </ButtonBase>
                            </motion.div>
                          ))}
                        </div>}
                        </div>}
                
                   
                   
                    
                  
              </motion.div>
  )
}




export default Carousel
