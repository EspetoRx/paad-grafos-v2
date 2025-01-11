<template>
    <div 
        class="form-check form-switch mt-1" 
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
            justStarted: false,
            checkboxValue: false,
        }
    },
    mounted() {
        this.justStarted = true;
        this.checkboxValue = this.switchInitialValue;
        setTimeout(function(){
            this.justStarted = false;
        }.bind(this), 5);
    },
    watch: {
        checkboxValue: function(newCheckBoxValue, oldCheckBoxValue) {
            if (!this.justStarted)
                this.$emit('checkbox-status-changed', newCheckBoxValue);
        },
        switchInitialValue: function(newValue, oldValue) {
            this.checkboxValue = newValue;
        }
    },
    emits: ['checkbox-status-changed']
}
</script>