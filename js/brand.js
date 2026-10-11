(function(){
  var d=document, root=d.documentElement;
  root.classList.add('js');
  /* scroll reveal */
  var els=d.querySelectorAll('.reveal,.blk,.title');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.05});
    els.forEach(function(e){io.observe(e)});
  } else { els.forEach(function(e){e.classList.add('in')}); }
  /* copy hex */
  var t=d.getElementById('toast'),h;
  d.addEventListener('click',function(e){
    var b=e.target.closest('[data-hex]');if(!b)return;var v=b.getAttribute('data-hex');
    function done(){if(!t)return;t.textContent='Copied '+v;t.classList.add('show');clearTimeout(h);h=setTimeout(function(){t.classList.remove('show')},1600)}
    if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(v).then(done,function(){})}
    else{var a=d.createElement('textarea');a.value=v;d.body.appendChild(a);a.select();try{d.execCommand('copy');done()}catch(x){}d.body.removeChild(a)}
  });
  /* close menu on link / Escape */
  var m=d.querySelector('.menu');
  if(m){d.addEventListener('keydown',function(e){if(e.key==='Escape')m.removeAttribute('open')});m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){m.removeAttribute('open')})})}

  /* seeds spill out in every direction, rotating and flipping. On the landing they leave the two i-dots of the logo. */
  var SEED='M346.38 -49.28L345.57 -48.75L344.91 -47.95L344.31 -46.76L343.80 -45.26L343.24 -43.06L342.73 -40.44L341.77 -33.68L341.37 -28.48L341.38 -23.84L341.58 -21.62L341.84 -19.98L342.32 -17.98L342.83 -16.52L343.45 -15.20L344.16 -14.03L345.01 -12.95L345.68 -12.27L346.73 -11.41L347.86 -10.73L348.75 -10.31L350.05 -9.86L352.55 -9.43L354.08 -9.37L355.71 -9.47L358.53 -9.96L360.22 -10.43L361.89 -11.04L363.53 -11.77L365.11 -12.62L366.61 -13.57L368.02 -14.61L369.30 -15.74L370.46 -16.94L371.47 -18.20L372.29 -19.48L372.97 -20.83L373.34 -21.80L373.70 -23.16L373.89 -24.57L373.92 -25.57L373.79 -27.00L373.49 -28.42L373.02 -29.84L372.38 -31.23L371.32 -33.03L370.34 -34.40L368.89 -36.11L365.94 -38.99L364.12 -40.52L361.78 -42.30L359.43 -43.93L356.72 -45.66L354.20 -47.11L351.94 -48.25L350.00 -49.04L348.62 -49.42L347.38 -49.51Z';
  var calm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function spawn(){
    d.querySelectorAll('.seedfield').forEach(function(f){
      f.innerHTML='';
      var n=parseInt(f.getAttribute('data-n'),10)||12, NS='http://www.w3.org/2000/svg';
      var fr=f.getBoundingClientRect(); if(!fr.width||!fr.height) return;
      var logo=f.parentNode.querySelector('.build'), origins=null;
      if(logo){
        var lr=logo.getBoundingClientRect();           /* the two i-dots: 49.6% and 94.9% of the wordmark width, 22% down */
        var oy=lr.top-fr.top+lr.height*0.22;
        origins=[lr.left-fr.left+lr.width*0.496, lr.left-fr.left+lr.width*0.949].map(function(x){return {x:x,y:oy}});
      }
      var small=fr.width<600;
      /* even coverage: one jittered target per cell of a grid over the section, shuffled; each seed flies from an i-dot to its cell */
      var cols=Math.max(2,Math.round(Math.sqrt(n*fr.width/fr.height))), rows=Math.ceil(n/cols), cells=[];
      for(var r=0;r<rows;r++) for(var c=0;c<cols;c++) cells.push([c,r]);
      for(var k=cells.length-1;k>0;k--){var m=Math.floor(Math.random()*(k+1)),t=cells[k];cells[k]=cells[m];cells[m]=t;}
      var cw=fr.width/cols, ch=fr.height/rows;
      for(var i=0;i<n;i++){
        var cell=cells[i%cells.length];
        var tx=(cell[0]+0.15+Math.random()*0.7)*cw, ty=(cell[1]+0.15+Math.random()*0.7)*ch;
        var o=origins?origins[i%2]:{x:fr.width/2,y:fr.height/2};
        var el=d.createElementNS(NS,'svg');
        el.setAttribute('viewBox','341 -50 33 41'); el.setAttribute('class','sd');
        var p=d.createElementNS(NS,'path'); p.setAttribute('d',SEED); el.appendChild(p);
        var size=(small?11:14)+Math.random()*(small?8:10), dur=16+Math.random()*12;   /* small, constant size: always reads as a seed */
        el.style.cssText='width:'+size.toFixed(1)+'px;height:'+(size*1.24).toFixed(1)+'px;'+
          'left:'+o.x.toFixed(1)+'px;top:'+o.y.toFixed(1)+'px;'+
          '--dx:'+(tx-o.x).toFixed(0)+'px;--dy:'+(ty-o.y).toFixed(0)+'px;'+
          '--rot:'+Math.round((Math.random()<.5?-1:1)*(120+Math.random()*420))+'deg;'+
          'animation-duration:'+dur.toFixed(1)+'s;animation-delay:-'+(Math.random()*dur).toFixed(1)+'s';
        f.appendChild(el);
      }
    });
  }
  if(!calm){
    root.classList.add('seeds-live');
    spawn(); window.addEventListener('load',spawn); if(document.fonts&&document.fonts.ready) document.fonts.ready.then(spawn);
    var rt; window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(spawn,250)});
  }

  /* sections: native scrolling with CSS snap. JS only restores the section on refresh and keeps the URL in step. */
  (function(){
    var secs=[].slice.call(d.querySelectorAll('.landing,.slide')), BAR=68;
    if(!secs.length) return;
    function top(s){ return s.classList.contains('slide') ? s.offsetTop-BAR : s.offsetTop; }
    function nearest(){ var y=window.scrollY,b=secs[0],bd=1e9; secs.forEach(function(s){var dd=Math.abs(top(s)-y); if(dd<bd){bd=dd;b=s}}); return b; }
    try{ if('scrollRestoration' in history) history.scrollRestoration='manual'; }catch(e){}
    function place(){
      var id=(location.hash||'').slice(1), t=id&&d.getElementById(id);
      var target=(t&&t.classList&&(t.classList.contains('slide')||t.classList.contains('landing')))?t:secs[0];
      var p=root.style.scrollBehavior; root.style.scrollBehavior='auto'; window.scrollTo(0,top(target)); root.style.scrollBehavior=p;
    }
    place();
    window.addEventListener('load',place);
    window.addEventListener('pageshow',function(e){ if(e.persisted) place(); });
    var urlT;
    window.addEventListener('scroll',function(){
      clearTimeout(urlT);
      urlT=setTimeout(function(){
        var s=nearest(); if(Math.abs(top(s)-window.scrollY)>4) return;
        var h=s.classList.contains('landing')?location.pathname+location.search:'#'+s.id;
        try{ history.replaceState(null,'',h); }catch(e){}
      },260);
    },{passive:true});
  })();

  /* only seed fields that are on screen are animated */
  if('IntersectionObserver' in window){
    d.querySelectorAll('.seedfield').forEach(function(f){
      new IntersectionObserver(function(es){es.forEach(function(e){f.classList.toggle('idle',!e.isIntersecting)})},{rootMargin:'100px 0px'}).observe(f.parentNode);
    });
  }
})();
