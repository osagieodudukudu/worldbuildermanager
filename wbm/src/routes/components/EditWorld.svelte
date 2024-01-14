<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import Form from "../components/Form.svelte";
    import Confirm from "../components/Confirm.svelte";

    let dispatch = createEventDispatcher();

    let showForm = false;
    let confirm = "";
    let message = "";
    
    /**
     * @type {string}
     */
    let name;
    /**
     * @type {string}
     */
    let desc;
    /**
     * @type {string | null | ArrayBuffer}
     */
    let profile;
    /**
     * @type {Boolean}
     */
    let submitting;


    /**
     * @type any
     */
     let selectedworld = [];

    

    onMount(async() => {

        const response = await fetch('http://localhost:3000/api/worlds/selected');

        if (response.ok) {
            const data = await response.json();
            selectedworld = data;
            console.log('Response:', data);
        }
        
        name = selectedworld.name;
        desc = selectedworld.desc;
        profile = selectedworld.profile;
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
        message = "YOU WANT TO EDIT YOUR WORLD?"
        
        ShowForm();

        await waitForConfirm();
        
        if (confirm == "Y") {
            submitting = true; 

            if (desc === undefined) {
                desc = '';
            }
            if (profile === undefined) {
                profile = '';
            }

            if (name) {
                const fileInput = document.querySelector('input[type="file"]');
                const file = fileInput.files[0];

                if (!file || (file && file.size <= 2 * 1024 * 1024 )) {
                    const world = {
                    name,
                    desc,
                    profile,
                    };

                    dispatch('UpdateWorldtoList', world);
                } 
                
                else {
                    window.alert('File size exceeds 2MB limit');
                    fileInput.value = selectedworld.profile;
                    profile = selectedworld.profile; 
                    submitting = false;
                }
            }
            confirm = "";
        } else {
            confirm = "";
        }
  }

    function handleFileChange(event) {
        const file = event.target.files[0];

        const reader = new FileReader();

        reader.onload = () => {
        profile = reader.result; 
        };

        reader.readAsDataURL(file);
    }

    async function handleCancel() {
        message = "YOU WANT TO CANCEL?"
        
        ShowForm();

        await waitForConfirm();
        
        if (confirm == "Y") {

            dispatch('Cancel');
            confirm = "";
            
        } else {
            confirm = "";
        }

    }

</script>

<Form {showForm}>
    <Confirm message={message} on:Yes={()=>setConfirm("Y")} on:No={()=>setConfirm("N")}/>
</Form>

<form on:submit|preventDefault={handleSubmit}>
    <h3>EDIT YOUR WORLD!</h3>
  
    <br>
    <h4>Upload your profile image</h4>
    <input type="file" on:change={handleFileChange} accept="image/*" />
  
    <h4>Name your world</h4>
    <input type="text" class="name" bind:value={name} required={submitting} />
  
    <h4>Describe your world</h4>
    <textarea class="description" bind:value={desc}></textarea>
  
    <br><br>
    <button>UPDATE YOUR WORLD</button>
  
    <br>
    <br>
    <button type="button" on:click={handleCancel}>CANCEL EDIT</button>
</form>

<style>
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
    
    .name{
        width: 400px;
        height: 30px;
        border-radius: 20px;        

    }
    .description {
        width: 400px;
        height: 250px;
        padding: 10px;
        line-height: 2;
        border-radius: 20px;        
    }
    button {
        cursor: pointer;
        border-radius: 20px;
        padding: 15px;
    }
</style>
