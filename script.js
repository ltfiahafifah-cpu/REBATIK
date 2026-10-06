const $=id=>document.getElementById(id);
const c=$("canvas"),x=c.getContext("2d");

let motif="Kawung";
let pattern="Cross";

function ready(){
  $("status").textContent="● READY";
}

/* PILIH MOTIF */
document.querySelectorAll(".motif").forEach(b=>{
  b.onclick=()=>{
    document.querySelectorAll(".motif")
      .forEach(v=>v.classList.remove("active"));

    b.classList.add("active");
    motif=b.dataset.m;

    $("title").textContent=motif+" Pattern";
    $("sm").textContent=motif;
    ready();
  };
});

/* PILIH POLA */
document.querySelectorAll(".pattern").forEach(b=>{
  b.onclick=()=>{
    document.querySelectorAll(".pattern")
      .forEach(v=>v.classList.remove("active"));

    b.classList.add("active");
    pattern=b.dataset.p;

    $("sp").textContent=pattern;
    ready();
  };
});

/* SLIDER */
$("level").oninput=()=>{
  $("levelVal").textContent=$("level").value;
  $("sl").textContent=$("level").value;
  ready();
};

$("size").oninput=()=>{
  $("sizeVal").textContent=$("size").value;
  ready();
};

$("gap").oninput=()=>{
  $("gapVal").textContent=$("gap").value;
  ready();
};

$("color").oninput=ready;
$("bg").oninput=ready;


/* MOTIF */
function shape(px,py,s,m,col){

  x.strokeStyle=col;
  x.fillStyle=col;
  x.lineWidth=2;

  if(m=="Kawung"){
    for(let a=0;a<4;a++){
      x.save();
      x.translate(px,py);
      x.rotate(a*Math.PI/2);

      x.beginPath();
      x.ellipse(0,-s*.32,s*.18,s*.38,0,0,Math.PI*2);
      x.stroke();

      x.restore();
    }
  }

  if(m=="Truntum"){
    x.beginPath();
    x.arc(px,py,s*.13,0,Math.PI*2);
    x.fill();

    for(let a=0;a<8;a++){
      let q=a*Math.PI/4;

      x.beginPath();
      x.arc(
        px+Math.cos(q)*s*.38,
        py+Math.sin(q)*s*.38,
        s*.07,0,Math.PI*2
      );
      x.fill();
    }
  }

  if(m=="Ceplok"){
    x.beginPath();
    x.rect(px-s*.32,py-s*.32,s*.64,s*.64);
    x.stroke();

    x.beginPath();
    x.arc(px,py,s*.16,0,Math.PI*2);
    x.stroke();
  }

  if(m=="Bunga"){
    for(let a=0;a<6;a++){
      let q=a*Math.PI/3;

      x.beginPath();
      x.arc(
        px+Math.cos(q)*s*.24,
        py+Math.sin(q)*s*.24,
        s*.17,0,Math.PI*2
      );
      x.stroke();
    }

    x.beginPath();
    x.arc(px,py,s*.1,0,Math.PI*2);
    x.fill();
  }

  if(m=="Lereng"){
    x.beginPath();

    x.moveTo(px-s*.5,py+s*.5);
    x.lineTo(px+s*.5,py-s*.5);

    x.moveTo(px-s*.25,py+s*.5);
    x.lineTo(px+s*.5,py-s*.25);

    x.stroke();
  }
}


/* REKURSI */
function rec(px,py,s,l,m,col){

  shape(px,py,s,m,col);

  if(l<=0)return;

  let d=s*+$("gap").value;
  let n=s*.45;

  rec(px+d,py,n,l-1,m,col);
  rec(px-d,py,n,l-1,m,col);
  rec(px,py+d,n,l-1,m,col);
  rec(px,py-d,n,l-1,m,col);
}


