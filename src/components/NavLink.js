import cn from 'classnames';
import { motion } from 'framer-motion';
import React, { useContext } from 'react'
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { Lang } from './Context';
import { Box } from '@mui/material';

const NavLink = ({link, setOpen, sx, disableClass}) => {

    const location = useLocation();
    const lang = useContext(Lang);

    const active = lang==='fr'? 
    link[lang].path === '/'? location.pathname === '/' : location.pathname.includes(link[lang].path) :
    link[lang].path === '/en'? location.pathname === '/en' : location.pathname.includes(link[lang].path)
    return (
        <Box sx={sx}>
        <motion.h4 
            whileTap={{scale: 0.95}}
            
            
            className={cn(!disableClass && 'nav-link', {active: active})}
            onClick={setOpen ? () => setOpen(false):null}>
            <Link className={cn({active: active})} to={link[lang].path}>{link[lang].name}</Link>
        </motion.h4>
        </Box>
    )
}
export default NavLink
