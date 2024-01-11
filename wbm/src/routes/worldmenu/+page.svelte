<script>
    import { onMount } from 'svelte';
    
    import EditWorld from '../components/EditWorld.svelte';
    import Modal from '../components/Modal.svelte';
    import Footer from "../components/Footer.svelte";

    let showForm = false;

    /**
     * @type any
     */
    let selectedworld = [];
    

    //Grabs selected world so page can display information
    onMount(async () => {
        const response = await fetch('http://localhost:3000/api/worlds/selected');
        
        if (response.ok) {
            const data = await response.json();
            selectedworld = data;
            console.log('SELECTED WORLD FETCHED!')
            console.log('Response:', data);
        }
    });
    
    //Updates World to Backend
    async function editWorld(updatedWorldData) {
        const objectId = selectedworld._id;
        console.log(objectId);
        try {
            const response = await fetch(`http://localhost:3000/api/worlds/${objectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedWorldData),
            });

            if (response.ok) {
            const updatedWorld = await response.json();
            selectedworld = updatedWorld;
            console.log('World updated:', updatedWorld);
            } 
            else {
            console.error('Error editing world:', response.status);
            }
        } 
        
        catch (error) {
            console.error('Failed to fetch:', error);
        }
    }

    function ShowForm(){
        showForm = !showForm;
    }

    function handleMapRemove(){
        const map = "";

        const world = {
            map
        };

        editWorld(world);

    }

    function handleMapUpload(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = () => {
            const map = reader.result;
        
            const world = {
                map,
            };
            
            editWorld(world);
        };
    
        reader.readAsDataURL(file);
    }

    // Takes event info and puts it in the edit world function
    const handleEditClick = (e) => {
        editWorld(e.detail);
        console.log('Edit button clicked');
        showForm = !showForm;
    }

</script>

<Modal {showForm}>
    <EditWorld on:UpdateWorldtoList={handleEditClick} on:Cancel={ShowForm}/>
</Modal>


<div class:hidden={showForm}>
    <div class="wrapper">
        <div class="name">
            <button title="Go Back to All Worlds"><a href="/"><img src="src/assets/back_arrow.png" alt="" id="arrow"></a></button>
            <button class="b" on:click={ShowForm}>
                <img title="Edit World" class="edit-button" src="src/assets/edit.png" alt="">
                <p class="edit">EDIT WORLD</p>
            </button>
            <div class="profile"><img class="profileimg" src={selectedworld.profile ? selectedworld.profile : '../src/assets/blank_world_profile.png'} alt=''></div>
            <div class="title"><h1 class="title">{selectedworld.name}</h1></div>
        </div>

        <div class="worldoptions" > 
            <button title="Show Characters" class="a" data-sveltekit-preload-data="tap"><a href="/worldmenu/world_characters"><h2 class="a">CHARACTERS</h2></button>
            <button title="Show Places" class="a" data-sveltekit-preload-data="tap"><a href="/worldmenu/world_places"><h2 class="a">Places</h2></button>
            <button title="Show Items" class="a" data-sveltekit-preload-data="tap"><a href="/worldmenu/world_items"><h2 class="a">Items</h2></button>
            <button title="Show Events" class="a" data-sveltekit-preload-data="tap"><a href="/worldmenu/world_events"><h2 class="a">Events</h2></button>
        </div>

        <div class="container">
            <div class="map">
                <h2>MAP</h2>
                <h5>MAKE YOUR OWN MAP AND CLICK THE IMAGE BELOW TO UPLOAD IT!</h5>
                <h5>RECOMMENDED SIZE (1920 x 1080)</h5>
                <div id="map-box">
                    <label for="file-upload" class="custom-file-upload">
                        <input  class="mapimg" id="file-upload" type="file" accept="image/*" on:change={handleMapUpload} />
                        {#if selectedworld.map}
                        <img title="Change Map" src={selectedworld.map} alt='' id="map">
                        {:else}
                        <img title="Upload Map" src="./src/assets/blank image.png" alt='' id="map">
                        {/if}
                    </label>
                </div>
                <button title="Remove Map" class="remove" on:click={() => handleMapRemove()}>REMOVE MAP</button>
            </div>

            <div class="description">
                <h2>Description</h2>
                <div class="text-box">
                    {#if selectedworld.desc}
                    <h4 class="text_description">{selectedworld.desc}</h4>
                    {:else}
                    <h4>NONE</h4>
                    {/if}
                </div>
            </div>
            
        </div>
        <Footer />
    </div>
</div>

<style>
    .wrapper {
        width: 1920px;
        margin: 0 auto;
    }

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
        width: 1000px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .title:hover {
        cursor: default;
    }

    

    .edit {
        color: rgb(213, 69, 0);
        font-size: small;
        position: relative;
        top: 35px;
        -webkit-text-stroke-width: 0px;
    }

    .edit:hover {
        cursor:pointer;
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

    .remove {
        font-size: medium;
        color: white;
        padding: 10px;
        border-radius: 20px;
        background-color: rgb(213, 69, 0);
    }

    .remove:hover {
        background-color: rgb(213, 0, 0);
        box-shadow: 0 0 10px rgba(115, 62, 62, 0.322);
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }

    .profile {
        
        width: 150px;
        height: 150px;
        overflow: hidden;
        border-radius: 50%;
        object-fit: cover;
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }

    .profile:hover {
        box-shadow: 0 0 10px rgba(115, 62, 62, 0.322);
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }

    .profileimg {
        height: 150px;
        align-self: center;
    }

    .text_description {
        color: rgba(0, 0, 0, 0.311);
    }
    .text-box{
        background-color: white;
        height: 620px;
        margin: 30px;
        padding: 20px;
        padding-top: 10px;
        border-radius: 20px;
        overflow-y: scroll;
        box-shadow: 0 0 10px rgba(115, 62, 62, 0.322);
        
    }

    .description, .map{
        margin: 20px;
        height: auto;
        border-radius: 10px;
        text-align: center;
        background: rgb(255, 233, 199);
    }

    .description{
        text-align: left;
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
        text-decoration: none;
    }

    button:active {
        background: transparent;
    }

    .a {
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
        text-decoration: none;
    }
    
    .a:hover {
        color:rgb(213, 0, 0);
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }

    .a:active {
        color: red;
    }

    .b{
        padding-bottom: 60px;
    }

    .container {
        width: 100%;
        height: auto;
        padding-bottom: 50px;
        display: grid;
        grid-gap: 10px;
        grid-template-columns: 75% 25%;   
    }
    .hidden {
        display: none;
    }
</style>