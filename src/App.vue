<template>
    <div>
        <ModalComponent :disabled="bsModalDisabled" :title="bsModalTitle" :bodyComponent="bsModalBody"
            @modal-close="modalClose" @modal-return-value="setModalReturnValue" :showClose="bsModalShowClose">
        </ModalComponent>
        <ToastContainer :newToast="newToast"></ToastContainer>
        <top-navbar @toggle-off-canvas="toggleOffCanvas" @offcanvas-for-vis-configure="offCanvasForVisConfigure"
            @offcanvas-for-vis-physics="offCanvasForVisPhysics" @offcanvas-for-vis-nodes="offCanvasForVisNodes"
            @offcanvas-for-vis-edges="offCanvasForVisEdges" @offcanvas-for-vis-interactions="offcanvasForVisInteractions"
            @offcanvas-for-vis-layout="offCanvasForVisLayout" @offcanvas-for-vis-manipulation="offcanvasForVisManipulation">
        </top-navbar>
        <graph :nodes="nodes" :edges="edges" :options="options" @canvas-start="canvasStart" v-if="canvasEnabled"
            :key="Hash">
        </graph>
        <bottom-navbar></bottom-navbar>
        <off-canvas :offCanvasEnabled="this.offCanvasEnabled" :title="this.offCanvas.title" :type="this.offCanvas.type"
            :localNetwork="this.encapsulateNetwork" :options="this.options" @toggle-off-canvas="this.toggleOffCanvas"
            @options-has-changed="this.optionsHasChanged" :realNodes="this.nodes" :bsModalReturnValue="bsModalReturnValue"
            @nodes-has-changed="this.nodesHasChanged" @canvas-key-change="onCanvasKeyChange"
            @send-toast="emitNewToast" @open-bs-modal="enableModal" @edges-has-changed="edgesHasChanged" :realEdges="this.edges"></off-canvas>
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
import ModalComponent from './components/Common/Modal/Modal.vue';

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
                { id: 1, label: "Vértice 1" },
                { id: 2, label: "Vértice 2" },
                { id: 3, label: "Vértice 3" },
                { id: 4, label: "Vértice 4" },
                { id: 5, label: "Vértice 5" },
            ],
            edges: [
                { from: 1, to: 3, label: "<b>Aresta 1</b>" },
                { from: 1, to: 2, label: "<b><i>Aresta 2</i></b>" },
                { from: 2, to: 4, label: "<i>Aresta 3</i>" },
                { from: 2, to: 5, label: "<code>Aresta 4</code>" },
                { from: 3, to: 3, label: "Aresta 5" },
            ],
            options: null,
            encapsulateNetwork: null,
            Hash: hash(),
            newToast: null,

            bsModalDisabled: true,
            bsModalTitle: "",
            bsModalBody: "",
            bsModalReturnValue: null,
            bsModalShowClose: false,
            seed: "",
        }
    },
    components: {
        'top-navbar': TopNavbar,
        'bottom-navbar': BottomNavbar,
        'off-canvas': OffCanvas,
        'graph': Graph,
        'ToastContainer': ToastContainer,
        'ModalComponent': ModalComponent
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

        offCanvasForVisEdges() {

            this.offCanvas.title = "<i class='fa-solid fa-code-branch'></i> Vis Js. Arestas";
            this.offCanvas.type = "visjs-edges";

        },

        offcanvasForVisInteractions() {

            this.offCanvas.title = "<i class='fa-solid fa-computer-mouse'></i> Vis Js. Interações";
            this.offCanvas.type = "visjs-interactions";

        },

        offCanvasForVisLayout() {

            this.offCanvas.title = "<i class='fa-solid fa-file-signature'></i> Vis Js. Projeto";
            this.offCanvas.type = "visjs-layout";

        },

        offCanvasForVisNodes() {

            this.offCanvas.title = "<i class='fa-solid fa-circle'></i> Vis Js. Vértices";
            this.offCanvas.type = "visjs-nodes";

        },

        offcanvasForVisManipulation() {

            this.offCanvas.title = "<i class='fa-solid fa-gamepad'></i> Vis Js. Manipulação";
            this.offCanvas.type = "visjs-manipulation";

        },

        canvasStart(container, graph_data, options) {

            let localNetwork = new Network(
                container,
                graph_data,
                options
            );
            this.encapsulateNetwork = localNetwork;
            this.optionsHasChanged(options);
            this.checkManipulatioEnabled();

        },

        optionsHasChanged(options) {
            this.options = options;
            Vue.toRaw(this.encapsulateNetwork).setOptions(this.options);
        },

        nodesHasChanged(nodes) {
            this.nodes = nodes;
        },

        edgesHasChanged(edges) {
            this.edges = edges;
        },

        onCanvasKeyChange: function () {
            console.log("Repintando o canvas.");
            this.checkManipulatioEnabled();
            this.Hash = hash();
        },

        checkManipulatioEnabled: function () {
            if (this.options.manipulation.enabled) {
                setTimeout(function () {
                    var element = document.getElementsByClassName('vis-manipulation');
                    var element3 = document.getElementsByClassName('vis-edit-mode');
                    var element4 = document.getElementsByClassName('vis-close');
                    element = element[0];
                    element3 = element3[0];
                    element4 = element4[0];
                    var element2 = document.getElementById('vis-manipulation-area');
                    element2.innerHTML = '';
                    element2.insertAdjacentElement('afterbegin', element);
                    element2.insertAdjacentElement('beforeend', element3);
                    element2.insertAdjacentElement('beforeend', element4);
                }, 3);
            }
        },

        emitNewToast: function (value) {
            this.newToast = value;
        },

        enableModal: function (title, body) {
            this.bsModalTitle = title;
            this.bsModalBody = body;
            this.bsModalDisabled = false;
        },

        setModalReturnValue: function (value) {
            this.bsModalReturnValue = value;
            setTimeout(() => this.bsModalReturnValue = null, 2000)
        },

        modalClose: function () {
            this.bsModalDisabled = true;
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