import cn from 'classnames'
import React, { useContext, useEffect, useState } from 'react'
import sanityClient from '../../client.js'
import { Lang } from '../../components/Context.js'
import Spinner from '../../components/Spinner.js'
import './style.scss'

const Perf = () => {

    
    const [data, setData] = useState(null)
    useEffect(() => {
        sanityClient
        .fetch(`*[_type == 'live']{
            _id,
            'video': videos.asset->{
                url
            },
            youtube,
            title,
            'order': order,
          } | order(order asc)`)
        .then((data) => {setData(data)})
        .catch(console.error)
    }, [])

    const [selected, setSelected] = useState();

    const lang = useContext(Lang);

    return data? (
        <div className='perf'>
           
            <div className={cn('inner', {open: selected})}>
                {data.map((item) => (
                    <div 
                    key={item._id}
                    onClick={() => setSelected(item._id)} 
                    className={cn('video', {open: selected === item._id})}>
                        <h4 className='title'>{item.title[lang]}</h4>
                        <div className='inner'>
                        
                        {item.video && <video className="frame" controls autoPlay muted loop src={item.video.url} /> }
                        {item.youtube && 
                            <iframe className="frame" src={`https://www.youtube.com/embed/${item.youtube}`} title="YouTube video player" frameborder="0" allow=" accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="true"></iframe>
                        }
                        </div>
                    </div>
                ))}

            </div>
        </div>

    ) : <Spinner />
}
export default Perf