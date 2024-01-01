<script>
    import { createEventDispatcher } from 'svelte';

    let dispatch = createEventDispatcher();
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
     * @type {string | null | ArrayBuffer}
     */
    let map;
    /**
     * @type {Boolean}
     */
    let isSelected;
    /**
     * @type {Boolean}
     */
    let submitting;

    function handleSubmit() {
        submitting = true; 

        if (desc === undefined) {
            desc = '';
        }
        if (profile === undefined) {
            profile = '';
        }
        map = "";

        isSelected = false;

        if (name) {
            const fileInput = document.querySelector('input[type="file"]');
            const file = fileInput.files[0];

            if (!file || (file && file.size <= 2 * 1024 * 1024 )) {
                const world = {
                name,
                desc,
                profile,
                map,
                isSelected,
                };

                dispatch('AddWorldtoList', world);
            } 
            
            else {
                window.alert('File size exceeds 2MB limit');
                fileInput.value = '';
                profile = ''; 
                submitting = false;
            }
        }
    }

    function handleCancel() {

    dispatch('Cancel');

    }

    function handleFileChange(event) {
        const file = event.target.files[0];

        const reader = new FileReader();

        reader.onload = () => {
        profile = reader.result; 
        };

    reader.readAsDataURL(file);
    }
</script>

<form on:submit|preventDefault = {handleSubmit}>
    <h3>MAKE YOUR WORLD!</h3>

    <br><h4>Upload your profile image</h4>

    <input type="file" on:change={handleFileChange} accept="image/*" />

    <h4>Name your world</h4>
    
    <input type="text" class="name" bind:value={name} required={submitting}>

    <h4>Describe your world</h4>

    <textarea class="description" bind:value={desc}></textarea>
    
    <br><br><button>ADD YOUR WORLD</button>

    <br><button on:click={handleCancel}>CANCEL NEW WORLD</button>
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
</style>