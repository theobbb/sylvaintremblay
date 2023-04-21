import React, { useEffect } from 'react'


const Canvas2 = React.memo(props => {


    useEffect(() => {


    const imgs_url = [
        {src:'img/home/img-1', x: 0.3, y: 0.5},
        {src:'img/home/img-2', x: 0.5, y: 0.5},
        {src:'img/home/img-3', x: 0.5, y: 0.5},
        {src:'img/home/img-4', x: 0.5, y: 0.5},
        {src:'img/home/img-5', x: 0.5, y: 0.5}

    ]

    const small = {
        w: 120,
        h: 400,
        spacing: 20
    }
    const _0 = {
        width: 120,
        height: 400,
        spacing: 20,
    }

    var main = {
        w: _0.width,
        h: _0.height,
        space: _0.spacing,
    }
    const img_dims = { x: 0.8, y: 0.8 }




    const frames = [0,10]
   
    var x = 50;

    const lerp = (f0, f1, t) => (1 - t) * f0 + t * f1;

    let tree = []
    const init = () => {
        var len = imgs_url.length,
        counter = 0;
        imgs_url.map((item, index) => {
            
            let img = new Image(); 
            var c = document.createElement('c');
            c.appendChild(img)
            tree = [...tree, c]
            
            img.id = `img-${index}`;
            c.id = `c-${index}`;
            img.index = index;
            c.index = index;

            img.target = {x: item.x, y: item.y}

            c.img = c.children[0];

            c.active = false;
            
            close(c)
            /*
            c.first_x = (main.w + main.space) * c.index;
            c.first_y = (window.innerHeight - main.h) / 2;
            c.first_w = main.w;
            c.first_h = main.h;
*/
            img.src = process.env.PUBLIC_URL + `/${item.src}.jpg`;
            img.onload = () => {
                counter++;
                
                if ( counter === len ) {
                    size()
                    draw()
                    
                }
            }
            
        })

    }
    init()

    
    

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');


    function close(c) {

        c.x = (main.w + main.space) * c.index;
        c.y = (window.innerHeight - main.h) / 2;
        c.w = main.w;
        c.h = main.h;
    }

    document.addEventListener('click', click)

    function click(event) {

        tree.map((c) => {
            
                if (ctx.isPointInPath(c.rect, event.offsetX, event.offsetY)) {
                    open(c)
                    //console.log(c.index)
                }
            
        })
    }
    
    
    
    function open(active) {
        var offset = 0;
        
        tree.map((c) => {
            /*
            // already active => close
            if (c.active == true) {
                c.active = false;
                c.animating = true;
                c.new_x = c.small_x;
                c.new_y = c.small_y
                c.new_w = c.small_w
                c.new_h = c.small_h
                //console.log(c.small_x, c.small_y, c.small_w, c.small_h)
            }*/
            // open



            if (c == active) {
                c.active = true;
                c.animating = true;
                //console.log(c.new_w,c.big_w)

                
                //xs[c.index] = xs.reduce((a, b) => a + b, c.big_w)
                //xs[c.index] = xs[c.index - 1] + c.big_w;
                
                offset = c.big_x - c.x;

                
                
                c.new_x = c.big_x;
                c.new_y = c.big_y;
                c.new_w = c.big_w;
                c.new_h = c.big_h;
                
               
                
                
                //last_w = c.new_w;

                //test[c.index] = 0 + test[c.index - 1] + c.new_w;
                
                
                //test.splice(c.index, 0, c.index);
            } else {
                c.animating = true;
                c.new_x = c.x - offset;
                c.new_y = c.y;
                c.new_w = c.w;
                c.new_h = c.h;
            }
            
            if (c.animating == true) {
                anim(c)
            }

            
        })
        //console.log(xs)
        console.log(offset)
    }



    function anim(c) {
        draw()
        c.x = lerp(c.x, c.new_x, 0.15);
        c.y = lerp(c.y, c.new_y, 0.15);
        c.w = lerp(c.w, c.new_w, 0.15);
        c.h = lerp(c.h, c.new_h, 0.15);

        //c.img.$x = lerp(c.img.$x, c.x, 0.15);

        //c.img.$x = lerp(c.x, c.new_x + test[c.index], 0.15);
        
        if (Math.abs(c.x - c.new_x) > 0.1) {
            requestAnimationFrame(() => anim(c))
        } else {
            c.animating = false;
        }
    }
    function draw() {
        
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        tree.map((c) => {
            ctx.save();
            c.rect = new Path2D();
            ctx.beginPath();
            c.rect.rect(c.x, c.y, c.w, c.h)
            ctx.clip(c.rect)
            //ctx.fill(c.rect)
            ctx.drawImage(c.img, c.img.$x, c.img.$y, c.img.$width, c.img.$height);
            ctx.restore();
        })


    }

    const size = () => {
        canvas.width = window.innerWidth*3
        canvas.height = window.innerHeight

        tree.map((c) => {

            let img = c.img
            let r = Math.max(
                img.naturalWidth / Math.min(window.innerWidth*img_dims.x, img.naturalWidth),
                img.naturalHeight / Math.min(window.innerHeight*img_dims.y, img.naturalHeight)
            );
            img.$width = img.naturalWidth/r;
            img.$height = img.naturalHeight/r;
            img.$x = (main.w + main.space) * img.index - (img.$width - main.w) * img.target.x;
            img.$y = (window.innerHeight - main.h) / 2 - (img.$height - main.h) * img.target.y;

            //c.small_x = (small.w + small.spacing) * c.index;
            c.small_x = small.w;
            c.small_y = (window.innerHeight - small.h) / 2;
            c.small_w = small.w;
            c.small_h = small.h;
            c.big_x = c.img.$x;
            c.big_y = c.img.$y;
            c.big_w = c.img.$x - c.img.$x + c.img.$width;
            c.big_h = c.img.$y - c.img.$y + c.img.$height;

            //test[c.index] = 0;

            //console.log(JSON.stringify(c, null, 4))
        })
        


    }
    



    document.addEventListener('resize', size)
    })


    return (
        <canvas id='canvas'></canvas>
    )
})

export default Canvas2
