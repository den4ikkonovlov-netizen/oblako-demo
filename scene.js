import * as THREE from './assets/three.module.js';

// One isolated renderer; no layout reads or React updates in the animation loop.
const host=document.querySelector('#scene');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'default'});}catch{host.dataset.fallback='true';}
if(renderer){
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));
 renderer.setClearColor(0x000000,0);
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.22;
 renderer.shadowMap.enabled=true;
 renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 host.append(renderer.domElement);
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(38,1,.1,70);
 camera.position.set(0,2.2,15);camera.lookAt(0,.1,0);
 const world=new THREE.Group();scene.add(world);
 scene.add(new THREE.HemisphereLight(0xffffff,0xadc7d4,2.2));
 const key=new THREE.DirectionalLight(0xfff3dd,4.5);key.position.set(-4,8,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-6;key.shadow.camera.right=6;key.shadow.camera.top=7;key.shadow.camera.bottom=-6;key.shadow.normalBias=.035;scene.add(key);
 const fill=new THREE.DirectionalLight(0xb7dcff,2.8);fill.position.set(5,3,-4);scene.add(fill);
 const front=new THREE.DirectionalLight(0xffffff,1.0);front.position.set(0,1,9);scene.add(front);
 const env=new THREE.Scene();env.background=new THREE.Color(0xc4d9df);
 const panel=(color,intensity,pos,scale)=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(intensity),side:THREE.DoubleSide}));p.position.set(...pos);p.scale.set(...scale);p.lookAt(0,0,0);env.add(p);};
 panel(0xffffff,5,[-4,4,4],[4,6,1]);panel(0xffffff,3,[5,3,2],[2,5,1]);panel(0xffdfbd,2,[0,6,-3],[5,3,1]);
 const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(env,.08).texture;pmrem.dispose();
 const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.32,metalness:.04,...extra});
 const cream=mat(0xfffdf5,{roughness:.57}),white=mat(0xffffff,{roughness:.52}),peach=mat(0xf0a184),coral=mat(0xed7659),blue=mat(0x82b9cf),gold=mat(0xf6cf7e,{metalness:.4,roughness:.25});
 const geoSphere=new THREE.SphereGeometry(1,40,28);
 const ball=(parent,material,x,y,z,sx,sy= sx,sz=sx)=>{let m=new THREE.Mesh(geoSphere,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
 const cylinder=(parent,r,h,material,x,y,z)=>{let m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,80,1),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
 const tube=(parent,pts,r,material)=>{const curve=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p)));const m=new THREE.Mesh(new THREE.TubeGeometry(curve,70,r,7,false),material);parent.add(m);return m;};
 const cloud=new THREE.Group();world.add(cloud);cloud.position.set(.25,-1.65,0);
 [[-1.5,0,0,.85,.5,.6],[-.7,.1,.1,1.0,.61,.8],[.15,.15,0,1.05,.67,.82],[1.1,.06,0,.94,.58,.7],[1.65,-.1,.05,.63,.4,.5],[-.5,-.23,.6,.9,.48,.56],[.8,-.23,.6,.9,.48,.5]].forEach(v=>ball(cloud,white,...v));
 const cake=new THREE.Group();world.add(cake);cake.position.set(.25,-.55,.1);cake.rotation.y=-.22;
 cylinder(cake,1.38,.12,gold,0,-.3,0);cylinder(cake,1.27,.13,cream,0,-.2,0);cylinder(cake,1.2,1.12,peach,0,.4,0);cylinder(cake,1.21,.18,cream,0,1.04,0);
 // Icing scallops, piped cream, small sugar pearls.
 for(let i=0;i<24;i++){const a=i/24*Math.PI*2;ball(cake,cream,Math.cos(a)*1.13,.98,Math.sin(a)*1.13,.15,.21+(i%3)*.065,.15);ball(cake,cream,Math.cos(a)*1.15,-.13,Math.sin(a)*1.15,.1,.1,.1);}
 for(let i=0;i<15;i++){let a=i/15*Math.PI*2;const puff=new THREE.Group();puff.position.set(Math.cos(a)*.96,1.14,Math.sin(a)*.96);cake.add(puff);for(let j=0;j<4;j++)ball(puff,cream,Math.cos(j*1.6)*.022,.02+j*.045,Math.sin(j*1.6)*.022,.13-j*.025,.06,.13-j*.025);}
 for(let i=0;i<40;i++){const a=i*2.39996;const y=.02+(i%6)*.13;ball(cake,i%2?cream:gold,Math.cos(a)*1.205,y,Math.sin(a)*1.205,.022);}
 const flames=[];
 [[-.5,0],[.05,-.32],[.52,.06],[-.14,.48]].forEach(([x,z],i)=>{const candle=cylinder(cake,.055,.65,i%2?blue:coral,x,1.5,z);tube(cake,[[x,1.83,z],[x+.01,1.9,z]],.009,mat(0x493c34));const fire=ball(cake,new THREE.MeshBasicMaterial({color:0xffb955}),x,1.99,z,.055,.13,.055);ball(fire,new THREE.MeshBasicMaterial({color:0xfff7c7}),0,-.18,.15,.55,.63,.55);flames.push(fire);});
 function balloon(x,y,z,material,size=1){const g=new THREE.Group();world.add(g);g.position.set(x,y,z);ball(g,material,0,0,0,.67*size,.84*size,.65*size);const knot=new THREE.Mesh(new THREE.ConeGeometry(.075*size,.13*size,16),material);knot.position.y=-.86*size;g.add(knot);tube(g,[[0,-.86*size,0],[-.06,-1.4*size,.1],[.12,-2.1*size,-.05],[.02,-2.8*size,0]],.008,mat(0xa8a396));return g;}
 const balloonA=balloon(-2.05,1.7,-.8,mat(0xe8927b,{metalness:.25,roughness:.18}),1.05);balloonA.rotation.z=.14;
 const balloonB=balloon(1.72,2.75,-1.15,gold,.85);balloonB.rotation.z=-.16;
 const balloonC=balloon(2.55,.9,-.8,mat(0xb3d3dc,{metalness:.4,roughness:.22}),.74);
 const starShape=new THREE.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5+Math.PI/2;const r=i%2?.36:.76;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?starShape.lineTo(x,y):starShape.moveTo(x,y);}starShape.closePath();
 const star=new THREE.Mesh(new THREE.ExtrudeGeometry(starShape,{depth:.13,bevelEnabled:true,bevelThickness:.13,bevelSize:.16,bevelSegments:5,steps:1,curveSegments:24}),mat(0x88b5ce,{metalness:.62,roughness:.2}));star.position.set(-1.6,-.8,1.4);star.rotation.set(-.1,-.35,-.28);star.castShadow=true;world.add(star);
 const gift=new THREE.Group();world.add(gift);gift.position.set(1.65,-1.13,1.15);gift.rotation.set(.1,-.5,.13);
 const box=new THREE.Mesh(new THREE.BoxGeometry(.75,.7,.75,1,1,1),blue);gift.add(box);box.castShadow=true;const lid=new THREE.Mesh(new THREE.BoxGeometry(.81,.12,.81),mat(0xa6cbd7));lid.position.y=.36;gift.add(lid);
 const ribbon1=new THREE.Mesh(new THREE.BoxGeometry(.13,.73,.765),cream),ribbon2=new THREE.Mesh(new THREE.BoxGeometry(.765,.73,.13),cream);gift.add(ribbon1,ribbon2);
 tube(gift,[[0,.43,0],[-.33,.8,0],[-.42,.53,0],[0,.43,0],[.33,.8,0],[.42,.53,0],[0,.43,0]],.045,cream);
 const orbit=new THREE.Group();world.add(orbit);const confetti=[];for(let i=0;i<13;i++){const a=i*2.39996;const m=new THREE.Mesh(new THREE.TorusGeometry(.045+(i%3)*.013,.022,7,16,Math.PI*1.3),[coral,blue,gold][i%3]);m.position.set(Math.cos(a)*(2.3+(i%3)*.18),Math.sin(a)*2.3+.15,Math.sin(i)*1.5);m.rotation.set(i*.7,i*.3,i);orbit.add(m);confetti.push(m);}
 // A translucent contact shadow anchors the floating composition.
 const cvs=document.createElement('canvas');cvs.width=cvs.height=128;const ctx=cvs.getContext('2d');const gradient=ctx.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,'rgba(72,101,107,0.17)');gradient.addColorStop(1,'rgba(72,101,107,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);const shadow=new THREE.Mesh(new THREE.PlaneGeometry(6,2),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cvs),transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.set(.2,-2.65,.2);world.add(shadow);
 let w=0,h=0,mobile=false,baseX=0,visible=true,raf=0,last=0,elapsed=0,start=performance.now(),mx=0,my=0,tx=0,ty=0;
 const resize=()=>{const r=host.getBoundingClientRect();w=r.width;h=r.height;if(!w||!h)return;mobile=innerWidth<=760;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=mobile?13.5:14.5;camera.updateProjectionMatrix();baseX=mobile?0:1.6;world.scale.setScalar(mobile?.95:1);world.position.x=baseX;};
 new ResizeObserver(resize).observe(host);resize();
 const hero=document.querySelector('.hero');hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=hero.getBoundingClientRect();tx=(e.clientX-r.left)/r.width*2-1;ty=(e.clientY-r.top)/r.height*2-1;},{passive:true});hero.addEventListener('pointerleave',()=>{tx=ty=0;});
 const easeOut=t=>1-Math.pow(1-t,4);
 function frame(now){raf=0;if(!visible||document.hidden)return;const dt=Math.min((now-last)/1000||.016,.04);last=now;elapsed+=dt;const intro=reduced.matches?1:easeOut(Math.min(1,(now-start)/1900));mx+=(tx-mx)*(1-Math.exp(-dt*2.4));my+=(ty-my)*(1-Math.exp(-dt*2.4));const time=reduced.matches?0:elapsed;
  world.position.x=baseX+mx*.13;world.position.y=(1-intro)*-.65;world.rotation.y=mx*.09;world.rotation.x=-my*.035;world.rotation.z=(1-intro)*-.065;
  cake.position.y=-.55+Math.sin(time*.7)*.075;cloud.position.y=-1.65+Math.sin(time*.7)*.075;
  balloonA.position.y=1.7+Math.sin(time*.52)*.13;balloonA.rotation.z=.14+Math.sin(time*.4)*.035;balloonB.position.y=2.75+Math.sin(time*.45+1)*.15;balloonC.position.y=.9+Math.sin(time*.56+2)*.1;
  star.rotation.y=-.35+Math.sin(time*.42)*.16;star.position.y=-.8+Math.sin(time*.6+1)*.1;gift.position.y=-1.13+Math.sin(time*.6+2)*.07;orbit.rotation.z=Math.sin(time*.2)*.025;flames.forEach((f,i)=>f.scale.y=.13*(1+Math.sin(time*3+i)*.09));
  renderer.render(scene,camera);if(!reduced.matches)raf=requestAnimationFrame(frame);
 }
 const run=()=>{last=performance.now();if(!raf)raf=requestAnimationFrame(frame);};
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)run();else if(raf){cancelAnimationFrame(raf);raf=0;}},{rootMargin:'120px'}).observe(hero);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)run();else if(raf){cancelAnimationFrame(raf);raf=0;}});reduced.addEventListener('change',run);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();document.documentElement.classList.remove('webgl-ready');if(raf)cancelAnimationFrame(raf);});
 document.documentElement.classList.add('webgl-ready');run();
}
