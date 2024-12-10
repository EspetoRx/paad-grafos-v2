<template>
    <p v-if="!checkboxValue" class="m-0 pt-1">Ative para começar.</p>
    <SwitchWithInfo v-if="checkboxValue" :switchId="'send-object-sending-switch'" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Nodes.Chosen (Toggle Boolean/Object sending) - Alterne entre o envio do booleano e de objeto'"
        :switchDisabled="false" :switchInitialValue="enableObject" :switchLabelEnabled="true"
        :switchLabelValue="(enableObject) ? 'Enviando objeto para o escolhido' : 'Enviando booleano verdadeiro para o escolhido'"
        @checkbox-status-changed="configureBooleanSending"></SwitchWithInfo>
    <SwitchWithInfo v-if="checkboxValue && enableObject" :switchId="'send-object-node-sending-switch'"
        :switchTooltipEnabled="true"
        :switchTooltip="'Options.Nodes.Chosen.Node (Toggle Boolean/Object sending) - Quando verdadeiro, selecionar ou passar o mouse sobre um vértice alterará suas características de acordo com o padrão. Quando falso, nenhuma alteração ocorrerá no vértice quando o vértice for escolhido.'"
        :switchDisabled="false" :switchInitialValue="enableNodeObject" :switchLabelEnabled="true"
        :switchLabelValue="(enableNodeObject) ? 'Enviando objeto para o vértice escolhido' : 'Enviando booleano para o vértice escolhido'"
        @checkbox-status-changed="configureNodeBooleanSending"></SwitchWithInfo>
    <InputTextArea v-if="checkboxValue && enableObject && enableNodeObject" :inputId="'input-text-function-chosen-node'"
        :inputEnabled="nodeFunctionEnabled" :inputInitialValue="nodeFunctionText"
        :inputPlaceholder="'//JS para o vértice escolhido'" :inputRows="10" :isLabelEnabled="true"
        :labelValue="'Função de customização de vértice'" :tooltip="'Options.Nodes.Chosen.Node (Custom Function) - '"
        :hasSwitch="true" :switchId="'input-text-function-chosen-edit-mode'"
        :switchTooltip="'Options.Nodes.Chose.Node (Enable Funciton Editing) - Ative a edição da função.'"
        :switchDisabled="false" :switchInitialValue="nodeFunctionEnabled" :switchLabelEnabled="false"
        @checkbox-value-change="nodeFunctionEnabledChange" @input-value-change="nodeFunctionTextChange"></InputTextArea>
    <button type="button" class="btn btn-primary form-control mt-2"
        v-if="checkboxValue && enableObject && enableNodeObject && nodeFunctionEnabled"
        @click.prevent="nodeFunctionChange">Enviar função (Repinta canvas)</button>
    <SwitchWithInfo v-if="checkboxValue && enableObject" :switchId="'send-object-label-sending-switch'"
        :switchTooltipEnabled="true"
        :switchTooltip="'Options.Nodes.Chosen.Label (Toggle Boolean/Object sending) - Quando verdadeiro, selecionar ou passar o mouse sobre um vértice alterará as características de seu rótulo de acordo com o padrão. Quando falso, nenhuma alteração no rótulo do vértice ocorrerá quando o vértice for escolhido.'"
        :switchDisabled="false" :switchInitialValue="enableLabelObject" :switchLabelEnabled="true"
        :switchLabelValue="(enableLabelObject) ? 'Enviando objeto para o rótulo escolhido' : 'Enviando booleano para o rótulo escolhido'"
        @checkbox-status-changed="configureLabelBooleanSending"></SwitchWithInfo>
    <InputTextArea v-if="checkboxValue && enableObject && enableLabelObject" :inputId="'input-text-function-chosen-label'"
        :inputEnabled="labelFunctionEnabled" :inputInitialValue="labelFunctionText"
        :inputPlaceholder="'//JS para o rótulo escolhido'" :inputRows="10" :isLabelEnabled="true"
        :labelValue="'Função de customização de rótulo'" :tooltip="'Options.Nodes.Chosen.Label (Custom Function) - '"
        :hasSwitch="true" :switchId="'input-text-function-chosen-labe-edit-mode'"
        :switchTooltip="'Options.Nodes.Chose.Label (Enable Funciton Editing) - Ative a edição da função.'"
        :switchDisabled="false" :switchInitialValue="labelFunctionEnabled" :switchLabelEnabled="false"
        @checkbox-value-change="labelFunctionEnabledChange" @input-value-change="labelFunctionTextChange"></InputTextArea>
    <button type="button" class="btn btn-primary form-control mt-2" v-if="checkboxValue && enableObject && enableLabelObject && labelFunctionEnabled" @click.prevent="labelFunctionchange">Enviar função (Repinta canvas)</button>
</template>
<script>

import SwitchWithInfo from '../Common/SwitchWithInfo.vue';
import LabelWithTooltip from '../Common/LabelWithTooltip.vue';
import InputColorPicker from '../Common/Inputs/InputColorPicker.vue';
import InputTextArea from '../Common/Inputs/InputTextArea.vue';