/* MOTIF TAMBAHAN */
function extra(){

  return [...document.querySelectorAll(".extra input:checked")]
    .map(e=>({
      m:e.value,
      c:e.parentElement.querySelector("[type=color]").value
    }));
}


/* GENERATE */
function draw(){

  x.fillStyle=$("bg").value;
  x.fillRect(0,0,c.width,c.height);

  let s=+$("size").value;
  let l=+$("level").value;
  let main=$("color").value;
  let ex=extra();

  function get(i){
    if(ex.length)return ex[i%ex.length];
    return {m:motif,c:main};
  }


  /* CROSS */
  if(pattern=="Cross"){

    let pos=[
      [.5,.5],
      [.25,.5],
      [.75,.5],
      [.5,.25],
      [.5,.75]
    ];

    pos.forEach((p,i)=>{
      let e=i?get(i-1):{m:motif,c:main};

      rec(
        c.width*p[0],
        c.height*p[1],
        s*.8,l,e.m,e.c
      );
    });
  }


  /* GRID */
  if(pattern=="Grid"){

    let d=s*1.5;
    let i=0;

    for(let y=d/2;y<c.height+d;y+=d){

      for(let xx=d/2;xx<c.width+d;xx+=d){

        let e=get(i++);

        rec(xx,y,s*.55,l,e.m,e.c);
      }
    }
  }


  /* DIAMOND */
  if(pattern=="Diamond"){

    let d=s*1.5;
    let i=0;

    for(let r=-1;r<10;r++){

      for(let col=-1;col<12;col++){

        let e=get(i++);
        let xx=col*d+(r%2)*d/2;

        rec(xx,r*d,s*.55,l,e.m,e.c);
      }
    }
  }


  /* RADIAL */
  if(pattern=="Radial"){

    let cx=c.width/2;
    let cy=c.height/2;
    let i=0;

    for(let r=0;r<=360;r+=90){

      let n=r==0?1:Math.max(8,r/90*8);

      for(let a=0;a<n;a++){

        let q=a*Math.PI*2/n;
        let e=get(i++);

        rec(
          cx+Math.cos(q)*r,
          cy+Math.sin(q)*r,
          r==0?s*.7:s*.5,
          l,e.m,e.c
        );
      }
    }
  }


  /* HEXAGON */
  if(pattern=="Hexagon"){

    let dx=s*1.5;
    let dy=s*1.3;
    let i=0;

    for(let row=-1;row<12;row++){

      for(let col=-1;col<14;col++){

        let e=get(i++);

        let xx=col*dx+
          (row%2)*dx/2;

        rec(
          xx,
          row*dy,
          s*.48,
          l,e.m,e.c
        );
      }
    }
  }

  $("status").textContent="● GENERATED";
}


/* TOMBOL GENERATE */
$("generate").onclick=draw;


/* RANDOMIZE */
$("random").onclick=()=>{

  let m=[
    "Kawung",
    "Truntum",
    "Ceplok",
    "Bunga",
    "Lereng"
  ];

  let p=[
    "Cross",
    "Grid",
    "Diamond",
    "Radial",
    "Hexagon"
  ];

  motif=m[Math.floor(Math.random()*m.length)];
  pattern=p[Math.floor(Math.random()*p.length)];

  document.querySelectorAll(".motif").forEach(b=>{
    b.classList.toggle("active",b.dataset.m==motif);
  });

  document.querySelectorAll(".pattern").forEach(b=>{
    b.classList.toggle("active",b.dataset.p==pattern);
  });

  $("title").textContent=motif+" Pattern";
  $("sm").textContent=motif;
  $("sp").textContent=pattern;

  draw();
};


/* DOWNLOAD */
$("download").onclick=()=>{

  let a=document.createElement("a");

  a.download="rebatik-pattern.png";
  a.href=c.toDataURL();

  a.click();
};


/* RESET */
$("reset").onclick=()=>{

  x.clearRect(0,0,c.width,c.height);

  $("status").textContent="● EMPTY";
};