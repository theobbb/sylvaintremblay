
import { AnimateSharedLayout, motion } from "framer-motion"
import { Link, Route, Switch, Redirect, useLocation, useParams } from "react-router-dom"
import './style.scss'
import { useContext, useEffect, useState } from "react"
import sanityClient from '../../client.js'


import { Lang } from "../../components/Context"
import NavLink from "../../components/NavLink"
import Spinner from "../../components/Spinner"
import Page from "./Page"
import Footer from "../../components/Footer"

const transition = { duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }
const Infos = () => {

    let lang = useContext(Lang)
    const location = useLocation();
    let { slug } = useParams();

    const [data, setData] = useState(null)
    useEffect(() => {
        sanityClient
        .fetch(`*[_type == "texte"]{
            title,
            _id,
            texte,
            slug,
            'order': order,
            images[]{
                _key,
                asset->{
                    _id,
                    'url': url + '?format=auto&fm=webp',
                    'w': metadata.dimensions.width,
                    'h': metadata.dimensions.height
                }
            },
            } | order(order desc)`)
        .then((data) => {setData(data)})
        .catch(console.error)
    }, [])

    return data ? (
<>
            <div id='infos'>
                
                {data.map((page) => (
                    <Route key={page._id} path={[`/${page.slug.fr.current}`, `/en/${page.slug.en.current}`]} > 
                        {lang == 'fr' ? <Redirect to={`/${page.slug.fr.current}`} /> : <Redirect to={`/en/${page.slug.en.current}`} />}
                        <Page page={page} />
                    </Route>
                ))}
                
            </div>
            <Footer />
            </>
    ) : <Spinner/>
}

export default Infos
