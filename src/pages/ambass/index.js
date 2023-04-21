import sanityClient from '../../client.js'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Spinner from '../../components/Spinner';
import './style.scss'
import { Lang } from '../../components/Context';
import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Arrow } from '../../components/Arrow';
import { ArrowReturn } from '../../components/ArrowReturn.js';
import { send } from 'emailjs-com';
import Rencontrez from './Rencontrez.js';
import Devenez from './Devenez.js';

const transition = { duration: .7, ease: [0.43, 0.13, 0.23, 0.96] };

const Ambass = () => {

    

    const [data, setData] = useState(null)
    useEffect(() => {
        sanityClient
        .fetch(`*[_type == 'ambass']{
            _id,
            name,
            lieu,
            text,
            images[]{
                _key,
                asset->{
                    _id,
                    'url': url + '?format=auto&fm=webp',
                    'w': metadata.dimensions.width,
                    'h': metadata.dimensions.height
                }
            },
          }`)
        .then((data) => {setData(data)})
        .catch(console.error)
    }, [])
    const lang = useContext(Lang);

    const [onglet, setOnglet] = useState(0);

    return data ? (
        <div className='ambass'>
            <div className='top-text'>
                {lang==='fr'? 
                <p>Les ambassadrices et ambassadeurs sont des collectioneurs des oeuvres de Tremblay. </p>
                : 
                <p>Ambassadors are collectors of Tremblay's works</p>
                }
            </div>
            <div className='nav'>
                <h4>
                    <a onClick={() => setOnglet(0)}>{lang==='fr'?'Rencontrez un ambassadeur':'Meet an ambassador'}</a>
                    <span> / </span>
                    <a onClick={() => setOnglet(1)}>{lang==='fr'?'Devenez un ambassadeur':'Become an ambassador'}</a>
                </h4>
                
            </div>
            <AnimatePresence initial={false}>
                {/*<Rencontrez key={onglet} data={data} />*/}
                {onglet === 0 && <Rencontrez key='ren' data={data} />}
                {onglet === 1 && <Devenez key='dev' />}
            </AnimatePresence>
        </div>
    ) : <Spinner />
}





export default Ambass