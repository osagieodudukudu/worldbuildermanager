<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import Modal from "../components/Modal.svelte";
    import Confirm from "../components/Confirm.svelte";

    let dispatch = createEventDispatcher();
    
    let selectedworld = [];
    let selectedcharacter = [];

   
    let allEthnicities = [];
    let allNationailities = [];
    let allGenders = [];
    let allSkills = [];
    let allAttributes = [];
    let allSpecies = [];

    let selectname;
    let selectbio;
    let selectage;
    let selectnationality;
    let selectethnicity;
    let selectgender;
    let selectskills;
    let selectattributes;
    let selectspecies;

    let showForm = false;
    let confirm = "";
    let message = "";


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
    let skills;
    /**
     * @type {String}
     */
    let attributes;
     /**
     * @type {String}
     */
    let species;
    /**
     * @type {Boolean}
     */
    let submitting;

    onMount(async () => {

        const response1 = await fetch('http://localhost:3000/api/worlds/selected');
            
        if (response1.ok) {
            const data = await response1.json();
            selectedworld = data;
            console.log('SELECTED WORLD FETCHED!')
            console.log('Response:', data);
        }

        
        const response = await fetch('http://localhost:3000/api/characters/selected');
        
        if (response.ok) {
            const data = await response.json();
            selectedcharacter = data;
            console.log('Response:', data);
        }
        
        selectname = selectedcharacter.name;
        selectbio = selectedcharacter.bio;
        selectage = selectedcharacter.age;
        
        let entities    =   [selectedcharacter.nationality, selectedcharacter.ethnicity, selectedcharacter.gender, selectedcharacter.skills, selectedcharacter.attributes, selectedcharacter.species];
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
                        selectnationality = responseData[0].name;
                
                        console.log (selectnationality);
                        break;
                    case "ethnicity":
                        selectethnicity = responseData[0].name;
        
                        console.log (selectethnicity);
                        break;
                    case "gender":
                        selectgender = responseData[0].name;
                        console.log (selectgender);
                        break;
                    case "skills":  
                        selectskills = responseData[0].name;
                        console.log (selectskills);
                        break;
                    case "attributes":
                        selectattributes = responseData[0].name;
            
                        console.log (selectattributes);
                        break;
                    case "species":
                        selectspecies = responseData[0].name;
                        console.log (selectspecies);
                        break;                        
                }
            }

        }

        const response2 = await fetch(`http://localhost:3000/api/ethnicity/grab/${selectedworld._id}`);
            
            if (response2.ok) {
                const data = await response2.json();
                allEthnicities = data;
                console.log(`ETHNICITIES FETCHED!`)
                console.log('Response:', data);
            }
        const response3 = await fetch(`http://localhost:3000/api/nationality/grab/${selectedworld._id}`);
            
            if (response3.ok) {
                const data = await response3.json();
                allNationailities = data;
                console.log(`NATIONALITIES FETCHED!`)
                console.log('Response:', data);
            }

        const response4 = await fetch(`http://localhost:3000/api/gender/`);
            
            if (response4.ok) {
                const data = await response4.json();
                allGenders = data;
                console.log(`GENDERS FETCHED!`)
                console.log('Response:', data);
            }
        
        const response5 = await fetch(`http://localhost:3000/api/skills/grab/${selectedworld._id}`);
            
            if (response5.ok) {
                const data = await response5.json();
                allSkills = data;
                console.log(`SKILLS FETCHED!`)
                console.log('Response:', data);
            }  
        
        const response6 = await fetch(`http://localhost:3000/api/attributes/grab/${selectedworld._id}`);
            
            if (response6.ok) {
                const data = await response6.json();
                allAttributes = data;
                console.log(`ATTRIBUTES FETCHED!`)
            }

        const response7 = await fetch(`http://localhost:3000/api/species/grab/${selectedworld._id}`);
            
            if (response7.ok) {
                const data = await response7.json();
                allSpecies = data;
                console.log(`SPECIES FETCHED!`)
            }
          
            
    });

    const ShowForm = () => {

        showForm = !showForm;
        console.log(showForm, `Confirmed`);

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

    async function handleSubmit() {
        message = "YOU WANT TO EDIT YOUR CHARACTER?"
        ShowForm();

        await waitForConfirm();

        if (confirm == "Y") {
            confirm = "";
            submitting = true; 
            
            if (!selectbio) { selectbio = '' }; 
            isSelected = false;
    
            let entities    =   [selectedcharacter.nationality, selectedcharacter.ethnicity, selectedcharacter.gender, selectedcharacter.skills, selectedcharacter.attributes, selectedcharacter.species];
            let entitiesName = [selectnationality, selectethnicity, selectgender, selectskills, selectattributes, selectspecies];
            let entitiesVar =   ["nationality", "ethnicity", "gender", "skills", "attributes", "species"];
    
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
                                case "nationality":
                                    nationality = responseData._id;
                                    console.log(nationality);
                                    break;
                                case "ethnicity":
                                    ethnicity = responseData._id;
                                    console.log(ethnicity);
                                    break;
                                case "gender":
                                    gender = responseData._id;
                                    console.log(gender);
                                    break;
                                case "skills":
                                    skills = responseData._id;
                                    console.log(skills);
                                    break;
                                case "attributes":
                                    attributes = responseData._id;
                                    console.log(attributes);
                                    break;
                                case "species":
                                    species = responseData._id;
                                    console.log(species);
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
        
            if (selectname) { 
            
                    const character = {
                        world_id: selectedworld._id,
                        name: selectname,
                        age: selectage,
                        ethnicity,
                        nationality,
                        gender,
                        skills,
                        attributes,
                        species,
                        bio: selectbio,
                        isSelected
                    };
    
                    
                console.log('Character in Queue', character);
    
                dispatch('UpdateCharacter', character);
            } else {
                window.alert("Give your character a name")
            }

        } else {
            console.log("Submit not confirmed")
            confirm = "";
        }
        
        
    };

    async function handleCancel() {

        message = "YOU WANT TO CANCEL?"
        ShowForm();

        await waitForConfirm();

        if (confirm == "Y") {
            dispatch('CancelAdd');
            confirm = "";

        } else {
            console.log("Cancel not confirmed");
            confirm = "";
        }
    
    } 

</script>

<Modal {showForm}>
    <Confirm message={message} on:Yes={()=>setConfirm("Y")} on:No={()=>setConfirm("N")}/>
</Modal>

<form on:submit|preventDefault = {handleSubmit} style="display: {showForm ? 'none' : 'grid'}">
        
    <h3>EDIT YOUR CHARACTER!</h3> 

    <div class="container">

    <div>

        <h4>Name your character</h4>
        <input type="text" class="name" bind:value={selectname} required={submitting}>


        <h4>Give your character a biography</h4>
        <textarea class="description" bind:value={selectbio}></textarea>
        
        
        <br><br>
        <h4>Age</h4>
        <input type="number" class="age" bind:value={selectage} required={submitting} min="0">

        <br><br>
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

    </div>
    <div>

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
        
        <br><br>
        <h4>Skills</h4>
        <input type="text" class="skills" bind:value={selectskills}>
        <h4 class="note"> or Pick from a Selection</h4>
        <select class="skills" bind:value={selectskills}>
            <option value=""></option>
            {#each allSkills as skills}
            <option value={skills.name}>{skills.name}</option>
            {/each}
        </select>
        
        <br><br>
        <h4>Attributes</h4>
        <input type="text" class="attributes" bind:value={selectattributes}>
        <h4 class="note"> or Pick from a Selection</h4>
        <select class="attributes" bind:value={selectattributes}>
            <option value=""></option>
            {#each allAttributes as attrib}
            <option value={attrib.name}>{attrib.name}</option>
            {/each}
        </select>

    </div>
    
</div>
<br><br><br><br>
<button>EDIT YOUR CHARACTER</button>
<br><br><button on:click={handleCancel}>CANCEL</button>
    
    
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
    
    .name, .ethnicity, .nationality, .gender, .skills, .attributes, .species{
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