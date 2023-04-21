import React, { useContext, useState } from 'react'
import { Lang } from './Context';


export default function Infolettre() {

    const lang = useContext(Lang);

    const [inputText, setInputText] = useState(null)

  return (
    <div className='infolettre'>
        <h5><div></div>{lang === 'fr'? 'infolettre': 'newsletter'} 
        
            <form action="https://sylvaintremblay.us10.list-manage.com/subscribe/post?u=ad76a5b766cc13f11c22636aa&amp;id=3bcc231d1f" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                <input type='email' name="EMAIL" className="email no-scroll" id="mce-EMAIL" placeholder='email' defaultValue={inputText} onChange={(e) => setInputText(e.target.value)}></input>
            </form>
        </h5>
    </div>
  )
}
