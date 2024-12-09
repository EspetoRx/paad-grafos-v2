<template>
    <div class="accordion-item">
        <div class="accordion-header border-bottom">
            <div class="d-flex">
                <div class="form-check form-switch pt-1 pb-1 ms-1 collapsed" v-if="switchButton">
                    <input class="form-check-input" type="checkbox" role="switch" :id="'flexSwitch-' + this.id"
                        :checked="this.checkboxValue" v-model="this.checkboxValue" :disabled="!this.isCheckedEnabled">
                </div>
                <button class="accordion-button collapsed p-0 pt-1 pb-1 flex-fill" type="button"
                    data-bs-toggle="collapse" :data-bs-target="'#flush-collapse-' + this.id" aria-expanded="false"
                    :aria-controls="'flush-collapse-' + this.id" :disabled="accordionDisabled">
                    <div class="d-flex w-100 justify-content-between" v-if="this.hasTooltip">
                        <div class="ms-2">
                            {{ this.title }}
                        </div>
                        <div class="flex-shrink-1 badge bg-info m-1" data-bs-toggle="tooltip" :title="this.tooltip"
                            data-bs-html="true">
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
                <component :is="currentContent" :checkboxValue="checkboxValue" @message="message"
                    @open-bs-modal="openBsModal" :bsModalReturnValue="bsModalReturnValue"></component>
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
import ScalingNodeAccordion from '../Nodes/ScalingNodeAccordion.vue';
import ShadowNodeAccordion from '../Nodes/ShadowNodeAccordion.vue';
import ArrowEdgeAccordion from '../Edges/ArrowEdgeAccordion.vue';
import EndPointOffsetAccordion from '../Edges/EndPointOffsetAccordion.vue';
import ChosenEdgeAccordion from '../Edges/ChosenEdgeAccordion.vue';
import ColorEdgeAccordion from '../Edges/ColorEdgeAccordion.vue';
import FontEdgeAccordion from '../Edges/FontEdgeAccordion.vue';
import ScalingEdgeAccordion from '../Edges/ScalingEdgeAccordion.vue';
import SelfReferenceEdgeAccordion from '../Edges/SelfReferenceEdgeAccordion.vue';
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
        accordionDisabled: Boolean,
        bsModalReturnValue: Boolean
    },
    data() {
        return {
            checkboxValue: false,
            currentlyEnabled: false,
            currentContent: null,
            alteredByFather: false,
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
            case 'nodes.color': {
                this.currentContent = "ColorNodeAccordion";
                break;
            }
            case 'nodes.fixed': {
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
            case 'nodes.scaling': {
                this.currentContent = 'ScalingNodeAccordion';
                break;
            }
            case 'nodes.shadow': {
                this.currentContent = 'ShadowNodeAccordion';
                break;
            }
            case 'edges.arrows': {
                this.currentContent = 'ArrowEdgeAccordion';
                break;
            }
            case 'edges.endPointOffset': {
                this.currentContent = "EndPointOffsetAccordion";
                break;
            }
            case 'edges.chosen': {
                this.currentContent = "ChosenEdgeAccordion";
                break;
            }
            case 'edges.color': {
                this.currentContent = "ColorEdgeAccordion";
                break;
            }
            case 'edges.font': {
                this.currentContent = "FontEdgeAccordion";
                break;
            }
            case 'edges.scaling': {
                this.currentContent = "ScalingEdgeAccordion";
                break;
            }
            case 'edges.selfReference': {
                this.currentContent = "SelfReferenceEdgeAccordion";
                break;
            }
        }
    },
    watch: {
        checkboxValue: function (newCheckbox, oldCheckbox) {
            if (!this.alteredByFather) {
                this.$emit('toggle-switch-event', this.id, newCheckbox);
            }
            this.alteredByFather = false;
        },
        switchChecked: function(newVal, oldVal) {
            if (this.checkboxValue != newVal) {
                this.alteredByFather = true;
            }
            this.checkboxValue = newVal;
        }
    },
    components: {
        ChosenNodeAccordion,
        ColorNodeAccordion,
        FixedNodeAccordion,
        FontNodeAccordion,
        HeightConstraintNodeAccordion,
        ShapeNodeAccordion,
        ScalingNodeAccordion,
        ShadowNodeAccordion,
        ArrowEdgeAccordion,
        EndPointOffsetAccordion,
        ChosenEdgeAccordion,
        ColorEdgeAccordion,
        FontEdgeAccordion,
        ScalingEdgeAccordion,
        SelfReferenceEdgeAccordion
    },
    methods: {
        message: function (message, variables) {
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

        },
        openBsModal(title, body) {
            this.$emit("open-bs-modal", title, body);
        }
    },
    emits: ['toggle-switch-event', 'message', 'open-bs-modal']
}
</script>