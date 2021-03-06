
/*jslint node: true, vars: true, evil: true, bitwise: true */
"use strict";

/* global gEngine */

// previously accepted a tranform parameter, 
// but moving away from using transform
function RigidShape(xf) {
    this.mLine = new LineRenderable();
    this.mLine.setColor([1, 1, 1, 1]);
    
    this.mXform = xf;
    this.mVelocity = vec2.fromValues(0, 0);
    this.mAcceleration = vec2.fromValues(0, 0);

    this.mMass = 1;
    this.mInvMass = 1;
    this.mInertia = 0;
    this.mFriction = 0.8;
    this.mRestitution = 0.2;

    this.mAngle = 0;
    this.mAngVel = 0;
    this.mAngAcc = 0;

    this.mBoundRadius = 0;
    this.mDrawBounds = false;
}

RigidShape.prototype.getMass = function() {
    return this.mMass;
};

RigidShape.prototype.setMass = function(newMass) {
    this.mMass = newMass;
    if (this.mMass < 0) {
        this.mMass = 0;
    }
    if (this.mMass !== 0) {
        this.mInvMass = 1 / this.mMass;
        this.mAcceleration = gEngine.Physics.getSystemAcceleration();
    }
    else {
        this.mAcceleration = vec2.fromValues(0, 0);
    }
    this.updateInertia();
};

// increases Mass by 0.05
RigidShape.prototype.incMass = function() {
    this.mMass += 0.05;
    this.updateInertia();
};

// decreases Mass by 0.05
RigidShape.prototype.decMass = function() {
    this.mMass -= 0.05;
    this.updateInertia();
};

RigidShape.prototype.getFriction = function() {
    return this.mFriction;
};

RigidShape.prototype.setFriction = function(newFric) {
    this.mFriction = newFric;
    if (this.mFriction < 0) {
        this.mFriction = 0;
    }
};

RigidShape.prototype.getRestitution = function() {
    return this.mRestitution;
};

RigidShape.prototype.setRestitution = function(newRest) {
    this.mRestitution = newRest;
    if (this.mRestitution < 0) {
        this.mRestitution = 0;
    }
    if (this.mRestitution > 1) {
        this.mRestitution = 1;
    }
};

RigidShape.prototype.getInertia = function() {
    return this.mInertia;
};

RigidShape.prototype.toggleDrawBound = function() {
    this.mDrawBounds = !this.mDrawBounds;
};

RigidShape.prototype.getCenter = function() {
    return this.mXform.getPosition();
};

RigidShape.prototype.setCenter = function(newX, newY) {
    this.mXform.setPosition(newX, newY);
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
    var dump = vec2.fromValues(0, 0);
    vec2.add(this.mVelocity, this.mVelocity, vec2.scale(dump, this.mAcceleration, dt));
    
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