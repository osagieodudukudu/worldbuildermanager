<script>
        import { onMount } from 'svelte';
    
        import AddPerson from '../../components/AddPerson.svelte';
        import EditPerson from '../../components/EditPerson.svelte';
        import Modal from '../../components/Modal.svelte';
    
            /**
         * @type any
         */
        let selectedworld  = [];
    
        /**
         * @type any
         */
        let selectedperson = [];
    
        /**
         * @type any
         */
        let people = [];
    
        let showAdd = false; 
        let showEdit = false;
    
        onMount(async () => {
    
            const response = await fetch('http://localhost:3000/api/worlds/selected');
            
            if (response.ok) {
                const data = await response.json();
                selectedworld = data;
                people = data.people;
                console.log('SELECTED WORLD FETCHED!')
                console.log('Response:', data);
            }
    
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
                const response = await fetch(`http://localhost:3000/api/people/${objectId}`, {
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
    
    </script>
    
    <!-- New Person Form -->
    <Modal {showAdd}>
        <AddPerson on:AddPersontoList={addPerson} on:Cancel={ShowAdd}/>
    </Modal>
    
    <!-- Edit Person Form -->
    <Modal {showEdit}>
        <EditPerson on:UpdateWorldtoList={handleEditPerson} on:Cancel={ShowEdit}/>
    </Modal>
    
    <body style="display: {showAdd ? 'none' : 'grid'}">
        <div class="body" >
        <div>
            <div class="title">
                <button><a href="/worldmenu"><img src="../src/assets/back_arrow.png" alt="" id="arrow"></a></button>
                <h1 class="worldname">{selectedworld.name}</h1>
                <h1 class="page-title">PEOPLE</h1>
            </div>
            <div class="box" id="list-box">
                <button on:click={ShowAdd}><h1 class="add">+ PERSON</h1></button><br><br>
                <div class="text-box" id="list">
                    
                </div>
            </div>   
        </div>
        
        <div class="box" >
            <h2>CLICK ON THE IMAGE BELOW TO UPLOAD THE IMAGE OF YOUR PLACE<br><br>RECOMMENDED SIZE: (1080 x 1920)</h2>
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
            
            
            {#if selectedperson.name}
                <h1 class="name">{selectedperson.name}</h1>
            {:else}
                <h1 class="name">...</h1>
            {/if}
                
                
           
            <div class="text-box" id="description">
                {#if selectedperson.name}
                    <h3>NAME: {selectedperson.name}</h3>

                    <h3>AGE:
                        {#if selectedperson.age}
                            {selectedperson.age} 
                        {:else}
                            Unknown
                        {/if}
                    </h3> 
                    
                    <h3>ETHNICITY:
                        {#if selectedperson.ethnicity}
                            {selectedperson.ethnicity} 
                        {:else}
                            Unknown
                        {/if}
                    </h3> 

                    <h3>NATIONALITY:
                        {#if selectedperson.nationality}
                            {selectedperson.nationality} 
                        {:else}
                            Unknown
                        {/if}
                    </h3> 
                    
                    <h3>GENDER:
                        {#if selectedperson.gender}
                            {selectedperson.gender} 
                        {:else}
                            Unknown
                        {/if}
                    </h3> 

                    <h3>SKILLS:
                        {#if selectedperson.skills}
                            {selectedperson.skills} 
                        {:else}
                            Unknown
                        {/if}
                    </h3> 

                    <h3>ATTRIBUTES:
                        {#if selectedperson.attributes}
                            {selectedperson.attributes} 
                        {:else}
                            Unknown
                        {/if}
                    </h3> 

                    <h3>BIO:
                        {#if selectedperson.bio}
                            {selectedperson.bio} 
                        {:else}
                            Unknown
                        {/if}
                    </h3> 
                    
                {:else}
                    <h3 class ='blank'>ADD <br>A NEW PERSON <br><br> or <br><br> SELECT <br>A PERSON FROM THE LIST</h3>
                {/if}

                
            </div>
            
        </div>
        </div>
    </body>
    
    <style>
        .blank {
            text-align: center;
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
        .add {
            font-size: large;
            padding-bottom: 5px;
            text-justify: center;
            color: rgba(100, 28, 28, 0.338);
            transition-duration: 200ms;
            transition-timing-function: ease-in-out;
        }
        .add:hover{
            cursor: pointer;
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
            -webkit-text-stroke-width: 2px;
            -webkit-text-stroke-color: rgb(213, 0, 0);
            margin-bottom: 30px;
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
            background: rgb(255, 233, 199);
            border-radius: 20px;
            padding: 20px;
        }
    
        .text-box{
            background-color: white;
            height: 670px;
            padding: 20px;
            padding-top: 10px;
            border-radius: 20px;
            overflow-y: scroll;
            overflow-x: break-word;
            box-shadow: 0 0 10px rgba(115, 62, 62, 0.322);
            
        }
        h2 {
            font-size: small;
            text-align: center;
            color: rgba(0, 0, 0, 0.311)    }
        h3 {
            color: rgb(185, 185, 185);
            font-size: medium;
        }
        button {
            background: transparent;
            border: transparent;
        }
    </style>