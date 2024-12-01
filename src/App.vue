<template>
    <div>
        <ToastContainer :newToast="newToast"></ToastContainer>
        <top-navbar @toggle-off-canvas="toggleOffCanvas" @offcanvas-for-vis-configure="offCanvasForVisConfigure"
            @offcanvas-for-vis-physics="offCanvasForVisPhysics" @offcanvas-for-vis-nodes="offCanvasForVisNodes">
        </top-navbar>
        <graph :nodes="nodes" :edges="edges" :options="options" @canvas-start="canvasStart" v-if="canvasEnabled"
            :key="Hash">
        </graph>
        <bottom-navbar></bottom-navbar>
        <off-canvas :offCanvasEnabled="this.offCanvasEnabled" :title="this.offCanvas.title" :type="this.offCanvas.type"
            :localNetwork="this.encapsulateNetwork" :options="this.options" @toggle-off-canvas="this.toggleOffCanvas"
            @options-has-changed="this.optionsHasChanged" :realNodes="this.nodes"
            @nodes-has-changed="this.nodesHasChanged" @canvas-key-change="onCanvasKeyChange"
            @send-toast="emitNewToast"></off-canvas>
    </div>
</template>
<script>
import { Network } from 'vis-network';
import * as Vue from 'vue';
import { Tooltip, Toast } from 'bootstrap';

import TopNavbar from './components/TopNavbar.vue';
import BottomNavbar from './components/BottomNavbar.vue';
import OffCanvas from './components/OffCanvas.vue';
import Graph from './components/Graph.vue';
import ToastContainer from './components/Common/Toast/ToastContainer.vue';

import BaseOptions from './assets/BaseOptions.json';
import { hash } from './../src/utils/Hash';

export default {
    data() {
        return {
            canvasEnabled: false,
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
            options: null,
            encapsulateNetwork: null,
            Hash: hash(),
            newToast: null
        }
    },
    components: {
        'top-navbar': TopNavbar,
        'bottom-navbar': BottomNavbar,
        'off-canvas': OffCanvas,
        'graph': Graph,
        'ToastContainer': ToastContainer
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

        offCanvasForVisNodes() {

            this.offCanvas.title = "<i class='fa-solid fa-circle'></i> Vis Js. Vértices";
            this.offCanvas.type = "visjs-nodes";

        },

        canvasStart(container, graph_data, options) {

            let localNetwork = new Network(
                container,
                graph_data,
                options
            );
            this.encapsulateNetwork = localNetwork;
            this.optionsHasChanged(options);

        },

        optionsHasChanged(options) {
            this.options = options;
            Vue.toRaw(this.encapsulateNetwork).setOptions(this.options);
        },

        nodesHasChanged(nodes) {
            this.nodes = nodes;
        },

        onCanvasKeyChange: function () {
            this.Hash = hash();
        },

        emitNewToast: function (value) {
            this.newToast = value;
        }
    },
    mounted() {
        this.options = BaseOptions;
        this.options.nodes.image = new URL(`/public/images/paad_logo.png`, import.meta.url).href;
        this.options.nodes.brokenImage = new URL(`/public/images/paad_logo.png`, import.meta.url).href;
        this.canvasEnabled = true;
        new Tooltip(document.body, {
            selector: "[data-bs-toggle='tooltip']",
        });
        new Toast();
    }
}
</script>