<style>
div.vis-network div.vis-navigation div.vis-button{
    background-position: 0px 0px;
    border-radius: 0;
}

div.vis-network div.vis-navigation div.vis-button:hover,
div.vis-network div.vis-navigation div.vis-button:active {
    box-shadow: none;
}

div.vis-network div.vis-navigation div.vis-button.vis-up {
    bottom: 13.1vh;
    left: 30px;
    background-image: url('/images/manipulation_buttons/chevron-up-solid.svg');
}

div.vis-network div.vis-navigation div.vis-button.vis-down {
    bottom: 6.1vh;
    left: 30px;
    background-image: url('/images/manipulation_buttons/chevron-down-solid.svg');
}

div.vis-network div.vis-navigation div.vis-button.vis-left {
    bottom: 9.6vh;
    left: 15px;
    background-image: url('/images/manipulation_buttons/chevron-left-solid.svg');
}

div.vis-network div.vis-navigation div.vis-button.vis-right {
    bottom: 9.6vh;
    left: 57.5px;
    background-image: url('/images/manipulation_buttons/chevron-right-solid.svg');
}

div.vis-network div.vis-navigation div.vis-button.vis-zoomIn {
    bottom: 6.5vh;
    right: 20px;
    background-image: url('/images/manipulation_buttons/magnifying-glass-plus-solid.svg');
}

div.vis-network div.vis-navigation div.vis-button.vis-zoomOut {
    bottom: 13vh;
    right: 20px;
    background-image: url('/images/manipulation_buttons/magnifying-glass-minus-solid.svg');
}
div.vis-network div.vis-navigation div.vis-button.vis-zoomExtends {
    bottom: 20vh;
    right: 20px;
    background-image: url('/images/manipulation_buttons/expand-solid.svg');
}
</style>

<template>
    <div>
        <div id="graph"></div>
    </div>
</template>
<script>
import { DataSet } from 'vis-data';
export default {

    name: "Graph",
    props: ['nodes', 'edges', 'options'],
    data() {
        return {
            container: null,
        }
    },
    computed: {
        graph_data() {
            return {
                nodes: new DataSet(this.nodes),
                edges: new DataSet(this.edges)
            };
        },
    },
    mounted() {
        console.log("Graph Component mounted.");
        this.container = document.getElementById("graph");
        this.$emit('canvas-start', this.container, this.graph_data, this.options);
    },
    emits: ['canvas-start']
}
</script>