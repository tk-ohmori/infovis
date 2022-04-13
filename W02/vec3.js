class Vec3 {
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v){
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    sum(v){
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    sum(){return this.x + this.y + this.z;}

    min(){return Math.min(this.x, this.y, this.z);}

    max(){return Math.max(this.x, this.y ,this.z);}

    mid(){return  this.sum() - this.min() -this.max();}

    cross(v){
        var x = this.x;
        var y = this.y;
        var z = this.z;
        this.x = y * v.z - z * v.y;
        this.y = z * v.x - x * v.z;
        this.z = x * v.y - y * v.x;
        return this;
    }

    length(){return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );}
}