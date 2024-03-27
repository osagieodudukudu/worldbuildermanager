<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import Form from "./Form.svelte";
    import Confirm from "./Confirm.svelte";


    let dispatch = createEventDispatcher();
    
    let selectedworld = [];
    let selectedevent = [];

    let allNotableCharacters = [];
    let allLocations = [];


    let selectName;
    let selectHistory;
    let selectDate;
    let selectLocation;
    let selectNotableCharacters = [];
    
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
    let notablecharacters; 
    /**
     * @type {String}
     */
    let locations;
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
        const response1 = await fetch('http://localhost:3000/api/events/selected');

            if (response1.ok) {
                const data = await response1.json();
                selectedevent = data;
            }    

            selectName = selectedevent.name;
            selectHistory = selectedevent.history;

            let backendDate =  selectedevent.date; 
            let dateObject = new Date(backendDate);
            let year = dateObject.getUTCFullYear(); 
            let month = ('0' + (dateObject.getMonth() + 1)).slice(-2); 
            let day = ('0' + dateObject.getDate()).slice(-2); 
            selectDate = `${year}-${month}-${day}`;

            selectLocation = selectedevent.location;
            console.log(selectLocation);

            selectedevent.notable_characters.forEach(characterId => {
            selectNotableCharacters.push(characterId);
            });

        const response2 = await fetch(`http://localhost:3000/api/characters/grab/${selectedworld._id}`);
            
            if (response2.ok) {
                const data = await response2.json();
                allNotableCharacters = data;
            }
        const response3 = await fetch(`http://localhost:3000/api/places/grab/${selectedworld._id}`);
        
            if (response3.ok) {
                const data = await response3.json();
                allLocations = data;
                }

        console.log('Selected Notable Characters:', selectNotableCharacters);
        console.log('All Notable Characters:', allNotableCharacters); 
    });
    
    const ShowForm = () => {
        
        showForm = !showForm;
        
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

    async function handleSubmit() {
        message = "YOU WANT TO ADD YOUR EVENT?";
        ShowForm();

        await waitForConfirm();

        if (confirm == "Y") {
            
            confirm = "";
            submitting = true; 
            
            if (!selectHistory) { selectHistory = ''; };
            
            isSelected = false;
    
            try {
                let notableCharactersIds = [];

                //Add Notable Charcters to Backend
                for (let i = 0; i < selectNotableCharacters.length; i++) {
                    let notable_character = selectNotableCharacters[i];
                    notableCharactersIds.push(notable_character);
                }

                const event = {
                    world_id: selectedworld._id,
                    name: selectName,
                    date: selectDate,
                    notable_characters: notableCharactersIds,
                    location: selectLocation,
                    history: selectHistory,
                    image,
                    isSelected
                };

                dispatch('EditEvent', event);
            } catch (error) {
                console.error('Failed to fetch:', error);
            }

        } else {
            confirm = "";
        }

    }


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
    };

</script>

<Form {showForm}>
    <Confirm message={message} on:Yes={()=>setConfirm("Y")} on:No={()=>setConfirm("N")}/>
</Form>

<form on:submit|preventDefault = {handleSubmit}>
        
    <h3>EDIT YOUR EVENT!</h3> 

    <div class="container">

    <div>

        <h4>Name your event</h4>
        <input type="text" class="name" bind:value={selectName} required={submitting}>


        <h4>Give your event some history</h4>
        <textarea class="history" bind:value={selectHistory}></textarea>
        
        
        <br><br>
        <br><br>
        <br><br>

        <h4>Date</h4>
        <input type="date" class="date" bind:value={selectDate}>

        <br><br>
    </div>
    <div>
        <h4>Location</h4>
        <h4 class="note">Pick from a Selection</h4>
        <h4 class="note">or go to the place tab to create more!</h4>
        <div class="boxscroll">
            {#each allLocations as location}
                <label>
                    <input type="radio" bind:group={selectLocation} value={location._id} checked={location._id === selectLocation}>
                    {location.name}
                </label>
                {/each}
            </div>
            <br><br>
            
        <h4>Notable Characters</h4>
        <h4 class="note">Pick from a Selection </h4>
        <h4 class="note">or go to the character tab to create more!</h4>
        
        <div class="boxscroll">
            {#each allNotableCharacters as character}
            <label>
                <input type="checkbox" bind:group={selectNotableCharacters} value={character._id}>
                {character.name}
            </label>
            {/each}
        </div>

    </div>
    
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
    
    .name, .notablecharacter, .location{
        width: 400px;
        height: 30px;
        border-radius: 20px;        

    }

    .boxscroll {
        border: 2px solid #ccc;
        border-radius: 20px;
        padding: 10px;
        margin-bottom: 20px;
        height: 75px;
        overflow-y: auto;
    }

    .date {
        width: 150px;
        height: 40px;
        border-radius: 20px; 
    }

    .history {
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