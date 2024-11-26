<template>
    <div>
        <div id="graph"></div>
    </div>
</template>
<script>
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
                nodes: this.nodes,
                edges: this.edges
            };
        },
    },
    mounted() {
        console.log("Graph Component mounted.");
        this.container = document.getElementById("graph");
        this.$emit('update-network', this.container, this.graph_data, this.options);
    },
    emits: ['update-network']
}
</script>