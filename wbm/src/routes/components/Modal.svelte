<script>
    export let showForm = false;

    let name;
    let desc;

</script>

{#if showForm}
        <div class="modal">
            <slot></slot>    
        </div>   
    
{/if}

<main>

</main>

<style>

    .modal {
        padding: 50px;
        border-radius: 10px;
        max-width: 400px;
        margin: 10% auto;
        text-align: center;
        background: white;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
    }

</style>