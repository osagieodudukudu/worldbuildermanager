<script>
    import { onMount, createEventDispatcher } from 'svelte';

    let dispatch = createEventDispatcher();

    /**
     * @type {string}
     */
     let name;
    /**
     * @type {string | null | undefined}
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
    let submitting;




    let existingWorldData = {
        name: 'World Name',
        desc: 'World Description',
        profile: null, 
    }

    onMount(() => {
        
        name = existingWorldData.name;
        desc = existingWorldData.desc;
        profile = existingWorldData.profile;
    });

  function handleSubmit() {
    submitting = true; 

    if (desc === undefined) {
        desc = '';
    }
    if (profile === undefined) {
        profile = '';
    }
    map = "";

    if (name) {
        const fileInput = document.querySelector('input[type="file"]');
        const file = fileInput.files[0];

        if (!file || (file && file.size <= 2 * 1024 * 1024 )) {
            const world = {
            name,
            desc,
            profile,
            map,
            id: Math.random(),
            };

            dispatch('UpdateWorldtoList', world);
        } 
        
        else {
            window.alert('File size exceeds 2MB limit');
            fileInput.value = '';
            profile = ''; 
            submitting = false;
        }
    }
  }

  function handleFileChange(event) {
    // Handle file change
    // Update the profile image
  }

  function handleCancel() {
    // Handle cancel action
    // Close the form or navigate back
  }

</script>


<form on:submit|preventDefault={handleSubmit}>
    <h3>EDIT YOUR WORLD!</h3>
  
    <h5>Hit ENTER to submit</h5>
  
    <br />
    <h4>Upload your profile image</h4>
    <input type="file" on:change={handleFileChange} accept="image/*" />
  
    <h4>Name your world</h4>
    <input type="text" class="name" bind:value={name} required={submitting} />
  
    <h4>Describe your world</h4>
    <input type="text" class="description" bind:value={desc} />
  
    <br /><br />
    <button>UPDATE YOUR WORLD</button>
  
    <br />
    <button on:click={handleCancel}>CANCEL EDIT</button>
</form>