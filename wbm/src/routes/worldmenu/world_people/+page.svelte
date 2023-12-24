<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    let SelectedWorld = writable({
        name: '',
        desc: '',
        profile: null,
        map: null,
        id: 0,
    });

    let people = [];

    onMount(async () => {
        const response = await fetch('http://localhost:3000/api/worlds/selected');
        
        if (response.ok) {
            const data = await response.json();
            SelectedWorld.set(data);
            console.log('Response:', data);
        }

        const response = await fetch('http://localhost:3000/api/people/')
    });
    
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
    }

</script>

<div class="body">
    <div>
        <div class="title">
            <button><a href="/worldmenu"><img src="../src/assets/back_arrow.png" alt="" id="arrow"></a></button>
            <h1 class="worldname">{$SelectedWorld.name}</h1>
            <h1 class="page-title">PEOPLE</h1>
        </div>
        <div class="box" id="list-box">
            <h1 class="add">ADD PERSON</h1>
            <div class="text-box" id="list">

            </div>
        </div>   
    </div>
    
    <div class="box" >
        <h2>CLICK ON THE IMAGE BELOW TO UPLOAD THE IMAGE OF YOUR PLACE<br><br>RECOMMENDED SIZE: (1080 x 1920)</h2>
        <div id="image-box">
            <label for="file-upload" class="custom-file-upload">
                <input id="file-upload" type="file" accept="image/*" on:change={handleFileChange} />
                {#if $SelectedWorld.map}
                    <img src={$SelectedWorld.map} alt='' id="image">
                {:else}
                    <img src="../src/assets/blank image_vert.png" alt='' id="image">
                {/if}
                
            </label>
        </div>
    </div>

    <div class="box" id="description">
        <h1 class="name">NAME</h1>
       
        <div class="text-box" id="description">
            <h3>NAME:</h3>
            <h3>AGE:</h3>
            <h3>ETHNICITY:</h3>
            <h3>NATIONALITY:</h3>
            <h3>GENDER:</h3>
            <h3>SKILLS:</h3>
            <h3>ATTRIBUTES:</h3>
            <h3>BIOGRAPHY:</h3>
        </div>
        
    </div>
</div>


<style>
    #file-upload {
        opacity: 0;
        position: absolute;
    }
    #image-box{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #image {
        border-radius: 20px;
        max-width: 400px;
        max-height: 800px;
        cursor: pointer;
        box-shadow: 0 0 10px rgba(115, 62, 62, 0.322);
    }
    #list {
        height: 650px;
    }
    #arrow {
        opacity: 50%;
        position: absolute;
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
    #description {
        padding: 40px;
        
    }
    .title{
        padding-top: 20px;

    }
    .add {
        font-size: large;
        padding-bottom: 5px;
        text-justify: center;
        color: rgba(100, 28, 28, 0.338);
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }
    .add:hover{
        cursor: pointer;
        color:rgb(255, 98, 59);
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }
    .add:active {
        color:rgb(255, 0, 0);
        transition-duration: 20ms;
        transition-timing-function: ease-in-out;
    }
    .name {
        text-transform: uppercase;
        font-size: 40px;
        text-align: center;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: rgb(213, 0, 0);
        margin-bottom: 30px;
    }
    .worldname {
        text-transform: uppercase;
        text-align: right;
        font-size: 20px;
        color:burlywood;
    }
    .page-title {
        text-transform: uppercase;
        font-size: 70px;
        text-align: right;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: rgb(213, 0, 0);
        margin-bottom: 30px;
    }
    .body {
        padding-top: 10px;
        padding-left: 10px;
        padding-bottom: 20px;
        width: 99%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 30px;
        height: 90vh;
    }

    .box{
        background: rgb(255, 233, 199);
        border-radius: 20px;
        padding: 20px;
    }

    .text-box{
        background-color: white;
        height: 670px;
        padding: 20px;
        padding-top: 10px;
        border-radius: 20px;
        overflow-y: scroll;
        overflow-x: break-word;
        box-shadow: 0 0 10px rgba(115, 62, 62, 0.322);
        
    }
    h2 {
        font-size: small;
        text-align: center;
        color: rgba(0, 0, 0, 0.311)    }
    h3 {
        color: rgb(185, 185, 185);
        font-size: medium;
    }
    button {
        background: transparent;
        border: transparent;
    }
</style>