let img;
let frame=0;
let s;
let k;
let a = [];
let hights = [];
let type = 2;
let done;
let SIMPVAL;
let NEGVAL;
let i = 0;
let n = 200;
let eps = 100;
let depth = 50;
let np = 40;
let lmax = 0;
let lmax1 = -800;
let perc = 0;
let step = 0;
let timestart;
let linesD = 0;
let fc1;
let delay;
let globT;
let pix = [];
let p1 = [];
let p2 = [];
let hi = [];
function preload() {
  img = loadImage('006.gif');
  img.resize(width, height);
}

function setup() {
  createCanvas(540, 540);
  img.resize(width, height);
  smooth(8);
}

function draw() {
  if (frame<1) {
    image(img, 0, 0);
  }
  strokeWeight(0.8);
  fill(0, 128);
  stroke(0, 128);
  let i=0;
  if (frame<2) {
    loadPixels();
    const d = pixelDensity();
    let s=0.0;
    pix = [];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const i = 4 * d * (y * d * width + x);
        pix[y*width+x]=255-red(get(x, y));
        if (pix[y*width+x] < 1) {
          pix[y*width+x] = 0;
        }
        s += 1.0 * pix[y*width+x] / (width*height);
      }
    }
    SIMPVAL=int(s*0.5);
    NEGVAL=int(3*s*0.3);
    if (type === 1) {
      let k = 0;
      for (let i = 0; i < n / 4; i++) {
        a[k] = i * (height - 1) * 4 / n;
        a[k + n] = 0;
        a[k + n / 4] = height - 1;
        a[k + n / 4 + n] = i * (height - 1) * 4 / n;
        a[k + n / 2] = height - i * (height - 1) * 4 / n - 1;
        a[k + n / 2 + n] = height - 1;
        a[k + 3 * n / 4] = 0;
        a[k + 3 * n / 4 + n] = height - i * (height - 1) * 4 / n - 1;
        k++;
      }
    }
    if (type === 2) {
      for (let i = 0; i < n; i++) {
        hights[i] = -100;
        a[i] = round(height / 2 + (sin(TWO_PI * i / n) * (height / 2 - 1)));
        a[i + n] = round(height / 2 - (cos(TWO_PI * i / n) * (height / 2 - 1)));
      }
    }
    done = false;
    updatePixels();
  }
  if (frame==3) {
    background(255);
  }
  for (let i = 0; i < n; i++) {
    hights[i] = 0;
    ellipse(a[i], a[i + n], 2, 2);
  }
  if (!done) {
    draw2d();
  } else {
  }
  if (frame > 30) {
    noLoop();
  }
  frame++;
}

function draw2d() {
  go(depth);
}

function go(k) {
  if (k != 0) {
    let f = false;
    let j = 0;
    let max = -16000;
    for (let j1 = 0; (j1 < ((2 * n) + 1)) && !f; j1++) {
      if (i != j1) {
        let q = (j1 % 2 === 0) ? (n + 1 + np + (j1 / 2)) % n : (n + 1 + np - ((j1 + 1) / 2)) % n;
        let c = p(i, q, 0);
        if (abs(c - lmax) < eps) {
          j = q;
          f = true;
        } else if (c > max) {
          j = q;
          max = c;
        }
      }
    }
    if ((!f) || (max > lmax) || (step > 2100)) {
      lmax = max;
      if (lmax > lmax1) {
        lmax1 = lmax;
      }
      if ((lmax < eps) && (!done)) {
        done = true;
        text("DONE", 20, 40);
        text(step, 20, 60);
      }
    }
    line(a[i], a[i + n], a[j], a[j + n]);
    step++;
    if (i != j) {
      i = (p(i, j, 1));
    }
    np = i;
    i = j;
    go(k - 1);
  }
}

function p(x, y, m) {
  if (x != y) {
    let s = 0;
    let x0 = a[x];
    let y0 = a[x + n];
    let dx = abs(a[y] - a[x]);
    let dy = abs(a[y + n] - a[x + n]);
    let sx = a[x] < a[y] ? 1 : -1;
    let sy = a[x + n] < a[y + n] ? 1 : -1;
    let err = dx - dy;
    let e2;
    let f=false;
    while (f!=true) {
      if (x0 === a[y] && y0 === a[y + n]) {
        f=true;
      }
      if (m != 1) {
        s += pix[x0 + y0 * height];
      }
      if (m == 1) {
        if (pix[x0 + y0 * height] > 1) {
          pix[x0 + y0 * height] -= SIMPVAL;
        } else if (pix[x0 + y0 * height] <= 1) {
          pix[x0 + y0 * height] = -NEGVAL;
        }
      }
      e2 = 2 * err;
      if (e2 > -dy) {
        err = err - dy;
        x0 = x0 + sx;
      }
      if (e2 < dx) {
        err = err + dx;
        y0 = y0 + sy;
      }
    }
    return s;
  } else {
    return 0;
  }
}
