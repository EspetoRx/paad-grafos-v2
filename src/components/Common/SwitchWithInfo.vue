<template>
    <div :class="'d-flex justify-content-between ' + ((divClasses)?divClasses:'')">
        <switch-button :switchId="this.switchId" :switchDisabled="this.switchDisabled"
            :switchInitialValue="this.switchValue" :switchTooltipEnabled="this.switchTooltipEnabled"
            :switchTooltip="this.switchTooltip" :switchLabelEnabled="this.switchLabelEnabled"
            :switchLabelValue="this.switchLabelValue" @checkbox-status-changed="checkBoxStatusChanged" class="flex-fill"></switch-button>
        <div>
            <div class="flex-shrink-1 badge bg-info m-1" data-bs-toggle="tooltip" :title="this.switchTooltip">
                <i class="fa-solid fa-info text-right"></i>
            </div>
        </div>
    </div>
</template>
<script>

import SwitchButton from './SwitchButton.vue';

export default {
    name: "Switch Button With Info",
    props: [
        'switchId',
        'switchDisabled',
        'switchInitialValue',
        'switchTooltipEnabled',
        'switchTooltip',
        'switchLabelEnabled',
        'switchLabelValue',
        'divClasses'
    ],
    data() {
        return{
            switchValue: false
        }
    },
    mounted() {
        this.switchValue = this.switchInitialValue;
    },
    components: {
        'switch-button': SwitchButton
    },
    methods: {
        checkBoxStatusChanged: function (value) {
            this.$emit('checkbox-status-changed', value);
        }
    },
    watch: {
        switchInitialValue: function(newValue, oldValue) {
            this.switchValue = newValue;
        }
    },
    emits: ['checkbox-status-changed']
    
}
</script>