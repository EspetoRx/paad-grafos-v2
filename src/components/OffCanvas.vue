<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.offcanvas-body::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.offcanvas-body {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

.offcanvas_maior {
    width: 700px;
}
</style>
<template>
    <div class="offcanvas offcanvas-end" :class="offCanvasEnabled ? 'show' : ''" tabindex="-1"
        :style="{ visibility: offCanvasEnabled ? 'visible' : 'hidden' }" id="offcanvasBodyEnclosure">
        <div class="offcanvas-header p-2">
            <h5 class="offcanvas-title" id="" v-html="title"></h5>
            <button type="button" class="btn-close text-reset" @click.prevent="checkOptions(); $emit('toggle-off-canvas')"></button>
        </div>
        <div class="offcanvas-body">
            <physics v-if="this.type == 'visjs-physics'" :localNetwork="this.encapsulateLocalNetwork"
                :options="this.encapsulateOptions" @options-has-changed="optionsHasChanged"></physics>
            <nodes v-if="this.type == 'visjs-nodes'" :network="this.encapsulateLocalNetwork"
                :options="this.encapsulateOptions" @options-has-changed="optionsHasChanged"
                @nodes-has-changed="nodeshasChanged" :nodes="encapsulateNodes" @component-key-change="onComponentKeyChange"
                @send-toast="sendToast"></nodes>
            <edges v-if="this.type == 'visjs-edges'" :network="encapsulateLocalNetwork" :options="encapsulateOptions"
                @options-has-changed="optionsHasChanged" @send-toast="sendToast" @canvas-key-change="onComponentKeyChange"
                @open-bs-modal="enableBsModal" :bsModalReturnValue="bsModalReturnValue"></edges>
            <div id="offcanvasBody"></div>
        </div>
    </div>
</template>
<script>

import physics from './Physics/Physics.vue';
import nodes from './Nodes/Nodes.vue';
import edges from './Edges/Edges.vue'

export default {
    name: 'Off Canvas',
    components: {
        'physics': physics,
        'nodes': nodes,
        'edges': edges
    },
    props: [
        'offCanvasEnabled',
        'title',
        'type',
        'localNetwork',
        'options',
        'realNodes',
        'bsModalReturnValue'
    ],
    data() {
        return {
            encapsulateLocalNetwork: null,
            encapsulateOptions: null,
            container: document.getElementById("offcanvasBody"),
            encapsulateNodes: null
        }
    },
    watch: {
        offCanvasEnabled: function (newOffCanvasEnabled, oldOffCanvasEnabled) {
            if (newOffCanvasEnabled) {
                if (this.type == 'visjs-physics') {
                    this.encapsulateLocalNetwork = this.localNetwork;
                    this.encapsulateOptions = this.options;
                    this.$emit('options-has-changed', this.encapsulateOptions);
                }
                if (this.type == 'visjs-configure' || this.type == "visjs-nodes") {
                    this.encapsulateLocalNetwork = this.localNetwork;
                    this.encapsulateOptions = this.options;
                }
                if (this.type == 'visjs-configure') {
                    this.encapsulateLocalNetwork = this.localNetwork;
                    this.encapsulateOptions = this.options;
                    var container = document.getElementById("offcanvasBody");
                    this.encapsulateOptions.configure = {
                        enabled: true,
                        filter: true,
                        container: container,
                        showButton: true
                    }
                    var offcanvasBody = document.getElementById("offcanvasBodyEnclosure");
                    offcanvasBody.classList.add('offcanvas_maior');
                    this.optionsHasChanged(this.encapsulateOptions);
                }
                if (this.type == "visjs-edges") {
                    this.encapsulateLocalNetwork = this.localNetwork;
                    this.encapsulateOptions = this.options;
                    this.encapsulateOptions.edges = {};
                    this.$emit('options-has-changed', this.encapsulateOptions);
                }
            } 

        },
    },
    mounted() {
        console.log("OffCanvas Component Mounted");
        this.encapsulateNodes = this.realNodes;
    },
    methods: {
        optionsHasChanged(recievedOptions) {
            this.encapsulateOptions = recievedOptions;
            this.$emit('options-has-changed', this.encapsulateOptions);
        },
        nodeshasChanged(recievedNodes) {
            this.encapsulateNodes = recievedNodes;
            this.$emit('nodes-has-changed', this.encapsulateNodes);
        },
        onComponentKeyChange: function(recievedFlag) {
            if (recievedFlag) {
                this.$emit('canvas-key-change')
            }
        },
        sendToast: function(value) {
            this.$emit('send-toast', value);
        },
        checkOptions: function() {
            // Fazer Lógica melhor para não dar PAU...
            /*if (this.type == 'visjs-configure') {
                var optionsFromConfigurator = Vue.toRaw(this.encapsulateLocalNetwork).getOptionsFromConfigurator();
                optionsFromConfigurator.nodes.shape = this.encapsulateOptions.nodes.shpae ?? 'ellipse';
                optionsFromConfigurator.nodes.opacity = 1;
                optionsFromConfigurator.configure = false;
                optionsFromConfigurator.manipulation.enabled = false;
                optionsFromConfigurator.manipulation.initiallyActive = false;
                optionsFromConfigurator.physics = {solver : 'barnesHut'};
                this.optionsHasChanged(optionsFromConfigurator);
            }*/
            if (this.type == 'visjs-configure') {
                this.encapsulateOptions.configure = false;
                this.$emit('options-has-changed', this.encapsulateOptions);
            }
        },
        enableBsModal: function(title, body) {
            this.$emit("open-bs-modal", title, body);
        }
    },
    emits: [
        'toggle-off-canvas',
        'options-has-changed',
        'nodes-has-changed',
        'canvas-key-change',
        'send-toast',
        'open-bs-modal'
    ]
}
</script>