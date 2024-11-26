<template>
    <switch-info
        :switchId="'send-boolean-switch'"
        :switchTooltipEnabled="true"
        :switchTooltip="'Toggle this to send true of false. Alterne esse marcador para enviar verdadeiro ou falso.'"
        :switchDisabled="this.booleanDisabled"
        :switchInitialValue="true"
        :switchLabelEnabled="true"
        :switchLabelValue="(!enableObject)?('Enviando booleano ' + (booleanValue?'verdadeiro.':'falso.')):('Não está enviando booleano.')"
        @checkbox-status-changed="configureBooleanSending"
    ></switch-info>
    <switch-info
        :switchId="'send-object-switch'"
        :switchTooltipEnabled="true"
        :switchTooltip="'Send Object instead of boolean. Ativa o envio de objeto ao invés do envio do boolean verdadeiro ou falso.'"
        :switchDisabled="false"
        :switchInitialValue="false"
        :switchLabelEnabled="true"
        :switchLabelValue="'Ativar envio de objeto'"
        @checkbox-status-changed="avaliateObjectSend"
    ></switch-info>
    <div v-if="this.enableObject" class="border ms-1 me-1 pe-1 ps-1">
        <label-tooltip
            :labelValue="'Cor de fundo'"
            :tooltip="'Options.Nodes.Chosen.node.color - Configure a cor de background dos vértices selecionados.'"
            :forId="'background-color-pick'"
            :hasSwitch="false"
            :switchId="''"
            :switchTooltip="''"
            :switchDisabled="false"
            :switchInitialValue="false"
            :switchLabelEnabled="false"
            :switchLabelValue="''"
        ></label-tooltip>
        <input-color
            :colorPickerId="'background-color-pick'"
            :colorPickerDefaultColor="'#97C2FC'"
            :tooltip="'Options.Nodes.Chosen.node.color - Configure a cor de background dos vértices selecionados.'"
            @update-color="updateChosenNodeBackgroundColor"
        ></input-color>
    </div>
</template>
<script>

import SwitchWithInfo from '../Common/SwitchWithInfo.vue';
import LabelWithTooltip from '../Common/LabelWithTooltip.vue';
import InputColorPicker from '../Common/InputColorPicker.vue';

export default {
    name: "Chosen Node Options",
    data() {
        return{
            enableObject: false,
            booleanValue: true,
            booleanDisabled: false
        }
    },
    components: {
        'switch-info': SwitchWithInfo,
        'label-tooltip': LabelWithTooltip,
        'input-color': InputColorPicker
    },
    methods: {
        configureBooleanSending: function(value) {
            console.log("Confiugre boolean sending " + value);
            this.booleanValue = value;
            this.emitMessage("update-chosen-node", value);
        },
        avaliateObjectSend: function(value) {
            if (value == true) {
                this.enableObject = true;
                this.booleanDisabled = true;                
            } else {
                this.enableObject = false;
                this.booleanDisabled = false;
            }
        },
        updateChosenNodeBackgroundColor: function(value) {
            this.emitMessage('update-chosen-node-background-color', value);
        },
        emitMessage: function(message, value) {
            this.$emit("message", message, value);
        }
    },
    emits: ['message']
}
</script>