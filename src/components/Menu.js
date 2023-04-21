import React, { useState, useEffect, useContext, useCallback, useRef } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { AnimatePresence, AnimateSharedLayout, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import cn from 'classnames'
import { Lang, Theme } from './Context'
import NavLink from './NavLink'
import { Box, useMediaQuery } from '@mui/material'
import LocaleLinks from './LocaleLinks'
import NavLinks from './NavLinks'
import Infolettre from './Infolettre'

const transition = { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] };

const Menu = (props) => {

    
    const lang = useContext(Lang);
    const theme = useContext(Theme);

    const [inputText, setInputText] = useState(null)

    const [open, setOpen] = useState(false)

    
    const year = new Date().getFullYear()

    useEffect(() => {
        const header = document.querySelector('header');
        function resize() {
            getScale();
            setMobile(window.innerWidth < 1100 || window.innerHeight < 650)
            
            
        }
        resize();

        window.addEventListener('resize', resize);
        new ResizeObserver(getScale).observe(document.body)
        return () => window.removeEventListener('resize', resize);
        
    }, [])


    const [mobile, setMobile] = useState(false);

    const location = useLocation();


    const left = useRef();
    const top = useRef();
    const page = useRef();

    const [[scale, offX, offY], setScale] = useState([0,0,0]);


    function getScale() {
        let bodyH = document.body.scrollHeight;

        if (left.current && top.current && page.current) {

            setScale([
                window.innerWidth > 1100?
                Math.min(
                    1 - left.current.getBoundingClientRect().width / window.innerWidth,
                    1 - top.current.getBoundingClientRect().height / bodyH
                ) : 1 - left.current.getBoundingClientRect().width / window.innerWidth,
                0,
                window.innerWidth > 1100? top.current.getBoundingClientRect().height : 0
            ])
        }

        
    }

    useEffect(() => {
        getScale();
    }, [left.current, top.current, page.current])

    

    const getPageTitle = () => {
        var res = '';
        const len = location.pathname.split('/').length;
        if (lang==='fr') {
            if (len > 2) res = null;
            else res = location.pathname.split('/')[len - 1];
        } else {
            if (len > 3) res = null;
            else if (location.pathname.split('/')[len - 1] === 'en') res = null;
            else res = location.pathname.split('/')[len - 1];
        }
        if (typeof res == 'string') {
            res = res.replaceAll('-', ' ');
        }
        return res
    }
    const pageTitle = getPageTitle();

    const matchDown800 = useMediaQuery('(max-width:800px)');

    return (  
        
    <>
    
        <motion.div  
            id='menu'
            transition={{delay:  open? 0.1:0, ...transition}}
            className={open? 'open': null}
        >
            <AnimatePresence>
<>
                

                
                    
                    <motion.div 
                    transition={transition} 
                    animate={open? {x: 0, opacity: 1}: {x: -300, opacity: 0}} 
                    ref={left} 
                    className='left'>

                    

                    <div className='links'>
                        <LocaleLinks  />
                        <NavLinks setOpen={setOpen} />
                        
                        
                    </div>

                    <div className='copyright'>
                        <h5>&#169; {year}</h5>
                    </div>
                
                </motion.div>

                <motion.div 
                transition={transition} 
                animate={mobile? open? {x: 0, opacity: 1}: {x: -300, opacity: 0} : open? {y: 0, opacity: 1}: {y: -300, opacity: 0}} 
                ref={top} 
                className='top'>
                        
                    
                        <Infolettre />

                        <div className='contact'>

                            <h5 className='email'><a className='noline' href='mailto:info@sylvaintremblay.ca'>info@sylvaintremblay.ca</a></h5>
                            <div className='reseaux'>
                                <h5><a target='blank' href='https://www.instagram.com/sylvaintremblayartist/' className='noline'>Instagram</a></h5>
                                <h5><a target='blank' href='https://www.facebook.com/STremblayartist/' className='noline'>Facebook</a></h5>
                            </div>
                        </div>
                    
                </motion.div>

            </>

            
        </AnimatePresence>
        
        </motion.div>

                
        <motion.div
        ref={page}
        className={cn('page', {open:open})}
        style={{top: 0, left: 0, zIndex: 100, position: mobile && open? 'absolute':'relative', originX: 1, originY: 0}}
        transition={{...transition}} 
        animate={open? mobile? {x: `calc(100vw - ${matchDown800? '64px': '76px'})`}:{scale: scale, y:offY, borderTopLeftRadius: '14px', borderBottomLeftRadius: '14px'} : mobile? {x:0}:{scale: 1, y:0}}
        
        >
            <motion.header 
            
            initial={{y: -200}}
            transition={{delay: 0.05 , ...transition}} 
            animate={{y:0}}
            className={cn({open: open})}>
            
                <div className='left'>

                    <motion.div 
                        whileTap={{scale: 0.9 }}
                        className='button' onClick={() => setOpen(!open)}>
                        <svg width='28' height='28' viewBox='0 0 30 30'>
                            <path fill="transparent"
                        strokeWidth="3"
                        stroke="hsl(0, 0%, 18%)"
                        strokeLinecap="round" 
                        d={open? 'M5,5 L25,25 M5,25 L25,5':'M2,10 L28,10 M2,20 L28,20'} 

                        />
                            
                        </svg>
                    </motion.div>
                    
                    <Link className="link noline" to={lang==='fr'? '/':'/en'}>
                        <Box 
                        sx={{marginLeft: {xs: 1.5, sm: 2.5, lg: 3}}}
                        component={motion.div}
                        className="site-title"
                        initial={{y: -200}}
                        animate={{y: 0, transition: transition}}
                        
                        >
                            
                            
                            <Box>
                            <img 
                            style={{height: 38}}
                            src={process.env.PUBLIC_URL + '/logo.png'}></img>
                            </Box>

                            <Box sx={{px: {xs: 1.5, sm: 2, lg: 2.5}}}>
                            
                            <h5 className="Sylvain">SYLVAIN TREMBLAY</h5>
                            </Box>
                            
                        </Box>
                        </Link>

                </div>

                <motion.div
                    onClick={() => props.setTheme(theme === 'light'?'dark':'light')}
                    transition={{delay: open? 0.05 : 0.05 , ...transition}} 
                    className='color'
                    >

                    <span  />
                    
                </motion.div>

                <AnimatePresence>

                <motion.div
                initial={{y: -200, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                exit={{y: -200, opacity: 0}}
                transition={transition}
                 key={pageTitle} 
                 className='page-title'>
                    <h5>{pageTitle}</h5>
                </motion.div>
                </AnimatePresence>
            </motion.header>
            <motion.div 
            className='page-content' 
            
            //initial={{y: -200}}
            //transition={{delay: 0.1 , ...transition}} 
            animate={mobile? open? {x: '30%', opacity: 0}:{x: 0, opacity: 1} : null}
            transition={{delay: open? 0 : 0.3 , ...transition}}
            >
            
                
                {props.children}
                
            </motion.div>

        </motion.div>
    </>   
    
    )
}



export default Menu
