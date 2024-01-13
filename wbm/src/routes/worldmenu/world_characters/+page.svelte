<script>

    import { onMount } from 'svelte';

    import AddCharacter from '../../components/AddCharacter.svelte';
    import EditCharacter from '../../components/EditCharacter.svelte';
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
    let selectedcharacter = [];
    /**
     * @type {any[]}
     */
    let characters = [];

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
    let age;
    /**
     * @type {any}
     */
     let nationality;
    /**
     * @type {any}
     */
    let ethnicity;
    /**
     * @type {any}
     */
    let gender;
    /**
     * @type {any}
     */
    let species;
    /**
     * @type {any}
     */
    let skills;
    /**
     * @type {any}
     */
    let attributes;
    /**
     * @type {any}
     */
    let bio;
    /**
     * @type {any}
     */
    let image;
    

    onMount(async () => {
        
        const response = await fetch('http://localhost:3000/api/worlds/selected');
        
        if (response.ok) {
            const data = await response.json();
            selectedworld = data;
            console.log('SELECTED WORLD FETCHED!');
            console.log('Response:', data);
        }

        const response2 = await fetch(`http://localhost:3000/api/characters/grab/${selectedworld._id}`);

        if (response2.ok) {
            const data = await response2.json();
            characters = data;
            console.log('CHARACTERS OF WORLD FETCHED!');
            console.log('Response:', data);
        }

    });

    const ShowForm = () => {

        showForm = !showForm;
        console.log(showForm, `Confirmed`)

    };

    const ShowAdd = () => {

        showAdd = !showAdd;
        console.log(showAdd, `Add made it through`)
        
    };
    
    const ShowEdit = (e) => {
        handleSelect(e);
        showEdit = !showEdit;
        console.log(showEdit, `Edit made it through`)
    };

    function setConfirm(answer) {
        if (answer=="Y" || answer=="N"){
            confirm = answer;
            showForm = !showForm;
        } else {
            console.log('Invailid Input', confirm);
        };
    };

    async function waitForConfirm() {
        while(showForm){
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log("Form Closed", confirm)
    };

    async function getSelected() {
        const response = await fetch('http://localhost:3000/api/characters/selected');
    
        if (response.ok) {
            const data = await response.json();

            if (data.world_id == selectedworld._id) {
                selectedcharacter = data;
            }

            console.log('SELECTED CHARACTER FETCHED!')
            console.log('Response:', selectedcharacter);
        }
        else {
            selectedcharacter = selectedcharacter;
        }
    };
    
    async function handleSelect(object){
        
        const response = await fetch(`http://localhost:3000/api/characters/select/${ object._id }`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: object._id })
        });

        if (response.ok) {
            const selectedcharacter = await response.json();
            console.log('SELECTED CHARACTER FETCHED!');
            console.log('Response:', selectedcharacter.name);

            return true;
        } 

        else{
            return false;
        }

    }; 
    
    const addCharacter = async(e) => {
        
        console.log(e.detail);
        const newCharacter = e.detail;
        
        fetch('http://localhost:3000/api/characters/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCharacter),
        })
        .then((response) => {
            
            if (response.ok) {
                return response.json();
                
            } 
            
            else {
                throw new Error('Failed to add character');
            }
            
        })
        .then((addedCharacter) => {
            
            console.log('Added Character:', addedCharacter);
            characters = [ ...characters, addedCharacter];
            
            showAdd = !showAdd;

            handleSelect(addedCharacter);
            selectedID = addedCharacter._id;
            
        })
        .then((selectionResult) => {
            if (selectionResult) {
                console.log('Character selected successfully.');
            } else {
                console.log('Failed to select character.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            
        });
        
        selectedID = newCharacter.selectedID;
        name = newCharacter.name;
        age = newCharacter.age;
        bio = newCharacter.bio;
        image = newCharacter.image;

        let entities    =   [newCharacter.nationality, newCharacter.ethnicity, newCharacter.gender, newCharacter.skills, newCharacter.attributes, newCharacter.species];
        let entitiesVar =   ["nationality", "ethnicity", "gender", "skills", "attributes", "species"];
        
        for (let i = 0; i < entities.length; i++) {
            
            const response = await fetch(`http://localhost:3000/api/${entitiesVar[i]}/grab/${entities[i]}`);
            
            if(response.ok) {
                const responseData = await response.json();
                console.log('EntityGrab:', responseData, `${entities[i]}`);
                
                switch(entitiesVar[i]) {
                    case "nationality": 
                        nationality = responseData[0].name;
                        break;
                    case "ethnicity":
                        ethnicity = responseData[0].name;
                        break;
                    case "gender":
                        gender = responseData[0].name;
                        break;
                    case "skills":  
                        skills = responseData[0].name;
                        break;
                    case "attributes":
                        attributes = responseData[0].name;
                        break;
                    case "species":
                        species = responseData[0].name;
                        break;                        
                    }
            } else {
                switch(entitiesVar[i]) {
                    case "nationality": 
                        nationality = "";
                        break;
                    case "ethnicity":
                        ethnicity = "";
                        break;
                    case "gender":
                        gender = "";
                        break;
                    case "skills":  
                        skills = "";
                        break;
                    case "attributes":
                        attributes = "";
                        break;
                    case "species":
                        species = "";
                        break;                        
                    }
            }

        }
        
    };
    
    const deleteCharacter = async (object) => {
        message = "YOU WANT TO DELETE YOUR CHARACTER?"
        ShowForm();

        await waitForConfirm();

        if ( confirm=="Y" ){
            try {
                // Select the next character
                const selectResponse = await fetch(`http://localhost:3000/api/characters/select/next/${object._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: object._id })
                });
                
                if (!selectResponse.ok) {
                    throw new Error(`Failed to select next character with ID ${object._id}`);
                } else {
                    console.log('Next Character selected successfully');
                    // Delete the selected character
                    const deleteResponse = await fetch(`http://localhost:3000/api/characters/${object._id}`, {
                        method: 'DELETE'
                    });
                    
                    if (!deleteResponse.ok) {
                        throw new Error(`Failed to delete character with ID ${object._id}`);
                    } else {
                        console.log('Character deleted successfully');
                        // Perform cleanup
                        const cleanupResponse = await fetch('http://localhost:3000/api/cleanup', {
                            method: 'DELETE'
                        });
                        
                        if (!cleanupResponse.ok) {
                            throw new Error('Failed to perform cleanup');
                        }
                        console.log('Cleanup completed successfully');
                    }
                }
                
                //Fetch updated characters data
                const updatedCharactersResponse = await fetch('http://localhost:3000/api/characters');
                const updatedCharacters = await updatedCharactersResponse.json();
                characters = updatedCharacters.reverse();
                console.log(updatedCharacters);
                    
            }
            catch (error) {
                console.error('Error:', error.message);
            }                                   
            confirm = "";
        } else {
            confirm = "";
        };
    };

    async function editCharacter(updatedCharacterData) {
        const objectId = updatedCharacterData._id;
        console.log(updatedCharacterData.name, objectId);
        try {
            const response = await fetch(`http://localhost:3000/api/characters/${objectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCharacterData),
            });
            
            if (response.ok) {
                const updatedCharacter = await response.json();
                
                selectedcharacter = updatedCharacter;
                selectedID = updatedCharacter._id;
                name = updatedCharacter.name;
                age = updatedCharacter.age;
                bio = updatedCharacter.bio;
                
                let entities    =   [updatedCharacter.nationality, updatedCharacter.ethnicity, updatedCharacter.gender, updatedCharacter.skills, selectedcharacter.attributes, selectedcharacter.species];
                let entitiesVar =   ["nationality", "ethnicity", "gender", "skills", "attributes", "species"];
                

                for (let i = 0; i < entities.length; i++) {
                    
                    const response = await fetch(`http://localhost:3000/api/${entitiesVar[i]}/grab/${entities[i]}`);
                    
                    if(response.ok) {
                        const responseData = await response.json();
                        console.log(responseData);
                        console.log(`${entitiesVar[i]} FETCHED!`);

                        console.log('EntityGrab:', responseData, `${entities[i]}`);
                        
                        switch(entitiesVar[i]) {
                            case "nationality": 
                                nationality = responseData[0].name;
                        
                                console.log (nationality);
                                break;
                            case "ethnicity":
                                ethnicity = responseData[0].name;
                
                                console.log (ethnicity);
                                break;
                            case "gender":
                                gender = responseData[0].name;
                                console.log (gender);
                                break;
                            case "skills":  
                                skills = responseData[0].name;
                                console.log (skills);
                                break;
                            case "attributes":
                                attributes = responseData[0].name;
                    
                                console.log (attributes);
                                break;
                            case "species":
                                species = responseData[0].name;
                                console.log (species);
                                break;                        
                        }
                    }

                }

                console.log('Character updated:', updatedCharacter);

                const updatedCharactersResponse = await fetch('http://localhost:3000/api/characters');
                const updatedCharacters = await updatedCharactersResponse.json();
                console.log('Reloaded Character List:', updatedCharacters, characters);
                characters = updatedCharacters.reverse();
            } 
            else {
            console.error('Error editing character:', response.status);
            }
        } 
    
        catch (error) {
            console.error('Failed to fetch:', error);
        }
    };
    
    const handleEditCharacter = (e) => {
        editCharacter(e.detail);
        console.log('Edit Character clicked');
        showEdit = !showEdit;
    };
    
    function handleFileChange(event) {
        if (selectedID) {
            const file = event.target.files[0];
            const reader = new FileReader();
            
            reader.onload = async () => {
                image = reader.result;
                
                const character = {
                    _id: selectedID,
                    image
                };
                
                editCharacter(character);
            };
        
            reader.readAsDataURL(file);

        } else {
            window.alert("No Character Selected")
        };
    };

    function handleFileRemove(){
        image = "";

        const character = {
            image
        };

        editCharacter(character);

    };

    async function refreshData(object) {
        console.log('New Character Selction')

        let finished = handleSelect(object);
        
        if (finished) {

            selectedID = object._id;
            name = object.name;
            age = object.age;
            bio = object.bio;
            image = object.image; 

            let entities    =   [object.nationality, object.ethnicity, object.gender, object.skills, object.attributes, object.species];
            let entitiesVar =   ["nationality", "ethnicity", "gender", "skills", "attributes", "species"];

            for (let i = 0; i < entities.length; i++) {

                if (entities[i]){
                    const response = await fetch(`http://localhost:3000/api/${entitiesVar[i]}/grab/${entities[i]}`);
    
                    if(response.ok) {
                        const responseData = await response.json();
    
                        switch(entitiesVar[i]) {
                            case "nationality":
                                nationality = responseData[0].name;
                                break;
                            case "ethnicity":
                                ethnicity = responseData[0].name;
                                break;
                            case "gender":
                                gender = responseData[0].name;
                                break;
                            case "skills":
                                skills = responseData[0].name;
                                break;
                            case "attributes":
                                attributes = responseData[0].name;
                                break;
                            case "species":
                                species = responseData[0].name;
                                break;
                        }
    
                    }

                } else {
                    switch(entitiesVar[i]) {
                        case "nationality":
                            nationality = "";
                            break;
                        case "ethnicity":
                            ethnicity = "";
                            break;
                        case "gender":
                            gender = "";
                            break;
                        case "skills":
                            skills = "";
                            break;
                        case "attributes":
                            attributes = "";
                            break;
                        case "species":
                            species = "";
                            break;
                    }

                }

            }
        }
        else {
            console.error("Couldn't finish. Failed to Select Character");  
        }
    };
