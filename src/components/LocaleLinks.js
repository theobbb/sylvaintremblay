import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { links } from '../utils/links'
//{langLinks.en? langLinks.en : ''}
export default function LocaleLinks({disableClass, sx}) {

    const location = useLocation();

    const [langLinks, setLangLinks] = useState({
        fr: '/', 
        en: '/en'
    });

    useEffect(() => {
        links.map((section) => {
            section.map((link) => {
                if (link.fr.path === location.pathname || link.en.path === location.pathname) {
                    setLangLinks({
                        fr: link.fr.path,
                        en: link.en.path
                    })
                }
            })
        })
    }, [location])

  return (
    <div className={!disableClass && 'lang'}>
        <h4 className={!disableClass && 'nav-link'} sx={sx}>
            <Link to={langLinks.fr? langLinks.fr : ''}>fr</Link> /
            <Link to={langLinks.en? langLinks.en : ''}>en</Link>
        </h4>     
    </div>
  )
}
