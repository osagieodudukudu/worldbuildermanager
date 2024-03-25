<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import Form from "../components/Form.svelte";
    import Confirm from "../components/Confirm.svelte";

    let dispatch = createEventDispatcher();
    
    let selectedworld = [];
    let selectedevent = [];

   
    let allLocations = [];
    let allNotableCharacters = [];

    let selectname;
    let selectlocation;
    let selectdate;
    let selectnotecharacters;
    let selecthistory;

    let showForm = false;
    let confirm = "";
    let message = "";


    /**
     * @type {string | null | ArrayBuffer}
     */
     let image;
    /**
     * @type {Boolean}
     */
    let isSelected;
    /**
     * @type {String}
     */
    let location; 
    /**
     * @type {String}
     */
    let notable_character;
    /**
     * @type {String}
     */
    let history;
    /**
     * @type {Boolean}
     */
    let submitting;

    onMount(async () => {
        const response = await fetch('http://localhost:3000/api/worlds/selected');
            
            if (response.ok) {
                const data = await response.json();
                selectedworld = data;
            }

        const response2 = await fetch(`http://localhost:3000/api/location/grab/${selectedworld._id}`);
            
            if (response2.ok) {
                const data = await response2.json();
                allLocations = data;
            }

        const response3 = await fetch(`http://localhost:3000/api/notable_character/grab/${selectedworld._id}`);
            
            if (response3.ok) {
                const data = await response3.json();
                allNotableCharacters = data;
            }

    
    });

    const ShowForm = () => {

        showForm = !showForm;

    };

    function setConfirm(answer) {
        if (answer=="Y" || answer=="N"){
            confirm = answer;
            showForm = !showForm;
        } else {
        };
    };

    async function waitForConfirm() {
        while(showForm){
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    async function handleSubmit() {
        message = "YOU WANT TO EDIT YOUR EVENT?"
        ShowForm();

        await waitForConfirm();

        if (confirm == "Y") {
            confirm = "";
            submitting = true; 
            
            if (!selecthistory) { selecthistory = '' }; 
            isSelected = false;
    
            let entities    =   [selectedevent.location, selectedevent.notable_characters];
            let entitiesName = [selectlocation, selectnotecharacters];
            let entitiesVar =   ["location", "notable_characters"];
    
            for (let i = 0; i < entitiesName.length; i++) {
                if (entitiesName[i] && !(entitiesName[i].trim().length === 0)){

                    let Entity = {
                        world_id: selectedworld._id,
                        name: entitiesName[i],
                    };
        
                
                    //EDIT ENTITY
                    try {
                        let response = await fetch(`http://localhost:3000/api/${entitiesVar[i]}/${entities[i]}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
    
                            },
                            body: JSON.stringify(Entity),
                        });

                        if (!response.ok) {
                            //ADD ENTITY

                            response = await fetch(`http://localhost:3000/api/${entitiesVar[i]}/add`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(Entity),
                            });
        
                        }
        
                        if (response.ok) {
                            const responseData = await response.json();
        
                            switch(entitiesVar[i]) {
                                case "location":
                                    location = responseData._id;
                                    break;
                                case "notable_characters":
                                    notable_character = responseData._id;
                                    break;
                            }
                        } else {
                            throw new Error(`Failed to edit ${entitiesVar[i]}`);
                        }
        
                    } catch (error) {
                        console.error('Failed to fetch:', error);
                    }

                } else {
                    await fetch(`http://localhost:3000/api/${entitiesVar[i]}/${entities[i]}`, {
                            method: 'DELETE',
                    });
                }

            }
            
            const event = {
                world_id: selectedworld._id,
                name: selectname,
                location,
                date: selectdate,
                notable_character,
                history: selecthistory,
                image,
                isSelected
            };
            
            dispatch('UpdateEvent', event);

        } else {
            confirm = "";
        }
        
        
    };

    async function handleCancel() {

        message = "YOU WANT TO CANCEL?"
        ShowForm();

        await waitForConfirm();

        if (confirm == "Y") {
            dispatch('CancelEdit');
            confirm = "";

        } else {
            confirm = "";
        }
    
    } 

</script>

<Form {showForm}>
    <Confirm message={message} on:Yes={()=>setConfirm("Y")} on:No={()=>setConfirm("N")}/>
</Form>

<form on:submit|preventDefault = {handleSubmit}>
        
    <h3>EDIT YOUR EVENT!</h3> 

    <div class="container">

    <div>

        <h4>Name your event</h4>
        <input type="text" class="name" bind:value={selectname} required={submitting}>


        <h4>Give your event history</h4>
        <textarea class="description" bind:value={selecthistory}></textarea>
        
        
        <br><br>
        <br><br>
        <br><br>
        <h4>Date</h4>
        <input type="number" class="date" bind:value={selectdate} >

    </div>
    <div>

        <br><br>
        <h4>Location</h4>
        <input type="text" class="location" bind:value={selectlocation}>
        <h4 class="note"> or Pick from a Selection</h4>
        <select class="location" bind:value={selectlocation}>
            <option value=""></option>
            {#each allLocations as local}
            <option value={local.name}>{local.name}</option>
            {/each}
        </select>

        <br><br>
        <h4>Notable Characters</h4>
        <input type="text" class="notable_characters" bind:value={selectnotecharacters}>
        <h4 class="note"> or Pick from a Selection</h4>
        <select class="notable_characters" bind:value={selectnotecharacters}>
            <option value=""></option>
            {#each allNotableCharacters as note}
            <option value={note.name}>{note.name}</option>
            {/each}
        </select>
    
</div>
<br><br><br><br>
<button>EDIT YOUR EVENT</button>
<br><br><button type="button" on:click={handleCancel}>CANCEL</button>
    
    
</form>   

<style>
    button {
        cursor: pointer;
        border-radius: 20px;
        padding: 15px;
    }

    input, select {
        text-align: center;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    form {
        text-align: center;
       
    }

    h3 {
        font-size: x-large;
        color: rgb(255, 38, 0);
    }

    h4 {
        font-size: small;
        text-transform: uppercase;
    }
    
    .name, .notable_characters, .location, .gender, .species{
        width: 400px;
        height: 30px;
        border-radius: 20px;        

    }

    .age {
        width: 100px;
        height: 40px;
        border-radius: 20px; 
    }

    .description {
        width: 400px;
        height: 250px;
        padding: 10px;
        line-height: 2;
        border-radius: 20px;        
    }

    .note {
        font-size: 60%;
        color:rgb(201, 201, 201)
    }

    .container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 50px;
    }
    
</style>