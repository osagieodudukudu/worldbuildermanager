<script>
    import { worlds } from '../store';

    import Header from "./components/Header.svelte";
    import Footer from "./components/Footer.svelte";
    import Modal from "./components/Modal.svelte"
    import AddWorldForm from "./components/AddWorldForm.svelte";

    let showForm = false;

    const ShowForm = () =>{
        showForm = !showForm;
      }

    
    let world = $worlds;

    

   
    const AddWorld = (e) =>{ 
        const newworld = (e.detail);

        world = [newworld, ...world];

        showForm = false;
        
    }
  
    const DeleteWorld = (id) =>{
        world = world.filter((world) => world.id != id);
    }

</script>



<!-- Header -->
<Header /> 

<!-- New World Form -->
<Modal {showForm}>
  <AddWorldForm on:AddWorldtoList={AddWorld}/>
</Modal>


<!-- World Gallery -->
<body>
<div class="wrapper" class:hidden={showForm}>
    <img class="arrow" src="./src/assets/back_arrow.png" alt="" id="backward">
    <div class="carousel">

        <container class="world">
            <container class="worldbutton" title="Add New World">
                <!-- Name -->
                <h2 class="name">Add New World</h2>
                <!-- Button Shape -->
                <button on:click={ShowForm}><img src = "./src/assets/add_world_icon.png" alt=""></button>
                <!-- Profile Picture -->
                <img class="profile"  src="./src/assets/blank_world_profile.png" alt="">
            </container>
        </container>
    
        {#each world as world}  
            <container class="world">
                <container class="worldbutton" title = "{world.name}">
                    <!-- Name -->
                    <h2 class="name">{world.name}</h2>
                    <!-- Description -->
                    <p class="desc">{world.desc}</p>
                    <!-- Button Shape -->
                    <button><img src = "./src/assets/world_icon.png" alt=""></button>
                    <!-- Profile Picture -->
                    <img class="profile" src = {world.profile} alt="">
                </container>

                <button on:dblclick={() => DeleteWorld(world.id)} title="Delete {world.name}" class="delete" ><img src="./src/assets/delete.png" alt=""></button>
            </container>
        {/each}
    </div>  
    <img class="arrow" src="./src/assets/forward_arrow.png" alt="" id="forward">
</div>
</body>

<!-- Footer -->
<Footer />



<style>
    body {
        display: grid;
        align-items: center;
        justify-items: center;
        
        
    }
    .wrapper {
        max-width: 1280px;
        width: 100%;
    }

    .arrow{
        height: 45px;
        width: auto;
        cursor: pointer;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);

    }

    #forward {
        right: 60px;
    }
    #backward{
        left: 60px;
    }

    .wrapper  .carousel {
        overflow: hidden;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: calc((100%/3)-12px);
    }

    .carousel .world{
        list-style: none;
        border-radius: 8px;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
 

    div{
        display: flex;
        
    }

    container {
        position: relative;
        display: flex;
        justify-content: center;
        list-style-type: none;
    }

    .name {
        text-transform: uppercase;
        color: white;
        position: absolute;
        text-align: center;
        top: 45%;
        overflow-wrap: break-word;
        inline-size: 250px;
        text-shadow: 2px 2px rgba(0, 0, 0, 0.305);
    }
    
    .desc {
        text-transform: uppercase;
        color: white;
        position: absolute;
        text-align: center;
        top: 55%;
        overflow-wrap: break-word;
        inline-size: 250px;
    }

    button {
        padding: 10px;
        cursor: pointer;
        background: transparent;
        border: transparent;
        
    }

    img {  
        max-width: auto;  
        height: 75%; 
    } 

    .profile {
        filter: grayscale() opacity(80%);
        position: absolute;
        top: 109px;
        width: auto;
        height: 22%;
        overflow: hidden;
        border-radius: 50%;
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
        
    }
    .profile:hover {
        filter: none;
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }

    .worldbutton {
        filter: opacity(50%);
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }

    .worldbutton:hover {
        filter: none;
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
        
    }

    .delete {
        filter: grayscale();
        opacity: 50%;
        position:absolute;
        width:auto;
        height: 10%;
        top: 500px;
        left: 45%;
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }

    .delete:hover {
        filter: none;
        opacity: 100%;
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }

    .hidden{
        display:none;
    }
    
</style>