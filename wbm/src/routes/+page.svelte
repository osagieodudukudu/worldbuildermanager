<script>
    import { onMount } from 'svelte';
    
    import Header from "./components/Header.svelte";
    import Footer from "./components/Footer.svelte";
    import Modal from "./components/Modal.svelte";
    import Form from "./components/Form.svelte";
    import Confirm from "./components/Confirm.svelte";
    import AddWorld from "./components/AddWorld.svelte";

    let showAdd = false;
    let showForm = false;
    let confirm = "";
    let message = "";
    
    /**
     * @type {any[]}
     */
    let worlds = [];
   
    onMount(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/worlds');
            
            if (response.ok) {
            //Keep Consistent Order of Worlds
            const listworlds = await response.json();
            worlds = listworlds;

            } 
            
            else {

            throw new Error('Failed to fetch worlds in frontend');

            }
        } 
        
        catch (error) {
            
            console.error('Error retrieving worlds:', error);
            
        }
    });
    
    const ShowAdd = () => {
    
        showAdd = !showAdd;
    
    };
    
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

    // @ts-ignore
    function handleClick(objectid) {
        
    fetch(`http://localhost:3000/api/worlds/select/${objectid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: objectid })
    })
        .then(response => {
            if (response.status === 204) {


            } else if (response.ok) {

                return response.json();
                
            } else {
                throw new Error('Failed to select world');
            }
        })
        .then(selectedWorld => {
            window.location.href = '/worldmenu';
        })    
        .catch(error => {
            console.error('Error:', error);
        });
    };
        
    // @ts-ignore
    const addWorld = (e) => {
    
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

            worlds = [addedWorld, ...worlds];

            showAdd = !showAdd;

            })

            .catch((error) => {
            console.error('Error:', error);

            });
};


    // @ts-ignore
    const deleteWorld = async (id) => {
        message = "YOU WANT TO DELETE YOUR WORLD?"
        ShowForm();

        await waitForConfirm();

        if ( confirm == "Y" ) {
            fetch(`http://localhost:3000/api/worlds/${id}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        return fetch(`http://localhost:3000/api/cleanup/${id}`, {
                            method: 'DELETE',
                        })
                    } else {
                        throw new Error(`Failed to delete world's characters, places, items, and events with ID ${id}`);
                    }
                })
                .then((response) => {
                    if (response.ok) {
                        return fetch(`http://localhost:3000/api/cleanup`, {
                            method: 'DELETE',
                        })
                    } else {
                        throw new Error(`Failed to delete world's subentities with ID ${id}`);
                    }
                })
                .then((response) => {
                    if (response.ok) {
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

                confirm = "";

        } else {
            confirm = "";
        };
};

</script>

<!-- Header -->
<Header />

<!-- New World Form -->
<Modal {showAdd}>
    <AddWorld on:AddWorldtoList={addWorld} on:Cancel={ShowAdd}/>
</Modal>

<!-- Confirmation -->
<Form {showForm}>
    <Confirm message={message} on:Yes={()=>setConfirm("Y")} on:No={()=>setConfirm("N")}/>
</Form>

<!-- World Gallery -->
<body class:hidden={showAdd}>
    <div class="wrapper" >

        <div class="carousel">
            <container class="world">
                <container class="worldbutton" title="Add New World">
                    <!-- Name -->
                    <h2 class="name">Add New World</h2>
                    <!-- Button Shape -->
                    <button on:click={ShowAdd}
                        ><img
                            src="./src/assets/add_world_icon.png"
                            alt=""
                        /></button
                    >
                    <!-- Profile Picture -->
                    <div class="profile"><img class="profileimg" src='../src/assets/blank_world_profile.png' alt=''></div>
                </container>
            </container>
            {#if worlds && worlds.length > 0}

            
            {#each worlds as world}
                <container class="world">
                    <container class="worldbutton" title={world.name}>
                        <!-- Name -->
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <h2 class="name" on:click={() => handleClick(world._id)} data-sveltekit-preload-data="hover">{world.name}</h2>
                        <!-- Description -->
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <p class="desc" on:click={() => handleClick(world._id)} data-sveltekit-preload-data="hover">{world.desc}</p>
                        <!-- Button Shape -->
                        <button on:click={() => handleClick(world._id)}  data-sveltekit-preload-data="hover">
                            <img src="./src/assets/world_icon.png" alt=''>
                        </button>
                        <!-- Profile Picture -->
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div class="profile"><img class="profileimg" src={world.profile ? world.profile : './src/assets/blank_world_profile.png'} on:click={() => handleClick(world._id)} data-sveltekit-preload-data="hover" alt="" /></div>
                    </container>

                    <button on:click={() => deleteWorld(world._id)} title="Delete {world.name}" class="delete"> 
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
        max-width: 1920px;
        margin: 0 auto;
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
    .desc:hover,
    .profile:hover{
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
        top: 108px;
        width: 125px;
        height: 125px;
        object-fit: cover;
        overflow: hidden;
        align-content: center;
        border-radius: 50%;
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }
    .profileimg {
        height: 125px;
        
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
