import cn from 'classnames';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Lang } from '../../components/Context';
import Spinner from '../../components/Spinner';
import { Box, ButtonBase, Grid } from '@mui/material';
import CitiesCarousel from './CitiesCarousel';



const ease = [0.43, 0.13, 0.23, 0.96];
const transition = { duration: .5, ease: [0.43, 0.13, 0.23, 0.96] }

function List({data, slug, slice}) {

    const lang = useContext(Lang);

    const [animating, setAnimating] = useState([]);

    const history = useHistory();

    function complete(item) {
        
        var arr = animating;
        if (animating.includes(item.slug[lang].current)) {
            arr.splice(animating.indexOf(item.slug[lang].current), 1);
            setAnimating(arr);
        }
    }

    useEffect(() => {
        
        if (!animating.includes(slug)) {
            setAnimating(animating => [...animating, slug])
        }
    }, [slug])

    const [query, setQuery] = useState();

    const [cities, setCities] = useState([]);

    useEffect(() => {
        
        var arr = [];
        data.map((item) => {
            
            var lieu = item.lieu[lang];
            if (!arr.includes(lieu)) {
                arr.push(lieu)
            }
            
        })
        setCities(arr)
    }, [data])

    function clickCity(city) {
        var cityLen = 0;
        var onlySlug;
        data.map((item) => {
            if (item.lieu[lang] === city) {
                onlySlug = item.slug[lang].current;
                cityLen++
            }
        })
        if (cityLen === 1 && query!==city) history.push(lang==='fr'?`/nouvelles/${onlySlug}`:`/en/news/${onlySlug}`);
        setQuery(query!==city? city:null)
    }

    const slicedData = slice? data.slice(0,slice):data;

    
    return (
        <>
            {cities && 
            <CitiesCarousel items={cities} query={query} clickCity={clickCity} />

           
            }
        <Grid container className='list' 
        
        sx={{px: {xs: 0.5, sm: 1, md: 1}, 
            py: {xs: 2.5, sm: 2, md: 1}
            }}
        component={motion.div}>
            

            {slicedData.map((item) => (!query || query===item.lieu[lang]) && (
                
                <AnimatePresence>
                    <Grid
                    item
                    xl={3}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{width: '100%'}}
                    //columns={{xs: 12, md: 6}}
                    
                    initial={{y: 100, opacity: 0}}
                    animate={{y:0, opacity: 1}}
                    exit={{y:-100, opacity: 0}}
                    transition={transition}>
                    
                    {item.slug[lang].current !== slug ?
                        

                        <Item 
                        complete={complete} 
                        
                        onTop={animating.includes(item.slug[lang].current)} 
                        key={item._id} item={item} /> :
                        <div className='post fake'></div>
                    }
                    </Grid>
                   
                    
                </AnimatePresence>
            ))}
        </Grid> 
        </>
    )
}

const Item = ({item, complete, onTop, slug}) => {

    const lang = useContext(Lang);
    
    return (
        <Box
        
        sx={{
            px: {xs: 2, sm: 1, md: 2}, 
            py: {xs: 2, sm: 2, md: 3},
           
            width: '100%'
        }}
        component={motion.div}
        className='post'
        transition={transition}    
        layoutId={`item-container-${item._id}`} 
        onLayoutAnimationComplete={() => complete(item)}
        style={{zIndex: onTop? 1:0}}
        >
            <motion.div className='inner'>
                <motion.div className='titles' transition={transition} layoutId={`texts-container-${item._id}`}> 

                    <h3 className='lieu words'>
                        {item.lieu[lang].split(' ').map((word,index) => (
                            <motion.div
                            className='word'
                            transition={transition}
                            layoutId={`lieu-words-${item._id}-${word}-${index}`}>
                                {word}
                            </motion.div>
                        ))}
                    </h3>
                    <h5 className='date words'>
                        {item.date[lang].split(' ').map((word,index) => (
                            <motion.div
                            className='word'
                            transition={transition}
                            layoutId={`date-words-${item._id}-${word}-${index}`}>
                                {word}
                            </motion.div>
                        ))}
                    </h5>
                    <h4 className='title words'>
                        {item.title[lang].split(' ').map((word,index) => (
                            <motion.div
                            className='word'
                            transition={transition}
                            layoutId={`title-words-${item._id}-${word}-${index}`}>
                                {word}
                            </motion.div>
                        ))}
                    </h4>
                </motion.div>
            
                <motion.div 
                transition={transition}  

                layoutId={`image-container-${item._id}`} 
                className='img'>
                {item.videos? (
                    <motion.div className='video'>
                        <iframe src={`https://www.youtube.com/embed/${item.videos[0]}?controls=0&autoplay=1&mute=1&loop=1&playlist=${item.videos[0]}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </motion.div>
                ) : item.images && (
                    
                    <motion.img transition={transition} layoutId={`image-${item._id}`} src={item.images[0].asset.url} />
                    )}
                </motion.div>               
                
            <Link className='link noline' to={lang == 'fr'? `/nouvelles/${item.slug[lang].current}` : `/en/news/${item.slug[lang].current}`}>
            <ButtonBase sx={{width: '100%', height: '100%'}} />
            </Link>
            
            </motion.div>
            

        </Box>
    )
}

export default List
