<template>
    <div class="accordion-item">
        <div class="accordion-header d-flex" :id="'flush-' + Hash">
            <SwitchButton :switchId="'options-edges-arrows-' + accordionItem" :switchDisabled="false"
                :switchInitialValue="checkboxItemComponent" :switchTooltipEnabled="true" :switchTooltip="tooltip"
                :switchLabelEnabled="false" @checkbox-status-changed="chekckboxValueChange"></SwitchButton>
            <button class="accordion-button collapsed p-1" type="button" data-bs-toggle="collapse"
                :data-bs-target="'#' + itemId" aria-expanded="false" :aria-controls="itemId">
                <div class="d-flex w-100 justify-content-between">
                    <div class="ms-2" v-html="accordionTitle"></div>
                    <div class="flex-shrink-1 badge bg-info m-1" data-bs-toggle="tooltip" :title="tooltip"
                        data-bs-html="true">
                        <i class="fa-solid fa-info text-right"></i>
                    </div>
                </div>
            </button>
        </div>
        <div :id="itemId" class="accordion-collapse collapse" :aria-labelledby="'flush-' + Hash"
            :data-bs-parent="'#' + accordionId">
            <div class="accordion-body p-1">
                <component :is="accordionComponent" :arrowType="accordionItem" :checkboxValue="checkboxItemComponent"
                    @message="message" @open-bs-modal="openBsModal" :bsModalReturnValue="bsModalReturnValue">
                </component>
            </div>
        </div>
    </div>
</template>
<script>
import { hash } from '../../../utils/Hash';
import SwitchButton from '../SwitchButton.vue';
import ArrowsEdgeBaseComponent from '../../Edges/ArrowsEdgeBaseComponent.vue';
import FontEdgeBaseComponent from '../../Edges/FontEdgeBaseComponent.vue';
import ScalingLabelEdgeBaseComponent from '../../Edges/ScalingLabelEdgeBaseComponent.vue';
export default {
    name: "Accordion Item Component",
    props: [
        'accordionId',
        'accordionTitle',
        'accordionBody',
        'accordionItem',
        'tooltip',
        'bsModalReturnValue'
    ],
    data() {
        return {
            Hash: hash(),
            itemId: 'flush-collapse-' + hash(),
            checkboxItemComponent: false
        }
    },
    computed: {
        accordionComponent: function() {
            return this.accordionBody;
        }
    },
    mounted() {
        console.log("Accordion Item Component Mounted");
    },
    components: {
        SwitchButton,
        ArrowsEdgeBaseComponent,
        FontEdgeBaseComponent,
        ScalingLabelEdgeBaseComponent
    },
    methods: {
        chekckboxValueChange(value) {
            this.checkboxItemComponent = value;
            this.$emit("message", "update-checkbox-accordion", this.accordionItem, value);
        },
        message: function (message, arrowType, value) {
            this.$emit("message", message, arrowType, value);
        },
        openBsModal: function (title, body) {
            this.$emit("open-bs-modal", title, body);
        }
    },
    emits: ['message', 'open-bs-modal']
}
</script>