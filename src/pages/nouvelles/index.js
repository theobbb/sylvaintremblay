
import { Switch, useLocation, Route, Redirect, useParams } from 'react-router-dom'
import React, { useState, useEffect, useContext, useRef } from 'react'
import sanityClient from '../../client.js'
import cn from 'classnames';
import Spinner from '../../components/Spinner'
import { Lang } from '../../components/Context'
import './style2.scss'
import { AnimatePresence, motion, AnimateSharedLayout, useMotionValue } from 'framer-motion'
import List from './List.js';
import Single from './Single.js';
import { PageTitle } from '../../components/PageTitle.js';

const transition = { duration: .5, ease: [0.43, 0.13, 0.23, 0.96] }
//{lang == 'fr' ? <Redirect to="/nouvelles" /> : <Redirect to="/en/news" />}
const Nouvelles = ({pageReady, nb}) => {
    
    let { slug } = useParams();
    const slice = nb? nb:null;

    const [data, setData] = useState(null)
    useEffect(() => {
        sanityClient
        .fetch(`*[_type == "post"]{
            title,
            _id,
            body,
            date,
            lieu,
            slug,
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
            videos
          } | order(order desc)`)
        .then((data) => {setData(data)})
        .catch(console.error)
    }, [])


    var open = typeof slug === 'string'? 'open':'';

    const [delay, setDelay] = useState(false);
    const [lastType, setLastType] = useState();

    useEffect(() => {
       
      if (typeof slug === lastType) {
        setDelay(true);
      }
      setLastType(typeof slug)
    }, [slug])

    const lang = useContext(Lang);

    const [redirect, setRedirect] = useState(null);

    useEffect(() => {
        if (typeof slug !== 'string') {
            setRedirect(lang==='fr'?'/nouvelles':'/en/news')
        }
    }, [lang])

    return data ? (

    <AnimateSharedLayout type='crossfade'>
        <div className={`nouvelles ${open}`}>

            

            <AnimatePresence exitBeforeEnter>
                <List ready={pageReady} data={data} slug={slug} slice={slice} />

                <Single delay={delay} slug={slug} data={data} />

            </AnimatePresence>

        </div>
        </AnimateSharedLayout>

        
    ) : (<Spinner />)
}

export default Nouvelles
