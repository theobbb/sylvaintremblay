import React from 'react'
import Konva from 'konva';


const Canvas = React.memo(props => {

  const img_w = 80;
  const img_h = 800;
  const img_d = 15;


  

  const rafAsync = () => {
    return new Promise(resolve => {
        requestAnimationFrame(resolve);
    });
  }
  const checkElement = (selector) => {
    if (document.querySelector(selector) === null) {
        return rafAsync().then(() => checkElement(selector));
    } else {
        return Promise.resolve(true);
    }
  }    
  checkElement('#container').then(() => {

    var width = window.innerWidth;
    var height = window.innerHeight;

    var stage = new Konva.Stage({
      container: 'container',
      width: width,
      height: height,

    });


    var layer = new Konva.Layer();
    

    // main API:
    const imgs = []
    const imgs_url = [
        'img-1',
        'img-2',
        'img-3',
        'img-4',
        'img-5'

    ];
    var imgs_dims = [];
    

    console.log(imgs_url.length)
    var group = new Konva.Group({
      x: 0,
      y: 0,
      width: width,
      height: height,

      });
      
    let last_img_w = 0;



    for (let i = 0; i < imgs_url.length; i++) {
        
        
        let img = new Image();
        
        
        
        img.onload = () => {
            
            last_img_w += img.naturalWidth / 4
            console.log(i)

            imgs_dims.splice(i, 0, [img.naturalWidth, img.naturalHeight])

            let w = img.naturalWidth
            let h = img.naturalHeight
            let _w = w / Math.min(window.innerWidth*0.8, w)
            let _h = h / Math.min(window.innerHeight*0.5, h)
            var r = Math.max(_w,_h);

            
            //ctx.drawImage(img, i ,0, img.naturalWidth/r, img.naturalHeight/r);
            var container = new Konva.Group({
              clip: {
                x: (img_w + img_d) * i,
                y: 300,
                width: img_w,
                height: img_h,
                
              },
              
            });

            container.on('click', function () {
              //open(`#${this.id()}`)
              open(this)
              //anim(this);
              //anim.start();
              //test(this.id())
              //console.log(this)
            });


            console.log(container.attrs.clipX)

            var item = new Konva.Image({
              
              x: container.clipX(),
              y: container.clipY(),
              image: img,
              
              width: img.naturalWidth / r,
              height: img.naturalHeight / r,
              id: `img-${i}`,
              opacity: 0.5,
            });
            item.on('mouseover', function () {
              this.opacity(1);
            });
            item.on('mouseout', function () {
              this.opacity(0.5);
            });


            container.add(item)
            group.add(container);
          };
          img.src = process.env.PUBLIC_URL + `/img/home/${imgs_url[i]}.jpg`;
    }
    console.log(imgs_dims)



      
    layer.add(group)
    stage.add(layer);


    //document.addEventListener('wheel', scroll, { passive: false })
    
    const min = 0;
    const max = window.innerWidth;
    
    // Clamp number between two values with the following line:
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    const open = (item) => { 
      console.log(item.width())

      var tween = new Konva.Tween({
        node: item,
        duration: 1,


        
        
        width: 300,
        
      });
      tween.play()

/*
      var anim = new Konva.Animation(function (frame) {
        item.x(
          //item.x() + frame.time * 0.01
        );
        item.width(
          item.width() + frame.time * 0.1
           
        )

      },layer);
      anim.start()
      */
    }

    /*
      //var item = stage.find(id)[0]
      var anim = new Konva.Animation(function (frame) {
        group.x(
          frame.time * 0.1
        );
      }, layer);
      */
    

  //document.addEventListener('click', () => {console.log('start'); open(stage.find('#img-1')[0])})
    

    
})
   

    return (
        <>
            <div id='container' page={props.page}>
                {props.children}
            </div>
        </>
    )
})

export default Canvas
