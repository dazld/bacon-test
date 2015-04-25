"use strict";

// https://gist.github.com/james2doyle/5694700
// wrapped in a build function to avoid server side evaluation
var raf = require('raf');

var build = function() {

    // easing functions http://goo.gl/5HLl8
    var easeInOutQuad = function(t, b, c, d) {
        t /= d / 2;
        if (t < 1) {
            return c / 2 * t * t + b;
        }
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };


    var easeInCubic = function(t, b, c, d) {
        var tc = (t /= d) * t * t;
        return b + c * (tc);
    };

    // var inOutQuintic = function(t, b, c, d) {
    //     var ts = (t /= d) * t,
    //         tc = ts * t;
    //     return b + c * (6 * tc * ts + -15 * ts * ts + 10 * tc);
    // };

    var lastAnimFrame = false;

    return function scrollTo(to, duration, callback) {


        callback = callback || function(){};
        duration = (typeof(duration) === 'undefined') ? 500 : duration;

        // because it's so fucking difficult to detect the scrolling element, just move them all
        function move(amount) {
            document.documentElement.scrollTop = amount;
            document.body.parentNode.scrollTop = amount;
            document.body.scrollTop = amount;
        }

        function position() {
            return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
        }
        var start = position(),
            change = to - start,
            currentTime = 0,
            increment = 20,
            cancelled = false;


        var animateScroll = function animateScroll () {
            if (cancelled) {
                raf.cancel(lastAnimFrame);
                return false;
            }
            // increment the time
            currentTime += increment;
            // find the value with the quadratic in-out easing function
            var val = easeInOutQuad(currentTime, start, change, duration).toFixed(1);
            // move the document.body
            move(val);
            // do the animation unless its over
            if ((currentTime < duration) && change ) {
                lastAnimFrame = raf(animateScroll);
            } else {
                if (callback && typeof(callback) === 'function') {
                    // the animation is done so lets callback
                    raf(callback);
                }
            }
        };
        animateScroll();
        return function cancelAnimation(){
            cancelled = true;
            raf(callback);
        };
    };
};
module.exports = build;
