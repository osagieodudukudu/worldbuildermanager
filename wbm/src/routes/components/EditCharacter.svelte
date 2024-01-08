<script>
    import { createEventDispatcher, onMount } from 'svelte';


    let dispatch = createEventDispatcher();
    
    let selectedworld = [];

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


        /**
     * @type {string}
     */
    let name;
    /**
     * @type {string}
     */
    let bio;
    /**
     * @type {string | null | ArrayBuffer}
     */
    let image;
    /**
     * @type {Boolean}
     */
    let isSelected;
    /**
     * @type {Number}
     */
    let age;
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
        const response = await fetch('http://localhost:3000/api/worlds/selected');
            
            if (response.ok) {
                const data = await response.json();
                selectedworld = data;
                console.log('SELECTED WORLD FETCHED!')
                console.log('Response:', data);
            }

        let entities    =   [ selectnationality, selectethnicity, selectgender, selectskills, selectattributes, selectspecies ];
        let entitiesVar =   [ "nationality", "ethnicity", "gender", "skills", "attributes", "species" ];
        let allEntities =   [ allNationailities, allEthnicities, allGenders, allSkills, allAttributes, allSpecies ];

        for (let i =0; i<entities.length; i++) {
            const response = await fetch(`http://localhost:3000/api/${entitiesVar[i]}/grab/${selectedworld._id}`);

            if (response.ok) {
                
                const data = await response.json();
                allEntities[i] = data;
                console.log(`${entitiesVar[i]} FETCHED!`)
                console.log('Response:', data);

            }
        }  
            
    })

    async function handleSubmit() {
        submitting = true; 
        
        if (!selectbio) { selectbio = ''; }
        image = ''; 
        isSelected = false;

        let entities    =   [selectnationality, selectethnicity, selectgender, selectskills, selectattributes, selectspecies];
        let entitiesVar =   ["nationality", "ethnicity", "gender", "skills", "attributes", "species"];

        for (let i = 0; i < entities.length; i++) {
            
            let newEntity = {
                world_id: selectedworld._id,
                name: entities[i],
            };

           
            //EDIT ENTITY
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
                        case "skills":
                            skills = responseData._id;
                            break;
                        case "attributes":
                            attributes = responseData._id;
                            break;
                        case "species":
                            species = responseData._id;
                            break;
                    }
                }
                else {
                    throw new Error(`Failed to edit ${entitiesVar[i]}`);
                }

            } 
            
            catch (error) {
                console.error('Failed to fetch:', error);
            }
        }
    
        if (selectname && nationality && ethnicity && gender && skills && attributes && species) { 
        
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
                    image,
                    isSelected
                };

                
            console.log('Character in Queue', character);

            dispatch('EditCharactertoList', character);
        }
        
    }

    function handleCancel() {

    dispatch('Cancel');

    }

</script>

<form on:submit|preventDefault = {handleSubmit}>
        
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

        <br><br>
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

        <br><br><br><br>
        <button>EDIT YOUR CHARACTER</button>
        <br><br><button on:click={handleCancel}>CANCEL NEW CHARACTER</button>
    </div>

    </div>
    
    
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
    
</style>