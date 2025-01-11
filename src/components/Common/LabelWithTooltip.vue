<template>
    <div class="d-flex justify-content-between mt-1 mb-1">
        <switch-button v-if="this.hasSwitch" :switchId="this.switchId" :switchDisabled="this.switchDisabled"
            :switchInitialValue="this.switchInitialValue" :switchTooltipEnabled="this.switchTooltipEnabled || false"
            :switchTooltip="this.switchTooltip" :switchLabelEnabled="this.switchLabelEnabled"
            :switchLabelValue="this.switchLabelValue" @checkbox-status-changed="checkboxStatusChanged"></switch-button>
        <div class="d-flex justify-content-between flex-fill">
            <div class="d-flex w-100 justify-content-between">
                <div>
                    <label :for="forId" class="form-label h-100 mb-0 pt-1 align-middle">{{ this.labelValue }}</label>
                </div>
                <div class="flex-shrink-1 badge bg-info m-1" data-bs-toggle="tooltip" :title="this.tooltip">
                    <i class="fa-solid fa-info text-right"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import SwitchButton from './SwitchButton.vue';

export default {
    name: "Label tooltip",
    props: [
        'labelValue',
        'tooltip',
        'forId',
        'hasSwitch',
        'switchId',
        'switchTooltip',
        'switchDisabled',
        'switchInitialValue',
        'switchLabelEnabled',
        'switchLabelValue',
        'switchTooltipEnabled'
    ],
    components: {
        'switch-button': SwitchButton
    },
    methods: {
        checkboxStatusChanged: function (value) {
            this.$emit('checkbox-status-changed', value);
        }
    },
    emits: ['checkbox-status-changed']
}
</script>