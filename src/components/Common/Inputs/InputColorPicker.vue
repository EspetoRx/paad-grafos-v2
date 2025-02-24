<template>
  <input
    type="color"
    class="form-control form-control-color w-100 mb-1"
    :id="this.colorPickerId"
    v-model="this.color"
    :title="this.tooltip"
    :disabled="this.disabled || false"
  />
</template>
<script>
export default {
  name: "Color Picker Component",
  props: ["colorPickerId", "colorPickerDefaultColor", "tooltip", "disabled"],
  data() {
    return {
      color: "",
      justStarted: false,
    };
  },
  watch: {
    color: function (newValue, oldValue) {
      if (!this.justStarted) this.$emit("update-color", newValue);
    },
  },
  mounted() {
    this.justStarted = true;
    console.log("Input Color Picker Component Mounted");
    this.color = this.colorPickerDefaultColor;
    setTimeout(
      function () {
        this.justStarted = false;
      }.bind(this),
      5
    );
  },
  emits: ["update-color"],
};
</script>
