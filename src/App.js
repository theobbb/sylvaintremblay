import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { Route, Switch, useLocation } from 'react-router-dom'
import './sass/main.scss';
import Loader from './components/Loader'
import Menu from './components/Menu'
import Home from './pages/home'
import Oeuvres from './pages/oeuvres'
import Galeries from './pages/galeries'
import Nouvelles from './pages/nouvelles/index'

import { Lang, Theme } from "./components/Context";

import 'aos/dist/aos.css'; 

import Scroll from './utils/Scroll'
import Cv from "./pages/cv";
import Infos from "./pages/infos";
import { ScrollTop } from "./components/ScrollTop";
import Ambass from "./pages/ambass";
import Perf from "./pages/perf";

import ReactGA from 'react-ga';
import { ThemeProvider, createTheme } from "@mui/material";
import Footer from "./components/Footer";
import P404 from "./pages/404";

const App = () => {

    const location = useLocation();

    const [masterData, setMasterData] = useState(null);
    const [prc, setPrc] = useState(0);
    const [loading, setLoading] = useState(false);
    const [newSession, setNewSession] = useState(false);

    const [otherLangLink, setOtherLangLink] = useState('');


    useEffect(() => { if(newSession) setNewSession(typeof sessionStorage.getItem('opened') === 'string') })

    useEffect(() => {
        document.addEventListener('click', () => {setLoading(false)})
      if (!loading) sessionStorage.setItem('opened',1)

      loading
        ? document.querySelector("body").classList.add("loading")
        : document.querySelector("body").classList.remove("loading");
    }, [loading]);


    const [theme, setTheme] = useState('dark');

    const [lang, setLang] = useState(sessionStorage.getItem('lang')?? 'fr');
    sessionStorage.setItem('lang', lang);

    useEffect(() => {
        if (location.pathname.includes('/en')) setLang('en')
        else setLang('fr')
    }, [location])


    useEffect(() => {
        theme === 'dark'
        ? document.querySelector("body").classList.add("dark")
        : document.querySelector("body").classList.remove("dark");
    }, [theme]);


    const [scrollTop, setScrollTop] = useState();
   //var scrollTo;

    var init = false;
    useEffect(() => {if (!init && document.querySelector('html').classList.contains('no-touch')) {
        var scroll = new Scroll();
        
        setScrollTop(() => scroll.scrollTop);
        init = true;
    }
        
    }, []);

    useEffect(() => {
        if (document.querySelectorAll('header').length) {
            if (location.pathname.includes('oeuvres') || location.pathname.includes('works'))
                document.querySelectorAll('header')[0].style.position = 'absolute';
            else 
                document.querySelectorAll('header')[0].style.position = 'relative';
        }
    }, [location])

    // Google Analytics
    const TRACKING_ID = "G-6Z4SS2ZZR8"; // OUR_TRACKING_ID
    ReactGA.initialize(TRACKING_ID);
    useEffect(() => {
        ReactGA.pageview(window.location.pathname + window.location.search);
      }, [location]);

      const muitheme = createTheme();

      useEffect(() => {
        if (location.pathname == '/' || location.pathname == '/en') document.title = `Sylvain Tremblay`;
        else
        document.title = `Sylvain Tremblay | ${location.pathname.split('/').pop().replace('-', ' ')}`;
      }, [location]);
      
    return (
        
        <>
            <ThemeProvider theme={muitheme}>

        
            <AnimatePresence exitBeforeEnter>
        
            {loading && !newSession ? (
            <motion.div key='loader'>
                <Loader setLoading={setLoading} prc={prc} />
            </motion.div>
            ) : (

                <Lang.Provider value={lang}>
                <Theme.Provider value={theme}>

                
                <Menu setLang={setLang} setTheme={setTheme}>

                
                
                <AnimateSharedLayout type='crossfade'>
                <AnimatePresence exitBeforeEnter>
                    <Switch location={location} key={lang === 'fr' ? location.pathname.split('/')[1] : location.pathname.split('/')[2]}>

                            
                           
                            
                            

                            <Route exact path={['/', '/en']}>
                                <Home />
                                <Footer />
                            </Route>

                            <Route path={['/oeuvres/:slug', '/en/works:slug', '/oeuvres', '/en/works']}>

                                
                                <Oeuvres />
                            </Route>

                            <Route path={['/galeries', '/en/galleries']}>
                                <Galeries />
                                <Footer />
                            </Route>
                            <Route path={['/nouvelles/:slug', '/en/news/:slug', '/nouvelles', '/en/news']}>
                                <Route exact path={['/nouvelles', '/en/news']}>
                                </Route>
                                
                                <Nouvelles />
                                <Footer />
                            </Route>
                            <Route path={['/ambassadeurs', '/en/ambassadors']}>
                                <Ambass />
                                <Footer />
                            </Route>
                            <Route path={['/performances-en-direct', '/en/live-performance']}>
                                <Perf />
                                <Footer />
                            </Route>
                            <Route path={['/CV', '/en/CV']}>
                                <Cv />
                                <ScrollTop scrollTop={scrollTop} />
                                <Footer />
                            </Route>

                            <Infos />
                            <Footer />
                            </Switch>
                        
                            
                            </AnimatePresence>
                </AnimateSharedLayout>

                
                      
                      
                </Menu>
                
                </Theme.Provider>
                </Lang.Provider>
            )}
            </AnimatePresence>

            </ThemeProvider>


            </>
        
    )
}




export default App
