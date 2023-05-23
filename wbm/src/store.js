import { writable } from 'svelte/store';


export const worlds = ([ 
    {name:'Codename: HERO1', desc:'the world i made when i was in 10th grade.', profile:"./src/assets/webtoonxavier.jpg", id: 1},
    {name:'Codename: HERO2', desc:'the world i made when i was in 10th grade.', profile:"./src/assets/webtoonxavier.jpg", id: 2},
    {name:'Codename: HERO3', desc:'the world i made when i was in 10th grade.', profile:"./src/assets/webtoonxavier.jpg", id: 3},

    ]);

export const selectedWorld = writable([{name:'',desc:'', profile:'', id:0}]);