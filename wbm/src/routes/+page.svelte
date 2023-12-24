<script>
    import { onMount } from 'svelte';
    
    import Header from "./components/Header.svelte";
    import Footer from "./components/Footer.svelte";
    import Modal from "./components/Modal.svelte";
    import AddWorldForm from "./components/AddWorldForm.svelte";

    let showForm = false;
    
    /**
     * @type {any[]}
     */
    let worlds = [];
   
    onMount(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/worlds');
            
            if (response.ok) {
            //Keep Consistent Order of Worlds
            const inverseworlds = await response.json();
            worlds = inverseworlds.reverse();
            console.log('Response:', worlds);

            } 
            
            else {

            throw new Error('Failed to fetch worlds in frontend');

            }
        } 
        
        catch (error) {

            console.error('Error retrieving worlds:', error);

        }
        });


    // @ts-ignore
    function handleClick(id) {
    console.log(id);
        
    fetch(`http://localhost:3000/api/worlds/select/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    })
        .then(response => {
            if (response.status === 204) {

                console.log('World selected successfully');

            } else if (response.ok) {

                return response.json();
                
            } else {
                throw new Error('Failed to select world');
            }
        })
        .then(selectedWorld => {
            console.log(selectedWorld);
            window.location.href = '/worldmenu';
        })    
        .catch(error => {
            console.error('Error:', error);
        });
};

        
    const ShowForm = () => {

        showForm = !showForm;

    };

    // @ts-ignore
    const AddWorld = (e) => {
    
        console.log(e.detail);
        const newWorld = e.detail;

        fetch('http://localhost:3000/api/worlds/add', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(newWorld),
        })
            .then((response) => {
    
                if (response.ok) {
                return response.json();
            } 
            
            else {
                throw new Error('Failed to add world');
            }
            
        })
            .then((addedWorld) => {

            console.log('Added World:', addedWorld);
            worlds = [addedWorld, ...worlds];

            showForm = !showForm;

            })

            .catch((error) => {
            console.error('Error:', error);

            });
};


    // @ts-ignore
    const DeleteWorld = (id) => {
        fetch(`http://localhost:3000/api/worlds/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
            if (response.ok) {
                console.log('World deleted successfully');
                return fetch('http://localhost:3000/api/worlds');
            } 
            else {
                throw new Error(`Failed to delete world with ID ${id}`);
            }
            })
            .then((response) => response.json())
            .then((updatedWorlds) => {
                worlds = updatedWorlds.reverse();
                })
            .catch((error) => {
                console.error('Error:', error);
                });
};

</script>

<!-- Header -->
<Header />

<!-- New World Form -->
<Modal {showForm}>
    <AddWorldForm on:AddWorldtoList={AddWorld} on:Cancel={ShowForm}/>
</Modal>

<!-- World Gallery -->
<body>
    <div class="wrapper" class:hidden={showForm}>
        <div class="carousel">
            <container class="world">
                <container class="worldbutton" title="Add New World">
                    <!-- Name -->
                    <h2 class="name">Add New World</h2>
                    <!-- Button Shape -->
                    <button on:click={ShowForm}
                        ><img
                            src="./src/assets/add_world_icon.png"
                            alt=""
                        /></button
                    >
                    <!-- Profile Picture -->
                    <img
                        class="profile"
                        src="./src/assets/blank_world_profile.png"
                        alt=""
                    />
                </container>
            </container>
            {#if worlds && worlds.length > 0}

            {#each worlds as world}
                <container class="world">
                    <container class="worldbutton" title={world.name}>
                        <!-- Name -->
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <h2 class="name" on:click={() => handleClick(world.id)} data-sveltekit-preload-data="hover">{world.name}</h2>
                        <!-- Description -->
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <p class="desc" on:click={() => handleClick(world.id)} data-sveltekit-preload-data="hover">{world.desc}</p>
                        <!-- Button Shape -->
                        <button on:click={() => handleClick(world.id)}  data-sveltekit-preload-data="hover">
                            <img src="./src/assets/world_icon.png" alt=''>
                        </button>
                        <!-- Profile Picture -->
                        <img class="profile" src={world.profile ? world.profile : './src/assets/blank_world_profile.png'} alt="" />
                    </container>

                    <button on:dblclick={() => DeleteWorld(world.id)} title="Delete {world.name}" class="delete"> 
                        <img src="./src/assets/delete.png" alt="" />
                    </button>
                </container>
            {/each}
            {/if}
        </div>
    </div>
    
<!-- Footer -->
<Footer />
</body>



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

    .wrapper{
        overflow-x: scroll;
        overflow-y: hidden;
    }

    .carousel {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: calc((100% / 3)-12px);
    }

    .carousel .world {
        list-style: none;
        border-radius: 8px;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    div {
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
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        inline-size: 250px;
        text-shadow: 2px 2px rgba(0, 0, 0, 0.305);
    }

    .desc {
        text-transform: uppercase;
        color: white;
        position: absolute;
        text-align: center;
        top: 55%;
        height: 92px;
        overflow-wrap: break-word;
        overflow-y: hidden;
        inline-size: 250px;
    }

    .name:hover,
    .desc:hover {
        cursor: pointer;
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
        width: 125px;
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
        position: absolute;
        width: auto;
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

    .hidden {
        display: none;
    }

</style>
