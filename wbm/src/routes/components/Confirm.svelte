<script>
  import { createEventDispatcher, onMount } from 'svelte';


  let dispatch = createEventDispatcher();
  export let message;

  function handleSubmit(action) {
    dispatch(action);
    
  }

</script>

<form>
      
  <h3>ARE YOU SURE</h3> 
  <h4>{message}</h4>
  <div class="container">

    <button on:click={() => handleSubmit('Yes')}>YES</button>
    <button on:click={() => handleSubmit('No')}>NO</button>
  

  </div>
  
  
</form>   

<style>
  button {
    cursor: pointer;
    border-radius: 20px;
    padding: 15px;
  }

  form {
    text-align: center;
     
  }

  h3 {
    font-size: x-large;
    color: rgb(255, 38, 0);
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
</style>