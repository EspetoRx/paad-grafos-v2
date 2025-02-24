<template>
  <div class="accordion-item">
    <div class="accordion-header d-flex" :id="'flush-' + Hash">
      <SwitchButton
        :switchId="'options-edges-arrows-' + accordionItem"
        :switchDisabled="false"
        :switchInitialValue="checkboxItemComponent"
        :switchTooltipEnabled="true"
        :switchTooltip="tooltip"
        :switchLabelEnabled="false"
        v-if="hasSwitchButton"
        @checkbox-status-changed="chekckboxValueChange"
      ></SwitchButton>
      <button
        class="accordion-button collapsed p-0 pt-1"
        type="button"
        data-bs-toggle="collapse"
        :data-bs-target="'#' + itemId"
        aria-expanded="false"
        :aria-controls="itemId"
      >
        <div class="d-flex w-100 justify-content-between">
          <div class="" v-html="accordionTitle"></div>
        </div>
      </button>
      <div
        class="flex-shrink-1 badge bg-info m-1 ms-2"
        data-bs-toggle="tooltip"
        :title="tooltip"
        data-bs-html="true"
      >
        <i class="fa-solid fa-info text-right"></i>
      </div>
    </div>
    <div
      :id="itemId"
      class="accordion-collapse collapse"
      :aria-labelledby="'flush-' + Hash"
      :data-bs-parent="'#' + accordionId"
    >
      <div class="accordion-body p-0">
        <div class="p-1">
          <component
            :is="accordionComponent"
            :accordionType="accordionItem"
            :checkboxValue="checkboxItemComponent"
            @message="message"
            @open-bs-modal="openBsModal"
            :bsModalReturnValue="bsModalReturnValue"
            :options="options"
          >
          </component>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { hash } from "../../../utils/Hash";

import SwitchButton from "../SwitchButton.vue";
import InteractionsKeyboard from "../../Interactions/InteractionsKeyboard.vue";
import HierarchicalLayoutBaseComponent from "../../Layout/HierarchicalLayoutBaseComponent.vue";
import AddNodeBaseComponent from "../../Manipulation/AddNodeBaseComponent.vue";
import AddEdgeBaseComponent from "../../Manipulation/AddEdgeBaseComponent.vue";
import EditNodeBaseComponent from "../../Manipulation/EditNodeBaseComponent.vue";
import EditEdgeBaseComponent from "../../Manipulation/EditEdgeBaseComponent.vue";
import DeleteNodeBaseComponent from "../../Manipulation/DeleteNodeBaseComponent.vue";
import DeleteEdgeBaseComponent from "../../Manipulation/DeleteEdgeBaseComponent.vue";
import ArrowsEdgeBaseComponent from "../../Edges/ArrowsEdgeBaseComponent.vue";
import FontEdgeBaseComponent from "../../Edges/FontEdgeBaseComponent.vue";
import ScalingLabelEdgeBaseComponent from "../../Edges/ScalingLabelEdgeBaseComponent.vue";
import ArrowEdgeAccordion from "../../Edges/ArrowEdgeAccordion.vue";
import EndPointOffsetAccordion from '../../Edges/EndPointOffsetAccordion.vue';
import ChosenEdgeAccordion from '../../Edges/ChosenEdgeAccordion.vue';
import ColorEdgeAccordion from '../../Edges/ColorEdgeAccordion.vue';
import FontEdgeAccordion from '../../Edges/FontEdgeAccordion.vue';
import ScalingEdgeAccordion from "../../Edges/ScalingEdgeAccordion.vue";
import SelfReferenceEdgeAccordion from "../../Edges/SelfReferenceEdgeAccordion.vue";
import ShadowEdgeAccordion from "../../Edges/ShadowEdgeAccordion.vue";
import SmoothEdgeAccordion from "../../Edges/SmoothEdgeAccordion.vue";
import WidthConstraintEdgeAccordion from "../../Edges/WidthConstraintEdgeAccordion.vue";
export default {
  name: "Accordion Item Component",
  props: [
    "accordionId",
    "accordionTitle",
    "accordionBody",
    "accordionItem",
    "tooltip",
    "bsModalReturnValue",
    "checkboxValue",
    "hasSwitchButton",
    "options",
  ],
  data() {
    return {
      justStarted: false,
      Hash: hash(),
      itemId: "flush-collapse-" + hash(),
      checkboxItemComponent: false,
    };
  },
  watch: {
    checkboxValue: function (newValue, oldValue) {
      if (newValue != this.checkboxItemComponent) {
        this.checkboxItemComponent = newValue;
      }
    },
  },
  computed: {
    accordionComponent: function () {
      return this.accordionBody;
    },
  },
  mounted() {
    this.justStarted = true;
    console.log("Accordion Item Component Mounted");
    if (this.checkboxValue != null) {
      this.checkboxItemComponent = this.checkboxValue;
    }
    this.justStarted = false;
  },
  components: {
    SwitchButton,
    ArrowsEdgeBaseComponent,
    FontEdgeBaseComponent,
    ScalingLabelEdgeBaseComponent,
    InteractionsKeyboard,
    HierarchicalLayoutBaseComponent,
    AddNodeBaseComponent,
    AddEdgeBaseComponent,
    EditNodeBaseComponent,
    EditEdgeBaseComponent,
    DeleteNodeBaseComponent,
    DeleteEdgeBaseComponent,
    ArrowEdgeAccordion,
    EndPointOffsetAccordion,
    ChosenEdgeAccordion,
    ColorEdgeAccordion,
    FontEdgeAccordion,
    ScalingEdgeAccordion,
    SelfReferenceEdgeAccordion,
    ShadowEdgeAccordion,
    SmoothEdgeAccordion,
    WidthConstraintEdgeAccordion
  },
  methods: {
    chekckboxValueChange(value) {
      if (!this.justStarted) {
        this.checkboxItemComponent = value;
        this.$emit("message", "update-checkbox-accordion", this.accordionItem, value);
      }
    },
    message: function (message, arrowType, value) {
      this.$emit("message", message, arrowType, value);
    },
    openBsModal: function (title, body) {
      this.$emit("open-bs-modal", title, body);
    },
  },
  emits: ["message", "open-bs-modal"],
};
</script>
