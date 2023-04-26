import { motion, useAnimation } from 'framer-motion';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { ArrowReturn } from '../../components/ArrowReturn';
import { Lang } from '../../components/Context';

function Single({slug, data, delay}) {
    const transition = { duration: .5, ease: [0.43, 0.13, 0.23, 0.96] }

    const lang = useContext(Lang);

    const [slugs, setSlugs] = useState([]);

    function update() {
        var arr = [];
        data.map((item) => {
            arr.push(item.slug[lang].current)
        })
        setSlugs(arr);
    }
    useEffect(() => update(), [lang])

    const [headerH, setHeaderH] = useState(0);

    useEffect(() => {
        const header = document.querySelector('header');

        function resize() {
            setHeaderH(header.offsetHeight);
        }
        resize()
        window.addEventListener('resize', resize);
    }, [setHeaderH])


    return data.map((item) => (item.slug.fr.current === slug || item.slug.en.current === slug) && (
        
       
<>
        <motion.div 
        className='post single'
        style={{originY: 0}}
        transition={transition}
        key={`single-${item._id}`}
        layoutId={`item-container-${item._id}`} 

        >
            <motion.div className='inner'>

                    <div className='top'>
                        <div className='left'>
                            <motion.div className='return' whileTap={{ scale: 0.9 }} >
                                
                                <ArrowReturn />
                                <Link className='link noline' to={lang == 'fr'? '/nouvelles':'/en/news'} />
                            </motion.div>

                            <motion.div className='titles ' transition={transition} layoutId={`texts-container-${item._id}`}>     
                                <h3 className='lieu words'>
                                    {item.lieu[lang].split(' ').map((word,index) => (
                                        <motion.div
                                        className='word'
                                        transition={transition}
                                        key={`word-${item._id}-${word}-${index}`}
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
                                        key={`word-${item._id}-${word}-${index}`}
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
                                        key={`word-${item._id}-${word}-${index}`}
                                        layoutId={`title-words-${item._id}-${word}-${index}`}>
                                            {word}
                                        </motion.div>
                                    ))}
                                </h4>
                            
                            </motion.div>
                        </div>

                        <Controls slugs={slugs} index={Math.max(0,data.length-1 - item.order)} />
                    </div>

                    <div className='main'>

                        <div className='medias'>
                        
                            <div className='videos'>
                                {item.videos && item.videos.map((video, index) => (
                                    <motion.div 
                                    key={video._key} 
                                    transition={transition} 
                                    layoutId={index === 0 ?`video-container-${item._id}`:null} 
                                    className='video open videos'>
                                        
                                            <iframe src={`https://www.youtube.com/embed/${video}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                        
                                    </motion.div>
                                ))}
                            </div>

                            <div className='imgs'>
                                {item.images && item.images.map((img, index) => (
                                    <motion.div 
                                    transition={transition} 
                                    
                                    layoutId={index === 0 && !item.videos? `image-container-${item._id}`:null} 
                                    className='img open'>
                                    
                                    <motion.img transition={transition} layoutId={index === 0 && `image-${item._id}`} src={img.asset.url} />
                                        
                                    </motion.div>
                                ))}
                            </div>

                        </div>

                        <div className='body'>
                        
                    {item.body[lang].map((section, index) => 
                        <motion.div className={section._type} key={section._key}
                    >
                            {section.children.map((item) => (
                                <p className={item._type +' '+ item.marks} key={item._key}>
                                {item.text}
                                </p>
                            ))}
                        </motion.div>
                    )}
                        
                    
                        </div>
                    </div>
                    
            </motion.div>

        </motion.div>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{opacity: 0}}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="overlay"
            >
                <Link className='link noline' to={lang==='fr'?'/nouvelles':'/en/news'} />
            </motion.div>
        </>
        
    ))
       
}


const ArrowTop = () => (
    <svg fill='none' width="60" height="60">
        <path d='M5,30 L55,30 M43,20 L55,30 L43,40' strokeWidth='2px' strokeLinecap="round"/>
    </svg>
)

function Controls({slugs, index}) {

    return (
        <div className='controls'>
            <motion.div className='prev' initial={{rotate: 180}} whileTap={{ scale: 0.9 }}>
                <Link to={index > 0 ? slugs[index - 1] : slugs[slugs.length - 1]} className='noline'>
                    <ArrowTop />
                </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.9 }} className='next'>
                <Link to={index < slugs.length - 1 ? slugs[index + 1] : slugs[0]} className='noline'>
                    <ArrowTop />
                </Link>
            </motion.div>
        </div>
    
    )  
    
}

export default Single
