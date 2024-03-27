<script>

    import { onMount } from 'svelte';

    import AddPlace from '../../components/AddPlace.svelte';
    import EditPlace from '../../components/EditPlace.svelte';
    import Confirm from '../../components/Confirm.svelte';
    import Modal from '../../components/Modal.svelte';
    import Form from '../../components/Form.svelte';
    

    
    /**
     * @type {never[]}
     */
    let selectedworld = [];
    /**
     * @type {any[]}
     */
    let selectedplace = [];
    /**
     * @type {any[]}
     */
    let places = [];

    let showAdd = false; 
    let showEdit = false;
    let showForm = false;
    let confirm = "";
    let message = "";

    /**
     * @type {any}
     */
    let selectedID;
    /**
     * @type {any}
     */
    let name;
    /**
     * @type {any}
     */
    let population;
    /**
     * @type {any}
     */
    let attractions;
    /**
     * @type {any}
     */
    let notable_characters;
    /**
     * @type {any}
     */
    let desc;
    /**
     * @type {any}
     */
    let image;
    

    onMount(async () => {
        
        const response = await fetch('http://localhost:3000/api/worlds/selected');
        
        if (response.ok) {
            const data = await response.json();
            selectedworld = data;
        }

        const response2 = await fetch(`http://localhost:3000/api/places/grab/${selectedworld._id}`);

        if (response2.ok) {
            const data = await response2.json();
            places = data;
        }

    });

    const ShowForm = () => {

        showForm = !showForm;

    };

    const ShowAdd = () => {

        showAdd = !showAdd;
        
    };
    
    const ShowEdit = (e) => {
        handleSelect(e);
        showEdit = !showEdit;
    };

    function setConfirm(answer) {
        if (answer=="Y" || answer=="N"){
            confirm = answer;
            showForm = !showForm;
        } else {
            confirm = "N";
        };
    };

    async function waitForConfirm() {
        while(showForm){
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };
    
    async function handleSelect(object){
        selectedID = object._id;
        const response = await fetch(`http://localhost:3000/api/places/select/${ object._id }`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: object._id })
        });

        if (response.ok) {
            const selectedplace = await response.json();

            return true;
        } 

        else{
            return false;
        }

    }; 
    
    const addPlace = async(e) => {
        
        const newPlace = e.detail;
        
        fetch('http://localhost:3000/api/places/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPlace),
        })
        .then((response) => {
            
            if (response.ok) {
                return response.json();
                
            } 
            
            else {
                throw new Error('Failed to add place');
            }
            
        })
        .then((addedPlace) => {
            
            places = [ ...places, addedPlace];
            
            showAdd = !showAdd;

            handleSelect(addedPlace);
            selectedID = addedPlace._id;
            
        })
        .catch((error) => {
            console.error('Error:', error);
            
        });
        
        selectedID = newPlace.selectedID;
        name = newPlace.name;
        population = newPlace.population;
        desc = newPlace.desc;
        image = newPlace.image;

        let entities    =   [newPlace.attractions, newPlace.notable_characters];
        let entitiesVar =   ["attractions", "characters"];
        
        for (let i = 0; i < entities.length; i++) {
                if (entities[i] && entities[i].length > 0) { 
                    let names = [];

                    for (let j = 0; j < entities[i].length; j++) {
                        const response = await fetch(`http://localhost:3000/api/${entitiesVar[i]}/grab/${entities[i][j]}`);

                        if(response.ok) {
                            const responseData = await response.json();
                            names.push(responseData.name);
                        } else {
                            console.error(`Failed to fetch ${entitiesVar[i]} name`);
                        }
                    }

                    // Seperate the names into strings
                    switch(entitiesVar[i]) {
                        case "attractions":
                            attractions = names.join(', ');
                            break;
                        case "characters":
                            notable_characters = names.join(', ');
                            break;
                    }
                } else {
                    switch(entitiesVar[i]) {
                        case "attractions":
                            attractions = "";
                            break;
                        case "characters":
                            notable_characters = "";
                            break;
                    }
                }
            }
        
    };
    
    const deletePlace = async (object) => {
        message = "YOU WANT TO DELETE YOUR PLACE?"
        ShowForm();

        await waitForConfirm();

        if ( confirm=="Y" ){
            try {
                // Select the next place
                const selectResponse = await fetch(`http://localhost:3000/api/places/select/next/${object._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: object._id })
                });
                
                if (!selectResponse.ok) {
                    throw new Error(`Failed to select next place with ID ${object._id}`);
                } else {
                    // Delete the selected place
                    const deleteResponse = await fetch(`http://localhost:3000/api/places/${object._id}`, {
                        method: 'DELETE'
                    });
                    
                    if (!deleteResponse.ok) {
                        throw new Error(`Failed to delete place with ID ${object._id}`);
                    } else {
                        // Perform cleanup
                        const cleanupResponse = await fetch('http://localhost:3000/api/cleanup', {
                            method: 'DELETE'
                        });
                        
                        if (!cleanupResponse.ok) {
                            throw new Error('Failed to perform cleanup');
                        }
                    }
                }
                
                //Fetch updated places data
                const updatedPlacesResponse = await fetch('http://localhost:3000/api/places');
                const updatedPlaces = await updatedPlacesResponse.json();
                places = updatedPlaces.reverse();

                name = "";
                population = "";
                desc = "";
                image  = "";
                attractions = "";
                notable_characters = "";
                    
            }
            catch (error) {
                console.error('Error:', error.message);
            }                                   
            confirm = "";
        } else {
            confirm = "";
        };
    };

    async function editPlace(updatedPlaceData) {
        const objectId = updatedPlaceData._id;
        try {
            const response = await fetch(`http://localhost:3000/api/places/${objectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPlaceData),
            });
            
            if (response.ok) {
                const updatedPlace = await response.json();
                
                selectedplace = updatedPlace;
                selectedID = updatedPlace._id;
                name = updatedPlace.name;
                population = updatedPlace.population;
                desc = updatedPlace.desc;
                
                let entities    =   [updatedPlace.attractions, updatedPlace.notable_characters];
                let entitiesVar =   ["attractions", "characters"];
                
                
                for (let i = 0; i < entities.length; i++) {
                    let names = [];
                    if (entities[i] && entities[i].length > 0) { 
                        for (let j = 0; j < entities[i].length; j++) {
                            const response = await fetch(`http://localhost:3000/api/${entitiesVar[i]}/grab/${entities[i][j]}`);
                            if (response.ok) {
                                const responseData = await response.json();
                                names.push(responseData.name);
                            } else {
                                console.error(`Failed to fetch ${entitiesVar[i]} name`);
                            }
                        }
                    }
                

                // Separate the names into strings
                switch(entitiesVar[i]) {
                    case "attractions":
                        attractions = names.join(', ');
                        break;
                    case "characters":
                        notable_characters = names.join(', ');
                        break;
                }
            }
                
                // Fetch updated places
                const updatedPlacesResponse = await fetch('http://localhost:3000/api/places');
                const updatedPlaces = await updatedPlacesResponse.json();
                places = updatedPlaces.reverse();
            } else {
                console.error('Error editing place:', response.status);
            }

        } catch (error) {
            console.error('Failed to fetch:', error);
        }
    };
    
    const handleEditPlace = (e) => {
        editPlace(e.detail);
        showEdit = !showEdit;
    };
    
    function handleFileChange(event) {
        if (selectedID) {
            const file = event.target.files[0];
            const reader = new FileReader();
            
            reader.onload = async () => {
                image = reader.result;
                
                const place = {
                    _id: selectedID,
                    image
                };
                
                editPlace(place);
            };
        
            reader.readAsDataURL(file);

        } else {
            console.error("No Place Selected");
        };
    };

    async function handleFileRemove(){
        message = "YOU WANT TO REMOVE YOUR IMAGE?"
        ShowForm();

        await waitForConfirm();

        if ( confirm=="Y" ){
        
            if (selectedID) {
                image = "";
        
                const place = {
                    _id: selectedID,
                    image
                };
        
                editPlace(place);
                
            } else {
                console.error("No Place Selected");
            };
            confirm = "";
            
        } else {
            confirm = "";
        }

    };

    async function refreshData(object) {
        let finished = handleSelect(object);
        
        if (finished) {
            name = object.name;
            population = object.population;
            desc = object.desc;
            image = object.image; 

            let entities    =   [object.attractions, object.notable_characters];
            let entitiesVar =   ["attractions", "characters"];

            for (let i = 0; i < entities.length; i++) {
                if (entities[i] && entities[i].length > 0) { 
                    let names = [];

                    for (let j = 0; j < entities[i].length; j++) {
                        const response = await fetch(`http://localhost:3000/api/${entitiesVar[i]}/grab/${entities[i][j]}`);

                        if(response.ok) {
                            const responseData = await response.json();
                            names.push(responseData.name);
                        } else {
                            console.error(`Failed to fetch ${entitiesVar[i]} name`);
                        }
                    }

                    // Seperate the names into strings
                    switch(entitiesVar[i]) {
                        case "attractions":
                            attractions = names.join(', ');
                            break;
                        case "characters":
                            notable_characters = names.join(', ');
                            break;
                    }
                } else {
                    switch(entitiesVar[i]) {
                        case "attractions":
                            attractions = "";
                            break;
                        case "characters":
                            notable_characters = "";
                            break;
                    }
                }
            }
        } else {
            console.error("Couldn't finish. Failed to Select Place");  
        }
    };

