import { AnimatePresence, motion } from 'framer-motion'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Observer from '../../utils/observer'
import { Lang } from '../../components/Context'
import Spinner from '../../components/Spinner'
import './style.scss'
import cn from 'classnames'
import sanityClient from '../../client.js'
import { Box } from '@mui/material'

const Galeries = () => {

    const [data, setData] = useState(null)
    useEffect(() => {
        sanityClient
        .fetch(`*[_type == 'galerie'] | order(order){
        _id,
        nom,
        lieu,
        emails[],
        liens[]
        }`)
        .then((data) => {setData(data)})
        .catch(console.error)
    }, [])
    
    return data? (
        
            <Box 
            sx={{mx: {xs: 2, md: 9.5, lg: 10}, my: {xs: 4, md: 8}}}
            id='galeries'>
                
                    {data.map((galerie,index) => 
                        <Row key={galerie._id} galerie={galerie} index={index} />

                    )}
                
            </Box>   
                    

    ) : (<Spinner />)
}
const transition = { duration: .6, ease: [0.43, 0.13, 0.23, 0.96] };

const Row = ({galerie, index}) => {
    const lang = useContext(Lang);

    const ref = useRef(null);
    const onScreen = Observer(ref);

    return (
        <Box 
        
        className={cn('galerie', {reveal: onScreen})}
        ref={onScreen? null : ref}
        key={galerie._id}>
            <motion.div 
            className='inner'
            initial={{opacity:0, y:'100%'}}
            animate={onScreen? {opacity:1, y:0} : {opacity:0, y:'100%'}}
            exit={{opacity:0, y:'-100%'}}
            
            transition={transition}>
            
            
            <h1 className='titre'>{galerie.nom[lang]? galerie.nom[lang] : galerie.nom['fr']}</h1>

            <div className='s2'>
                <h5 className='lieu'>{galerie.lieu[lang]? galerie.lieu[lang] : galerie.lieu['fr']}</h5>

                {galerie.emails && galerie.emails.map((email, index) => email && (
                    
                    <h5 key={index}><a href={`mailto:${email}`}>{email}</a></h5>
                ))} 
                {galerie.liens && galerie.liens.map((lien) => lien && (
                    <h5 key={lien._key}><a target="_blank" href={lien.url}>{lien.nom}</a></h5>
                ))}                                
            </div>
        
            </motion.div>
        </Box>
    )
}

export default Galeries
