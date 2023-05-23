<script>
    import { selectedWorld } from '../../../store';
    import Footer from "../../components/Footer.svelte";

    let SelectedWorld = [{
        name: '', desc: '', profile: '', id: 0 
    }];

    selectedWorld.subscribe(value => {
        SelectedWorld = value;
    });
</script>

<div class="one">

    <div class="two">

        <div class="four">

            <h1>PLACES</h1>
            <h2>{SelectedWorld[0].name}</h2>

        </div>

        <div class="five">

            <div class="list">
                <h2>List</h2>
            </div>

            <div class="image">
                <h2>Image</h2>
                <img src="../src/assets/blank image.png" alt='' id="image">
            </div>
  
        </div>

    </div>
    
    <div class="three">
        <h2>Description</h2>
        <h4 class="text_description"> Name:</h4>
        <h4 class="text_description"> Age:</h4>
        <h4 class="text_description"> Ethnicity:</h4>
        <h4 class="text_description"> Gender:</h4>
        <h4 class="text_description"> Bio:</h4>

    </div>

</div>

<Footer/>

<style>
    #image{
        opacity: 45%;
        max-width: 90%;
        height: auto;
        border-radius: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.273);
        margin-bottom: 50px;
    }
    .image{
        min-height: 100px;
    }

    h1 {
        font-size: 80px;
        position: absolute;
    }

    h2 {
        text-transform: uppercase;
    }

    .three{
        margin: 20px;
        height: auto;
        border-radius: 10px;
        background: rgb(255, 233, 199);
        box-shadow: 0 0 10px rgba(60, 10, 0, 0.679);
    }
    .four {
        padding-left: 30px;
    }

    .five {
        display: grid;
        max-height: auto;
        grid-template-columns: 50% 50%; 
    }

    .one {
        width: 100%;
        min-height: 500px;
        padding-bottom: 50px;
        display: grid;
        grid-gap: 10px;
        grid-template-columns: 60% 40%;   
    }
    .two {
        display: grid;
        grid-template-rows: 50% 50%; 
    }

    .image, .list {
        margin: 20px;
        height: 100%;
        border-radius: 10px;
        background: rgb(255, 233, 199);
        box-shadow: 0 0 10px rgba(60, 10, 0, 0.679);
    }

    .text_description {
        color: rgba(125, 125, 125, 0.571);
        padding-left: 40px;
        padding-right: 40px;
    }
</style>