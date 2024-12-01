<template>
    <div 
        class="form-check form-switch mt-1" 
        :data-bs-toggle="this.switchTooltipEnabled?'tooltip':''"
        :title="this.switchTooltip"
    >
        <input 
            class="form-check-input" 
            type="checkbox" 
            :id="this.switchId"
            :checked="this.checkboxValue" 
            v-model="this.checkboxValue"
            :disabled="this.switchDisabled"
        >
        <label 
            class="form-check-label" 
            :for="this.switchId"
            v-if="switchLabelEnabled"
        >{{ this.switchLabelValue }}</label>
    </div>
</template>
<script>
export default {
    name: "Switch Button Component",
    props: [
        'switchId',
        'switchDisabled',
        'switchInitialValue',
        'switchTooltipEnabled',
        'switchTooltip',
        'switchLabelEnabled',
        'switchLabelValue'
    ],
    data() {
        return {
            checkboxValue: false,
        }
    },
    mounted() {
        this.checkboxValue = this.switchInitialValue;
    },
    watch: {
        checkboxValue: function(newCheckBoxValue, oldCheckBoxValue) {
            this.$emit('checkbox-status-changed', newCheckBoxValue);
        },
        switchInitialValue: function(newValue, oldValue) {
            this.checkboxValue = newValue;
        }
    },
    emits: ['checkbox-status-changed']
}
</script>