var k;
var p;
var a_slider;
var r_slider;
var atxt,ain;
var rtxt,rin;

var header;

var b_OE, b_HP, b_HM, b_IE, b_half; 

// nice values
// spin 0.999 radius 2.657

function setup() {
  // put setup code here
  createCanvas(windowWidth,windowHeight,WEBGL);
  perspective();
  
  let M = 1;
  let scale = 100;
  let a = 0.999;
  let r = 2.657;
  k = new Kerr(M,a,40,40, scale);

  p = new photon(r,1,0
    ,0.01
    ,a,scale);



  // controls
    a_slider = createSlider(0.0,0.999,a,0.001);
    a_slider.position(50,15);

    r_slider = createSlider(1.1,6,r,0.001);
    r_slider.position(50,40);

    ain = createInput(a,'number');
    ain.position(200,15);ain.size(50,15)
    ain.value(a);
    ain.input(ain_event);
    // hack
    ain.k = k;
    ain.p = p;
    ain.a_slider = a_slider;

    rin = createInput(r,'number');
    rin.position(200,40);rin.size(50,15);
    rin.value(r);
    rin.input(rin_event);
    // hack
    rin.p = p;
    rin.r_slider = r_slider;

    atxt = createP('spin');
    atxt.position(10,0);
    atxt.style('color:white');

    rtxt = createP('radius');
    rtxt.position(10,30);
    rtxt.style('color:white');

    header = createP('Spinning Black Hole, bounded photon orbits.');
    header.position(10,60);
    header.style('color:white');

    b_OE = createCheckbox('Outer ergosphere',true);
    b_OE.position(260,15);b_OE.style('color:white');

    b_IE = createCheckbox('Inner ergosphere',true);
    b_IE.position(260,40);b_IE.style('color:white');

    b_HM = createCheckbox('Inner horizon',true);
    b_HM.position(390,40);b_HM.style('color:white');

    b_HP = createCheckbox('Outer horizon',true);
    b_HP.position(390,15);b_HP.style('color:white');

    b_half = createCheckbox('draw half surfaces',true);
    b_half.position(500,15);b_half.style('color:white');
  }

function draw() {
  // put drawing code here
  background('#333333')
  orbitControl();

  if(a_slider.value() != k.spin){
    k.change_spin(a_slider.value());
    p.change_spin(a_slider.value());
    ain.value(a_slider.value());
  }
  if(r_slider.value() != p.r){
    p.change_r(r_slider.value());
    rin.value(r_slider.value());
  }
  
  let half = b_half.checked();
  stroke('rgba(0,0,0,0.5)');
  if(b_OE.checked()) k.draw_OE(color(0,50,123,40),half);
  if(b_HP.checked()) k.draw_HP(color(0,50,123,40),half);
  if(b_HM.checked()) k.draw_HM(color(0,50,123,40),half);
  if(b_IE.checked()) k.draw_IE(color(0,50,150,50),half);
  for(let i = 0; i < 20; i++)
    p.update();
  p.draw();
}

function ain_event(){
  if(this.value()<0){
    this.value(0);
    return;
  }
  if(this.value()>0.999){
    this.value(0.999);
    return;
  }
  this.k.change_spin(this.value());
  this.p.change_spin(this.value());
  this.a_slider.value(this.value());
}

function rin_event(){
  if(this.value()<1.1){
    this.value(1.1);
    return;
  }
  if(this.value()>6){
    this.value(6);
    return;
  }
  this.p.change_r(this.value());
  this.r_slider.value(this.value());
}