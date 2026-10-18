// Typing effect in the hero code window
(function(){
  var lines=[
    ['<span class="k">const</span> developer = {',''],
    ['  name: <span class="s">"Alex Rivera"</span>,',''],
    ['  role: <span class="s">"Front-end Developer"</span>,',''],
    ['  stack: [<span class="s">"HTML"</span>, <span class="s">"CSS"</span>, <span class="s">"JavaScript"</span>],',''],
    ['  available: <span class="k">true</span>,',''],
    ['  <span class="k">hire</span>() { <span class="k">return</span> <span class="s">"Let’s talk!"</span>; }',''],
    ['};','']
  ];
  var el=document.getElementById('typed');
  var html=lines.map(function(l){return l[0]}).join('\n');
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){el.innerHTML=html;return;}
  var i=0,out='',inTag=false;
  function step(){
    var ch=html[i++];
    if(ch==='<')inTag=true;
    out+=ch;
    if(ch==='>')inTag=false;
    if(inTag){return step();}
    el.innerHTML=out+'<span class="caret"></span>';
    if(i<html.length)setTimeout(step,ch==='\n'?220:28);
  }
  step();
})();

// Project filters
document.querySelectorAll('.filters button').forEach(function(b){
  b.addEventListener('click',function(){
    document.querySelectorAll('.filters button').forEach(function(x){x.setAttribute('aria-pressed','false')});
    b.setAttribute('aria-pressed','true');
    var f=b.dataset.f;
    document.querySelectorAll('.proj').forEach(function(p){
      p.hidden=!(f==='all'||p.dataset.t.split(' ').indexOf(f)>-1);
    });
  });
});

// Skill bars animate when scrolled into view
var bars=document.querySelectorAll('.bar-t div');
function fill(){bars.forEach(function(d){d.style.width=d.dataset.w+'%'})}
if('IntersectionObserver' in window){
  new IntersectionObserver(function(e,o){if(e[0].isIntersecting){fill();o.disconnect();}},{threshold:.3}).observe(document.getElementById('skills'));
}else{fill();}

// Theme toggle
document.getElementById('theme').addEventListener('click',function(){
  var r=document.documentElement;
  var dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;
  r.dataset.theme=dark?'light':'dark';
});


// Pick a folder from your computer and list its files (Chrome / Edge, local use only)
(function () {
  var pick = document.getElementById('pick');
  var list = document.getElementById('list');
  var note = document.getElementById('picknote');
  if (!pick) return;
  if (!window.showDirectoryPicker) {
    pick.disabled = true;
    note.textContent = 'Folder picking works in Chrome and Edge on a computer.';
    return;
  }
  pick.addEventListener('click', async function () {
    try {
      var dir = await window.showDirectoryPicker();
      list.innerHTML = '';
      for await (var entry of dir.values()) {
        if (entry.kind !== 'file') continue;
        var file = await entry.getFile();
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = file.name;
        li.appendChild(a);
        list.appendChild(li);
      }
      note.textContent = list.children.length ? '' : 'That folder has no files.';
    } catch (e) {
      note.textContent = 'No folder was chosen.';
    }
  });
})();