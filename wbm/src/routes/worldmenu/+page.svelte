<script>


</script>



<div class="worldoptions">
    <button class="option"><h2>People</h2></button>
    <button class="option"><h2>Place</h2></button>
    <button class="option"><h2>Items</h2></button>
    <button class="option"><h2>Events</h2></button>

</div>

<div class="name">
    <h1>NAME</h1>
</div>

<style>
    .worldoptions {
        position:absolute;
        top: 50px;
        display: flex;
        justify-content: center;
        width: 100%;
    }

    h2 {
        text-align: center;
        font-size: 50px;
    }

    .name {
        text-align: center;
        font-size: 35px;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: rgb(213, 0, 0);
    }

    button{
        padding-left: 70px;
        padding-right: 70px;
        background: transparent;
        border: transparent;
        cursor: pointer;
        text-transform: uppercase;
        font-size: 30px;
        text-align: center;
    }

    button:active {
        background: transparent;
    }

    .option {
        filter: grayscale();
        color:rgb(213, 0, 0);
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }

    .option:hover {
        filter: none;
        transition-duration: 200ms;
        transition-timing-function: ease-in-out;
    }

    .option:active {
        color: red;
    }
</style>