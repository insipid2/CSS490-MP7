/* File: Minion.js 
 *
 * Creates and initializes a Minion object
 * overrides the update function of GameObject to define
 * simple sprite animation behavior behavior
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteAnimateRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

// TODO add parameter isAnimated to select whether a SpriteAnimateRenderable or a TextureRenderable is used
// also change update() method to check this before calling updateAnimation()
// possibly have parameter be: 1: minion; 2: platform 3: wall
function Minion(spriteTexture, atX, atY, createCircle, type) {
    this.kDelta = 0.3;
    this.kType = type;
    
    if(type === 1) {
        this.mMinion = new SpriteAnimateRenderable(spriteTexture);
        this.mMinion.setColor([1, 1, 1, 0]);
        this.mMinion.getXform().setPosition(atX, atY);
        this.mMinion.getXform().setSize(24, 19.2);
        this.mMinion.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
                                    204, 164,   // widthxheight in pixels
                                    5,          // number of elements in this sequence
                                    0);         // horizontal padding in between
        this.mMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
        this.mMinion.setAnimationSpeed(30);
                                // show each element for mAnimSpeed updates
    }
    else if (type === 2) {
        this.mMinion = new TextureRenderable(spriteTexture);
        this.mMinion.getXform().setPosition(atX, atY);
        this.mMinion.getXform().setSize(30, 3.75);
    }
    else if (type === 3) {
        this.mMinion = new TextureRenderable(spriteTexture);
        this.mMinion.getXform().setPosition(atX, atY);
        this.mMinion.getXform().setSize(3, 12);
    }
    

    GameObject.call(this, this.mMinion);
    
    var r;
    if (createCircle)
        r = new RigidCircle(this.getXform(), 8); 
    else
        r = new RigidRectangle(this.getXform(), this.getXform().getWidth(), this.getXform().getHeight());
    this.setRigidBody(r);
    this.toggleDrawRenderable();
    
    if (this.kType > 1) {
        this.setMass(0);
    }
}
gEngine.Core.inheritPrototype(Minion, WASDObj);

Minion.prototype.setSize = function(width, height) {
    this.getXform().setSize(width, height);
    this.mRigidBody.setSize(width, height);
};


Minion.prototype.update = function (aCamera) {
    GameObject.prototype.update.call(this);
    // remember to update this.mMinion's animation
    if (this.kType === 1) {
        this.mMinion.updateAnimation();
    }
};