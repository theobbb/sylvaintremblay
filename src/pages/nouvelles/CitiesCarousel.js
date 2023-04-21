import { Box, Typography } from '@mui/material'
import useEmblaCarousel from 'embla-carousel-react'
import React, { useContext } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { Theme } from '../../components/Context'

export default function CitiesCarousel({items, query, clickCity}) {
    
    const autoplayOptions = {
        delay: 0,
        stopOnInteraction: false,
        rootNode: (emblaRoot) => emblaRoot.parentElement,
      }

    
      const [emblaRef] = useEmblaCarousel({
        loop: true, 
        dragFree: true, 
        speed: 0.01, 
        direction: 'ltr', 
        startIndex: 5,
    }, [Autoplay(autoplayOptions)])

    const theme = useContext(Theme)
    
    
      return (
       
        <Box className="embla" ref={emblaRef} 
        sx={{overflow: 'hidden', background: theme === 'light'? 'rgba(0, 0, 0, 0.05)': 'rgba(0, 0, 0, 0.29)'}}>
          <Box className="embla__container" sx={{display: 'flex', alignItems:'center', direction: 'ltr'}}>
            {items.map((item) => 
                
                <Box sx={{py: 0, px: 2}} className="embla__slide">
                <h4 
                style={{wordWrap: 'nowrap', whiteSpace: 'nowrap'}}
                className={query===item?'active': ''} onClick={() => clickCity(item)}><a>{item.toUpperCase()}</a></h4>
      
                </Box>
              
            )}
          </Box>
        </Box>
        
      )
}
