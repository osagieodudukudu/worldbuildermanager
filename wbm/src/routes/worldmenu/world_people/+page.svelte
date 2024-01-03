<script>
        import { onMount } from 'svelte';
    
        import AddPerson from '../../components/AddPerson.svelte';
        import EditPerson from '../../components/EditPerson.svelte';
        import Modal from '../../components/Modal.svelte';
    
       
        let selectedworld = [];
        let selectedperson = [];
        let selectedpersonData = []
        let people = [];
    
        let showAdd = false; 
        let showEdit = false;
        let reload = false;
    
        onMount(async () => {
            
            const response = await fetch('http://localhost:3000/api/worlds/selected');
            
            if (response.ok) {
                const data = await response.json();
                selectedworld = data;
                console.log('SELECTED WORLD FETCHED!');
                console.log('Response:', data);
            }

            const response2 = await fetch(`http://localhost:3000/api/people/grab/${selectedworld._id}`);

            if (response2.ok) {
                const data = await response2.json();
                people = data.reverse();
                console.log('PEOPLE OF WORLD FETCHED!');
                console.log('Response:', data);
            }

            const response3 = await fetch('http://localhost:3000/api/people/selected');
        
            if (response3.ok) {
                const data = await response3.json();

                if (data.world_id == selectedworld._id) {
                    selectedperson = data;
                }

                console.log('SELECTED PERSON FETCHED!')
                console.log('Response:', data);
            }
            else {
                selectedperson = selectedperson;
            }

            handleSelect(selectedperson._id)

        });
    
        const ShowAdd = () => {
    
            showAdd = !showAdd;
            console.log(showAdd, `Add made it through`)
    
        };
    
        const ShowEdit = () => {
    
            showEdit = !showEdit;
            console.log(showEdit, `Edit made it through`)
    
        };
    
        // @ts-ignore
        const addPerson = (e) => {
        
            console.log(e.detail);
            const newPerson = e.detail;
    
            fetch('http://localhost:3000/api/people/add', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPerson),
            })
                .then((response) => {
    
                    if (response.ok) {
                    return response.json();
                } 
                
                else {
                    throw new Error('Failed to add person');
                }
                
            })
                .then((addedPerson) => {
    
                console.log('Added Person:', addedPerson);
                people = [addedPerson, ...people];
    
                showAdd = !showAdd;
    
                })
    
                .catch((error) => {
                console.error('Error:', error);
    
                });
        };
    
        async function editPerson(updatedPeopleData) {
            const objectId = selectedperson._id;
            console.log(objectId);
            try {
                await fetch(`http://localhost:3000/api/people/${objectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPeopleData),
                });
            } 
            
            catch (error) {
                console.error('Failed to fetch:', error);
            }
        }
        
        function handleFileChange(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            
            reader.onload = () => {
                const image = reader.result;
            
                const people = {
                    image
                };
                
                editPerson(people);
            };
        
            reader.readAsDataURL(file);
        }
    
        function handleFileRemove(){
            const image = "";
    
            const people = {
                image
            };
    
            editPerson(people);
    
        }
    
        const handleEditPerson = (e) => {
            editPerson(e.detail);
            console.log('Edit Person clicked');
            showEdit = !showEdit;
        }

        async function handleSelect (objectid){
            let nationality = selectedperson.nationality;
            console.log(nationality);

            let ethnicity = selectedperson.ethnicity;
            console.log(ethnicity);

            let gender = selectedperson.gender;
            console.log(gender);

            let skills = selectedperson.skills;
            console.log(skills);

            let attributes = selectedperson.attributes;
            console.log(attributes);

            let entities    =   [nationality, ethnicity, gender, skills, attributes];
            let entitiesVar =   ["nationality", "ethnicity", "gender", "skills", "attributes"];
            
            const response = await fetch(`http://localhost:3000/api/people/select/${ objectid }`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: objectid })
            });

            if (response.ok) {
                const selectedperson = await response.json();
                console.log('SELECTED PERSON FETCHED!');
                console.log('Response:', selectedperson);
            } 

            

            for (let i = 0; i < entities.length; i++) {

                const response2 = await fetch(`http://localhost:3000/api/${entitiesVar[i]}/grab/${entities[i]}`);

                if(response2.ok) {
                    const responseData = await response2.json();
                    console.log('EntityGrab:',responseData, `${entities[i]}`);

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
                    }
                }
            }

            selectedpersonData = {
                isSelected: selectedperson.isSelected,
                _id: selectedperson._id,
                name: selectedperson.name, 
                age: selectedperson.age,
                nationality,
                ethnicity,
                gender,
                skills,
                attributes,
                bio: selectedperson.bio,
                image: selectedperson.image
            };

            console.log(selectedpersonData);

        }; 

    </script>

    <Modal {showAdd}>
        <AddPerson on:AddPersontoList={addPerson} on:Cancel={ShowAdd}/>
    </Modal>
    
    <!-- Edit Person Form -->
    <Modal {showEdit}>
        <EditPerson on:UpdateWorldtoList={handleEditPerson} on:Cancel={ShowEdit}/>
    </Modal>
    
    <body style="display: {showAdd || showEdit ||reload ? 'none' : 'grid'}">
        <div class="body" >
        <div>
            <div class="title">
                <!-- TITLE -->
                <button><a href="/worldmenu"><img src="../src/assets/back_arrow.png" alt="" id="arrow"></a></button>
                <h1 class="worldname">{selectedworld.name}</h1>
                <h1 class="page-title">PEOPLE</h1>
            </div>
            <div class="box" id="list-box">
                <!-- Add Button -->
                <button on:click={ShowAdd}><h1 class="add">ADD PERSON</h1></button><br><br>

                <!-- List -->
                <div class="text-box" id="list">
                    {#each people as person}
                    <button on:click={ handleSelect(person._id)} class="listbutton" class:selected = {person._id == selectedperson._id}><h3 class="listname">{person.name}</h3></button>
                        
                    {/each}
                </div>
            </div>   
        </div>
        
        <div class="box" >
            <br><h2>CLICK ON THE IMAGE BELOW TO <br>UPLOAD THE IMAGE OF YOUR PLACE<br><br>RECOMMENDED SIZE: (1080 x 1920)</h2>
            <br><br>
            <div id="image-box">
                
                <label for="file-upload" class="custom-file-upload">
                    <input id="file-upload" type="file" accept="image/*" on:change={handleFileChange} />
                    {#if selectedperson.image}
                        <img src={selectedperson.image} alt='' id="image">
                    {:else}
                        <img src="../src/assets/blank image_vert.png" alt='' id="image">
                    {/if}
                    
                </label>
            </div>
        </div>
    
        <div class="box" id="description">
            
            <!-- NAME TITLE -->
            {#if selectedperson.name}
                <h1 class="name">{selectedpersonData.name}</h1>
            {:else}
                <h1 class="name">...</h1>
            {/if}
            
            <!-- TEXT DESCRIPTION -->
            <div class="text-box" id="description">
                {#if selectedperson.name}
                    <h3>NAME: 
                        <span class="display">{selectedpersonData.name}
                        </span>
                    </h3>

                    <h3>AGE:
                        {#if selectedperson.age}
                            <span class="display">
                                {selectedpersonData.age}
                            </span> 
                        {:else}
                            Unknown
                        {/if}
                    </h3> 
                    
                    <h3>ETHNICITY:
                        {#if selectedperson.ethnicity}
                        <span class="display">
                            {selectedpersonData.ethnicity}
                        </span>  
                        {:else}
                            Unknown
                        {/if}
                    </h3> 

                    <h3>NATIONALITY:
                        {#if selectedperson.nationality}
                        <span class="display">
                            {selectedpersonData.nationality}
                        </span> 
                        {:else}
                            Unknown
                        {/if}
                    </h3> 
                    
                    <h3>GENDER:
                        {#if selectedperson.gender}
                        <span class="display">
                            {selectedpersonData.gender}
                        </span>  
                        {:else}
                            Unknown
                        {/if}
                    </h3> 

                    <h3>SKILLS:
                        {#if selectedperson.skills}
                        <span class="display">
                            {selectedpersonData.skills}
                        </span>  
                        {:else}
                            Unknown
                        {/if}
                    </h3> 

                    <h3>ATTRIBUTES:
                        {#if selectedperson.attributes}
                        <span class="display">
                            {selectedpersonData.attributes}
                        </span>  
                        {:else}
                            Unknown
                        {/if}
                    </h3> 

                    <h3>BIO:
                        {#if selectedperson.bio}
                        <span class="display">
                            {selectedpersonData.bio}
                        </span>  
                        {:else}
                            Unknown
                        {/if}
                    </h3> 
                    
                {:else}
                    <h3 class ='blank'>ADD <br>A NEW PERSON <br><br> or <br><br> SELECT <br>A PERSON FROM THE LIST</h3>
                {/if}

                
            </div>
            
            {#if selectedperson.name}
                 <br><button on:click={ShowEdit}><h1 class="edit">EDIT PERSON</h1></button>
            {/if}
           
            
            
        </div>
        </div>
    </body>
    
    <style>
        
        .listbutton {
            border-radius: 20px;
            margin-bottom: 10px;
            width: 350px;
            
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
            
        }
        .listname { 
            text-transform: uppercase;
            font-size: large;
            transition-duration: 200ms;
            transition-timing-function: ease-in-out;
            text-align: left;
            
        }
        .worldname {
            text-transform: uppercase;
            text-align: right;
            font-size: 20px;
            color:burlywood;
        }
        .page-title {
            text-transform: uppercase;
            font-size: 70px;
            text-align: right;
            -webkit-text-stroke-width: 2px;
            -webkit-text-stroke-color: rgb(213, 0, 0);
            margin-bottom: 30px;
        }
        .body {
            padding-top: 10px;
            padding-left: 10px;
            padding-bottom: 20px;
            width: 99%;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 30px;
            height: 90vh;
        }
    
        .box{ 
            background: rgb(255, 232, 199);
            border-radius: 20px;
            padding: 20px;
        }
        .text-box{
            background-color: white;
            height: 670px;
            width: 350px;
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
            color: rgba(0, 0, 0, 0.311)    }
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