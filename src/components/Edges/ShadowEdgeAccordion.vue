<template>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-warning" v-if="!checkboxValue">
    <i class="fa-solid fa-circle-info me-2"></i> Ative Sombra para começar
  </p>
  <SwitchWithInfo
    v-if="checkboxValue"
    :switchId="'options-edges-shadow-object-enabled'"
    :switchDisabled="false"
    :switchInitialValue="objectEnabled"
    :switchTooltipEnabled="true"
    :switchTooltip="'Options.Edges.Shadow (Toggle boolean/object sending) - Quando verdadeiro, a aresta projeta uma sombra usando as configurações padrão. Isso fornece o raio do círculo e a posição.'"
    :switchLabelEnabled="true"
    :switchLabelValue="
      objectEnabled ? 'Enviando objeto de sombra' : 'Enviando booleano de sombra'
    "
    @checkbox-status-changed="changeObjectShadowSending"
  ></SwitchWithInfo>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-danger" v-if="objectEnabled">
    <i class="fa-solid fa-circle-info me-2"></i> Desativar envio de objeto repinta canvas.
  </p>
  <LabelWithTooltip
    v-if="checkboxValue && objectEnabled"
    :labelValue="'Cor da sombra'"
    :tooltip="'Options.Edges.Shadow.Color - O tamanho da cor da sombra como uma string. Os formatos suportados são \'rgb(255.255.255)\', \'rgba(255.255.255,1)\' e \'#FFFFFF\'.'"
    :forId="'options-edges-shadow-color'"
    :hasSwitch="false"
  ></LabelWithTooltip>
  <InputColorPicker
    v-if="checkboxValue && objectEnabled"
    :colorPickerId="'options-edges-shadow-color'"
    :colorPickerDefaultColor="color"
    :tooltip="'Options.Edges.Shadow.Color - O tamanho da cor da sombra como uma string. Os formatos suportados são \'rgb(255.255.255)\', \'rgba(255.255.255,1)\' e \'#FFFFFF\'.'"
    :disabled="false"
    @update-color="updateColor"
  ></InputColorPicker>
  <InputRange
    v-if="checkboxValue && objectEnabled"
    :inputId="'options-edges-shadow-size'"
    :isLabelEnabled="true"
    :min="1"
    :max="100"
    :step="1"
    :initialValue="size"
    :labelValue="'Tamanho'"
    :tooltip="'Options.Edges.Shadow.Size - O tamanho do desfoque da sombra.'"
    :disabled="false"
    :labelHasSwitch="false"
    @update-value-from-range-input="changeSize"
  ></InputRange>
  <InputRange
    v-if="checkboxValue && objectEnabled"
    :inputId="'options-edges-shadow-x'"
    :isLabelEnabled="true"
    :min="1"
    :max="100"
    :step="1"
    :initialValue="x"
    :labelValue="'Desvio em X'"
    :tooltip="'Options.Edges.Shadow.X - Desvio em X.'"
    :disabled="false"
    :labelHasSwitch="false"
    @update-value-from-range-input="changeX"
  ></InputRange>
  <InputRange
    v-if="checkboxValue && objectEnabled"
    :inputId="'options-edges-shadow-y'"
    :isLabelEnabled="true"
    :min="1"
    :max="100"
    :step="1"
    :initialValue="y"
    :labelValue="'Desvio em Y'"
    :tooltip="'Options.Edges.Shadow.Y - Desvio em Y.'"
    :disabled="false"
    :labelHasSwitch="false"
    @update-value-from-range-input="changeY"
  ></InputRange>
</template>
<script>
import InputColorPicker from "../Common/Inputs/InputColorPicker.vue";
import InputRange from "../Common/Inputs/InputRange.vue";
import LabelWithTooltip from "../Common/LabelWithTooltip.vue";
import SwitchWithInfo from "../Common/SwitchWithInfo.vue";

export default {
  name: "Shadow Edge Accordion Component",
  props: [
    "checkboxValue",
    "openBsModal",
    "bsModalReturnValue",
    "options",
    "accordionType",
  ],
  data() {
    return {
      objectEnabled: false,
      color: "#000000",
      size: 10,
      x: 5,
      y: 5,
      awatingResponse: [],
      justStarted: false,
    };
  },
  watch: {
    bsModalReturnValue: function (newValue, oldValue) {
      if (newValue == null || this.awatingResponse.length == 0) return;
      if (this.awatingResponse.includes("repaint_canvas_edges_shadow_false", 0)) {
        this.awatingResponse = this.awatingResponse.filter(function (e) {
          e != "repaint_canvas_edges_shadow_false";
        });
        if (newValue) {
          this.objectEnabled = !newValue;
          this.$emit(
            "message",
            "options-edges-shadow-object-enabled",
            this.accordionType,
            !newValue
          );
        } else {
          console.log("////////////////////////TESTE");
          this.objectEnabled = !newValue;
        }
      }
    },
    options: {
      handler: function (newValue, oldValue) {
        this.setValues(newValue, oldValue);
      },
      deep: true,
    },
  },
  methods: {
    changeObjectShadowSending: function (value) {
      if (value) {
        this.objectEnabled = value;
        if (!this.justStarted)
          this.$emit(
            "message",
            "options-edges-shadow-object-enabled",
            this.accordionType,
            value
          );
      } else {
        this.objectEnabled = false;
        this.awatingResponse.push("repaint_canvas_edges_shadow_false");
        this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
      }
    },
    updateColor: function (value) {
      this.color = value;
      if (!this.justStarted)
        this.$emit("message", "options-edges-shadow-color", this.accordionType, value);
    },
    changeSize: function (value) {
      this.size = value;
      if (!this.justStarted)
        this.$emit(
          "message",
          "options-edges-shadow-size",
          this.accordionType,
          parseInt(value)
        );
    },
    changeX: function (value) {
      this.x = value;
      if (!this.justStarted)
        this.$emit(
          "message",
          "options-edges-shadow-x",
          this.accordionType,
          parseInt(value)
        );
    },
    changeY: function (value) {
      this.y = value;
      if (!this.justStarted)
        this.$emit(
          "message",
          "options-edges-shadow-y",
          this.accordionType,
          parseInt(value)
        );
    },
    setValues: function (newValue, oldValue) {
      if (newValue == null) return;
      if ("edges" in newValue && typeof newValue.edges == "object") {
        if ("shadow" in newValue.edges && typeof newValue.edges.shadow == "boolean") {
          this.objectEnabled = false;
        } else if (
          "shadow" in newValue.edges &&
          typeof newValue.edges.shadow == "object"
        ) {
          this.objectEnabled = true;
          if ("color" in newValue.edges.shadow) {
            this.color = newValue.edges.shadow.color;
          }
          if ("size" in newValue.edges.shadow) {
            this.size = newValue.edges.shadow.size;
          }
          if ("x" in newValue.edges.shadow) {
            this.x = newValue.edges.shadow.x;
          }
          if ("y" in newValue.edges.shadow) {
            this.y = newValue.edges.shadow.y;
          }
        }
      }
    },
  },
  mounted() {
    this.justStarted = true;
    console.log("Shadow Edge Accordion Component Mounted");
    this.setValues(this.options, this.options);
    setTimeout(
      function () {
        this.justStarted = false;
      }.bind(this),
      5
    );
  },
  components: {
    SwitchWithInfo,
    LabelWithTooltip,
    InputColorPicker,
    InputRange,
  },
  emits: ["message", "open-bs-modal"],
};
</script>
