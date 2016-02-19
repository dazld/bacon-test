"use strict";
var bacon = require('baconjs');
// baconjs requestAnimFrame scheduler
//require('bacon.animationframe');
var scroll = require('./animate-scroll')();


var _ = window._ =  require('lodash');
var log = console.log.bind(console);

var $ = document.querySelectorAll.bind(document);

function makePara(){
    return '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>';
}

function makeHeading(idx){
    return '<h1>Title ' + idx + '</h1>';
}

function makeBlock(idx){
    log(idx)
    return "<div class='panel'>" + makeHeading(idx) + makePara() + "</div>";
}


function go(){
    var holder = document.createElement('div');

    var content = _.times(10, makeBlock).reduce(function(content, block){
        return content + block;
        
    },'');

    holder.innerHTML = content;
    $('#app')[0].appendChild(holder);

}

function closest (num, arr) {
    var mid;
    var lo = 0;
    var hi = arr.length - 1;
    while (hi - lo > 1) {
        mid = Math.floor ((lo + hi) / 2);
        if (arr[mid] < num) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    if (num - arr[lo] <= arr[hi] - num) {
        return lo;
    }
    return hi;
}

function setActive (closest){
    var active = document.querySelector('.active');

    if(active && active !== closest.el) {
        active.classList.remove('active');
        closest.el.classList.add('active');
    }
    
}


go();



var scrollEvents = bacon.fromEvent(window, 'wheel')
                        .merge(bacon.fromEvent(window, 'touchmove'))
                        .merge(bacon.fromEvent(window, 'touchend'))
                        // .debounce(16)
                        .flatMap(function(){
                            return bacon.once(window, 'scroll')
                        })
                        // .debounce(100)
                        .flatMapLatest(function(){
                            return window.scrollY; 
                        });

var h1s = $('.panel');

var positions = _.map(h1s, function(e){return {el:e, pos: e.offsetTop};});
var posInts = _.pluck(positions, 'pos');

console.log(posInts)


function getClosestAt(pos){
    var idx = closest(pos, posInts);
    return positions[idx];
}

var lastScrollCancel;

scrollEvents.flatMapLatest(getClosestAt).flatMap(function(closest){
    requestAnimationFrame(setActive.bind(null, closest));
    if (lastScrollCancel) {
        lastScrollCancel();
        lastScrollCancel = false;
    }
    return closest.pos;
}).debounce(500).onValue(function(pos){
    lastScrollCancel = scroll(pos-12, 1000);
});



getClosestAt(window.scrollY).el.classList.add('active');



























