"use strict";
var bacon = require('baconjs');
var _ = window._ =  require('lodash');

var log = console.log.bind(console);



var $ = document.querySelectorAll.bind(document);



function makePara(){
    return '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>';
}

function makeHeading(){
    return '<h1>Title</h1>';
}

function makeBlock(){
    return makeHeading() + makePara();
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

go();

var scrollEvents = bacon.fromEvent(window, 'wheel').merge(bacon.fromEvent(window, 'touchmove')).flatMapLatest(function(){
    return document.body.scrollTop;
});

var h1s = $('h1');

var positions = _.map(h1s, function(e){return {el:e, pos: e.offsetTop};});

scrollEvents.flatMap(function(pos){
    var idx = closest(pos, _.pluck(positions, 'pos'));
    return positions[idx];
}).onValue(function(closest){
    var active = document.querySelector('.active');
    if(active) {
        active.classList.remove('active');
    }
    closest.el.classList.add('active');
});






























