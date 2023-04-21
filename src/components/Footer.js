import { Box, Grid, useMediaQuery } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LocaleLinks from './LocaleLinks'
import NavLinks from './NavLinks'
import sanityClient from '../client.js'
import { Lang } from './Context'
import NavLink from './NavLink'
import { motion } from 'framer-motion'
import Infolettre from './Infolettre'
import { links } from '../utils/links'
export default function Footer() {

    const [data, setData] = useState([])

    useEffect(() => {
        sanityClient
        .fetch(
        `*[_type == "serie"]{
          _id,
          title,
          slug,
          'order': order
        } | order(order)`
        )
        .then((data) => {setData(data)})
        .catch(console.error)
    }, [])

    const lang = useContext(Lang);

    const [inputText, setInputText] = useState(null)
    

    const matchDownMD = useMediaQuery(theme => theme.breakpoints.down('md'));
    const matchDownLG = useMediaQuery(theme => theme.breakpoints.down('lg'));
    const col1 = matchDownLG? 115: 150;
  return (
    <Box 
    sx={{py: {xs: 8, md: 8}, px: {xs: 1, md: 2, lg: 3}}}
    component={motion.div} initial={{opacity: 0}} animate={{opacity: 1}} transition={{transition: 'ease', duration: 1, delay: 1}}>
        <Grid container rowSpacing={{xs: 8, lg: 6}}>
            <Grid item xs={12} lg={6} xl={8} order={{xs: 2, lg: 0, xl: 0}} 
            sx={{display: 'flex'}}>
                <Box sx={{width: col1, textAlign: 'right', marginRight: 3}}>
                    <h4>lang</h4>
                </Box>
                <LocaleLinks disableClass />
            </Grid>
            <Grid item xs={12} lg={6} xl={4} order={{xs: 0, lg: 1, xl: 1}} sx={{display: 'flex'}}>
            
            
    <Box className='infolettre' sx={{display: 'flex', marginLeft: {xs: 2, md: 1.5, lg: 0}}}>
        <h4>{lang === 'fr'? 'infolettre': 'newsletter'} </h4>
        <h4>
            <form action="https://sylvaintremblay.us10.list-manage.com/subscribe/post?u=ad76a5b766cc13f11c22636aa&amp;id=3bcc231d1f" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                <input type='email' name="EMAIL" className="email no-scroll" id="mce-EMAIL" placeholder='email' defaultValue={inputText} onChange={(e) => setInputText(e.target.value)}></input>
            </form>
            </h4>
    </Box>
            </Grid>
            <Grid item xs={12} lg={6} xl={4} order={{xs: 3, lg: 2, xl: 2}} sx={{display: 'flex'}}>
                <Box sx={{width: col1, textAlign: 'right', marginRight: 3}}>
                    <h4>navigation</h4>
                </Box>
            <Box>
                {links.map((section, index) => (
                                <div key={`section-${index}`} className='section'>
                                    {section.map((link, index) => (
                                        <NavLink key={`link-${index}`} link={link} disableClass sx={{marginBottom: 1}} />
                                    ))}  
                                </div>
                            ))}
                            </Box>
            </Grid>
            <Grid item xs={12} lg={6} xl={4} order={{xs: 4, lg: 4, xl: 3}} sx={{display: 'flex'}}>
            {data && (
                <>
                <Box sx={{width: col1, textAlign: 'right', marginRight: 3}} >
                    <h4>{lang==='fr'? 'séries':'series'}</h4>
                </Box>
                
                <Box>
                {data.map((serie) => (
                    
                    <Box 
                    component={motion.div}
                    key={`footer-${serie._id}`}
            whileTap={{scale: 0.95}}
            sx={{marginBottom: 1}}
            
            //className={cn('nav-link', {active: active})}
            //onClick={setOpen ? () => setOpen(false):null}
            >
            <h4>
            <Link to={`/${lang==='fr'? 'oeuvres': 'en/works'}/${serie.slug[lang].current}`}>
            {serie.title[lang].toLowerCase()}
            
            
            </Link>
            </h4>
        </Box>
                ))}
                </Box>
                
                </>
            )}
            
            </Grid>
            <Grid item xs={12} lg={6} xl={4} order={{xs: 1, lg: 3, xl: 4}}>
            <div className='contact'>
                        <Box sx={{paddingBottom: 3, marginLeft: {xs: 2, md: 1.5, lg: 0}}}>
                            <h4 className='email'>
                            <a className='noline' href='mailto:info@sylvaintremblay.ca'>
                            info@sylvaintremblay.ca
                            </a>
                            </h4>
                            </Box>
                            <div className='reseaux'>
                                
                                <a target='blank' href='https://www.instagram.com/sylvaintremblayartist/' className='noline'>
                                <Box sx={{display: 'flex'}}>
                                <Box sx={{marginRight: 3, marginBottom: 1, width: matchDownLG ? col1 : 'auto', textAlign: matchDownLG && 'right'}}>
                                    <h4>Instagram</h4>
                                </Box>
                                <Box>
                                    <h4 >@sylvaintremblayartist</h4>
                                </Box>
                                </Box>
                                </a>
                                
                                <h4>
                                <a target='blank' href='https://www.facebook.com/STremblayartist/' className='noline'>
                                <Box sx={{display: 'flex'}}>
                                <Box sx={{marginRight: 3, width: matchDownLG ? col1 : 'auto', textAlign: matchDownLG && 'right'}}>
                                    <h4>Facebook</h4>
                                </Box>
                                <Box>
                                    <h4 >STremblayartist</h4>
                                </Box>
                                </Box>
                               
                                </a>
                                </h4>
                            </div>
                        </div>
            </Grid>
            

        </Grid>
    </Box>
  )
}
