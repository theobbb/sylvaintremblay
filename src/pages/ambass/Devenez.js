import { send } from 'emailjs-com';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import React, { useContext, useEffect, useState } from 'react'
import { Lang } from '../../components/Context';

const transition = { duration: .7, ease: [0.43, 0.13, 0.23, 0.96] };

const Devenez = () => {
    const lang = useContext(Lang);
    return (
        <motion.div 
            initial={{x: '100%', opacity: 0}}
            animate={{x: 0, opacity: 1, transition: {delay: .5, ...transition}}}
            exit={{x: '100%', opacity: 0}} 
            transition={transition}
            className='devenez'>

            <div className='text'>
                {lang==='fr'? 
                    <p>
                    Vous êtes un fidèle collectionneur de Tremblay et aimeriez <strong>partager votre passion</strong> pour son art ? Joignez-vous à notre programme d’ambassadrices et d’ambassadeurs en remplissant le formulaire d'inscription ici. Notre équipe vous contactera par courriel afin de confirmer votre admission.
                    </p>
                    :
                    <p>
                    Are you a loyal Tremblay collector and would like to <strong>share your passion</strong> for his art? Join our Ambassador program by completing the registration form here. Our team will contact you by email to confirm your admission.
                    </p>
                }
            </div>

            <motion.div initial={{x: '100%', opacity: 0}}
            animate={{x: 0, opacity: 1, transition: {delay: .5, ...transition}}}
            exit={{x: '100%', opacity: 0}} 
            transition={transition}
            className='form' >
                <Form />
            </motion.div>

        </motion.div>
    )
}

function generateID() {
    var id = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < 8; i++)
        id += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return id;
}

const Form = () => {
    const lang = useContext(Lang);

    const [alert, setAlert] = useState({
        type: '',
        message: ''
    });

    const [oeuvres, setOeuvres] = useState([])
    const [oStr, setOStr] = useState();

    const [toSend, setToSend] = useState({
        name: '',
        email: '',
        ville: '',
        message: '',
        oeuvres: oStr
    });
    console.log(toSend.oeuvres)


    const createOeuvre = (e) => {
        setOeuvres([...oeuvres, {key: generateID(), name: '', size: ''}]);
    }
    

    const handleOeuvre = (e) => {

        setOeuvres(prevState => {
            const copy = prevState;
            const target = copy.filter((o) => o.key === e.target.id)[0]
            target[e.target.name] = e.target.value;
            return copy;
        });

        const cleanArr = oeuvres.map(o => {
            return { ...o };
        });

        var rows = '';
        cleanArr.map((o,index) => {
            const last = index === cleanArr.length - 1;
            const row = `{ ${o.name}, ${o.size} }${last?'':', '}`
            rows += row;
        })
        setToSend({...toSend, oeuvres: rows})
        
    };

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
          'template_ft8pa18',
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
        
        <AnimateSharedLayout>
        <motion.form layout onSubmit={onSubmit}>

            <motion.input 
            layout
            type='string' 
            name='name' 
            placeholder={lang==='fr'? 'nom':'name'}
            value={toSend.name}
            onChange={handleChange} 
            />
            <motion.input 
            layout
            type='email' 
            name="email" 
            placeholder={lang==='fr'? 'courriel':'email'}
            value={toSend.email}
            onChange={handleChange} 
            />
            <motion.input 
            layout
            type='string' 
            name="ville" 
            placeholder={lang==='fr'? 'ville':'city'}
            value={toSend.ville}
            onChange={handleChange} 
            />
            <div className='oeuvres'>
                <motion.h5 layout>{lang==='fr'? "oeuvres possédées":"owned works"}</motion.h5>
                    <AnimatePresence>
                    {oeuvres.map((oeuvre, index) => (
                        <motion.div key={oeuvre.key} initial={{opacity: 0}} animate={{opacity: 1}}
                        exit={{opacity: 0}} layout className='oeuvre'>
                            <motion.div 
                            whileTap={{scale: 0.9}}
                            
                            style={{cursor: 'pointer', width: 'fit-content'}} 
                            onClick={() => {setOeuvres(oeuvres.filter((o, i) => oeuvre.key !== o.key))}}
                            
                            className='minus'>
                                <svg viewBox='0 0 24 24' width='18' height='18'>
                                    <path d='M2,12 L22,12' strokeWidth='2' stroke='black' />

                                </svg>
                            </motion.div>
                            <div>
                            <input 
                            type='string' 
                            name="name" 
                            id={oeuvre.key}
                            placeholder={lang==='fr'? 'nom':'name'}
                            //value={oeuvres[index]?.name}
                            onChange={handleOeuvre} 
                            />
                            <input 
                            type='string' 
                            name="size" 
                            id={oeuvre.key}
                            size='9'
                            placeholder={lang==='fr'? 'dimensions':'dimensions'}
                            //value={oeuvres[index]?.size}
                            onChange={handleOeuvre} 
                            />
                            </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                
                    <motion.div 
                    layout
                    whileTap={{scale: 0.9}}
                    style={{cursor: 'pointer', width: 'fit-content'}} 
                    onClick={createOeuvre}
                    
                    className='plus'>
                        <svg viewBox='0 0 24 24' width='26' height='26'>
                            <path d='M2,12 L22,12 M12,2 L12,22' strokeWidth='2' stroke='black' />

                        </svg>
                    </motion.div>
                
            </div>
            
            <motion.textarea 
            layout
            name='message' 
            placeholder={lang==='fr'? 'message':'message'} 
            value={toSend.message}
            onChange={handleChange} 
            />
            
            <motion.input layout whileTap={{scale:0.9}} type='submit'/>
            
        </motion.form>
        <motion.div 
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        className={`alert ${alert.type}`}>
            <h5>{alert.message}</h5>
        </motion.div>
        </AnimateSharedLayout>
    )
}

export default Devenez