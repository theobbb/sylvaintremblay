import { motion } from 'framer-motion'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Lang } from '../../components/Context';
import Spinner from '../../components/Spinner';
import Observer from '../../utils/observer';
import { Box } from '@mui/material';

const transition = { duration: .7, ease: [0.43, 0.13, 0.23, 0.96] };

const Page = ({page}) => {

    const lang = useContext(Lang);

    const [pageArr, setPageArr] = useState([])

    useEffect(() => {

        let iLen = page.images.length;
        let pLen = page.texte[lang].length

        let _iLen = iLen
        let _pLen = pLen
        
        let arr = [];
        
        let _img = 0
        let _p = 0
        
        for (let i = 0; i < iLen+pLen; i++) {
            const img = () => {
                arr[i] = ['img', page.images[_img]]
                _img++
                _iLen--
            }
            const p = () => {
                arr[i] = ['p', page.texte[lang][_p]]
                _p++
                _pLen--
            }
            if (i === 0) {
                if (_iLen) img() 
                else if (_pLen) p()
            }
            else if (i === pLen + 1) {
                if (_iLen) img() 
                else if (_pLen) p()
            }
            else if (i <= pLen + 1) {
                if (_pLen) p() 
            }
            else if (i >= pLen + 1) {
                if (_iLen) img() 
            }
          }
          setPageArr(arr)
    }, [lang])

    return pageArr ? (
        <Box className='info-page' component={motion.div} sx={{width: '100%', px: {xs: 2, md: 9.5, lg: 10}}}>
            
            {pageArr.map((item, index) => item[0] === 'img'? (
                <Img key={index} img={item[1]} />
                
            ) : (
                <P p={item[1]} />
            ))}

            
        </Box>
    ) : <Spinner />
}

const Img = ({img}) => {
    const ref = useRef(null);
    const onScreen = Observer(ref);
    return (
        <Box
        sx={{py: {xs: 6, md: 8}}}
        component={motion.div} 
            className='img'
            initial={{opacity:0, y:'100%'}}
            animate={{opacity:1, y:0}}
            exit={{opacity:0, y:'-100%'}}
            transition={transition} 
        >
            <img src={img.asset.url} />
        </Box>
    )
}

const P = ({p}) => {
    const ref = useRef(null);
    const onScreen = Observer(ref);
    return (
        <Box
        sx={{py: {xs: 2, md: 3}}}
        component={motion.div} 
        ref={ref}            
        initial={{opacity:0, y:50}}
        animate={onScreen? { opacity:1, y:0 }:{opacity:0, y:50}}
        exit={{opacity:0, y:-50}}
        transition={transition} 
        className={p._type + ' body'} 
        key={p._key} 
        >

                {p.children.map((item) => (
                    <p className={item._type +' '+ item.marks} key={item._key}>
                    {item.text}
                    </p>
                ))}
                
        
        </Box>
    )
}

export default Page