</script>

<Form {showForm}>
    <Confirm message={message} on:Yes={()=>setConfirm("Y")} on:No={()=>setConfirm("N")}/>
</Form>

<!-- Add Character Form -->
<Modal {showAdd}>
    <AddCharacter on:AddCharactertoList={addCharacter} on:CancelAdd={ShowAdd}/>
</Modal>

<!-- Edit Character Form -->
<Modal {showEdit}>
    <EditCharacter on:UpdateCharacter={handleEditCharacter} on:CancelEdit={ShowEdit}/>
</Modal>
    
<body style="display: {showAdd || showEdit ? 'none' : 'grid'}">
    <div class="body">
    <div>
        <div class="title">
            <!-- TITLE -->
            <button><a href="/worldmenu"><img src="../src/assets/back_arrow.png" alt="" id="arrow"></a></button>
            <h1 class="worldname">{selectedworld.name}</h1>
            <h1 class="page-title">CHARACTERS</h1>
        </div>
        <div class="box" id="list-box">
            <!-- Add Button -->
            <button on:click={ShowAdd}><h1 class="add">ADD CHARACTER</h1></button><br><br>

            <!-- List -->
            <div class="text-box" id="list">
                {#each characters as character}
                    <div class="character">
                        <button on:click = {ShowEdit(character)} title="Edit {character.name}" class="editbutton"><h1 class="edit"><img src="../src/assets/edit.png" alt="" class="edit"/></button>
                            
                        <button on:click = {refreshData(character)} title="Select {character.name}" class="listbutton" class:selected = { character._id == selectedID }><h3 class="listname">{character.name}</h3></button>

                        <button on:click = {() => deleteCharacter(character)} title="Delete {character.name}"class="deletebutton"><img src="../src/assets/delete.png" alt="" class="delete"/></button>
                    </div>    
                {/each}
            </div>
        </div>   
    </div>
    
    <div class="box" >
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

                <h3>AGE:
                    {#if age}
                        <span class="display">
                            {age}
                        </span> 
                    {:else}
                        Unknown
                    {/if}
                </h3> 
                
                <h3>ETHNICITY:
                    {#if ethnicity}
                    <span class="display">
                        {ethnicity}
                    </span>  
                    {:else}
                        Unknown
                    {/if}
                </h3> 

                <h3>NATIONALITY:
                    {#if nationality}
                    <span class="display">
                        {nationality}
                    </span> 
                    {:else}
                        Unknown
                    {/if}
                </h3> 
                
                <h3>GENDER:
                    {#if gender}
                    <span class="display">
                        {gender}
                    </span>  
                    {:else}
                        Unknown
                    {/if}
                </h3> 

                <h3>SPECIES:
                    {#if species}
                    <span class="display">
                        {species}
                    </span>  
                    {:else}
                        Unknown
                    {/if}
                </h3> 

                <h3>SKILLS:
                    {#if skills}
                    <span class="display">
                        {skills}
                    </span>  
                    {:else}
                        Unknown
                    {/if}
                </h3> 

                <h3>ATTRIBUTES:
                    {#if attributes}
                    <span class="display">
                        {attributes}
                    </span>  
                    {:else}
                        Unknown
                    {/if}
                </h3> 

                <h3>BIO:
                    {#if bio}
                    <span class="display">
                        {bio}
                    </span>  
                    {:else}
                        Unknown
                    {/if}
                </h3> 
                
            {:else}
                <h3 class ='blank'>ADD<br>A NEW CHARACTER<br><br> or <br><br>SELECT<br>A CHARACTER FROM THE LIST</h3>
            {/if}

            
        </div>
    </div>

</body>

<style>
    .character {
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