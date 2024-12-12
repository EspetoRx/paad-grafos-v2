<style lang="css" src="./../css/style.css">
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