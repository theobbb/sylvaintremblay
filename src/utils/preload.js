import { useEffect } from "react";
import sanityClient from '../client.js'

const oeuvres = `'oeuvres':
*[_type == "serie"]{
  _id,
  title,
  lieu,
  toiles[]{
    _key,
    dimensions,
    titre,
    'image': image.asset->{
      'url': url + '?format=auto&fm=webp',
      'w': metadata.dimensions.width,
      'h': metadata.dimensions.height
    },
  },
  'order': order
} | order(order)`
/*
const oeuvres = `'oeuvres':
{
  'series': *[_type == "serie"]{
  _id,
  title,
  lieu,
  toiles,
  'order': order
} | order(order asc),
'toiles': *[_type == "toile"]{
  _id,
  title,
  size,
  'serie': serie._ref,
    
  'image': image.asset->{
    'url': url + '?format=auto&fm=webp',
    'w': metadata.dimensions.width,
    'h': metadata.dimensions.height
  },
  'order': order
} | order(order asc),

}`
*/
const demarche = `'demarche': 
*[_type == 'texte' && title=='Demarche']{
  sections[]{
      _key,
      'text': children[0].text
  }
}`

const galeries = `'galeries':
*[_type == 'galerie'] | order(order){
  _id,
  nom,
  lieu,
  emails[],
  liens[]
}`

const nouvelles = `'nouvelles':
*[_type == "post"]{
  title,
  _id,
  body,
  date,
  lieu,
  slug,
  'order': order,
  images[]{
      asset->{
          _id,
          url
      }
  },
  videos
} | order(order desc)`

const bio = `'bio': 
*[_type == 'texte' && title=='Biographie']{
  sections[]{
      _key,
      'text': children[0].text
  }
}`

function Preload(setMasterData, setPrc, setLoading) {

  var counter = 0, len = 0;

  //'videos': *[_type == "videos"]{}
  useEffect(() => {
      sanityClient
      .fetch(`{
        ${oeuvres},
        ${nouvelles},
        ${galeries},
        ${demarche},
        ${bio},
      }`)
      .then((data) => {
        setMasterData(data); 
        load(data)
      })
      .catch(console.error)
  }, [setMasterData])
  

  function load(data) {

    
    
    data.oeuvres.map((serie) => {
      
      len += serie.toiles?.length?? 0;
      console.log(len)


    
    
    //len = data.oeuvres.toiles?.length;
    
      serie.toiles?.map((toile,index) => {
        
        const img = new Image();
        img.src = toile.image.url;
        img.onload = () => loaded(true);
      })    
    })    
  }
  function loaded(type) {
    if (type === true) counter++; 
    if (type === false) counter--; 
    setPrc(Math.round(counter / len * 100))
    if (counter === len) {
      //setLoading(false)
    }
  }


}
export default Preload