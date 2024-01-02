<script>
    import { createEventDispatcher, onMount } from 'svelte';


    let dispatch = createEventDispatcher();
    

    let allEthnicities = [];
    let allNationailities = [];
    let allGenders = [];
    let allSkills = [];
    let allAttributes = [];

    let selectedworld = [];

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
                console.log('Response:', data);
            }  
            
    })

    async function handleSubmit() {
        submitting = true; 
        
        if (!bio) { bio = ''; }
        if (!image) { image = ''; }

        isSelected = false;

        let entities    =   [nationality, ethnicity, gender, skills, attributes];
        let entitiesVar =   ["nationality", "ethnicity", "gender", "skills", "attributes"];

        for (let i = 0; i < entities.length; i++) {
            
            let newEntity = {
                world_id: selectedworld._id,
                name: entities[i],
            };

            console.log(newEntity);

            
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
                        case "skills":
                            skills = responseData._id;
                            break;
                        case "attributes":
                            attributes = responseData._id;
                            break;

                    }
                }
                else {
                    throw new Error(`Failed to addd ${entitiesVar[i]}`);
                }

            } 
            
            catch (error) {
                console.error('Failed to fetch:', error);
            }
        }
    
        if (name && nationality && ethnicity && gender && skills && attributes) { 
        
                const person = {
                world_id: selectedworld._id,
                name,
                age,
                ethnicity,
                nationality,
                gender,
                skills,
                attributes,
                bio,
                image,
                isSelected
                };

                console.log('New Person in Queue', person);

                dispatch('AddPersontoList', person);
            
        }
    }

    function handleCancel() {

    dispatch('Cancel');

    }

</script>

<form on:submit|preventDefault = {handleSubmit}>
        
    <h3>ADD YOUR CHARACTER!</h3> 

    <div class="container">

    <div>

        <h4>Name your character</h4>
        <input type="text" class="name" bind:value={name} required={submitting}>


        <h4>Give your character a biography</h4>
        <textarea class="description" bind:value={bio}></textarea>
        
        
        <br><br><br><br><br><h4>Age</h4>
        <input type="number" class="age" bind:value={age} required={submitting}>
        
        <br><br><br><br><br><br><button>ADD YOUR CHARACTER</button>
        <br><br><button on:click={handleCancel}>CANCEL NEW PERSON</button>

    </div>
    
    <div>

        <h4>Nationality</h4>
        <input type="text" class="nationality" bind:value={nationality}>
        <h4 class="note"> or Pick from a Selection</h4>
        <select class="nationality" bind:value={nationality}>
            <option value=""></option>
            {#each allNationailities as nation}
            <option value={nation.name}>{nation.name}</option>
            {/each}
        </select>

        <br><br>
        <h4>Ethnicity</h4>
        <input type="text" class="ethnicity" bind:value={ethnicity}>
        <h4 class="note"> or Pick from a Selection</h4>
        <select class="ethnicity" bind:value={ethnicity}>
            <option value=""></option>
            {#each allEthnicities as ethnic}
            <option value={ethnic.name}>{ethnic.name}</option>
            {/each}
        </select>

        <br><br>
        <h4>Gender</h4>
        <input type="text" class="gender" bind:value={gender}>
        <h4 class="note"> or Pick from a Selection</h4>
        <select class="gender" bind:value={gender}>
            <option value=""></option>
            {#each allGenders as gender}
            <option value={gender.name}>{gender.name}</option>
            {/each}
        </select>
        
        <br><br>
        <h4>Skills</h4>
        <input type="text" class="skills" bind:value={skills}>
        <h4 class="note"> or Pick from a Selection</h4>
        <select class="skills" bind:value={skills}>
            <option value=""></option>
            {#each allSkills as skills}
            <option value={skills.name}>{skills.name}</option>
            {/each}
        </select>
        
        <br><br>
        <h4>Attributes</h4>
        <input type="text" class="attributes" bind:value={attributes}>
        <h4 class="note"> or Pick from a Selection</h4>
        <select class="attributes" bind:value={attributes}>
            <option value=""></option>
            {#each allAttributes as attrib}
            <option value={attrib.name}>{attrib.name}</option>
            {/each}
        </select>

    </div>

    </div>
    
    
</form>   

<style>
    button {
        cursor: pointer;
        border-radius: 20px;
        padding: 15px;
    }

    input {
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
    
    .name, .ethnicity, .nationality, .gender, .skills, .attributes{
        width: 400px;
        height: 30px;
        border-radius: 20px;        

    }

    .age {
        width: 50px;
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
    }

    
</style>