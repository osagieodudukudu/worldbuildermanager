<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import Form from "./Form.svelte";
    import Confirm from "./Confirm.svelte";


    let dispatch = createEventDispatcher();
    
    let selectedworld = [];
    let selecteditem = [];

    let allOwners = [];
    let allCategories = [];

    let newCategory = '';

    let addedCategories = [];

    let selectName;
    let selectDescription;
    let selectQuantity;
    let selectValue;
    let selectCategories = [];
    let selectOwners = [];
    
    let showForm = false;
    let confirm = "";
    let message = "";


    /**
     * @type {string | null | ArrayBuffer}
     */
    let image;
    /**
     * @type {Boolean}
     */
    let isSelected;
    /**
     * @type {String}
     */
    let owners; 
    /**
     * @type {String}
     */
    let categories;
    /**
     * @type {Boolean}
     */
    let submitting;

    let itemCategories = [];
    let itemOwners = [];

    onMount(async () => {
        const response = await fetch('http://localhost:3000/api/worlds/selected');
            
            if (response.ok) {
                const data = await response.json();
                selectedworld = data;
            }
        
        const response1 = await fetch('http://localhost:3000/api/items/selected');

            if (response1.ok) {
                const data = await response1.json();
                selecteditem = data;
            }    
        
        selectName = selecteditem.name;
        selectDescription = selecteditem.desc;
        selectQuantity =  selecteditem.quantity;
        selectValue =  selecteditem.value;
        
        selecteditem.categories.forEach(categoryId => {
            selectCategories.push(categoryId);
        });

        selecteditem.owners.forEach(characterId => {
            selectOwners.push(characterId);
        });

        const response2 = await fetch(`http://localhost:3000/api/characters/grab/${selectedworld._id}`);
            
            if (response2.ok) {
                const data = await response2.json();
                allOwners = data;
                console.log(allOwners);
            }
            
            const response3 = await fetch(`http://localhost:3000/api/categories/grab/${selectedworld._id}`);
            
            if (response3.ok) {
                const data = await response3.json();
                allCategories = data;
                console.log(allCategories);
            }
    });
    
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

    function addCategory() {
        if (newCategory) {
            addedCategories = [...addedCategories, newCategory];
            newCategory = '';
        }
    };

    function removeCategory(index) {
        addedCategories = addedCategories.filter((category, i) => i !== index);
    };

    async function waitForConfirm() {
        while(showForm){
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    async function handleSubmit() {
        message = "YOU WANT TO EDIT YOUR ITEM?";
        ShowForm();

        await waitForConfirm();

        if (confirm == "Y") {
            confirm = "";
            submitting = true;
            isSelected = false;

            try {
                let categoryIds = [];
                let ownersIds = [];

                //Add Notable Charcters to Backend
                for (let i = 0; i < selectOwners.length; i++) {
                    let owner = selectOwners[i];
                    ownersIds.push(owner);
                }

                //Add Listed Categories to Backend
                for (let i = 0; i < selectCategories.length; i++) {
                    let category = selectCategories[i];
                    categoryIds.push(category);
                }

                //Add New Categories to Backend
                for (let i = 0; i < addedCategories.length; i++) {
                    let category = addedCategories[i];

                    let newEntity = {
                        world_id: selectedworld._id,
                        name: category,
                    };
                    
                    const response = await fetch(`http://localhost:3000/api/categories/add`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newEntity),
                    });

                    if (response.ok) {
                        const responseData = await response.json();
                        categoryIds.push(responseData._id);
                    
                    } else {
                        throw new Error(`Failed to add category`);
                    }
                }

                const item = {
                    world_id: selectedworld._id,
                    name: selectName,
                    quantity: selectQuantity,
                    value: selectValue,
                    owners: ownersIds,
                    categories: categoryIds,
                    desc: selectDescription,
                    image,
                    isSelected
                };

                dispatch('UpdateItem', item);
            } catch (error) {
                console.error('Failed to fetch:', error);
            }
        } else {
            confirm = "";
        }
    }


    async function handleCancel() {
        message = "YOU WANT TO CANCEL?"
        
        ShowForm();

        await waitForConfirm();

        if (confirm == "Y") {
            dispatch('CancelEdit');
            confirm = "";

        } else {
            confirm = "";
        }
    };

</script>

<Form {showForm}>
    <Confirm message={message} on:Yes={()=>setConfirm("Y")} on:No={()=>setConfirm("N")}/>
</Form>

<form on:submit|preventDefault = {handleSubmit}>
        
    <h3>EDIT YOUR ITEM!</h3> 

    <div class="container">

    <div>

        <h4>Name your item</h4>
        <input type="text" class="name" bind:value={selectName} required={submitting}>


        <h4>Give your item a description</h4>
        <textarea class="description" bind:value={selectDescription}></textarea>
        
        
        <br><br>
        <br><br>
        <br><br>
        <h4>Quantity</h4>
        <input type="number" class="quantity" bind:value={selectQuantity} min="0">
        <br><br>
        <h4>Value($)</h4>
        <input type="number" class="value" bind:value={selectValue} min="0">

        <br><br>
    </div>
    <div>
        <h4>Category</h4>
        <input type="text" class="category" bind:value={newCategory}>
        <button type="button" on:click={addCategory}>Add</button>
        
        
        
        <br>
        <h4 class="note">New Category List</h4>
        <div class="boxscroll">
            {#each addedCategories as category, index}
            <div>
                <span>{category}</span>
                <button on:click={() => removeCategory(index)}>Remove</button>
            </div>
            {/each}
        </div>
        
        <h4 class="note"> and/or Pick from a Selection</h4>
        <div class="boxscroll">
            {#each allCategories as category}
                <label>
                    <input type="checkbox" bind:group={selectCategories} value={category._id}>
                    {category.name}
                </label>
            {/each}
        </div>
        <br><br>

        <h4>Notable Characters</h4>
        <div class="boxscroll">
            {#each allOwners as character}
            <label>
                <input type="checkbox" bind:group={selectOwners} value={character._id}>
                {character.name}
            </label>
            {/each}
        </div>

    </div>
    
</div>
<br><br><br><br>
<button>EDIT YOUR ITEM</button>
<br><br><button type="button" on:click={handleCancel}>CANCEL</button>
    
    
</form>   

<style>
    button {
        cursor: pointer;
        border-radius: 20px;
        padding: 15px;
    }

    input, select {
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
    
    .name, .owner, .category{
        width: 400px;
        height: 30px;
        border-radius: 20px;        

    }

    .boxscroll {
        border: 2px solid #ccc;
        border-radius: 20px;
        padding: 10px;
        margin-bottom: 20px;
        height: 75px;
        overflow-y: auto;
    }

    .quantity, .value {
        width: 100px;
        height: 40px;
        border-radius: 20px; 
    }

    .description {
        width: 400px;
        height: 250px;
        padding: 10px;
        line-height: 2;
        border-radius: 20px;        
    }

    .note {
        font-size: 60%;
        color:rgb(201, 201, 201)
    }

    .container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 50px;
    }
    
</style>