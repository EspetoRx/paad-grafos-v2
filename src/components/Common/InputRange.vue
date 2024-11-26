<template>
    <tooltip-label v-if="this.isLabelEnabled" :labelValue="this.labelValue" :tooltip="this.tooltip"
        :forId="this.inputId" :hasSwitch="false" :switchId="''" :switchTooltip="''" :switchDisabled="false"
        :switchInitialValue="false" :switchLabelEnabled="false" :switchLabelValue="''">

    </tooltip-label>
    <div class="d-flex">
        <input type="text" class="form-control w-25 h-75 text-center form-control-sm p-0" :value="this.value"
            :id="inputId + '-textfield'" disabled>
        <input type="range" v-model="this.value" class="form-range d-flex-fill m-2 h-75" :min="min" :max="max"
            :step="step" :id="inputId" :disabled="disabled || false">
    </div>
</template>
<script>

import LabelWithTooltip from './LabelWithTooltip.vue';

export default {
    name: "Range Component",
    props:[
        'inputId',
        'isLabelEnabled',
        'min',
        'max',
        'step',
        'initialValue',
        'labelValue',
        'tooltip',
        'disabled'
    ]
    ,
    data() {
        return {
            value: 0
        }
    },
    watch: {
        value: function (newValue, oldValue) {
            this.$emit("update-value-from-range-input", newValue);
        }
    },
    components: {
        'tooltip-label': LabelWithTooltip
    },
    mounted() {
        this.value = this.initialValue
    },
    emits: ['update-value-from-range-input']
}
</script>