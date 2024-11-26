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
    <input type="text" class="form-control" :enabled="this.inputEnabled" :id="this.inputId" v-model="this.inputValue" />
</template>
<script>

import LabelWithTooltip from './LabelWithTooltip.vue';

export default {
    name: "Input Text Component",
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
        }
    },
    mounted(){
        this.checkboxValue = this.switchInitialValue;
        this.inputValue = this.inputInitialValue;
    },
    emits: ['checkbox-value-change', 'input-value-change']
}
</script>