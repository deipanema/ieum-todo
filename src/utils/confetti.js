// confetti.js
const createConfetti = () => {
  if (typeof document === "undefined") return () => {}; // 서버 사이드 렌더링 방지

  // Constants
  const { random, cos, sin, PI } = Math;
  const PI2 = PI * 2;

  // Configuration
  const config = {
    particles: 500,
    spread: 1000,
    sizeMin: 3,
    sizeMax: 12,
    eccentricity: 30,
    deviation: 200,
    dxThetaMin: 0,
    dyMin: 0.0,
    dyMax: 2.18,
    dThetaMin: 0.4,
    dThetaMax: 0.3,
  };

  // Bright color palette
  const colors = [
    [255, 89, 149],
    [255, 159, 0],
    [255, 220, 0],
    [0, 205, 255],
    [30, 255, 140],
    [255, 150, 255],
    [147, 255, 255],
    [255, 255, 140],
    [255, 140, 255],
    [140, 255, 255],
  ];

  const getRandomColor = () => {
    const baseColor = colors[Math.floor(random() * colors.length)];
    return baseColor.map((value) => Math.max(0, Math.min(255, value + Math.floor(random() * 30) - 15)));
  };

  const color = (r, g, b) => `rgb(${r},${g},${b})`;

  // Cosine interpolation
  const interpolation = (a, b, t) => ((1 - cos(PI * t)) / 2) * (b - a) + a;

  // Create a 1D Maximal Poisson Disc over [0, 1]
  const createPoisson = () => {
    const radius = 1 / config.eccentricity;
    const radius2 = radius + radius;
    const domain = [radius, 1 - radius];
    const spline = [0, 1];
    let measure = 1 - radius2;

    while (measure) {
      let dart = measure * random();
      let interval, a, b, c, d;

      for (let i = 0; i < domain.length; i += 2) {
        a = domain[i];
        b = domain[i + 1];
        interval = b - a;
        if (dart < measure + interval) {
          spline.push((dart += a - measure));
          break;
        }
        measure += interval;
      }
      c = dart - radius;
      d = dart + radius;

      for (let i = domain.length - 1; i > 0; i -= 2) {
        const l = i - 1;
        a = domain[l];
        b = domain[i];

        if (a >= c && a < d) {
          if (b > d) domain[l] = d;
          else domain.splice(l, 2);
        } else if (a < c && b > c) {
          if (b <= d) domain[i] = c;
          else domain.splice(i, 0, c, d);
        }
      }

      measure = domain.reduce((sum, val, i) => (i % 2 ? sum + val - domain[i - 1] : sum), 0);
    }

    return spline.sort((a, b) => a - b);
  };

  // Container setup
  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "0",
    overflow: "visible",
    zIndex: "9999",
  });

  // Confetto class
  class Confetto {
    constructor() {
      this.frame = 0;
      this.opacity = 1;
      this.outer = document.createElement("div");
      this.inner = document.createElement("div");
      this.outer.appendChild(this.inner);

      const outerStyle = this.outer.style;
      const innerStyle = this.inner.style;

      const size = config.sizeMin + (config.sizeMax - config.sizeMin) * random();
      Object.assign(outerStyle, {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        perspective: "50px",
        transform: `rotate(${360 * random()}deg)`,
      });

      const [r, g, b] = getRandomColor();
      Object.assign(innerStyle, {
        width: "100%",
        height: "100%",
        backgroundColor: color(r, g, b),
        transform: `rotate3D(${cos(360 * random())},${cos(360 * random())},0,${this.theta}deg)`,
      });

      this.axis = `rotate3D(${cos(360 * random())},${cos(360 * random())},0,`;
      this.theta = 360 * random();
      this.dTheta = config.dThetaMin + config.dThetaMax * random();

      this.x = window.innerWidth * random();
      this.y = -config.deviation;
      this.dx = sin(config.dxThetaMin + config.dxThetaMin * random());
      this.dy = config.dyMin + config.dyMax * random();

      outerStyle.left = this.x + "px";
      outerStyle.top = this.y + "px";

      this.splineX = createPoisson();
      this.splineY = Array.from({ length: this.splineX.length }, () => config.deviation * random());
      this.splineY[0] = this.splineY[this.splineY.length - 1] = config.deviation * random();
    }

    update(height, delta) {
      this.frame += delta;
      this.x += this.dx * delta;
      this.y += this.dy * delta;
      this.theta += this.dTheta * delta;

      const phi = (this.frame % 7777) / 7777;
      const i = this.splineX.findIndex((x) => phi <= x) - 1;
      const j = i + 1;

      const rho = interpolation(
        this.splineY[i],
        this.splineY[j],
        (phi - this.splineX[i]) / (this.splineX[j] - this.splineX[i]),
      );

      const phiPI = phi * PI2;

      this.outer.style.left = this.x + rho * cos(phiPI) + "px";
      this.outer.style.top = this.y + rho * sin(phiPI) + "px";
      this.inner.style.transform = this.axis + this.theta + "deg)";

      if (this.frame > 5000) {
        this.opacity -= 0.01 * delta;
        this.outer.style.opacity = this.opacity;
      }

      return this.y > height + config.deviation || this.opacity <= 0;
    }
  }

  let frame = null;
  const confetti = [];

  // Cleanup function
  const cleanup = () => {
    cancelAnimationFrame(frame);
    frame = null;
    if (container.parentNode) {
      document.body.removeChild(container);
    }
    confetti.length = 0;
  };

  // Main animation function
  const poof = () => {
    document.body.appendChild(container);

    for (let i = 0; i < config.particles; i++) {
      const confetto = new Confetto();
      confetti.push(confetto);
      container.appendChild(confetto.outer);
    }

    let prev;
    const loop = (timestamp) => {
      const delta = prev ? timestamp - prev : 0;
      prev = timestamp;
      const height = window.innerHeight;

      for (let i = confetti.length - 1; i >= 0; --i) {
        if (confetti[i].update(height, delta)) {
          container.removeChild(confetti[i].outer);
          confetti.splice(i, 1);
        }
      }

      if (confetti.length) {
        frame = requestAnimationFrame(loop);
      } else {
        cleanup();
      }
    };

    frame = requestAnimationFrame(loop);
  };

  return poof;
};

export const poof = createConfetti();
