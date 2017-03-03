/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*jslint node: true, vars: true, white: true */
/*global vec2, CollisionInfo */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

/**
 * Static refrence to gEngine
 * @type gEngine
 */
var gEngine = gEngine || { };
    // initialize the variable while ensuring it is not redefined

/**
 * Default Constructor<p>
 * Physics engine supporting projection and impulse collision resolution. <p>
 * @class gEngine.Physics
 * @type gEngine.Physics
 */
gEngine.Physics = (function () {

    var mSystemtAcceleration = [0, -20];        // system-wide default acceleration
    
    var getSystemtAcceleration = function() { return mSystemtAcceleration; };
    
    var processCollision = function(set, infoSet) {
        var i = 0, j;
        var iToj = [0, 0];
        var info = new CollisionInfo();
        for (i = 0; i<set.size(); i++) {
            var objI = set.getObjectAt(i).getRigidBody();
            for (j = i+1; j<set.size(); j++) {
                var objJ = set.getObjectAt(j).getRigidBody();
                if (objI.boundTest(objJ)) {
                    if (objI.collisionTest(objJ, info)) {
                        // make sure info is always from i towards j
                        vec2.subtract(iToj, objJ.getCenter(), objI.getCenter());
                        if (vec2.dot(iToj, info.getNormal()) < 0)
                            info.changeDir();
                        infoSet.push(info);
                        info = new CollisionInfo();
                    }
                }
            }
        }
    };
    
    var mPublic = {
        getSystemAcceleration: getSystemtAcceleration,
        processCollision: processCollision
    };
    return mPublic;
}());