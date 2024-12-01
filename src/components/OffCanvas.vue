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
</style>
<template>
    <div class="offcanvas offcanvas-end" :class="offCanvasEnabled ? 'show' : ''" tabindex="-1"
        :style="{ visibility: offCanvasEnabled ? 'visible' : 'hidden' }">
        <div class="offcanvas-header p-2">
            <h5 class="offcanvas-title" id="" v-html="title"></h5>
            <button type="button" class="btn-close text-reset" @click.prevent="$emit('toggle-off-canvas')"></button>
        </div>
        <div class="offcanvas-body">
            <physics v-if="this.type == 'visjs-physics'" :localNetwork="this.encapsulateLocalNetwork"
                :options="this.encapsulateOptions" @options-has-changed="optionsHasChanged"></physics>
            <nodes v-if="this.type == 'visjs-nodes'" :network="this.encapsulateLocalNetwork"
                :options="this.encapsulateOptions" @options-has-changed="optionsHasChanged"
                @nodes-has-changed="nodeshasChanged" :nodes="encapsulateNodes" @component-key-change="onComponentKeyChange"
                @send-toast="sendToast"></nodes>
            <div id="offcanvasBody"></div>
        </div>
    </div>
</template>
<script>

import physics from './Physics/Physics.vue';
import nodes from './Nodes/Nodes.vue';

export default {
    name: 'Off Canvas',
    components: {
        'physics': physics,
        'nodes': nodes,
    },
    props: [
        'offCanvasEnabled',
        'title',
        'type',
        'localNetwork',
        'options',
        'realNodes'
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
                    this.optionsHasChanged(this.encapsulateOptions);
                }
            } else {
                if (this.type == 'visjs-configure') {
                    this.encapsulateOptions.configure.enabled = false;
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
        }
    },
    emits: [
        'toggle-off-canvas',
        'options-has-changed',
        'nodes-has-changed',
        'canvas-key-change',
        'send-toast'
    ]
}
</script>