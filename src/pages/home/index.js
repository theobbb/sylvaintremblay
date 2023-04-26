import { useState, useEffect, useRef, useContext } from 'react'
import { motion, AnimatePresence, AnimateSharedLayout  } from "framer-motion";

import Carousel from './Carousel/index'

import './style.scss'

import Spinner from '../../components/Spinner';
import Nouvelles from '../nouvelles';
import { Lang } from '../../components/Context';
import { Link } from 'react-router-dom';
import { Arrow } from '../../components/Arrow';
import { Box, useMediaQuery } from '@mui/material';


const Home = ({data, nouvelles, pageReady}) => {
    
    const transition = { duration: .5, ease: [0.43, 0.13, 0.23, 0.96] };
    
    const lang = useContext(Lang)

    const [scrollMore, setScrollMore] = useState(false);

    function scroll() {
        if (window.scrollY < 10) setScrollMore(true);
        else setScrollMore(false);
    }

    useEffect(() => {
        scroll()
        window.addEventListener('scroll', scroll);
        return () => window.removeEventListener('scroll', scroll);
    }, [])

    const matchDownMD = useMediaQuery(theme => theme.breakpoints.down('md'));
    const matchDownLG = useMediaQuery(theme => theme.breakpoints.down('lg'));
    const matchDownSM = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const matchDownXL = useMediaQuery(theme => theme.breakpoints.down('xl'));

    const infos = {
        fr: [
            'Représentation du Canada pour le G20 en Chine',
            "Enseignement de l'art moderne à l'Université canadienne à Dubaï, nomination comme professeur à vie",
            "Performance en direct lors de l'inauguration du Pavillon du Canada à l'Exposition universelle de 2020 à Dubaï",
            "Création d'une oeuvre pour l'exposition Mask Art de l'UNESCO",
            "Représentation du Canada au Japon dans le cadre de l'exposition 20th Japan International Art Exchange Exhibition",
        ],
        en: [
            'Representation of Canada for the G20 in China',
            "Teaching of modern art at the Canadian University in Dubai, appointment as a professor for life",
            "Live performance during the inauguration of the Canadian Pavilion at the 2020 World Expo in Dubai",
            "Creation of a work for the Mask Art exhibition of UNESCO",
            "Representation of Canada in Japan as part of the 20th Japan International Art Exchange Exhibition",
        ]
    }

    const top = {
        fr: [
            "Artiste international, Sylvain Tremblay est un maître de la texture et de la sculpture en peinture.",
            "Sa technique unique crée des tableaux captivants et expressifs, qui évoquent l'essence même de la nature et de l'humanité.",
            "Ses œuvres ont été exposées dans des galeries du monde entier et sont prisées par les collectionneurs d'art les plus exigeants."
        ],
        en: [
            "International artist, Sylvain Tremblay is a master of texture and sculpture in painting.",
            "His unique technique creates captivating and expressive paintings, which evoke the very essence of nature and humanity.",
            "His works have been exhibited in galleries around the world and are prized by the most demanding art collectors."
        ]
    }
    
    
    

    return (
        <motion.div className='home' 
       initial={{y: 100, opacity: 0}}
       animate={{y:0, opacity: 1}}
       exit={{y:-100, opacity: 0}}
       
        transition={transition}>
        
  
                       <div className='main-video'>
                        <video disableRemotePlayback autoPlay loop muted playsInline src={`/videos/${lang}.mp4`} />
                        </div>
                        <Box sx={{my: 8, mx: {xs: 2, sm: 3, md: 4, lg: 10}, maxWidth: 1500}}>
                        
                        
                        {top[lang].map((p, i) => (
                            <Box key={`top-${i}`} sx={{my: 2}}>
                            {matchDownMD ? <h4>{p}</h4> : <h3>{p}</h3>}
                           
                            </Box>
                            
                        ))}
                        
                        
                        </Box>
                        
                        <AnimatePresence>
                        {scrollMore && (
                        <motion.div 
                        
                        transition={transition}
                        initial={{y: 100, opacity: 0, transition: {delay: .5}}}
                        animate={{y:0, opacity: 1}}
                        exit={{y:-100, opacity: 0}}
                        className='scroll-more'>
                            
                            <div className='text'>{lang==='fr'?<h4>Défilez pour en voir plus</h4>:<h4>Scroll for more</h4>}</div>
                            <Arrow deg={90} />
                        </motion.div>
                        )}
                        </AnimatePresence>
                

                        <Carousel />

                        <Box sx={{marginTop: 12, marginBottom: 4, mx: {xs: 2, sm: 3, md: 4, lg: 10}, maxWidth: 1300}}>

                            {infos[lang].map((info, i) => (
                                <Box key={`info-${i}`} sx={{my: 2}}>
                                {matchDownMD ? <h4>{info}</h4> : <h3>{info}</h3>}
                                
                                </Box>
                            ))}

                        </Box>
                        

                        

                        
                    
                        
                        <div className='nouvelles-home'>

                        <Box className='nouvelles-titre' sx={{marginBottom: 3, mx: {xs: 2, md: 9.5, lg: 10}}}>
                            
                            <h2>{lang==='fr'?'Nouvelles récentes':'Recent News'}</h2>
                            
                        </Box>
                        <Nouvelles nb={matchDownXL?matchDownLG?matchDownSM?3: 4: 3: 4} />
                        <div className='more'>
                            <h4><Link to={lang==='fr'? '/nouvelles':'/en/news'}>{lang==='fr'?'voir toutes les nouvelles':'All News'}</Link></h4>     
                                <svg style={{transform: 'rotate(-45deg)'}} fill='none' viewBox='0 0 60 60' width="30" height="30">
                                    
                                    <path d='M5,30 L55,30 M40,15 L55,30 L40,45' stroke='black' strokeWidth='2px' stroke-linecap="round"/>
                                    
                                </svg>
                            
                            </div>
                        </div>

                    <div className='portrait'>
                    <img  src='https://cdn.sanity.io/images/r9dm8hy5/production/53a6c217825efd42b1798115ee4521e5a4d76394-5456x3064.jpg?w=1920&h=1080&fit=max'></img>
                    </div>

                    
                
        </motion.div>
    )
}

export default Home
