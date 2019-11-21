console.clear();

w = 1024;
w = 1024;

const twodWebGL = new WTCGL(
  document.querySelector('canvas#webgl'), 
  document.querySelector('script#vertexShader').textContent, 
  document.querySelector('script#fragmentShader').textContent,
  window.innerWidth,
  window.innerHeight,
  2
);
twodWebGL.startTime = -100 + Math.random() * 50;

let fb1 = twodWebGL.addFrameBuffer(window.innerWidth, window.innerHeight, WTCGL.IMAGETYPE_REGULAR, WTCGL.TEXTYPE_HALF_FLOAT_OES);
let fb2 = twodWebGL.addFrameBuffer(window.innerWidth, window.innerHeight, WTCGL.IMAGETYPE_REGULAR, WTCGL.TEXTYPE_HALF_FLOAT_OES);
let activeFB = fb1;

let timeout;

window.addEventListener('resize', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    twodWebGL.resize(window.innerWidth, window.innerHeight);
    fb1 = twodWebGL.addFrameBuffer(window.innerWidth, window.innerHeight, WTCGL.IMAGETYPE_REGULAR, WTCGL.TEXTYPE_HALF_FLOAT_OES);
    fb2 = twodWebGL.addFrameBuffer(window.innerWidth, window.innerHeight, WTCGL.IMAGETYPE_REGULAR, WTCGL.TEXTYPE_HALF_FLOAT_OES);
  }, 100);
});

twodWebGL.onRun = (delta) => {
  let _ctx = twodWebGL._ctx;
  
  // find the active texture based on the index
  uniform = _ctx.getUniformLocation(twodWebGL._program, `u_buffer`);
  // Set the texture unit to the uniform
  _ctx.uniform1i(uniform, 5);
  _ctx.activeTexture(_ctx.TEXTURE5);
  // Finally, bind the texture
  _ctx.bindTexture(_ctx.TEXTURE_2D, activeFB.frameTexture);
  activeFB = activeFB === fb1 ? fb2 : fb1;
  
  twodWebGL.addUniform('bufferpass', WTCGL.TYPE_BOOL, true);
  // twodWebGL.resize(1024, 1024);
  twodWebGL.render(activeFB);
  twodWebGL.addUniform('bufferpass', WTCGL.TYPE_BOOL, false);
  // twodWebGL.resize(window.innerWidth, window.innerHeight);
  
  oldmousepos[0] += (mousepos[0] - oldmousepos[0])*.02;
  oldmousepos[1] += (mousepos[1] - oldmousepos[1])*.02;
  
  // oldmousepos = mousepos;
  
  twodWebGL.addUniform('mouse', WTCGL.TYPE_V2, oldmousepos);
}




// track mouse move
let oldmousepos = [0,0];
let mousepos = [0,0];
const u_mousepos = twodWebGL.addUniform('mouse', WTCGL.TYPE_V2, mousepos);
window.addEventListener('pointermove', (e) => {
  let ratio = window.innerHeight / window.innerWidth;
  if(window.innerHeight > window.innerWidth) {
    mousepos[0] = (e.pageX - window.innerWidth / 2) / window.innerWidth;
    mousepos[1] = (e.pageY - window.innerHeight / 2) / window.innerHeight * -1 * ratio;
  } else {
    mousepos[0] = (e.pageX - window.innerWidth / 2) / window.innerWidth / ratio;
    mousepos[1] = (e.pageY - window.innerHeight / 2) / window.innerHeight * -1;
  }
});









// Load all our textures. We only initiate the instance once all images are loaded.
const textures = [
  {
    name: 'noise',
    url: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/982762/noise.png',
    type: WTCGL.IMAGETYPE_TILE,
    img: null
  }
];
const loadImage = function (imageObject) {
  let img = document.createElement('img');
  img.crossOrigin="anonymous";
  
  return new Promise((resolve, reject) => {
    img.addEventListener('load', (e) => {
      imageObject.img = img;
      resolve(imageObject);
    });
    img.addEventListener('error', (e) => {
      reject(e);
    });
    img.src = imageObject.url
  });
}
const loadTextures = function(textures) {
  return new Promise((resolve, reject) => {
    const loadTexture = (pointer) => {
      if(pointer >= textures.length || pointer > 10) {
        resolve(textures);
        return;
      };
      const imageObject = textures[pointer];

      const p = loadImage(imageObject);
      p.then(
        (result) => {
          twodWebGL.addTexture(result.name, result.type, result.img);
        },
        (error) => {
          console.log('error', error)
        }).finally((e) => {
          loadTexture(pointer+1);
      });
    }
    loadTexture(0);
  });
  
}

loadTextures(textures).then(
  (result) => {
    twodWebGL.initTextures();
    // twodWebGL.render();
    twodWebGL.running = true;
  },
  (error) => {
    console.log('error');
  }
);