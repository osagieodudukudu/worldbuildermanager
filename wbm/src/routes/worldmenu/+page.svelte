<script>
    import { selectedWorld } from '../../store';
    import Footer from "../components/Footer.svelte";
    import Modal from '../components/Modal.svelte';

    let SelectedWorld = [{
        name: '', desc: '', profile: '', id: 0 
    }];

    selectedWorld.subscribe(value => {
        SelectedWorld = value;
    });

</script>

<div class="name">
    <h1>{SelectedWorld[0].name}</h1>
</div>

<div class="worldoptions" > 
    <button class="option" data-sveltekit-preload-data="tap"><a href="/worldmenu/world_people"><h2>People</h2></button>
    <button class="option" data-sveltekit-preload-data="tap"><a href="/worldmenu/world_places"><h2>Places</h2></button>
    <button class="option" data-sveltekit-preload-data="tap"><a href="/worldmenu/world_items"><h2>Items</h2></button>
    <button class="option" data-sveltekit-preload-data="tap"><a href="/worldmenu/world_events"><h2>Events</h2></button>

</div>

<div class="container">
    <div class="map">
        <h2>MAP</h2>
        <img src="./src/assets/blank image.png" alt='' id="map">
    </div>
    <div class="description">
        <h2>Description</h2>
        <h4 class="text_description">{SelectedWorld[0].desc}</h4>
    </div>

</div>

<Footer />
<style>
    #map{
        opacity: 45%;
        max-width: 90%;
        height: auto;
        border-radius: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.273);
        margin-bottom: 50px;
    }
    .text_description {
        color: rgba(125, 125, 125, 0.571);
        padding-left: 40px;
        padding-right: 40px;
    }
    .description, .map{
        margin: 20px;
        height: auto;
        border-radius: 10px;
        text-align: center;
        background: rgb(255, 233, 199);
        box-shadow: 0 0 10px rgba(60, 10, 0, 0.679);
    }
    .worldoptions {
        top: 50px;
        display: flex;
        justify-content: center;
        width: 100%;
    }

    h2 {
        text-transform: uppercase;
        text-align: center;
    }

    .name {
        max-width: auto;
        text-align: center;
        font-size: 30px;
        text-transform: uppercase;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: rgb(213, 0, 0);
    }

    button{
        padding-left: 70px;
        padding-right: 70px;
        background: transparent;
        border: transparent;
        cursor: pointer;
        text-transform: uppercase;
        font-size: 30px;
        text-align: center;
    }

    button:active {
        background: transparent;
    }

    a {
        filter: grayscale();
        color:rgb(213, 0, 0);
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }

    a:hover {
        text-decoration: none;
        filter: none;
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }

    a:active {
        color: red;
    }

    .container {
        width: 100%;
        height: auto;
        padding-bottom: 50px;
        display: grid;
        grid-gap: 10px;
        grid-template-columns: 75% 25%;   
    }
</style>