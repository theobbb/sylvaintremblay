import { useState, useRef, useEffect, componentDidMount, componentDidUpdate, useContext, useCallback  } from "react";
import { AnimatePresence, motion, AnimateSharedLayout } from "framer-motion"
import cn from 'classnames'
import './style2.scss'
import { Lang } from "../../components/Context";
import Spinner from "../../components/Spinner";
import sanityClient from '../../client.js'
import { Link, useParams, useHistory, useLocation, Redirect } from "react-router-dom";
import { Arrow } from "../../components/Arrow";

const transition = { duration: .7, ease: [0.43, 0.13, 0.23, 0.96] };
const ease = [0.43, 0.13, 0.23, 0.96];
  

const Oeuvres = () => {

    const [data, setData] = useState([])

    useEffect(() => {
        sanityClient
        .fetch(
        `*[_type == "serie"]{
          _id,
          title,
          lieu,
          toiles[]{
            _key,
            dimensions,
            titre,
            'image': image.asset->{
              'url': url + '?format=auto&fm=webp',
              'w': metadata.dimensions.width,
              'h': metadata.dimensions.height
            },
          },
          slug,
          'order': order
        } | order(order)`
        )
        .then((data) => {setData(data)})
        .catch(console.error)
    }, [])

    let { slug } = useParams();

    let location = useLocation();

    let lang = useContext(Lang);

    if (lang==='en' && location.pathname.split('/').length > 3) {
      slug = location.pathname.split('/')[location.pathname.split('/').length - 1]

    }

    let history = useHistory();

    const [slugs, setSlugs] = useState([]);

    const [slideArr, setSlideArr] = useState([]);
    const [directionX, setDirectionX] = useState(0);
    const [directionY, setDirectionY] = useState(0);

    var serieIndex = slugs.indexOf(slug);

    useEffect(() => {
      var arr = [];
      data.map((serie, index) => {
        arr.push(serie.slug[lang].current);
        slideArr[index] = 0;
      });
      setSlugs(arr);
    }, [data, lang]);

    const controls = {
      up: () => {
        setDirectionY(-1);
        push(serieIndex !== 0? serieIndex - 1 : 0);
      },
      down: () => {
        setDirectionY(1);
        push(serieIndex !== data.length-1? serieIndex + 1 : data.length-1);
      },
      left: () => {
        setDirectionX(-1);
        setSlideArr(slideArr => {
          const arr = [...slideArr];
          arr[serieIndex] = arr[serieIndex] !== 0? arr[serieIndex] - 1 : 0;
          return arr;
        })
      },
      right: () => {
        setDirectionX(1);
        
        setSlideArr(slideArr => {
          const arr = [...slideArr];
          const len = data[serieIndex].toiles.length;
          arr[serieIndex] = arr[serieIndex] !== len-1? arr[serieIndex] + 1 : len-1;
          return arr;
        })
      }
      
    }

    
    function setSlide(index) {
      setSlideArr(slideArr => {
        const arr = [...slideArr];
        arr[serieIndex] = index;
        return arr;
      })
    }

    function push(index) {
      history.push(lang === 'fr'? `/oeuvres/${slugs[index]}`:`/en/works/${slugs[index]}`);
    }


    useEffect(() => {
      function keyPress(e) {
        
        if (slugs.length) {
          if (e.key === 'ArrowUp') controls.up();
          if (e.key === 'ArrowDown') controls.down();

          if (e.key === 'ArrowLeft') controls.left();
          if (e.key === 'ArrowRight') controls.right();
        }
      }
      document.addEventListener('keydown', keyPress);
      
      return () => {
        document.removeEventListener('keydown', keyPress)
      }
      
    },[slugs, slug]);


  const [animating, setAnimating] = useState(false)
  const [lastType, setLastType] = useState()
  useEffect(() => {

    if (typeof slug !== lastType) {

      setAnimating(true);
    }
    setLastType(typeof slug)
  }, [slug])



  const [[w, h], windowSize] = useState([0,0]);
  useEffect(() => {
    function resize() { 
      windowSize([window.innerWidth, window.innerHeight]);
    }
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, []);


  const fondSrc = 'https://cdn.sanity.io/images/r9dm8hy5/production/ef325b9fedc11739583707c4f6b6a2d28c7ce6f9-3300x2202.jpg?w=1920&h=1080&fit=max'

  return data? (
    <>

    <div className={cn('oeuvres', {open: slug})}>

        <AnimateSharedLayout type='crossfade'>
        
        {slug && 
        <div className='arrow-return' style={{zIndex: 1000}}>
        <ArrowReturn />
        <Link className='link noline' to={lang === 'fr'? '/oeuvres': '/en/works'} />
        </div>}
        
        <div className='background'>
            <motion.img initial={{opacity: 0}} animate={{opacity: 1}} transition={transition} src={fondSrc} />
          </div>
        
        <div className={cn('serie-titles', {open:slug})}>
          
        {data.map((serie, index) => (
          <SerieTitle 
            key={`title-${lang}-${serie._id}`}
            
            serie={serie} 
            open={serie.slug[lang].current === slug}
            
            slug={slug}
          />
        )

        )}
        </div>

        <AnimatePresence >
        {data.map((serie, index) => serie.slug[lang].current === slug && (

          <Serie 
            key={`open-${serie._id}`}
            serie={serie} 
            slide={slideArr[serieIndex]} 
            serieIndex={slugs.indexOf(slug) - index}
            setAnimating={setAnimating}
            animating={animating}
            setSlide={setSlide} 
            directionX={directionX} 
            directionY={directionY} 
            setDirectionX={setDirectionX}
            setDirectionY={setDirectionY}
            slug={slug}
            controls={controls}
            w={w}
            h={h}
          />
          ))}
          
        </AnimatePresence>
        </AnimateSharedLayout>

        {slug && <Controls controls={controls} />}
        
        
      
      
    </div>
    
</>
  ) : (<Spinner />)

}

const SerieTitle = ({serie, slug, open}) => {
  const lang = useContext(Lang);
  return (
    <Link className='noline' to={lang === 'fr'? `/oeuvres/${serie.slug.fr.current}`:`/en/works/${serie.slug.en.current}`} >
    <div className={cn('serie-title', {open:open})}>

        <AnimatedTitle 
        open={open} 
        len={serie.toiles?.length} 
        wordID={`${lang}-${serie._id}`} 
        title={`${serie.title[lang]}  ${serie.toiles?.length}`} />

        
    </div>
    </Link>
  )
}

const Serie = ({serie, slide, w, h, serieIndex, directionX, directionY, setDirectionX, setDirectionY, setSlide, slug, controls}) => {
  const [animState, setAnimState] = useState(0);

  const lang = useContext(Lang);

  useEffect(() => {
    setAnimState(0);
  }, [slug])

  
  useEffect(() => {
    function resize() {
      getImgW()
      getNavScroll()
    }
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, []);

  const vertical = w < h * 1.7;

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const variants = {
    enter: directionX => ({
        x: directionX > 0 ? w : -w,
        opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: directionX => ({
        zIndex: 0,
        x: directionX < 0 ? w : -w,
        opacity: 0
    })
  };

  const [imgW, setImgW] = useState(0);

  let img = useRef();

  function getImgW() {
    if (img.current) {
      setImgW(img.current.getBoundingClientRect().width);
    }
  }
  useEffect(getImgW, [img.current, slide])

  const [dragAxis, setDragAxis] = useState('x');

  const [scrollToMini, setScrollToMini] = useState(0);
  let nav = useRef();
  let inner = useRef();
  function getNavScroll() {
    if (nav.current !== null && inner.current !== null) {
      let scroll = Math.max(0, inner.current.getBoundingClientRect().width - nav.current.getBoundingClientRect().width);
      setScrollToMini(scroll * slide / serie.toiles.length);
    }
  }
  useEffect(() => {
    getNavScroll();
  }, [nav.current, inner.current, slide])

  return (
            <motion.div 
            className={cn('serie open', {vertical: vertical})}
            //layoutId={`serie-${serie._id}`}
            onAnimationComplete={() => slug === serie.slug[lang].current? setAnimState(1):setAnimState(0)}

            initial={{opacity: 0, height: h,y: directionY !== 0 ? (directionY > 0 ? h : -h) : null}}
            animate={{opacity: 1, y: 0, height: h}}
            exit={{opacity: 0, y: directionY < 0 ? h :-h}}
            transition={transition}
            >

            

              
              <motion.div className='main'>
                <motion.div 
                
                //initial={{x: '-100vw'}}
                animate={animState>=1 && {x: 0, transition: {delay: .7, ...transition}}}
                
                //animate={{opacity: 1}}
                transition={transition}
                className='inner'>
                <AnimatePresence custom={directionX}>
                {animState >= 1 && serie.toiles?.map((toile, index) => index === slide && (
                  
                  <motion.div 
                  custom={directionX}
                  variants={animState>=1 && variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  key={`big-${toile._key}`} 
                  drag
                  dragDirectionLock
                  onDirectionLock={axis => setDragAxis(axis)}
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    if (dragAxis === 'x') {
                      const swipe = swipePower(offset.x, velocity.x);
                      if (swipe < -swipeConfidenceThreshold) controls.right();
                      else if (swipe > swipeConfidenceThreshold) controls.left();
                    }
                    if (dragAxis === 'y') {
                      const swipe = swipePower(offset.y, velocity.y);
                      if (swipe < -swipeConfidenceThreshold) controls.down();
                      else if (swipe > swipeConfidenceThreshold) controls.up();
                        
                    }
                    
                  }}
                  className='toile'>
                    
                    <img ref={img} src={toile.image.url} />
                    
                  </motion.div>

                 
                  
                ))}
                </AnimatePresence>
                </motion.div>
              </motion.div>
              

              
              
              
                
              <AnimatePresence>
                {serie.toiles?.map((toile, index) => index === slide && (
                  <motion.div key={slide} className='infos'>
                  <div style={{width: vertical? 'auto': (w - imgW)/2}} className='inner'>
                  
                  <h4>
                    <motion.div
                      initial={{y: '100%', opacity: 0}}
                      animate={{y: 0, opacity: 1}}
                      exit={{y: '-100%', opacity: 0}}
                      transition={transition} 
                      key={slide} 
                    >
                      {toile.titre}
                    </motion.div>
                  </h4>
                  <h5>
                    <motion.div
                      initial={{y: '100%', opacity: 0}}
                      animate={{y: 0, opacity: 1}}
                      exit={{y: '-100%', opacity: 0}}
                      transition={transition} 
                      key={slide} 
                    >
                      {toile.dimensions + ' po'}
                    </motion.div>
                  </h5>
                  
                  
                  </div>
                  </motion.div>
                  ))}
              </AnimatePresence>  
                

              
              
                <motion.div 
                transition={transition} 
                ref={nav}
                className='nav'>
                  <motion.div 
                  ref={inner}
                  className='inner'
                  animate={{x: -scrollToMini}}
                  transition={transition}
                  >
                  {serie.toiles?.map((toile, index) => (
                    <motion.div 
                      
                      transition={transition}
                      
                      animate={animState>=1? {width: 'fit-content', margin: '0 16px'}:{width: 2, margin: '0 6px' }}
                      //style={{margin: animState>=1? '0 16px':null}}
                      onClick={() => {
                        
                          setDirectionX(slide > index? -1:1); 
                          setSlide(index)
                        
                      }} 
                      layoutId={`mini-${toile._key}`} 
                      key={`mini-${toile._key}`} 
                      className='mini toile'>
                        
                        <motion.img transition={transition}  animate={{opacity: animState>=1? 1:0}} src={toile.image.url} />
                        
                        {animState>=1 && index === slide && (
                        <motion.div
                        layoutId={`outline-${serie._id}`}
                        transition={transition}
                        className='outline'
                        />
                        )}
                      </motion.div>
                    
                  ))}
                  </motion.div>
                </motion.div>
              

              
              
            </motion.div>
  )
}

const Controls = ({controls}) => (
  <div className='controls'>
    
    
      <motion.div onClick={() => controls.right()} className='arrow' initial={{x: '80%'}}>
        <Arrow deg={0} />
      </motion.div>
    

    
      <motion.div onClick={() => controls.down()} className='arrow' initial={{y: '80%'}}>
      <Arrow deg={90} />
      </motion.div>
    

    
      <motion.div onClick={() => controls.left()} className='arrow' initial={{x: '-80%'}}>
      <Arrow deg={180} />
      </motion.div>
    

    
      <motion.div onClick={() => controls.up()} className='arrow' initial={{y: '-80%'}}>
        <Arrow deg={-90} />
      </motion.div>
    
  </div>
  
)
const ArrowReturn = () => (
  <motion.svg fill='none' viewBox='0 0 24 24' width="34" height="34">
        <path d='M2,2 L22,22 M2,18 L2,2 L18,2' stroke='black' strokeWidth='2px' strokeLinecap="round"/>
    </motion.svg>
)


const AnimatedTitle = ({ title, disabled, wordID, len }) => (
  <AnimateSharedLayout>
<motion.h2 transition={transition} layoutId={`title-${wordID}`} className='title'>
  
  {title.split(' ').map((word, wordIndex) => (

    <div key={wordIndex} className='word' style={{overflow: 'hidden'}}>
    {[...word].map((letter, letterIndex) => (
      <motion.div
        
        key={`letter-${wordID}-${letter}-${wordIndex}-${letterIndex}`}
        className='letter'
        
        initial={{y: 100}}
        animate={{y: 0, transition: {delay: .05*letterIndex, ...transition}}}
        exit={{y: 100}}
        transition={transition}
        >
        {letter}
      </motion.div>
    ))}
    </div>
  ))}
</motion.h2>
</AnimateSharedLayout>
);



export default Oeuvres
