<template>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-warning" v-if="!checkboxValue">
    <i class="fa-solid fa-circle-info me-2"></i> Ative Constante de Largura para começar
  </p>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-danger" v-if="checkboxValue">
    <i class="fa-solid fa-circle-info me-2"></i> Desativar Constante de Largura repinta canvas
  </p>
  <InputRange
    v-if="checkboxValue"
    :inputId="'options-edges-widthConstraint-value'"
    :isLabelEnabled="true"
    :min="0"
    :max="100"
    :step="1"
    :initialValue="widthCosntraint"
    :labelValue="'Máximo da Constante de Largura'"
    :tooltip="'Options.Edges.WidthConstraint.Maximum - Se um número for especificado, a largura máxima do rótulo da borda será definida como o valor. As linhas do rótulo da borda serão quebradas em espaços para ficarem abaixo do máximo.'"
    :disabled="false"
    @update-value-from-range-input="widthConstraintChange"
  ></InputRange>
</template>
<script>
import InputRange from "../Common/Inputs/InputRange.vue";

export default {
  name: "Width Constraint Edge Accordion Component",
  props: [
    "checkboxValue",
    "openBsModal",
    "bsModalReturnValue",
    "options",
    "accordionType",
  ],
  data() {
    return {
      widthCosntraint: 0,
      justStarted: false,
    };
  },
  mounted() {
    this.justStarted = true;
    console.log("Width Constraint Edge Accordion Component Mounted");
    this.setValues(this.options, this.options);
    setTimeout(
      function () {
        this.justStarted = false;
      }.bind(this),
      50
    );
  },
  components: {
    InputRange,
  },
  watch: {
    options: {
      handler: function (newValue, oldValue) {
        this.setValues(newValue);
      },
      deep: true,
    },
  },
  methods: {
    widthConstraintChange: function (value) {
      this.widthCosntraint = parseInt(value);
      if (!this.justStarted)
        this.$emit(
          "message",
          "options-edges-widthConstraint-value",
          this.accordionType,
          value
        );
    },
    setValues(newValue, oldValue) {
      if (newValue == null) return;
      if ("edges" in newValue && typeof newValue.edges == "object") {
        console.log("Width constraint: " + typeof newValue.edges.widthConstraint);
        if (
          "widthConstraint" in newValue.edges &&
          typeof newValue.edges.widthConstraint == "number"
        ) {
          this.widthCosntraint = newValue.edges.widthConstraint;
        }
      }
    },
  },
  emits: ["message", "open-bs-modal"],
};
</script>
