(function(){
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0;
  let stars = [];
  let STAR_COUNT = Math.min(320, Math.round(window.innerWidth * 0.18));
  const mouse = {x: window.innerWidth/2, y: window.innerHeight/2};

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    STAR_COUNT = Math.min(320, Math.round(window.innerWidth * 0.18));
    createStars();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e)=>{ mouse.x = e.clientX; mouse.y = e.clientY; });

  function createStars(){
    stars = [];
    for(let i=0;i<STAR_COUNT;i++){
      stars.push({
        x: Math.random()*w,
        y: Math.random()*h,
        z: Math.random(),
        r: Math.random()*1.6 + 0.2,
        vx: (Math.random()-0.5)*0.12,
        vy: (Math.random()-0.5)*0.12,
        tw: Math.random()*Math.PI*2
      });
    }
  }

  function loop(){
    ctx.clearRect(0,0,w,h);
    for(const s of stars){
      const dx = (mouse.x - w/2) / w;
      const dy = (mouse.y - h/2) / h;
      const px = s.x + dx * 40 * (s.z + 0.2);
      const py = s.y + dy * 40 * (s.z + 0.2);

      s.tw += 0.04 + s.z*0.02;
      const alpha = 0.55 + Math.sin(s.tw) * 0.45 * (0.6 + s.z*0.4);

      const grad = ctx.createRadialGradient(px, py, 0, px, py, s.r*8);
      grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
      grad.addColorStop(0.35, `rgba(200,220,255,${alpha*0.45})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.fillRect(px - s.r*8, py - s.r*8, s.r*16, s.r*16);

      s.x += s.vx * (1 + s.z*1.6);
      s.y += s.vy * (1 + s.z*1.6);
      if(s.x < -10) s.x = w + 10;
      if(s.x > w + 10) s.x = -10;
      if(s.y < -10) s.y = h + 10;
      if(s.y > h + 10) s.y = -10;
    }
    requestAnimationFrame(loop);
  }

  // initialize
  resize();
  createStars();
  loop();

  // create small rocket element and append
  const ship = document.createElement('div');
  ship.id = 'ship';
  ship.setAttribute('aria-hidden','true');
  ship.innerHTML = `
    <div class="saucer" aria-hidden="true">
      <svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Soucoupe volante" focusable="false">
        <g>
          <!-- saucer body -->
          <ellipse cx="60" cy="34" rx="44" ry="14" fill="#cfcfcf" stroke="#9a9a9a" stroke-width="1" />
          <ellipse cx="60" cy="26" rx="30" ry="8" fill="#e8e8e8" stroke="#bdbdbd" stroke-width="0.8" />
          <!-- dome -->
          <ellipse cx="60" cy="18" rx="12" ry="6" fill="#f5f7fb" stroke="#cfd8e3" />
          <!-- windows -->
          <circle cx="42" cy="30" r="2.6" fill="#153e75" opacity="0.9" />
          <circle cx="60" cy="29" r="2.6" fill="#153e75" opacity="0.9" />
          <circle cx="78" cy="30" r="2.6" fill="#153e75" opacity="0.9" />
        </g>
      </svg>
      <div class="saucer-glow" aria-hidden="true"></div>
    </div>`;
  document.body.appendChild(ship);

  // flight randomizer
  function randomizeShip(){
    const dur = 10 + Math.random()*12; // 10-22s
    const top = 6 + Math.random()*60; // percent
    ship.style.setProperty('--flight-top', top + '%');
    ship.style.setProperty('--flight-dur', dur + 's');
    ship.classList.remove('fly');
    void ship.offsetWidth;
    ship.classList.add('fly');
  }

  setInterval(randomizeShip, 14000);
  randomizeShip();

})();
