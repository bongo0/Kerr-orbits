
class photon{
    constructor(r, theta, phi, dl, a, scale){
      // In Boyer-Lindquist coords
      this.state = [theta,phi];
      
      // constants of motion
      this.r = r; // orbit radius, photon orbits have const radius
      this.r2 = r*r;
      this.Q;   // carter constant
      this.Lz;  // orbital angular momentum
      this.Lz2;
      this.u02; // some costant mess
      this.u12; // some other constant mess
      
      this.dl = dl; // affine parameter step for integrator

      // black hole parameters
      this.a = a; // spin of the black hole
      this.a2 = a*a;

      this.scale=scale; // for drawing
      
      // init params
      this.init();

      //change of vars
      let t = this.state[0];
      this.state[0] = Math.asin(cos(t)/sqrt(this.u02));
      
      this.path = [];
    }

    to_kerr_schild(){
        // from Boyer-Lindquist to Kerr-Schild coords

        // undo change of variables
        let cos_theta = sqrt(this.u02)*sin(this.state[0]);
        let theta = Math.acos(cos_theta);

        let tmp = sqrt(this.r2+this.a2);
        let x = tmp*sin(theta)*cos(this.state[1]);
        let y = tmp*sin(theta)*sin(this.state[1]);
        let z = this.r*cos_theta;

        return [x,y,z];
    }

    update(){
      this.record();
      this.state = this.rk4(this.state, this.dl);
      //console.log(this.state);
    }

    init(){
        let r = this.r;
        this.Lz = - (r*r*r - 3*r*r + this.a2*r+this.a2)/(this.a*(r-1));
        this.Lz2 = this.Lz*this.Lz;
        this.Q = -r*r*r*(r*r*r-6*r*r+9*r-4*this.a2)/(this.a2*(r-1)*(r-1));
        
        this.calc_u();

        this.state[0] = 1; 
        this.state[1] = 0;

        let t = this.state[0];
        this.state[0] = Math.asin(cos(t)/sqrt(this.u02));
      
    }

    // equations of motion for the photon
    photonEOM(x){
        //  0     1   
        //  theta phi 
          let rt = [0,0];
    
          let sX = sin(x[0]);
          let cTheta = sqrt(this.u02)*sin(x[0]);
          let theta = Math.acos(cTheta);
          let sTheta = sin(theta);
          
          let S = this.a2*cTheta*cTheta + this.r2;
          let D = this.a2 + this.r2 - 2*this.r;
          let P = this.r2+this.a2-this.a*this.Lz;

          rt[0] = this.a/(this.r2 + this.a2*this.u02*sX*sX)*(sqrt(this.u02*sX*sX-this.u12));
          rt[1] = (-(this.a - this.Lz/(sTheta*sTheta)) + this.a*P/D)/S;
    
          return rt;
    }

    // Runge-Kutta4 integrator
    rk4(x, dl){
        let k1 = this.photonEOM(x);
  
        let k2 = [x[0]+0.5*dl*k1[0],
                  x[1]+0.5*dl*k1[1]
                  ];
            k2 = this.photonEOM(k2);
      
        let k3 = [x[0]+0.5*dl*k2[0],
                  x[1]+0.5*dl*k2[1]
                  ];
            k3 = this.photonEOM(k3);
  
        let k4 = [x[0]+dl*k3[0],
                  x[1]+dl*k3[1]
                  ];
            k4 = this.photonEOM(k4);
        return [
          x[0]+dl/6.0*(k1[0] + 2*k2[0] + 2*k3[0] + k4[0]),
          x[1]+dl/6.0*(k1[1] + 2*k2[1] + 2*k3[1] + k4[1])
        ];
      }


    calc_u(){
        let tmp = (this.a2 - this.Q - this.Lz2);
        let tmp2 = 1/(2*this.a2);
        let tmp3 = sqrt(tmp*tmp + 4*this.a2*this.Q);
        this.u02 = tmp2*( tmp + tmp3 );
    
        this.u12 = tmp2*( tmp - tmp3 );
    }

    change_spin(a){
        this.a = a;
        this.a2 = a*a;
        this.init();
        this.path=[];
    }

    change_r(r){
        this.r = r;
        this.r2 = r*r;
        this.init();
        this.path=[];
    }

    draw(){
      let xyz = this.to_kerr_schild();
      strokeWeight(5);
      stroke(color(255,0,0,255));
      point(xyz[0]*this.scale,xyz[1]*this.scale,xyz[2]*this.scale);
      strokeWeight(1);
      
      noFill();
      beginShape();
      for(let i = 0; i < this.path.length; i++){
        vertex(this.path[i].x,this.path[i].y,this.path[i].z);
      }
      endShape()
      
      stroke(0);
    }

    record(){
      let xyz = this.to_kerr_schild();
      this.path.push(createVector(xyz[0]*this.scale,xyz[1]*this.scale,xyz[2]*this.scale));
      if(this.path.length > 7000)
        this.path.splice(0,1);
    }
  }
  