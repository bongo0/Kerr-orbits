

class Kerr{
  constructor(mass,spin, detailX, detailY, scale){
        this.detailX = detailX;
        this.detailY = detailY;
        this.scale = scale;
        
        this.M = mass;
        this.spin = spin;     // angular momentum per unit mass
        this.a2 = spin*spin;  
        this.geometry_OE = [];
        this.geometry_IE = [];
        this.geometry_HP = [];
        this.geometry_HM = [];

        this.update_OE();
        this.update_IE();
        this.update_HM();
        this.update_HP();
    }

    change_spin(a){
      this.spin = a;
      this.a2 = a;
      this.update_OE();
      this.update_IE();
      this.update_HM();
      this.update_HP();
    }

    EventHorizon_plus(M,spin,angle){
        return M + Math.sqrt(M*M-spin*spin);
    }
    EventHorizon_minus(M,spin,angle){
        return M - Math.sqrt(M*M-spin*spin);
    }
    OuterErgosphere(M,spin,angle){
        return M + Math.sqrt(M*M-spin*spin*Math.cos(angle)*Math.cos(angle));
    }
    InnerErgosphere(M,spin,angle){
        return (M - Math.sqrt(M*M-spin*spin*Math.cos(angle)*Math.cos(angle)));
    }

    draw_OE(color,half){
      this.draw_surf(this.geometry_OE,color,half);
    }

    update_OE(){
      this.update_surf(this.OuterErgosphere,this.geometry_OE);
    }
    
    draw_IE(color,half){
      this.draw_surf(this.geometry_IE,color,half);
    }
    update_IE(){
      this.update_surf(this.InnerErgosphere,this.geometry_IE);
    }
    
    draw_HP(color,half){
      this.draw_surf(this.geometry_HP,color,half);
    }
    update_HP(){
      this.update_surf(this.EventHorizon_plus,this.geometry_HP);
    }
    
    draw_HM(color,half){
      this.draw_surf(this.geometry_HM,color,half);
    }
    update_HM(){
      this.update_surf(this.EventHorizon_minus,this.geometry_HM);
    }
    
    update_surf(r_func,geometry){
      for (let i = 0; i <= this.detailX; i++) {
        geometry[i] = [];
        let theta = map(i, 0, this.detailX, 0, PI);
        
        for (let j = 0; j <= this.detailY; j++) {
          let phi = map(j, 0, this.detailY, 0, TWO_PI);
          let r = r_func(this.M,this.spin,theta);
          let tmp = Math.sqrt(r*r+this.spin*this.spin);
          let x = tmp * sin(theta) * cos(phi);
          let y = tmp * sin(theta) * sin(phi);
          let z = r * cos(theta);
          
          geometry[i].push(createVector(this.scale*x, this.scale*z, this.scale*y));
        }
      }
    }


    draw_surf(geometry,color,half){
      let l = 0;
      if(half) l = floor(this.detailY/2);
      for (let i = 0; i < this.detailX; i++) {
        colorMode(RGB);
        fill(color);
        beginShape(TRIANGLE_STRIP);
        for (let j = l; j <= this.detailY; j++) {
          let v1 = geometry[i][j];
          vertex(v1.x, v1.y, v1.z);
          let v2 = geometry[i+1][j];
          vertex(v2.x, v2.y, v2.z);
        }
        endShape();
      }
    }

  }
  
  
  