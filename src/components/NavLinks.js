import React from 'react'
import { links } from '../utils/links'
import NavLink from './NavLink'

export default function NavLinks({setOpen}) {
  return (
    <div className='nav-links'>

                            {links.map((section, index) => (
                                <div key={`section-${index}`} className='section'>
                                    {section.map((link, index) => (
                                        <NavLink key={`link-${index}`} link={link} setOpen={setOpen} />
                                    ))}  
                                </div>
                            ))}
                        </div>
  )
}
