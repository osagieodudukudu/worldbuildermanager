<script>
    export let showForm = false;
    export let showAdd = false;
    export let showEdit = false;
  </script>
  
  {#if showForm || showAdd || showEdit }
    <div class="modal-backdrop"> <div class="modal">
        <slot></slot>
      </div>
    </div>
  {/if}
  
  <main>
  
  </main>
  
  <style>
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background-color: rgba(11, 7, 43, 0.712); 
      z-index: 1040; 
    }
  
    .modal {
      position: fixed; 
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%); 
      padding: 50px;
      border-radius: 10px;
      min-width: 400px;
      max-width: 1200px;
      text-align: center;
      background: white;
      box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
      z-index: 1050; 
    }
  </style>
  