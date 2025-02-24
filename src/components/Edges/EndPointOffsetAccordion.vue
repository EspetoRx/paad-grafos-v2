<template>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-warning" v-if="!checkboxValue">
    <i class="fa-solid fa-circle-info me-2"></i> Ative "Deslocamento do ponto final" para
    começar
  </p>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-danger" v-if="checkboxValue">
    <i class="fa-solid fa-circle-info me-2"></i> Desativar "Deslocamento do ponto final"
    repinta canvas
  </p>
  <InputGroupWithLabel
    v-if="checkboxValue"
    :prepend="'De (From):'"
    :append="true"
    :inputType="'number'"
    :tooltip="'Options.Edges.EndPointOffset.From - Um número negativo aproxima o ponto final do ponto médio do nó e um número positivo faz o oposto.'"
    :inputInitialValue="from"
    @input-value-change="changeFrom"
    :step="0.1"
  ></InputGroupWithLabel>
  <InputGroupWithLabel
    v-if="checkboxValue"
    :prepend="'Para (To):'"
    :append="true"
    :inputType="'number'"
    :tooltip="'Options.Edges.EndPointOffset.To - Um número negativo aproxima o ponto final do ponto médio do nó e um número positivo faz o oposto.'"
    :inputInitialValue="to"
    @input-value-change="updateTo"
    :step="0.1"
  ></InputGroupWithLabel>
</template>
<script>
import InputGroupWithLabel from "../Common/Inputs/InputGroupWithLabel.vue";
export default {
  name: "End Point Offset Component",
  props: [
    "checkboxValue",
    "openBsModal",
    "bsModalReturnValue",
    "options",
    "accordionType",
  ],
  data() {
    return {
      from: 0,
      to: 0,
    };
  },
  mounted() {
    console.log("End Point Offset Component Mounted");
  },
  watch: {
    options: {
      handler: function (newValue, oldValue) {
        if ("edges" in newValue && typeof newValue.edges == "object") {
          if (typeof newValue.edges.endPointOffset == "object") {
            if (typeof newValue.edges.endPointOffset.from == "number") {
              this.from = newValue.edges.endPointOffset.from;
            }
            if (typeof newValue.edges.endPointOffset.to == "number") {
              this.to = newValue.edges.endPointOffset.to;
            }
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    changeFrom: function (value) {
      this.from = value;
      this.$emit(
        "message",
        "options-edges-endpointoffset-from",
        this.accordionType,
        value
      );
    },
    updateTo: function (value) {
      this.to = value;
      this.$emit("message", "options-edges-endpointoffset-to", this.accordionType, value);
    },
  },
  components: {
    InputGroupWithLabel,
  },
  emits: ["message", "open-bs-modal"],
};
</script>
