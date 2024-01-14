<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import Form from "../components/Form.svelte";
    import Confirm from "../components/Confirm.svelte";


    let dispatch = createEventDispatcher();
    
    let selectedworld = [];

    let allEthnicities = [];
    let allNationailities = [];
    let allGenders = [];
    let allSpecies = [];

    let selectname;
    let selectbio;
    let selectage;
    let selectnationality;
    let selectethnicity;
    let selectgender;
    let selectspecies;

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
    let ethnicity; 
    /**
     * @type {String}
     */
    let nationality;
    /**
     * @type {String}
     */
    let gender;
     /**
     * @type {String}
     */
    let species;
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

        const response2 = await fetch(`http://localhost:3000/api/ethnicity/grab/${selectedworld._id}`);
            
            if (response2.ok) {
                const data = await response2.json();
                allEthnicities = data;
            }
        const response3 = await fetch(`http://localhost:3000/api/nationality/grab/${selectedworld._id}`);
            
            if (response3.ok) {
                const data = await response3.json();
                allNationailities = data;
            }

        const response4 = await fetch(`http://localhost:3000/api/gender/grab/${selectedworld._id}`);
            
            if (response4.ok) {
                const data = await response4.json();
                allGenders = data;
            }

        const response7 = await fetch(`http://localhost:3000/api/species/grab/${selectedworld._id}`);
            
            if (response7.ok) {
                const data = await response7.json();
                allSpecies = data;
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

    async function waitForConfirm() {
        while(showForm){
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    async function handleSubmit() {
        message = "YOU WANT TO ADD YOUR CHARACTER?";
        ShowForm();

        await waitForConfirm();

        if (confirm == "Y") {
            
            confirm = "";
            submitting = true; 
            
            if (!selectbio) { selectbio = ''; };
            isSelected = false;
    
            let entitiesName    =   [selectnationality, selectethnicity, selectgender, selectspecies];
            let entitiesVar =   ["nationality", "ethnicity", "gender", "species"];
    
            for (let i = 0; i < entitiesName.length; i++) {


                    let newEntity = {
                        world_id: selectedworld._id,
                        name: entitiesName[i],
                    };
        
                
                    //ADD ENTITY
                    try {
                        const response = await fetch(`http://localhost:3000/api/${entitiesVar[i]}/add`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(newEntity),
                        });
        
                        if (response.ok) {
                            const responseData = await response.json();
        
                            switch(entitiesVar[i]) {
                                case "nationality":
                                    nationality = responseData._id;
                                    break;
                                case "ethnicity":
                                    ethnicity = responseData._id;
                                    break;
                                case "gender":
                                    gender = responseData._id;
                                    break;
                                case "species":
                                    species = responseData._id;
                                    break;
                            }
                        }
                        else {
                            throw new Error(`Failed to add ${entitiesVar[i]}`);
                        }
        
                    } catch (error) {
                        console.error('Failed to fetch:', error);
                    }
                
            }
            
            const character = {
                world_id: selectedworld._id,
                name: selectname,
                age: selectage,
                ethnicity,
                nationality,
                gender,
                species,
                bio: selectbio,
                image,
                isSelected
            };
            
            dispatch('AddCharactertoList', character);

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
    } 

</script>

<Form {showForm}>
    <Confirm message={message} on:Yes={()=>setConfirm("Y")} on:No={()=>setConfirm("N")}/>
</Form>

<form on:submit|preventDefault = {handleSubmit}>
        
    <h3>ADD YOUR CHARACTER!</h3> 

    <div class="container">

    <div>

        <h4>Name your character</h4>
        <input type="text" class="name" bind:value={selectname} required={submitting}>


        <h4>Give your character a biography</h4>
        <textarea class="description" bind:value={selectbio}></textarea>
        
        
        <br><br>
        <br><br>
        <br><br>
        <h4>Age</h4>
        <input type="number" class="age" bind:value={selectage} min="0">

        <br><br>
    </div>
    <div>
        <h4>Nationality</h4>
        <input type="text" class="nationality" bind:value={selectnationality}>
        <h4 class="note"> or Pick from a Selection</h4>
        <select class="nationality" bind:value={selectnationality}>
            <option value=""></option>
            {#each allNationailities as nation}
            <option value={nation.name}>{nation.name}</option>
            {/each}
        </select>

        <br><br>
        <h4>Ethnicity</h4>
        <input type="text" class="ethnicity" bind:value={selectethnicity}>
        <h4 class="note"> or Pick from a Selection</h4>
        <select class="ethnicity" bind:value={selectethnicity}>
            <option value=""></option>
            {#each allEthnicities as ethnic}
            <option value={ethnic.name}>{ethnic.name}</option>
            {/each}
        </select>

        <h4>Gender</h4>
        <input type="text" class="gender" bind:value={selectgender}>
        <h4 class="note"> or Pick from a Selection</h4>
        <select class="gender" bind:value={selectgender}>
            <option value=""></option>
            {#each allGenders as gender}
            <option value={gender.name}>{gender.name}</option>
            {/each}
        </select>

        <br><br>
        <h4>Species</h4>
        <input type="text" class="species" bind:value={selectspecies}>
        <h4 class="note"> or Pick from a Selection</h4>
        <select class="species" bind:value={selectspecies}>
            <option value=""></option>
            {#each allSpecies as species}
            <option value={species.name}>{species.name}</option>
            {/each}
        </select>

    </div>
    
</div>
<br><br><br><br>
<button>ADD YOUR CHARACTER</button>
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
    
    .name, .ethnicity, .nationality, .gender, .species{
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