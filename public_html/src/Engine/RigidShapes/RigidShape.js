
/*jslint node: true, vars: true, evil: true, bitwise: true */
"use strict";

/* global gEngine */

function RigidShape(xf) {
    this.mLine = new LineRenderable();
    this.mLine.setColor([1, 1, 1, 1]);
    
    this.mXform = xf;
    this.mVelocity = vec2.fromValues(0, 0);
    this.mBoundRadius = 0;
    
    this.mDrawBounds = true;
}

RigidShape.prototype.toggleDrawBound = function() {
    this.mDrawBounds = !this.mDrawBounds;
};

RigidShape.prototype.getCenter = function() {
    return this.mXform.getPosition();
};

RigidShape.prototype.setBoundRadius = function(r) {
    this.mBoundRadius = r;
};
RigidShape.prototype.getBoundRadius = function() {
    return this.mBoundRadius;
};

RigidShape.prototype.setVelocity = function(x, y) {
    this.mVelocity[0] = x;
    this.mVelocity[1] = y;
};
RigidShape.prototype.getVelocity = function() { return this.mVelocity;};
RigidShape.prototype.flipVelocity = function() { 
    this.mVelocity[0] = -this.mVelocity[0];
    this.mVelocity[1] = -this.mVelocity[1];
};

RigidShape.prototype.travel = function(dt) {};

RigidShape.prototype.update = function () {
    var dt = gEngine.GameLoop.getUpdateIntervalInSeconds();
    //s += v*t 
    this.travel(dt);
};


RigidShape.prototype.boundTest = function (otherShape) {
    var vFrom1to2 = [0, 0];
    vec2.subtract(vFrom1to2, otherShape.mXform.getPosition(), this.mXform.getPosition());
    var rSum = this.mBoundRadius + otherShape.mBoundRadius;
    var dist = vec2.length(vFrom1to2);
    if (dist > rSum) {
        //not overlapping
        return false;
    }
    return true;
};

RigidShape.prototype.draw = function(aCamera) {
    if (!this.mDrawBounds)
        return;
    
    var len = this.mBoundRadius * 0.5;
    //calculation for the X at the center of the shape
    var x = this.mXform.getXPos();
    var y = this.mXform.getYPos();
    
    this.mLine.setColor([1, 1, 1, 1]);
    this.mLine.setFirstVertex(x - len, y);  //Horizontal
    this.mLine.setSecondVertex(x + len, y); //
    this.mLine.draw(aCamera);
    
    this.mLine.setFirstVertex(x, y + len);  //Vertical
    this.mLine.setSecondVertex(x, y - len); //
    this.mLine.draw(aCamera);
};

RigidShape.kNumCircleSides = 16;
RigidShape.prototype.drawCircle = function(aCamera, r) {
    var pos = this.mXform.getPosition();    
    var prevPoint = vec2.clone(pos);
    var deltaTheta = (Math.PI * 2.0) / RigidShape.kNumCircleSides;
    var theta = deltaTheta;
    prevPoint[0] += r;
    var i, x, y;
    for (i = 1; i <= RigidShape.kNumCircleSides; i++) {
        x = pos[0] + r * Math.cos(theta);
        y = pos[1] +  r * Math.sin(theta);
        
        this.mLine.setFirstVertex(prevPoint[0], prevPoint[1]);
        this.mLine.setSecondVertex(x, y);
        this.mLine.draw(aCamera);
        
        theta = theta + deltaTheta;
        prevPoint[0] = x;
        prevPoint[1] = y;
    }
};