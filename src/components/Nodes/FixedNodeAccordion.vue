<template>
    <p v-if="!checkboxValue" class="m-0 pt-1">Ative para começar</p>
    <switch-info v-if="checkboxValue" :switchId="'enable-fixed-objects'" :switchDisabled="false"
        :switchInitialValue="this.enableObjectChekcboxValue" :switchTooltipEnabled="true"
        :switchTooltip="'Enable Fixed Object Sending. Ativa o envio do objeto Fixed.'" :switchLabelEnabled="true"
        :switchLabelValue="'Ativar envio de objeto'" @checkbox-status-changed="enableObjectSending"></switch-info>
    <div class="border p-1 m-1" v-if="checkboxValue && this.enableObjectChekcboxValue">
        <switch-info :switchId="'enable-fixed-objects-x'"
            :switchDisabled="false" :switchInitialValue="fixX" :switchTooltipEnabled="true"
            :switchTooltip="'Enable Fixed Object Sending at X Coordinate. Ativa o envio do objeto Fixed na coordenada X.'"
            :switchLabelEnabled="true" :switchLabelValue="'Fixar X'"
            @checkbox-status-changed="fixXCoordinate"></switch-info>
        <switch-info :switchId="'enable-fixed-objects-y'"
            :switchDisabled="false" :switchInitialValue="fixY" :switchTooltipEnabled="true"
            :switchTooltip="'Enable Fixed Object Sending at Y Coordinate. Ativa o envio do objeto Fixed.'"
            :switchLabelEnabled="true" :switchLabelValue="'Fixar Y'"
            @checkbox-status-changed="fixYCoordinate"></switch-info>
    </div>
</template>
<script>

import SwitchWithInfo from '../Common/SwitchWithInfo.vue';

export default {
    name: "Fixed Node Accordion Component",
    props: ['checkboxValue', 'bsModalReturnValue', 'openBsModal'],
    data() {
        return {
            enableObjectChekcboxValue: false,
            fixX: true,
            fixY: true,
            awaitingResponse: [],
        }
    },
    components: {
        'switch-info': SwitchWithInfo
    },
    methods: {
        enableObjectSending: function (value) {
            if (!value && this.enableObjectChekcboxValue) {
                this.awaitingResponse.push("repaint_canvas_nodes_fixed_object_sending_unselecting");
                this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
                this.enableObjectChekcboxValue = value;
            } else if (value && !this.enableObjectChekcboxValue) {
                this.awaitingResponse.push("repaint_canvas_nodes_fixed_object_sending_selecting");
                this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
                this.enableObjectChekcboxValue = value;
            }
        },
        fixXCoordinate: function (value) {
            if (!value && this.fixX) {
                this.awaitingResponse.push("repaint_canvas_nodes_fixed_X_unselecting");
                this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
                this.fixX = value;
            } else if (value && !this.fixX) {
                this.awaitingResponse.push("repaint_canvas_nodes_fixed_X_selecting");
                this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
                this.fixX = value;
            }
        },
        fixYCoordinate: function (value) {
            if (!value && this.fixY) {
                this.awaitingResponse.push("repaint_canvas_nodes_fixed_Y_unselecting");
                this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
                this.fixY = value;
            } else if (value && !this.fixY) {
                this.awaitingResponse.push("repaint_canvas_nodes_fixed_Y_selecting");
                this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
                this.fixY = value;
            }
        }
    },
    watch: {
        bsModalReturnValue: function (newValue, oldValue) {
            if (newValue == null || this.awaitingResponse.length == 0) return;
            if (this.awaitingResponse.includes("repaint_canvas_nodes_fixed_object_sending_unselecting", 0)) {
                this.awaitingResponse = this.awaitingResponse.filter(function (e) {
                    e != "repaint_canvas_nodes_fixed_object_sending_unselecting"
                });
                if (newValue) {
                    this.enableObjectChekcboxValue = !newValue;
                    this.$emit('message', 'options-nodes-fixed-object-sending', this.enableObjectChekcboxValue);
                    this.$emit("message", "repaint-component", true);
                } else {
                    this.enableObjectChekcboxValue = true;
                }
            }
            if (this.awaitingResponse.includes("repaint_canvas_nodes_fixed_object_sending_selecting", 0)) {
                this.awaitingResponse = this.awaitingResponse.filter(function (e) {
                    e != "repaint_canvas_nodes_fixed_object_sending_selecting"
                });
                if (newValue) {
                    this.enableObjectChekcboxValue = newValue;
                    this.$emit('message', 'options-nodes-fixed-object-sending', this.enableObjectChekcboxValue);
                    this.$emit("message", "repaint-component", true);
                } else {
                    this.enableObjectChekcboxValue = false;
                }
            }
            if (this.awaitingResponse.includes("repaint_canvas_nodes_fixed_X_unselecting", 0)) {
                this.awaitingResponse = this.awaitingResponse.filter(function (e) {
                    e != "repaint_canvas_nodes_fixed_X_unselecting"
                });
                if (newValue) {
                    this.fixX = !newValue;
                    this.$emit("message", 'fix-nodes-x-coordinate', this.fixX);
                    this.$emit("message", "repaint-component", true);
                } else {
                    this.fixX = true;
                }
            }
            if (this.awaitingResponse.includes("repaint_canvas_nodes_fixed_X_selecting", 0)) {
                this.awaitingResponse = this.awaitingResponse.filter(function (e) {
                    e != "repaint_canvas_nodes_fixed_X_selecting"
                });
                if (newValue) {
                    this.fixX = newValue;
                    this.$emit("message", 'fix-nodes-x-coordinate', this.fixX);
                    this.$emit("message", "repaint-component", true);
                } else {
                    this.fixX = false;
                }
            }
            if (this.awaitingResponse.includes("repaint_canvas_nodes_fixed_Y_unselecting", 0)) {
                this.awaitingResponse = this.awaitingResponse.filter(function (e) {
                    e != "repaint_canvas_nodes_fixed_Y_unselecting"
                });
                if (newValue) {
                    this.fixY = !newValue;
                    this.$emit("message", 'fix-nodes-y-coordinate', this.fixY);
                    this.$emit("message", "repaint-component", true);
                } else {
                    this.fixY = true;
                }
            }
            if (this.awaitingResponse.includes("repaint_canvas_nodes_fixed_Y_selecting", 0)) {
                this.awaitingResponse = this.awaitingResponse.filter(function (e) {
                    e != "repaint_canvas_nodes_fixed_Y_selecting"
                });
                if (newValue) {
                    this.fixY = newValue;
                    this.$emit("message", 'fix-nodes-y-coordinate', this.fixY);
                    this.$emit("message", "repaint-component", true);
                } else {
                    this.fixY = false;
                }
            }
        }
    },
    emits: ["message", 'open-bs-modal']
}
</script>