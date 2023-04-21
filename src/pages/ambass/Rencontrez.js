import cn from 'classnames';
import { send } from 'emailjs-com';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useContext, useRef, useState } from 'react'
import { ArrowReturn } from '../../components/ArrowReturn';
import { Lang } from '../../components/Context';

const transition = { duration: .7, ease: [0.43, 0.13, 0.23, 0.96] };

const Rencontrez = ({data}) => {
    const lang = useContext(Lang);

    const [selected, setSelected] = useState(null);

    

    return (
        <motion.div 
            initial={{x: '-100%', opacity: 0}}
            animate={{x: 0, opacity: 1, transition: {delay: .5, ...transition}}}
            exit={{x: '-100%', opacity: 0}} 
            transition={transition}
            className='rencontrez'>

            <div className='text'>
                {lang==='fr'? 
                <p>
                Vous aimeriez <strong>voir des œuvres</strong> de Tremblay et <strong>partager vos impressions</strong> avec des collectionneurs ? Inscrivez-vous ici et nous vous mettrons en contact avec l’ambassadrice ou l’ambassadeur <strong>le plus près de chez vous.</strong>
                </p>
                :
                <p>
                Would you like <strong>to see works</strong> by Tremblay and <strong>share your impressions</strong> with collectors? Sign up here and we will put you in touch with the Ambassador <strong>closest to you.</strong>
                </p>
                 }

                
            </div>
            <AnimatePresence>

            {data.map((item) => (

                <Item key={`${selected===item._id? 'selected':''}-${item._id}`} item={item} selected={selected===item._id} setSelected={setSelected}  />
                
            ))}
            </AnimatePresence>
        </motion.div>
    )
}


const Item = ({item, selected, setSelected}) => {
    const lang = useContext(Lang);

    let img = useRef()
/*
    const [imgW, setImgW] = useState()
    const [imgH, setImgH] = useState()

    function getImgSize() {
        if (img.current) {
            let conW = img.current.getBoundingClientRect().width;
            let conH = img.current.getBoundingClientRect().height;
            let w = item.images[0].asset.w;
            let h = item.images[0].asset.h;

            let r_w = w / Math.min(w,conW);
            let r_h = h / Math.min(h,conH);

            let ratio = Math.max(r_w,r_h);

            setImgW(w / ratio)
            setImgH(h / ratio)
        }
    }*/

    return (
        <motion.div 
        layoutId={item._id}
        transition={transition}

        onClick={() => {if (!selected) setSelected(item._id)}}
        className={cn('item', {selected: selected})}>
        {selected && (
            
            <motion.div
            layoutId={`return-${item._id}`}
            className='return'
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelected(null)} >
                        
                <ArrowReturn />
                
            </motion.div>
            
        )}
        <div className='inner'>
        

            
            {item.images && (
                <motion.div 
                
                
                ref={img}
                //onLayoutAnimationComplete={() => getImgSize()}
                //animate={selected? {maxWidth: 200}:{maxWidth: 500}}
                layoutId={`img-${item._id}`}
        transition={transition} 
        className='img'>
                
                   <motion.img 

        transition={transition}  src={item.images[0].asset.url} />
                
                </motion.div>
            )}
            <motion.div 
            transition={transition} 
            layoutId={`titles-${item._id}`} 
            className='titles'>
                <h4>{item.name[lang]}</h4>
                <h5>{item.lieu[lang]}</h5>
            </motion.div>

            {selected && (
            
            <motion.div 
            initial={{y: '100%', opacity: 0}}
            animate={{y: 0, opacity: 1, transition: {delay: .5, ...transition}}}
            exit={{y: '100%', opacity: 0}} 
            transition={transition}
            className='text'>
                        
                <p>{item.text[lang]}</p>
                
            </motion.div>
            )}
            
        </div>
        

        {selected && ( 
            
            <motion.div 
            initial={{x: '100%', opacity: 0}}
            animate={{x: 0, opacity: 1, transition: {delay: .5, ...transition}}}
            exit={{x: '100%', opacity: 0}}
            transition={transition}
            className='form'>
                <h5 className='form-text'>{lang==='fr'? `Inscrivez-vous ici et nous vous mettrons en contact avec ${item.name}.`:""}</h5>
                <Form ambassadeur={item.name} ville={item.lieu[lang]} />
            </motion.div>
            
        )}
        

        </motion.div>
    )
}


const Form = ({ambassadeur, ville}) => {
    const lang = useContext(Lang);

    const [alert, setAlert] = useState({
        type: '',
        message: ''
    });

    const [toSend, setToSend] = useState({
        name: '',
        email: '',
        message: '',
        ambassadeur: ambassadeur,
        ville: ville
    });

    const handleChange = (e) => {
    setToSend({ ...toSend, [e.target.name]: e.target.value });
    };
    const onSubmit = (e) => {
        e.preventDefault();

        if (!toSend.name.length) {
            setAlert({type: 'error', message: lang==='fr'? 'Veuillez indiquez votre nom':"Please enter your name"})
            return;
        }
        if (!toSend.name.length) {
            setAlert({type: 'error', message: lang==='fr'? 'Veuillez indiquez votre adresse courriel':"Please enter your email address"})
            return;
        }

        if (!toSend.email.includes('@')) {
            setAlert({type: 'error', message: lang==='fr'? 'Veuillez indiquez une adresse courriel valide':'Please provide a valid email address'})
            return;
        }

        send(
          'service_45t5auq',
          'template_wga8aqh',
          toSend,
          'user_oZoKmEMIeyFqlMFZi4wdm'
        )
          .then((response) => {
            setAlert({type: 'sucess', message: lang==='fr'? 'Merci, votre demande a été soumise!':''})
            console.log('SUCCESS!', response.status, response.text);
          })
          .catch((err) => {
            setAlert('error')
            console.log('FAILED...', err);
          });
      };

    return (
        <>
        
        <form onSubmit={onSubmit}>
        
            <input 
            type='string' 
            name='name' 
            placeholder={lang==='fr'? 'nom':'name'}
            value={toSend.name}
            onChange={handleChange} 
            />
            
            <input 
            type='email' 
            name="email" 
            placeholder={lang==='fr'? 'courriel':'email'}
            value={toSend.email}
            onChange={handleChange} 
            />
            <textarea 
            name='message' 
            placeholder={lang==='fr'? 'message':'message'} 
            value={toSend.message}
            onChange={handleChange} 
            />
            
            <motion.input whileTap={{scale:0.9}} type='submit'/>
        </form>
        <motion.div 
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        className={`alert ${alert.type}`}>
            <h5>{alert.message}</h5>
        </motion.div>
        </>
    )
}


export default Rencontrez
