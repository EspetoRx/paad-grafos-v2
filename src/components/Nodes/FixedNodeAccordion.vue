<template>
    <switch-info
        :switchId="'enable-fixed-objects'"
        :switchDisabled="false"
        :switchInitialValue="this.enableObjectChekcboxValue"
        :switchTooltipEnabled="true"
        :switchTooltip="'Enable Fixed Object Sending. Ativa o envio do objeto Fixed.'"
        :switchLabelEnabled="true"
        :switchLabelValue="'Ativar envio de objeto'"
        @checkbox-status-changed="enableObjectSending"
    ></switch-info>
    <switch-info
        v-if="this.enableObjectChekcboxValue"
        :switchId="'enable-fixed-objects-x'"
        :switchDisabled="false"
        :switchInitialValue="false"
        :switchTooltipEnabled="true"
        :switchTooltip="'Enable Fixed Object Sending at X Coordinate. Ativa o envio do objeto Fixed na coordenada X.'"
        :switchLabelEnabled="true"
        :switchLabelValue="'Fixar X'"
        @checkbox-status-changed="fixXCoordinate"
    ></switch-info>
    <switch-info
        v-if="this.enableObjectChekcboxValue"
        :switchId="'enable-fixed-objects-y'"
        :switchDisabled="false"
        :switchInitialValue="false"
        :switchTooltipEnabled="true"
        :switchTooltip="'Enable Fixed Object Sending at Y Coordinate. Ativa o envio do objeto Fixed.'"
        :switchLabelEnabled="true"
        :switchLabelValue="'Fixar Y'"
        @checkbox-status-changed="fixYCoordinate"
    ></switch-info>
</template>
<script>

import SwitchWithInfo from '../Common/SwitchWithInfo.vue';

export default {
    name: "Fixed Node Accordion Component",
    props: ['checkboxValue', 'bsModalReturnValue', 'openBsModal'],
    data() {
        return {
            enableObjectChekcboxValue: false
        }
    },
    components: {
        'switch-info': SwitchWithInfo
    }, 
    methods: {
        enableObjectSending: function(value) {
            this.enableObjectChekcboxValue = value;
            this.$emit('message', 'enable-fixed-node-object-sending', value);
        },
        fixXCoordinate: function(value) {
            this.$emit("message", 'fix-nodes-x-coordinate', value);
        },
        fixYCoordinate: function(value) {
            this.$emit("message", 'fix-nodes-y-coordinate', value);
        }
    },
    emits: ["message", 'open-bs-modal']
}
</script>