export default {
    name: "Chosen Node Options",
    props: ['checkboxValue', 'bsModalReturnValue', 'openBsModal'],
    data() {
        return {
            enableObject: false,
            enableNodeObject: false,
            nodeFunctionEnabled: false,
            nodeFunctionText: "",
            nodeFunction: null,
            enableLabelObject: false,
            labelFunctionEnabled: false,
            labelFunctionText: "",
            labelFunction: null,
            awaitingResponse: []
        }
    },
    components: {
        SwitchWithInfo,
        LabelWithTooltip,
        InputColorPicker,
        InputTextArea
    },
    methods: {
        configureBooleanSending: function (value) {
            this.enableObject = value;
            this.$emit("message", "options-nodes-chosen-object-enabled", value);
        },
        configureNodeBooleanSending: function (value) {
            this.enableNodeObject = value;
            this.awaitingResponse.push("options_nodes_chosen_canvas_redraw");
            this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
        },
        nodeFunctionEnabledChange: function (value) {
            this.nodeFunctionEnabled = value;
        },
        nodeFunctionTextChange: function (value) {
            this.nodeFunctionText = value;
        },
        nodeFunctionChange: function () {
            this.nodeFunction = eval(this.nodeFunctionText);
            this.$emit('message', 'options-nodes-chosen-node-function-value', this.nodeFunction);
            this.$emit("message", 'repaint-component');
            this.nodeFunctionEnabled = false;
        },
        configureLabelBooleanSending: function (value) {
            this.enableLabelObject = value;
            this.awaitingResponse.push("options_nodes_chosen_canvas_redraw_label")
            this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas")
        },
        labelFunctionEnabledChange: function(value) {
            this.labelFunctionEnabled = value;
        },
        labelFunctionTextChange: function(value) {
            this.labelFunctionText = value;
        },
        labelFunctionchange: function () {
            this.labelFunction = eval(this.labelFunctionText);
            this.$emit("message", "options-nodes-chosen-label-function-value", this.labelFunction);
            this.$emit("message", "repaint-component");
            this.labelFunctionEnabled = false;
        }
    },
    watch: {
        bsModalReturnValue: function (newValue, oldValue) {
            if (newValue == null) return;
            if (this.awaitingResponse.includes("options_nodes_chosen_canvas_redraw", 0)) {
                if (newValue) {
                    if (newValue && this.enableNodeObject && this.nodeFunctionText == "") {
                        import('./scripts/chosenNodeCustomFunction.js?raw')
                            .then(res => res.default)
                            .then((t) => {
                                this.nodeFunctionText = t;
                                this.nodeFunction = eval(t);

                                if (this.nodeFunction != null) {
                                    this.$emit("message", "send-toast", {
                                        toastTitle: "Cuidado",
                                        toastIcon: "fa-circle-exclamation",
                                        toastBody: "O input de Javascript pode levar a erros e a travamentos da aplicação. Use com cautela!",
                                        toastClasses: " bg-danger text-black"
                                    });
                                }
                                this.$emit('message', 'options-nodes-chosen-node-function-value', this.nodeFunction);
                                this.$emit("message", 'repaint-component');
                            });
                    } else if (newValue && this.enableObject) {
                        this.nodeFunction = eval(this.nodeFunctionText);
                        this.$emit("message", "options-nodes-chosen-node-function-value", this.nodeFunction);
                    }
                } else {
                    this.enableNodeObject = false;
                    this.$emit("options-nodes-chosen-label-boolean", true);
                    this.$emit("message", 'repaint-component');
                }
            }
            if (this.awaitingResponse.includes("options_nodes_chosen_canvas_redraw_label", 0)) {
                if (newValue) {
                    if (newValue && this.enableLabelObject && this.labelFunctionText == "") {
                        import('./scripts/chosenLabelCustomFunction.js?raw')
                            .then(res => res.default)
                            .then((t) => {
                                this.labelFunctionText = t;
                                this.labelFunction = eval(t);

                                if (this.labelFunction != null) {
                                    this.$emit("message", "send-toast", {
                                        toastTitle: "Cuidado",
                                        toastIcon: "fa-circle-exclamation",
                                        toastBody: "O input de Javascript pode levar a erros e a travamentos da aplicação. Use com cautela!",
                                        toastClasses: " bg-danger text-black"
                                    });
                                }
                                this.$emit('message', 'options-nodes-chosen-label-function-value', this.labelFunction);
                                this.$emit("message", 'repaint-component');
                            });
                    } else if (newValue && this.enableObject) {
                        this.labelFunction = eval(this.labelFunctionText);
                        this.$emit("message", "options-nodes-chosen-label-function-value", this.labelFunction);
                    }
                } else {
                    this.enableLabelObject = false;
                    this.$emit("options-nodes-chosen-node-boolean", true);
                    this.$emit("message", 'repaint-component');
                }
            }
        }
    },
    emits: ['message', 'open-bs-modal']
}
</script>