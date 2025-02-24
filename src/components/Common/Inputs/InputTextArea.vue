<template>
    <LabelWithTooltip
        v-if="this.isLabelEnabled" 
        :labelValue="this.labelValue" 
        :tooltip="this.tooltip"
        :forId="this.inputId" 
        :hasSwitch="this.hasSwitch" 
        :switchId="this.switchId" 
        :switchTooltip="this.switchTooltip" 
        :switchDisabled="this.switchDisabled"
        :switchInitialValue="this.checkboxValue" 
        :switchLabelEnabled="this.switchLabelEnabled" 
        :switchLabelValue="this.switchLabelValue"
        @checkbox-status-changed="checkboxStatusChanged"
    ></LabelWithTooltip>
    <textarea class="form-control font-monospace" :disabled="!inputEnabled" :id="inputId" v-model="inputValue" :rows="(inputRows?inputRows:'')"></textarea>
</template>
<script>

import LabelWithTooltip from '../LabelWithTooltip.vue';

export default {
    name: "Input TextArea Component",
    data(){
        return {
            checkboxValue: false,
            inputValue: "",
        }
    },
    props: [
        'inputId',
        'inputEnabled',
        'inputInitialValue',
        'inputPlaceholder',
        'inputRows',
        'isLabelEnabled',
        'labelValue',
        'tooltip',
        'hasSwitch',
        'switchId',
        'switchTooltip',
        'switchDisabled',
        'switchInitialValue',
        'switchLabelEnabled',
        'switchLabelValue',
    ],
    components: {
        LabelWithTooltip
    },
    methods: {
        checkboxStatusChanged: function(oldCBValue, newCBValue) {
            this.$emit("checkbox-value-change", oldCBValue);
        },
    },
    watch: {
        inputValue: function(newValue, oldValue) {
            this.$emit("input-value-change", newValue);
        },
        inputInitialValue: function(newValue, oldValue) {
            this.inputValue = newValue;
        },
        switchInitialValue: function(newValue, oldValue) {
            this.checkboxValue = newValue;
        }
    },
    mounted() {
        this.inputValue = this.inputInitialValue;
        this.checkboxValue = this.switchInitialValue;
    },
    emits: ['checkbox-value-change', 'input-value-change']
}
</script>