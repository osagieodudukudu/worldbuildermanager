<script>
    export let showForm = false;
    export let showAdd = false;
    export let showEdit = false;


</script>

{#if showForm || showAdd || showEdit }
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
        min-width: 400px;
        max-width: 1200px;
        margin: 10% auto;
        text-align: center;
        background: white;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
    }


</style>