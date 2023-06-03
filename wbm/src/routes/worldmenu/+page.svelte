<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import Footer from "../components/Footer.svelte";

    let showForm = false;

    let SelectedWorld = writable({
        name: '',
        desc: '',
        profile: '',
        map: '',
        id: 0,
    });

    onMount(async () => {
        const response = await fetch('http://localhost:3000/api/worlds/selected');
        
        if (response.ok) {
            const data = await response.json();
            SelectedWorld.set(data);
            console.log('Response:', data);
        }
    });

    async function editWorld(updatedWorldData) {
        const selectedWorldData = $SelectedWorld; // Get the current selected world data

        try {
            const response = await fetch(`/api/worlds/${selectedWorldData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedWorldData),
            });

            if (response.ok) {
            const updatedWorld = await response.json();
            SelectedWorld.set(updatedWorld); // Update the selected world store
            console.log('World updated:', updatedWorld);
            } else {
            console.error('Error updating world:', response.status);
            // Handle error case if needed
            }
        } catch (error) {
            console.error('Error updating world:', error);
            // Handle error case if needed
        }
    }

    function handleFileChange(event) {
        const file = event.target.files[0];

        const reader = new FileReader();

        reader.onload = () => {
            SelectedWorld.update(selectedWorld => ({
                ...selectedWorld,
                map: reader.result,
            }));
        };

        reader.readAsDataURL(file);
    };

    const handleEditClick = (e) => {
        editWorld(e.detail)
        console.log('Edit button clicked');
    };

</script>
<div class:hidden={showForm}>
<div class="name">
        <button title="Go Back to Home Page"><a href="/"><img src="src/assets/back_arrow.png" alt="" id="arrow"></a></button>
        <button  on:click={handleEditClick}><img class="edit-button" src="src/assets/edit.png" alt=""></button>
        <h1 class="title">{$SelectedWorld.name}</h1>
        
</div>

<div class="worldoptions" > 
    <button class="a" data-sveltekit-preload-data="tap"><a href="/worldmenu/world_people"><h2>People</h2></button>
    <button class="a" data-sveltekit-preload-data="tap"><a href="/worldmenu/world_places"><h2>Places</h2></button>
    <button class="a" data-sveltekit-preload-data="tap"><a href="/worldmenu/world_items"><h2>Items</h2></button>
    <button class="a" data-sveltekit-preload-data="tap"><a href="/worldmenu/world_events"><h2>Events</h2></button>

</div>

<div class="container">
    <div class="map">
        <h2>MAP</h2>
        <h5>MAKE YOUR OWN MAP AND UPLOAD BELOW</h5>
        <h5>RECOMMENDED SIZE (1920 x 1080)</h5>
        <div id="map-box">
            <label for="file-upload" class="custom-file-upload">
                <input id="file-upload" type="file" accept="image/*" on:change={handleFileChange} />
                {#if $SelectedWorld.map}
                    <img src={$SelectedWorld.map} alt='' id="map">
                {:else}
                    <img src="./src/assets/blank image.png" alt='' id="map">
                {/if}
                
            </label>
        </div>
    </div>
    <div class="description">
        <h2>Description</h2>
        
        <div class="text-box">
            {#if $SelectedWorld.desc}
                <h4 class="text_description">{$SelectedWorld.desc}</h4>
                {:else}
                    <h4>NONE</h4>
                {/if}
            
        </div>
        
    </div>

</div>
</div>

<style>
    #map-box{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    #file-upload {
        opacity: 0;
        position: absolute;
    }
    #map{
        max-width: 900px;
        max-height: 500px;
        border-radius: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.273);
        margin-bottom: 50px;
    }
    #map:hover {
        cursor: pointer;
    }
    #arrow {
        opacity: 50%;
        position: absolute;
        top: 95px;
        left:40px;
        width: auto;
        height: 90px;
        padding-left: 10px;
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }
    #arrow:hover {
        cursor: pointer;
        opacity: 100%;
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }
    h5{
        color: rgba(0, 0, 0, 0.311);
    }

    h4 {
        font-size: 18px;
        color: rgba(125, 125, 125, 0.571);
    }
    .title  {
        text-align: center;
    }
    .edit-button {
        position: relative;
        top: 40px;
        opacity: 50%;
        height: 30px;
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }

    .edit-button:hover {
        opacity: 100%;
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }

    .text_description {
        color: rgba(0, 0, 0, 0.311);
    }
    .text-box{
        background-color: white;
        height: 77%;
        margin: 30px;
        padding: 20px;
        padding-top: 10px;
        border-radius: 20px;
        overflow-y: scroll;
        box-shadow: 0 0 10px rgba(115, 62, 62, 0.322);
        
    }
    .description, .map{
        
        margin: 20px;
        height: 700px;
        border-radius: 10px;
        text-align: center;
        background: rgb(255, 233, 199);
        /* box-shadow: 0 0 10px rgba(60, 10, 0, 0.679); */
    }
    .worldoptions {
        top: 40px;
        display: flex;
        justify-content: center;
        width: 100%;
    }
    h1 {
        margin-top: 40px;
    }

    h2 {
        color: black;
        text-transform: uppercase;
        text-align: center;
    }

    .name {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        max-width: auto;
        text-align: center;
        font-size: 50px;
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

    .a {
        color:rgb(213, 0, 0);
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }

    .a:hover {
        text-decoration: none;
        filter: none;
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }

    .a:active {
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