const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(require('node:path').resolve(__dirname, '../../site.js'), 'utf8');
class Element {
  constructor() { this.handlers = {}; this.attributes = {}; this.dataset = {}; this.textContent = ''; this.classes = new Set(); this.classList = { toggle:(key,on)=>on ? this.classes.add(key):this.classes.delete(key), remove:key=>this.classes.delete(key), add:key=>this.classes.add(key) }; }
  addEventListener(name, cb) { this.handlers[name] = cb; }
  setAttribute(key,value) { this.attributes[key]=value; }
  click() { this.handlers.click?.({preventDefault(){}}); }
  focus() { this.focused=true; }
}
function boot(reduced=false, fine=false) {
  const root=new Element(), motion=new Element(), image=new Element(), caption=new Element(), trigger=new Element(), group=new Element(), close=new Element(), zoom=new Element(), zoomImage=new Element(), zoomCaption=new Element();
  const buttons=['one.webp','two.webp','three.webp'].map((path,i)=>{const b=new Element();b.dataset={screen:path,alt:'Screen '+i};b.textContent='View '+i;return b;});
  image.src='initial.webp';
  group.hidden=true;
  const gallery={ querySelector:q=>({'[data-gallery-image]':image,'.demo-caption':caption,'[data-zoom]':trigger}[q]),querySelectorAll:q=>q==='[data-screen]'?buttons:q==='[role="group"]'?[group]:[] };
  zoom.querySelector=q=>({'img':zoomImage,'.zoom-caption':zoomCaption,'[data-zoom-close]':close}[q]);
  zoom.showModal=()=>{zoom.open=true;};
  zoom.close=()=>{zoom.open=false;zoom.handlers.close();};
  const preference={matches:reduced,addEventListener(name,cb){this.change=cb;}};
  const requests=[];
  class Image { constructor(){requests.push(this);} }
  const document=new Element();
  const pending=new Element();pending.classes.add('reveal-pending');
  const stage=new Element();stage.properties={};stage.style={setProperty(key,value){stage.properties[key]=value;}};
  stage.box={left:0,top:0,width:340,height:420};stage.getBoundingClientRect=()=>stage.box;
  document.documentElement=root;
  document.querySelector=q=>({'.motion-control':motion,'.showcase-lightbox':zoom,'.orbital-stage':stage}[q]||null);
  document.querySelectorAll=q=>q==='[data-screen-gallery]'?[gallery]:q==='.reveal-pending'?[pending]:[];
  const window=new Element();
  window.matchMedia=q=>q.includes('prefers-reduced-motion')?preference:{matches:fine};
  window.frames=[];window.cancelled=[];
  window.requestAnimationFrame=callback=>{window.frames.push(callback);return window.frames.length;};
  window.cancelAnimationFrame=id=>window.cancelled.push(id);
  vm.runInNewContext(source,{window,document,Image});
  return {root,motion,image,caption,trigger,group,close,zoom,zoomImage,buttons,requests,preference,document,window,pending,stage};
}
const t=boot();
assert.equal(t.group.hidden,false);
t.buttons[1].click();t.requests[0].onload();
assert.equal(t.image.src,'two.webp');assert.equal(t.image.alt,'Screen 1');
assert.equal(t.buttons[1].attributes['aria-pressed'],'true');assert.equal(t.buttons[0].attributes['aria-pressed'],'false');
assert.equal(t.trigger.attributes.href,'two.webp');
t.trigger.click();assert.equal(t.zoom.open,true);assert.equal(t.zoomImage.src,'two.webp');
t.close.click();assert.equal(t.zoom.open,false);assert.equal(t.trigger.focused,true);
t.buttons[0].click();t.buttons[2].click();t.requests[2].onload();t.requests[1].onload();assert.equal(t.image.src,'three.webp');
t.buttons[0].click();t.requests[3].onerror();assert.equal(t.image.src,'three.webp');assert.match(t.caption.textContent,/pas pu être chargé/);
t.motion.click();assert(t.root.classes.has('motion-paused'));assert.equal(t.motion.attributes['aria-pressed'],'true');
t.motion.click();assert(!t.root.classes.has('motion-paused'));
t.preference.matches=true;t.preference.change();assert(t.root.classes.has('motion-paused'));assert.equal(t.motion.hidden,true);
t.document.hidden=true;t.document.handlers.visibilitychange();assert(t.root.classes.has('document-hidden'));
const reduced=boot(true);assert(reduced.root.classes.has('motion-paused'));assert.equal(reduced.motion.hidden,true);
console.log('Interaction checks passed: gallery selection, stale requests, load errors, zoom, focus return, pause/resume, reduced motion and hidden document.');
// Retour depuis le cache de navigation : ne pas rester en pause ou invisible.
t.document.hidden=false;t.root.classes.add('document-hidden');t.window.handlers.pageshow({persisted:true});
assert(!t.root.classes.has('document-hidden'));assert(!t.pending.classes.has('reveal-pending'));
assert.equal(t.stage.properties['--tilt-x'],'0deg');
// Un appui tactile ne doit pas activer l’inclinaison sur un appareil hybride.
const hybrid=boot(false,true);
hybrid.stage.handlers.pointermove({pointerType:'touch',clientX:100,clientY:100});assert.equal(hybrid.window.frames.length,0);
hybrid.stage.handlers.pointermove({pointerType:'mouse',clientX:100,clientY:100});assert.equal(hybrid.window.frames.length,1);
hybrid.document.hidden=true;hybrid.window.frames[0]();assert.equal(hybrid.stage.properties['--tilt-x'],undefined);
hybrid.document.hidden=false;
hybrid.stage.handlers.pointermove({pointerType:'mouse',clientX:100,clientY:100});
hybrid.stage.box.width=0;hybrid.window.frames[1]();assert.equal(hybrid.stage.properties['--tilt-x'],undefined);
hybrid.stage.box.width=340;
hybrid.stage.handlers.pointermove({pointerType:'mouse',clientX:100,clientY:100});
hybrid.window.handlers.pageshow({persisted:true});assert(hybrid.window.cancelled.includes(3));
assert.equal(hybrid.stage.properties['--tilt-y'],'0deg');
console.log('Lifecycle checks passed: restored page, touch on hybrid device, background frame, zero-size frame and stale-frame cancellation.');
