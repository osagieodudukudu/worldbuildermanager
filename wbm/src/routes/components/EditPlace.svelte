<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import Form from "./Form.svelte";
    import Confirm from "./Confirm.svelte";


    let dispatch = createEventDispatcher();
    
    let selectedworld = [];

    let allNotableCharacters = [];
    let allAttractions = [];

    let newAttraction = '';

    let addedAttractions = [];

    let selectName;
    let selectBio;
    let selectPopulation;
    let selectAttractions = [];
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
    let notable_characters; 
    /**
     * @type {String}
     */
    let attractions;
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

        const response2 = await fetch(`http://localhost:3000/api/characters/grab/${selectedworld._id}`);
            
        if (response2.ok) {
            const data = await response2.json();
            allNotableCharacters = data;
        }
        const response3 = await fetch(`http://localhost:3000/api/attractions/grab/${selectedworld._id}`);
        
        if (response3.ok) {
            const data = await response3.json();
            allAttractions = data;
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
            confirm = "N";
        };
    };

    function addAttraction() {
        if (newAttraction) {
            addedAttractions = [...addedAttractions, newAttraction];
            newAttraction = '';
        }
    };

    function removeAttraction(index) {
        addedAttractions = addedAttractions.filter((attraction, i) => i !== index);
    };

    async function waitForConfirm() {
        while(showForm){
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    async function handleSubmit() {
        message = "YOU WANT TO ADD YOUR PLACE?";
        ShowForm();

        await waitForConfirm();

        if (confirm == "Y") {
            confirm = "";
            submitting = true;
            isSelected = false;

            try {
                let attractionIds = [];

                for (let i = 0; i < selectAttractions.length; i++) {
                    let attraction = selectAttractions[i];
                    attractionIds.push(attraction);
                }

                for (let i = 0; i < addedAttractions.length; i++) {
                    let attraction = addedAttractions[i];

                    let newEntity = {
                        world_id: selectedworld._id,
                        name: attraction,
                    };
                    
                    const response = await fetch(`http://localhost:3000/api/attractions/add`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newEntity),
                    });

                    if (response.ok) {
                        const responseData = await response.json();
                        attractionIds.push(responseData._id);
                    
                    } else {
                        throw new Error(`Failed to add attraction`);
                    }
                }

                const place = {
                    world_id: selectedworld._id,
                    name: selectName,
                    population: selectPopulation,
                    notable_characters: selectNotableCharacters.map(character => character.name),
                    attractions: attractionIds,
                    bio: selectBio,
                    image,
                    isSelected
                };

                dispatch('AddPlacetoList', place);
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
            dispatch('CancelAdd');
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
        
    <h3>ADD YOUR PLACE!</h3> 

    <div class="container">

    <div>

        <h4>Name your place</h4>
        <input type="text" class="name" bind:value={selectName} required={submitting}>


        <h4>Give your place a description</h4>
        <textarea class="description" bind:value={selectBio}></textarea>
        
        
        <br><br>
        <br><br>
        <br><br>
        <h4>Population</h4>
        <input type="number" class="population" bind:value={selectPopulation} min="0">

        <br><br>
    </div>
    <div>
        <h4>Attraction</h4>
        <input type="text" class="attraction" bind:value={newAttraction}>
        <button type="button" on:click={addAttraction}>Add</button>
        
        <div>
            {#each addedAttractions as attraction, index}
                <div>
                    <span>{attraction}</span>
                    <button on:click={() => removeAttraction(index)}>Remove</button>
                </div>
            {/each}
        </div>
        
        <h4 class="note"> or Pick from a Selection</h4>
        <select multiple class="attraction" bind:value={selectAttractions}>
            <option value=""></option>
            {#each allAttractions as attract}
                <option value={attract._id}>{attract.name}</option>
            {/each}
        </select>
                

        <br><br>

        <h4>Notable Characters</h4>
        {#each allNotableCharacters as character}
            <label>
                <input type="checkbox" bind:group={selectNotableCharacters} value={character._id}>
                {character.name}
            </label>
        {/each}

    </div>
    
</div>
<br><br><br><br>
<button>ADD YOUR PLACE</button>
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
    
    .name, .notable_character, .attraction{
        width: 400px;
        height: 30px;
        border-radius: 20px;        

    }

    .population {
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