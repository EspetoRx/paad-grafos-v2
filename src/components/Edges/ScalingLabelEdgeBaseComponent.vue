<template>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-warning" v-if="!checkboxValue">
    <i class="fa-solid fa-circle-info me-2"></i> Ative Rótulo para começar
  </p>
  <SwitchWithInfo
    v-if="checkboxValue"
    :switchId="'switch-with-info-object-sending'"
    :switchDisabled="false"
    :switchInitialValue="objectEnabled"
    :switchTooltipEnabled="true"
    :switchTooltip="'Options.Edges.Scaling.Label (Toggle oject/boolean sending) - Alterne entre o envio de objeto e booleano.'"
    :switchLabelEnabled="true"
    :switchLabelValue="
      objectEnabled
        ? 'Enviando objeto para o campo Label'
        : 'Enviando booleano para o campo Label'
    "
    @checkbox-status-changed="changeObjectSending"
  ></SwitchWithInfo>
  <InputRange
    v-if="checkboxValue && objectEnabled"
    :inputId="'options-edges-scaling-label-min'"
    :isLabelEnabled="true"
    :min="0"
    :max="100"
    :step="1"
    :initialValue="min"
    :labelValue="'Mínimo:'"
    :tooltip="'Options.Edges.Scaling.Label.Min - O tamanho mínimo da fonte usado para rótulos durante o dimensionamento.'"
    :disabled="false"
    :labelHasSwitch="false"
    @update-value-from-range-input="updateMin"
  ></InputRange>
  <InputRange
    v-if="checkboxValue && objectEnabled"
    :inputId="'options-edges-scaling-label-max'"
    :isLabelEnabled="true"
    :min="0"
    :max="100"
    :step="1"
    :initialValue="max"
    :labelValue="'Máximo:'"
    :tooltip="'Options.Edges.Scaling.Label.Max - O tamanho máximo da fonte usado para rótulos durante o dimensionamento.'"
    :disabled="false"
    :labelHasSwitch="false"
    @update-value-from-range-input="updateMax"
  ></InputRange>
  <InputRange
    v-if="checkboxValue && objectEnabled"
    :inputId="'options-edges-scaling-label-maxVisible'"
    :isLabelEnabled="true"
    :min="0"
    :max="100"
    :step="1"
    :initialValue="maxVisible"
    :labelValue="'Visível no Máximo:'"
    :tooltip="'Options.Edges.Scaling.Label.MaxVisible - Ao aumentar o zoom, a fonte também fica maior. Você pode limitar o tamanho da fonte percebido usando esta opção. Se definido como 30, a fonte nunca parecerá maior que 30 com zoom de 100%.'"
    :disabled="false"
    :labelHasSwitch="false"
    @update-value-from-range-input="updateMaxVisible"
  ></InputRange>
  <InputRange
    v-if="checkboxValue && objectEnabled"
    :inputId="'options-edges-scaling-label-drawThreshold'"
    :isLabelEnabled="true"
    :min="0"
    :max="100"
    :step="1"
    :initialValue="drawThreshold"
    :labelValue="'Limite de Desenho:'"
    :tooltip="'Options.Edges.Scaling.Label.DrawThreshold - Ao diminuir o zoom, a fonte ficará menor. Isso define um limite inferior para quando a fonte é desenhada. Ao usar o dimensionamento de fonte, você pode usar isso junto com maxVisible para mostrar primeiro rótulos de bordas importantes quando diminuir o zoom e mostrar apenas o restante ao aumentar o zoom.'"
    :disabled="false"
    :labelHasSwitch="false"
    @update-value-from-range-input="updateDrawThreshold"
  ></InputRange>
</template>
<script>
import InputRange from "../Common/Inputs/InputRange.vue";
import SwitchWithInfo from "../Common/SwitchWithInfo.vue";
export default {
  name: "Scaling Label Edge Base Component",
  props: [
    "checkboxValue",
    "openBsModal",
    "bsModalReturnValue",
    "accordionType",
    "options",
  ],
  data() {
    return {
      objectEnabled: false,
      min: 14,
      max: 30,
      maxVisible: 30,
      justStarted: false,
      drawThreshold: 5,
    };
  },
  methods: {
    changeObjectSending: function (value) {
      this.objectEnabled = value;
      if (!this.justStarted) {
        this.$emit(
          "message",
          "options-edges-scaling-object-sending",
          this.accordionType,
          value
        );
        this.$emit("message", "repaint-component", this.accordionType, value);
      }
    },
    updateMin: function (value) {
      this.min = value;
      if (!this.justStarted) {
        this.$emit(
          "message",
          "options-edges-scaling-object-min",
          this.accordionType,
          value
        );
        this.$emit("message", "repaint-component", this.accordionType, value);
      }
    },
    updateMax: function (value) {
      this.max = value;
      if (!this.justStarted) {
        this.$emit(
          "message",
          "options-edges-scaling-object-max",
          this.accordionType,
          value
        );
        this.$emit("message", "repaint-component", this.accordionType, value);
      }
    },
    updateMaxVisible: function (value) {
      this.maxVisible = value;
      if (!this.justStarted) {
        this.$emit(
          "message",
          "options-edges-scaling-object-maxVisible",
          this.accordionType,
          value
        );
        this.$emit("message", "repaint-component", this.accordionType, value);
      }
    },
    updateDrawThreshold: function (value) {
        this.drawThreshold = value;
        if (!this.justStarted) {
        this.$emit(
          "message",
          "options-edges-scaling-object-drawThreshold",
          this.accordionType,
          value
        );
        this.$emit("message", "repaint-component", this.accordionType, value);
      }
    },
    optionsHandler: function(newValue, oldValue) {
      if (newValue == null) return;
      if ("edges" in newValue && typeof newValue.edges == "object") {
        if ("scaling" in newValue.edges && typeof newValue.edges.scaling == "object") {
          if (
            "label" in newValue.edges.scaling &&
            typeof newValue.edges.scaling.label == "boolean"
          ) {
            this.objectEnabled = false;
          } else if (
            "label" in newValue.edges.scaling &&
            typeof newValue.edges.scaling.label == "object"
          ) {
            console.log('/////////////Entrei  aqui: ' + newValue.edges.scaling.label.enabled);
            this.objectEnabled = newValue.edges.scaling.label.enabled;
            if ("min" in newValue.edges.scaling.label) {
              this.min = newValue.edges.scaling.label.min;
            }
            if ("max" in newValue.edges.scaling.label) {
              this.max = newValue.edges.scaling.label.max;
            }
            if ("maxVisible" in newValue.edges.scaling.label) {
              this.maxVisible = newValue.edges.scaling.label.maxVisible;
            }
            if ("drawThreshold" in newValue.edges.scaling.label) {
                this.drawThreshold = newValue.edges.scaling.label.drawThreshold;
            }
          }
        }
      }
    },
  },
  components: {
    SwitchWithInfo,
    InputRange,
  },
  watch: {
    options: {
      handler: function (newValue, oldValue) {
        this.optionsHandler(newValue, oldValue);
      },
      deep: true,
    },
  },
  mounted() {
    this.justStarted = true;
    console.log("Scaling Label Edge Base Component Mounted");
    this.optionsHandler(this.options, this.options);
    setTimeout(
      function () {
        this.justStarted = false;
      }.bind(this),
      5
    );
  },
  emits: ["message", "open-bs-modal"],
};
</script>
