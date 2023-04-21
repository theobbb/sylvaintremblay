import './style.scss'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useContext, useEffect, useRef, useState } from 'react'
import sanityClient from '../../client.js'
import Spinner from '../../components/Spinner'
import { Lang } from '../../components/Context'
import { useParams } from 'react-router'
import Observer from '../../utils/observer'
import cn from 'classnames'
import { Box } from '@mui/material'

const transition = { duration: .5, ease: [0.43, 0.13, 0.23, 0.96] };

const Cv = () => {

    
    const [data, setData] = useState(null)
    useEffect(() => {
        sanityClient
        .fetch(`*[_type == 'cv']{
            _id,
            categorie,
            slug,
            items[],
            'order': order,
          } | order(order asc)`)
        .then((data) => {setData(data)})
        .catch(console.error)
    }, [])

    const lang = useContext(Lang);
    let {slug} = useParams();

    return data ? (
        <Box className='cv' sx={{mx: {xs: 2, md: 9.5, lg: 10}, my: {xs: 4, md: 8}}}>
            {data.map((item,index0) => (
                <div className='content' key={`cv-item-${index0}`}>
                    <h2 className='title'>{item.categorie[lang]}</h2>
                    <div className='inner'>
                    {item.items.sort((a, b) => b.year - a.year).map((item, index1) => (
                        <>
                            <p className='year'>{item.year}</p>
                            <div className='body'>

                            {typeof item[lang] !== 'undefined' && item[lang].map((section, index2) => 
                                <Section section={section} key={`cv-item-section-${index2}`} />
                            )}
                            
                            </div>
                        </>
                    ))}
                    </div>
                </div>  
            
            ))}
        </Box>
    ) : <Spinner />
}

const Section = ({section}) => {
    const ref = useRef(null);
    const onScreen = Observer(ref);
    return (
        <motion.div transition={transition}  initial={{y: 50, opacity: 0}} animate={onScreen ? {y: 0, opacity: 1}:{y: 50}}  ref={ref} className={section._type} key={section._key}>
            {section.children.map((item) => (
                <motion.p 
                
                 
                
                className={cn(item._type, item.marks, {reveal: onScreen})} 
                key={item._key}>
                    {item.text}
                </motion.p>
            ))}
        </motion.div>
    )
}

export default Cv