</script>

<Form {showForm}>
    <Confirm message={message} on:Yes={()=>setConfirm("Y")} on:No={()=>setConfirm("N")}/>
</Form>

<!-- Add Place Form -->
<Modal {showAdd}>
    <AddPlace on:AddPlacetoList={addPlace} on:CancelAdd={ShowAdd}/>
</Modal>

<!-- Edit Place Form -->
<Modal {showEdit}>
    <EditPlace on:UpdatePlace={handleEditPlace} on:CancelEdit={ShowEdit}/>
</Modal>
    
<body style="display: {showAdd || showEdit ? 'none' : 'grid'}">
    <div class="body">
    <div>
        <div class="title">
            <!-- TITLE -->
            <button><a href="/worldmenu"><img src="../src/assets/back_arrow.png" alt="" id="arrow"></a></button>
            <h1 class="worldname">{selectedworld.name}</h1>
            <h1 class="page-title">PLACES</h1>
        </div>
        <div class="box" id="list-box">
            <!-- Add Button -->
            <button on:click={ShowAdd}><h1 class="add">ADD PLACE</h1></button><br><br>

            <!-- List -->
            <div class="text-box" id="list">
                {#each places as place}
                    <div class="place">
                        <button on:click = {ShowEdit(place)} title="Edit {place.name}" class="editbutton"><h1 class="edit"><img src="../src/assets/edit.png" alt="" class="edit"/></button>
                     
                        <button on:click = {refreshData(place)} title="Select {place.name}" class="listbutton" class:selected = { place._id == selectedID }><h3 class="listname">{place.name}</h3></button>

                        <button on:click = {() => deletePlace(place)} title="Delete {place.name}"class="deletebutton"><img src="../src/assets/delete.png" alt="" class="delete"/></button>
                    </div>    
                {/each}
            </div>
        </div>   
    </div>
    
    <div class="box" id="imageslot">
        <br><h2>CLICK ON THE IMAGE BELOW TO <br>UPLOAD THE IMAGE OF YOUR PLACE<br><br>RECOMMENDED SIZE: (1080 x 1920)</h2>
        <br><br>
        <div id="image-box">
            <label for="file-upload" class="custom-file-upload">
                <input id="file-upload" type="file" accept="image/*" on:change={handleFileChange}/>
                {#if image}
                <img src={image} alt='' id="image">
                {:else}
                <img src="../src/assets/blank image_vert.png" alt='' id="image">
                {/if}
            </label>
        </div>
        <br>
        <button title="Remove Image" class="remove" on:click={() => handleFileRemove()}>REMOVE IMAGE</button>

    </div>

    <div class="box" id="description">
        
        <!-- NAME TITLE -->
        {#if name}
            <h1 class="name">{name}</h1>
        {:else}
            <h1 class="name">...</h1>
        {/if}
        
        <!-- TEXT DESCRIPTION -->
        <div class="text-box" id="description">
            {#if name}
                <h3>NAME: 
                    {#if name}
                        <span class="display">
                            {name}
                        </span> 
                    {:else}
                        Unknown
                    {/if}
                </h3>

                <h3>POPULATION:
                    {#if population}
                        <span class="display">
                            {population}
                        </span> 
                    {:else}
                        Unknown
                    {/if}
                </h3> 
                
                <h3>NOTABLE CHARACTERS:
                    {#if notable_characters}
                    <span class="display">
                        {notable_characters}
                    </span>  
                    {:else}
                        Unknown
                    {/if}
                </h3> 

                <h3>ATTRACTIONS:
                    {#if attractions}
                    <span class="display">
                        {attractions}
                    </span> 
                    {:else}
                        Unknown
                    {/if}
                </h3> 

                <h3>DESCRIPTION:
                    {#if desc}
                    <span class="display">
                        {desc}
                    </span>  
                    {:else}
                        Unknown
                    {/if}
                </h3> 
                
            {:else}
                <h3 class ='blank'>ADD<br>A NEW PLACE<br><br> or <br><br>SELECT<br>A PLACE FROM THE LIST</h3>
            {/if}

            
        </div>
    </div>

</body>

<style>
    #imageslot {
        display: flex;           
        flex-direction: column;  
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
    .place {
        display: grid;
        grid-template-columns: 1fr 10fr 1fr;
        justify-content: center;
    }
    .delete{
        width: 20px;
    } 
    
    .edit{
        width: 20px;
    }

    .deletebutton, .editbutton {
        filter: grayscale();
        opacity: 50%;
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }

    .deletebutton:hover, .editbutton:hover{
        filter: none;
        opacity: 100%;
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }
    .listbutton {
        border-radius: 20px;
        margin-bottom: 10px;
        max-width: 400px;
        
    }
    .listbutton:hover {
        border: 2px solid rgb(191, 191, 191);
    }
    .blank {
        text-align: center;
    }
    .display {
        color: rgb(0, 0, 0);
        line-height: 2;
        overflow-wrap: break-word;
    }
    .selected, .selected:hover{
        border: 2px solid rgb(255, 0, 0);
        
    }
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
        max-width: 540px;
        
    }
    .title{
        padding-top: 20px;

    }
    .add, .edit{
        font-size: large;
        padding-bottom: 5px;
        text-justify: center;
        color: rgba(100, 28, 28, 0.338);
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }
    .add:hover, .edit:hover{
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
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: rgb(191, 0, 0);
        margin-bottom: 30px;
        max-width: 540px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        
    }
    .listname { 
        text-transform: uppercase;
        font-size: large;
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
        text-align: center;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        
    }
    .worldname {
        text-transform: uppercase;
        text-align: right;
        font-size: 20px;
        color:burlywood;
    }
    .page-title {
        text-transform: uppercase;
        font-size: 50px;
        text-align: right;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: rgb(213, 0, 0);
        margin-bottom: 30px;
    }
    
    .body {
        padding-top: 10px;
        padding-left: 10px;
        padding-bottom: 20px;
        width: 1920px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 30px;
        height: 90vh;
    }

    .box{ 
        background: rgb(255, 231, 196);
        border-radius: 20px;
        padding: 20px;
        max-height: 900px;
    }

    .text-box{
        background-color: white;
        height: 670px;
        max-width: 540px;
        padding: 20px;
        padding-top: 10px;
        border-radius: 20px;
        overflow-y: scroll;
        overflow-x: hidden;
        box-shadow: 0 0 10px rgba(115, 62, 62, 0.322);
        
    }
    h2 {
        font-size: small;
        text-align: center;
        color: rgba(0, 0, 0, 0.311)    
    }
    h3 {
        color: rgb(185, 185, 185);
        font-size: medium;
        margin: 5px;
    }
    button {
        background: transparent;
        border: transparent;
        cursor: pointer;
    }
</style>