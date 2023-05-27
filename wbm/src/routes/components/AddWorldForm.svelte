<script>
    import { createEventDispatcher } from 'svelte';

    let dispatch = createEventDispatcher();
    /**
     * @type {string}
     */
    let name;
    /**
     * @type {string | undefined}
     */
    let desc;
    let submitting = false; // Flag to indicate if form is being submitted

    function handleSubmit() {
        submitting = true; // Set submitting flag to true

        if (desc === undefined) {
            desc = '';
        }

        if (name) {
            const world = {
            name,
            desc,
            id: Math.random()
            };

            dispatch('AddWorldtoList', world);
        } 
        else {
            submitting = false;
        }
    }

    function handleCancel() {

    dispatch('Cancel');

    }
</script>

<form on:submit|preventDefault = {handleSubmit}>
    <h3>MAKE YOUR WORLD!</h3>
    <h4>Name your world</h4>
    <input type="text" placeholder="WORLD NAME" bind:value={name} required={submitting}>
    <h4>Describe your world</h4>
    <input type="text" placeholder="WORLD DESCRIPTION" bind:value={desc}>
    <br><br><button>ADD YOUR WORLD</button>
    <button on:click={handleCancel}>CANCEL</button>
</form>   

<style>

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
    
</style>
