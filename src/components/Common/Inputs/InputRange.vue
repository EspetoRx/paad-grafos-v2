<template>
  <tooltip-label
    v-if="this.isLabelEnabled"
    :labelValue="this.labelValue"
    :tooltip="this.tooltip"
    :forId="this.inputId"
    :hasSwitch="this.labelHasSwitch || false"
    :switchId="this.labelSwitchId || ''"
    :switchTooltip="this.tooltip || ''"
    :switchDisabled="this.labelSwitchDisabled || false"
    :switchInitialValue="this.labelSwitchInitialValue || false"
    :switchLabelEnabled="false"
    :switchLabelValue="''"
    :switchTooltipEnabled="this.labelSwitchTooltipEnabled || false"
    @checkbox-status-changed="onCheckboxStatusChanged"
  >
  </tooltip-label>
  <div class="d-flex">
    <input
      type="text"
      class="form-control w-25 h-75 text-center form-control-sm p-0"
      v-model="this.objectValue"
      :id="inputId + '-textfield'"
    />
    <input
      type="range"
      v-model="this.objectValue"
      class="form-range d-flex-fill m-2 h-75"
      :min="min"
      :max="max"
      :step="step"
      :id="inputId"
      :disabled="disabled || false"
    />
  </div>
</template>
<script>
import LabelWithTooltip from "../LabelWithTooltip.vue";

export default {
  name: "Range Component",
  props: [
    "inputId",
    "isLabelEnabled",
    "min",
    "max",
    "step",
    "initialValue",
    "labelValue",
    "tooltip",
    "disabled",
    "labelHasSwitch",
    "labelSwitchId",
    "labelSwitchDisabled",
    "labelSwitchInitialValue",
    "labelSwitchTooltipEnabled",
  ],
  data() {
    return {
      objectValue: 0,
      justStarted: false,
    };
  },
  watch: {
    objectValue: function (newValue, oldValue) {
      if (!this.justStarted) this.$emit("update-value-from-range-input", newValue);
    },
    initialValue: function (newValue, oldValue) {
      this.objectValue = "" + newValue;
    },
  },
  components: {
    "tooltip-label": LabelWithTooltip,
  },
  mounted() {
    this.justStarted = true;
    console.log("Input Range Component Mounted");
    this.objectValue = this.initialValue;
    setTimeout(
      function () {
        this.justStarted = false;
      }.bind(this),
      5
    );
  },
  methods: {
    onCheckboxStatusChanged: function (value) {
      this.$emit("checkbox-status-changed", value);
    },
  },
  emits: ["update-value-from-range-input", "checkbox-status-changed"],
};
</script>
