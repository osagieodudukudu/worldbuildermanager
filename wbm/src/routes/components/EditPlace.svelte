<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import Form from "./Form.svelte";
    import Confirm from "./Confirm.svelte";
    import { all } from 'axios';


    let dispatch = createEventDispatcher();
    
    let selectedworld = [];
    let selectedplace = [];

    let allNotableCharacters = [];
    let allAttractions = [];

    let newAttraction = '';

    let addedAttractions = [];

    let selectName;
    let selectDescription;
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
     * @type {Boolean}
     */
    let submitting;

    let placeAttractions = [];
    let placeNotableCharacters = [];

    onMount(async () => {
        const response = await fetch('http://localhost:3000/api/worlds/selected');
            
            if (response.ok) {
                const data = await response.json();
                selectedworld = data;
            }

        const response1 = await fetch('http://localhost:3000/api/places/selected');

        if (response1.ok) {
            const data = await response1.json();
            selectedplace = data;
        }

        selectName = selectedplace.name;
        selectDescription = selectedplace.desc;
        selectPopulation =  selectedplace.population;

        selectedplace.attractions.forEach(attractionId => {
            selectAttractions.push(attractionId);
        });

        selectedplace.notable_characters.forEach(characterId => {
            selectNotableCharacters.push(characterId);
        });

        const response2 = await fetch(`http://localhost:3000/api/characters/grab/${selectedworld._id}`);
            
        if (response2.ok) {
            allNotableCharacters = await response2.json();
            console.log(allNotableCharacters);
        }
        

        const response3 = await fetch(`http://localhost:3000/api/attractions/grab/${selectedworld._id}`);
        
        if (response3.ok) {
            allAttractions = await response3.json();
            console.log(allAttractions);

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
        message = "YOU WANT TO EDIT YOUR PLACE?";
        ShowForm();

        await waitForConfirm();

        if (confirm == "Y") {
            confirm = "";
            submitting = true;
            isSelected = false;

            try {
                let attractionIds = [];
                let notableCharactersIds = [];

                //Edit Notable Charcters to Backend
                for (let i = 0; i < selectNotableCharacters.length; i++) {
                    let notable_character = selectNotableCharacters[i];
                    notableCharactersIds.push(notable_character);
                }

                //Edit Listed Attractions to Backend
                for (let i = 0; i < selectAttractions.length; i++) {
                    let attraction = selectAttractions[i];
                    attractionIds.push(attraction);
                }

                //Edit New Attractions to Backend
                for (let i = 0; i < addedAttractions.length; i++) {
                    let attraction = addedAttractions[i];

                    let newEntity = {
                        world_id: selectedworld._id,
                        name: attraction,
                    };
                    
                    const response = await fetch(`http://localhost:3000/api/attractions/edit`, {
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
                        throw new Error(`Failed to edit attraction`);
                    }
                }

                const place = {
                    world_id: selectedworld._id,
                    name: selectName,
                    population: selectPopulation,
                    notable_characters: notableCharactersIds,
                    attractions: attractionIds,
                    desc: selectDescription,
                    image,
                    isSelected
                };

                dispatch('UpdatePlace', place);
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
        
    <h3>EDIT YOUR PLACE!</h3> 

    <div class="container">

    <div>

        <h4>Name your place</h4>
        <input type="text" class="name" bind:value={selectName} required={submitting}>


        <h4>Give your place a description</h4>
        <textarea class="description" bind:value={selectDescription}></textarea>
        
        
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
        
        
        
        <br>
        <h4 class="note">New Attrations List</h4>
        <div class="boxscroll">
            {#each addedAttractions as attraction, index}
            <div>
                <span>{attraction}</span>
                <button on:click={() => removeAttraction(index)}>Remove</button>
            </div>
            {/each}
        </div>
        
        <h4 class="note"> and/or Pick from a Selection</h4>
        <div class="boxscroll">
            {#each allAttractions as attract}
                <label>
                    <input type="checkbox" bind:group={selectAttractions} value={attract._id}>
                    {attract.name}
                </label>
            {/each}
        </div>
        <br><br>

        <h4>Notable Characters</h4>
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
<button>EDIT YOUR PLACE</button>
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

    .boxscroll {
        border: 2px solid #ccc;
        border-radius: 20px;
        padding: 10px;
        margin-bottom: 20px;
        height: 75px;
        overflow-y: auto;
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