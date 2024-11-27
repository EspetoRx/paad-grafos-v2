<template>
    <div class="accordion-item">
        <div class="accordion-header border-bottom">
            <div class="d-flex">
                <div class="form-check form-switch pt-1 pb-1 ms-1 collapsed" v-if="switchButton">
                    <input class="form-check-input" type="checkbox" role="switch" :id="'flexSwitch-' + this.id"
                        :checked="this.checkboxValue" v-model="this.checkboxValue" :disabled="!this.currentlyEnabled">
                </div>
                <button class="accordion-button collapsed p-0 pt-1 pb-1 flex-fill" type="button"
                    data-bs-toggle="collapse" :data-bs-target="'#flush-collapse-' + this.id" aria-expanded="false"
                    :aria-controls="'flush-collapse-' + this.id">
                    <div class="d-flex w-100 justify-content-between" v-if="this.hasTooltip">
                        <div class="ms-2">
                            {{ this.title }}
                        </div>
                        <div class="flex-shrink-1 badge bg-info m-1" data-bs-toggle="tooltip"
                            :title="this.tooltip">
                            <i class="fa-solid fa-info text-right"></i>
                        </div>
                    </div>
                    <div v-else>{{ this.title }}</div>
                </button>
            </div>
        </div>
        <div :id="'flush-collapse-' + this.id" class="accordion-collapse collapse ms-1 me-1"
            :data-bs-parent="'#accordionFlush-' + this.flushId">
            <div class="accordion-body p-0 pt-1 pb-1">
                <component :is="currentContent" :checkboxValue="this.checkboxValue" @message="message"></component>
            </div>
        </div>
    </div>
</template>
<script>

import ChosenNodeAccordion from '../Nodes/ChosenNodeAccordion.vue';
import ColorNodeAccordion from '../Nodes/ColorNodeAccordion.vue';
import FixedNodeAccordion from '../Nodes/FixedNodeAccordion.vue';
import FontNodeAccordion from '../Nodes/FontNodeAccordion.vue';
import HeightConstraintNodeAccordion from '../Nodes/HeightConstraintNodeAccordion.vue';
import ShapeNodeAccordion from '../Nodes/ShapeNodeAccordion.vue';

export default {
    name: "Accordion Item",
    props: {
        id: String,
        title: String,
        flushId: String,
        content: String,
        switchButton: Boolean,
        switchChecked: Boolean,
        hasTooltip: Boolean,
        tooltip: String,
        isCheckedEnabled: Boolean,
    },
    data() {
        return {
            checkboxValue: false,
            currentlyEnabled: false,
            currentContent: null,
        }
    },
    mounted() {
        this.checkboxValue = this.switchChecked;
        this.currentlyEnabled = this.isCheckedEnabled;
        switch (this.content) {
            case 'nodes.chosen': {
                this.currentContent = 'ChosenNodeAccordion';
                break;
            }
            case 'nodes.color' : {
                this.currentContent = "ColorNodeAccordion";
                break;
            }
            case 'nodes.fixed' : {
                this.currentContent = 'FixedNodeAccordion';
                break;
            }
            case 'nodes.font': {
                this.currentContent = 'FontNodeAccordion';
                break;
            }
            case 'nodes.heightConstraint': {
                this.currentContent = 'HeightConstraintNodeAccordion';
                break;
            }
            case 'nodes.shape': {
                this.currentContent = 'ShapeNodeAccordion';
                break;
            }
        }
    },
    watch: {
        checkboxValue: function(newCheckbox, oldCheckbox){
            this.$emit('toggle-switch-event', this.id, newCheckbox);
        }
    },
    components: {
        ChosenNodeAccordion,
        ColorNodeAccordion,
        FixedNodeAccordion,
        FontNodeAccordion,
        HeightConstraintNodeAccordion,
        ShapeNodeAccordion
    },
    methods: {
        message: function(message, variables) {
            if (message == 'enable-fixed-node-object-sending') {
                if (variables == true) {
                    this.checkboxValue = false;
                    this.currentlyEnabled = false;
                } else {
                    this.currentlyEnabled = true;
                }
            } else {
                this.$emit('message', message, variables);
            }
            
        }
    },
    emits: ['toggle-switch-event', 'message']
}
</script>