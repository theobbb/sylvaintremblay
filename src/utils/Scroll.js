

  const lerp = (f0, f1, t) => (1 - t) * f0 + t * f1;
  const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

  class Scroll {

    constructor(obj) {
      this.init();
    }

    init() {
      this.progress = 0;
      this.lastProgress = 0;
      this.maxScroll = 0;
      this.oldY = 0;
      this.y = 0;
      this.time = 0.01;
      this.frame = [0,100];
      //
      this.bindings();
      this.events();
      this.calculate();
      this.update();
    }

  
    bindings() {
      [
      'events',
      'calculate',
      'update',
      'handleWheel',
      'scrollTop',
      'move'].
      forEach(i => {this[i] = this[i].bind(this);});
    }

    calculate() {
      this.maxScroll = document.body.scrollHeight  - window.innerHeight
      this.move();
    } 
    handleWheel(e) {
      e.preventDefault();
      this.progress += e.deltaY;
      this.move();
    }
    move() {
      this.frame = [0,100];
      this.time = 0.1;
      this.progress = clamp(this.progress, 0, this.maxScroll)
    }
  
    events() {
      new ResizeObserver(this.calculate).observe(document.body)
      new ResizeObserver(this.calculate).observe(document.querySelector('.page'))
      window.addEventListener('resize', this.calculate, { passive: false });
      window.addEventListener('wheel', this.handleWheel, { passive: false });
    }
    scrollTop() {
      this.frame = [0,200];
      this.time = 0.05;

      this.progress = 0;
    }

    update() { 
      if (this.frame[0] < this.frame[1]) {
        this.frame[0] ++;
        window.scroll(0, lerp(window.scrollY, this.progress, this.time))
      }
      requestAnimationFrame(this.update);
    }
    
  } 


  export default Scroll