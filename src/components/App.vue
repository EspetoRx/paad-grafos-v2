<template>
    <div>
        <top-navbar @toggle-off-canvas="toggleOffCanvas" @offcanvas-for-vis-configure="offCanvasForVisConfigure"
            @offcanvas-for-vis-physics="offCanvasForVisPhysics">
        </top-navbar>
        <graph :nodes="nodes" :edges="edges" :options="options" @update-network="updateNetwork">
        </graph>
        <bottom-navbar></bottom-navbar>
        <off-canvas :offCanvasEnabled="offCanvasEnabled" 
            :title="offCanvas.title" :type="offCanvas.type"
            :localNetwork="this.encapsulateNetwork" 
            :options="this.options"
            @toggle-off-canvas="toggleOffCanvas"
            @options-has-changed="optionsHasChanged"></off-canvas>
    </div>
</template>
<script>
import { Network } from 'vis-network'
import * as Vue from 'vue';
import { Tooltip } from 'bootstrap';

import TopNavbar from './TopNavbar.vue';
import BottomNavbar from './BottomNavbar.vue';
import OffCanvas from './OffCanvas.vue';
import Graph from './Graph.vue';

export default {
    data() {
        return {
            offCanvasEnabled: false,
            offCanvas: {
                title: '',
                type: '',
            },
            nodes: [
                { id: 1, label: "Node 1" },
                { id: 2, label: "Node 2" },
                { id: 3, label: "Node 3" },
                { id: 4, label: "Node 4" },
                { id: 5, label: "Node 5" },
            ],
            edges: [
                { from: 1, to: 3 },
                { from: 1, to: 2 },
                { from: 2, to: 4 },
                { from: 2, to: 5 },
                { from: 3, to: 3 },
            ],
            options: {
                manipulation: {
                    enabled: true,
                    initiallyActive: true,
                },
                nodes: {
                    physics: true,
                },
                interaction: {
                    dragNodes: true,
                    dragView: true,
                    hideEdgesOnDrag: false,
                    hideEdgesOnZoom: false,
                    hideNodesOnDrag: false,
                    hover: true,
                    hoverConnectedEdges: true,
                    keyboard: {
                        enabled: true,
                        speed: { x: -10, y: -10, zoom: 0.02 },
                        bindToWindow: true,
                        autoFocus: true,
                    },
                    multiselect: true,
                    navigationButtons: true,
                    selectable: true,
                    selectConnectedEdges: true,
                    tooltipDelay: 300,
                    zoomSpeed: 1,
                    zoomView: true
                },
                physics: {
                    enabled: true,
                    barnesHut: {
                        theta: 0.5,
                        gravitationalConstant: -2000,
                        centralGravity: 0.3,
                        springLength: 95,
                        springConstant: 0.04,
                        damping: 0.09,
                        avoidOverlap: 0
                    },
                    forceAtlas2Based: {
                        theta: 0.5,
                        gravitationalConstant: -50,
                        centralGravity: 0.01,
                        springConstant: 0.08,
                        springLength: 100,
                        damping: 0.4,
                        avoidOverlap: 0
                    },
                    repulsion: {
                        centralGravity: 0.2,
                        springLength: 200,
                        springConstant: 0.05,
                        nodeDistance: 100,
                        damping: 0.09
                    },
                    hierarchicalRepulsion: {
                        centralGravity: 0.0,
                        springLength: 100,
                        springConstant: 0.01,
                        nodeDistance: 120,
                        damping: 0.09,
                        avoidOverlap: 0
                    },
                    maxVelocity: 50,
                    minVelocity: 0.1,
                    solver: 'barnesHut',
                    stabilization: {
                        enabled: true,
                        iterations: 1000,
                        updateInterval: 100,
                        onlyDynamicEdges: false,
                        fit: true
                    },
                    timestep: 0.5,
                    adaptiveTimestep: true,
                    wind: { x: 0, y: 0 }
                }
            },
            //localNetwork: null,
            encapsulateNetwork: null,
        }
    },
    components: {
        'top-navbar': TopNavbar,
        'bottom-navbar': BottomNavbar,
        'off-canvas': OffCanvas,
        'graph': Graph
    },
    methods: {

        toggleOffCanvas() {

            this.offCanvasEnabled = !this.offCanvasEnabled;

        },

        offCanvasForVisConfigure() {

            this.offCanvas.title = "<i class='fa-solid fa-screwdriver-wrench'></i> Vis Js. Configure";
            this.offCanvas.type = "visjs-configure";

        },

        offCanvasForVisPhysics() {

            this.offCanvas.title = "<i class='fa-solid fa-earth-americas'></i> Vis Js. Física";
            this.offCanvas.type = "visjs-physics";

        },

        updateNetwork(container, graph_data, options) {

            let localNetwork = new Network(
                container,
                graph_data,
                options
            );
            this.encapsulateNetwork = localNetwork;
            this.optionsHasChanged(options);

        },

        optionsHasChanged: function(options) {
            this.options = options;
            Vue.toRaw(this.encapsulateNetwork).setOptions(this.options);
        }
    },
    mounted() {
        new Tooltip(document.body, {
            selector: "[data-bs-toggle='tooltip']",
        })
    }
}
</script>