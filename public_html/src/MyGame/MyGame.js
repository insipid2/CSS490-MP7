/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    this.kMinionSprite = "assets/minion_sprite.png";
    this.kPlatform = "assets/platform.png";
    this.kWall = "assets/wall.png";
    this.kTarget = "assets/target.png";
    // The camera to view the scene
    this.mCamera = null;

    this.mMsgTop = null;
    this.mMsgBot = null;

    this.mEnvObjs = [];
    this.mCreatedObjects = [];
    this.mCollisionInfos = [];
    
    this.mCurrentObj = 0;
}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kMinionSprite);
    gEngine.Textures.loadTexture(this.kPlatform);
    gEngine.Textures.loadTexture(this.kWall);
    gEngine.Textures.loadTexture(this.kTarget);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kMinionSprite);
    gEngine.Textures.unloadTexture(this.kPlatform);
    gEngine.Textures.unloadTexture(this.kWall);
    gEngine.Textures.unloadTexture(this.kTarget);
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(50, 37.5), // position of the camera
        100,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    
    // stores walls and platforms - not moveable
    this.mEnvObjs = new GameObjectSet();
    
    // create the floor/ceiling
    var y = 1.875;
    var x = 15;
    for (var i = 1; i <= 4; i++) {
        var m = new Minion(this.kPlatform, x, y, false, 2);
        m.setMass(0);
        this.mEnvObjs.addToSet(m);
        m = new Minion(this.kPlatform, x, y + 71, false, 2);
        m.setMass(0);
        this.mEnvObjs.addToSet(m);
        x += 30;
    }
    
    // create the right/left walls
    x = 1.5;
    y = 6;
    for (var i = 1; i <= 7; i++) {
        var m = new Minion(this.kWall, x, y, false, 3);
        m.setMass(0);
        this.mEnvObjs.addToSet(m);
        m = new Minion(this.kWall, x + 97, y, false, 3);
        m.setMass(0);
        this.mEnvObjs.addToSet(m);
        y += 12;
    }
    
    // create platforms
    

    
    // create platforms
//    for (var i = 1; i <= 4; i++) {
//        // bottom row
//        var rend = new TextureRenderable(this.kPlatform);
//        var m = new GameObject(rend);
//        var rigid = new RigidRectangle(rend.getXform(), 30, 3.75);
//        m.setRigidBody(rigid);
//        m.getRigidBody().setCenter(x, y);
//        m.setMass(0);
//        console.log("center: " + m.getRigidBody().getCenter());
//        this.mEnvObjs.addToSet(m);
//        // top row
//        rend = new TextureRenderable(this.kPlatform);
//        m = new GameObject(rend);
//        rigid = new RigidRectangle(rend.getXform(), 30, 3.75);
//        m.setRigidBody(rigid);
//        m.getRigidBody().setCenter(x, y + 67);
//        m.setMass(0);
//        this.mEnvObjs.addToSet(m);
//        x += 30;
//    }
    

    this.mMsgTop = new FontRenderable("Status Message");
    this.mMsgTop.setColor([0, 0, 0, 1]);
    this.mMsgTop.getXform().setPosition(4, 67);
    this.mMsgTop.setTextHeight(2);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    
    this.mEnvObjs.draw(this.mCamera);
    
    // don't draw anymore, should be handled by physics?
//    // for now draw these ...
//    for (var i = 0; i<this.mCollisionInfos.length; i++) 
//        this.mCollisionInfos[i].draw(this.mCamera);
//    this.mCollisionInfos = [];
    
    this.mMsgTop.draw(this.mCamera);   // only draw status in the main camera
};

MyGame.prototype.increasShapeSize = function(obj, delta) {
    var s = obj.getRigidBody();
    var r = s.incShapeSizeBy(delta);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.kBoundDelta = 0.1;
MyGame.prototype.update = function () {
    
        
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Right)) {
        this.mCurrentObj += 1;
        if (this.mCurrentObj > this.mEnvObjs.length - 1) {
            this.mCurrentObj = 0;
        }
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Left)) {
        this.mCurrentObj -= 1;
        if (this.mCurrentObj < 0) {
            this.mCurrentObj = this.mEnvObjs.length - 1;
        }
    }
    // change to this.mCreatedObjects
    var obj = this.mEnvObjs.getObjectAt(this.mCurrentObj);
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        // this.increasShapeSize(obj, MyGame.kBoundDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        // this.increasShapeSize(obj, -MyGame.kBoundDelta);
    }
    obj.keyControl();
    
    this.mEnvObjs.update(this.mCamera);
    
    gEngine.Physics.processCollision(this.mEnvObjs, this.mCollisionInfos);

    var msg = "Mass: " + this.mEnvObjs.getObjectAt(this.mCurrentObj).getMass();
    msg += " | Inertia: ";
    msg += " | Friction: " + this.mEnvObjs.getObjectAt(this.mCurrentObj).getFriction();
    msg += " | Restitution: " + this.mEnvObjs.getObjectAt(this.mCurrentObj).getRestitution();
    this.mMsgTop.setText(msg);
};