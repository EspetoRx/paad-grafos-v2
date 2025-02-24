<template>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-warning" v-if="!checkboxValue">
    <i class="fa-solid fa-circle-info me-2"></i> Ative Maciez para começar
  </p>
  <SwitchWithInfo
    v-if="checkboxValue"
    :switchId="'options-edges-smooth-enabled'"
    :switchDisabled="false"
    :switchInitialValue="optionsEnabled"
    :switchTooltipEnabled="true"
    :switchTooltip="
      'Options.Edges.Smooth (Toggle false/true) - Quando verdadeiro, a aresta é desenhada como uma ' +
      'curva Bézier dinâmica. O desenho dessas curvas demora mais que o das curvas retas, mas fica melhor. ' +
      'Há uma diferença entre curvas suaves dinâmicas e curvas suaves estáticas. As curvas suaves dinâmicas ' +
      'possuem um nó de suporte invisível que participa da simulação física. Se você tiver muitas arestas, ' +
      'considere escolher um tipo diferente de curvas suaves e dinâmicas para obter melhor desempenho.'
    "
    :switchLabelEnabled="true"
    :switchLabelValue="
      optionsEnabled ? 'Enviando objeto para a maciez.' : 'Enviando booleano para maciez'
    "
    @checkbox-status-changed="optionsEnabledChange"
  ></SwitchWithInfo>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-danger" v-if="optionsEnabled">
    <i class="fa-solid fa-circle-info me-2"></i> Desativar envio de objeto repinta canvas.
  </p>
  <LabelWithTooltip
    v-if="checkboxValue && optionsEnabled"
    :labelValue="'Tipo'"
    :tooltip="'Options.Edges.Smooth.Type - Opções possíveis: \'dinâmico\', \'contínuo\', \'discreto\', \'diagonalCross\', \'straightCross\', \'horizontal\', \'vertical\', \'curvedCW\', \'curvedCCW\', \'cubicBezier\'. Dê uma olhada neste exemplo para ver como são e escolha o que você mais gosta! Ao usar dinâmico, as arestas terão um vértice de suporte invisível guiando a forma. Este vértice faz parte da simulação física.'"
    :forId="'options-edges-smooth-type'"
    :hasSwitch="false"
  ></LabelWithTooltip>
  <InputSelect
    v-if="checkboxValue && optionsEnabled"
    :selectId="'options-edges-smooth-type'"
    :options="typeOptions"
    :disabled="false"
    @update-selection="updateType"
  ></InputSelect>
  <SwitchWithInfo
    v-if="checkboxValue && optionsEnabled && type == 'cubicBezier'"
    :switchId="'options-edges-smooth-forceDirection'"
    :switchDisabled="false"
    :switchInitialValue="forceDirection"
    :switchTooltipEnabled="true"
    :switchTooltip="'Options.Edges.Smooth.ForceDirecetion (Toggle false/true) - Opções aceitas: [\'horizontal\', \'vertical\', \'none\']. Esta opção é usada apenas com curvas cúbicas de Bezier. Quando verdadeiro, é escolhido horizontal, quando falso, é usada a direção maior (x distância entre nós vs y distância entre nós). Se a distância x for maior, horizontal. Isso deve ser usado com layouts hierárquicos.'"
    :switchLabelEnabled="true"
    :switchLabelValue="
      forceDirection
        ? 'Enviando string para a forçar a direção.'
        : 'Enviando booleano para forçar a direção'
    "
    @checkbox-status-changed="forceDirectionEnabledChange"
  ></SwitchWithInfo>
  <InputSelect
    v-if="checkboxValue && optionsEnabled && type == 'cubicBezier' && forceDirection"
    :selectId="'options-edges-smooth-forceDirection'"
    :options="optionsForceDirection"
    :disabled="false"
    @update-selection="chageForceDirection"
  ></InputSelect>
  <InputRange
    v-if="checkboxValue && optionsEnabled && type != 'dynamic'"
    :inputId="'options-edges-smooth-roundness'"
    :isLabelEnabled="true"
    :min="0"
    :max="1"
    :step="0.1"
    :initialValue="roundness"
    :labelValue="'Arredondamento'"
    :tooltip="'Options.Edges.Smooth.Roundnessa - Faixa aceita: 0 .. 1,0. Este parâmetro ajusta a redondeza das curvas suaves para todos os tipos, EXCETO dinâmicas.'"
    :disabled="false"
    @update-value-from-range-input="changeRoundness"
  ></InputRange>
</template>
<script>
import InputRange from "../Common/Inputs/InputRange.vue";
import InputSelect from "../Common/Inputs/InputSelect.vue";
import LabelWithTooltip from "../Common/LabelWithTooltip.vue";
import SwitchWithInfo from "../Common/SwitchWithInfo.vue";

export default {
  name: "Smooth Edge Accordion Component",
  props: [
    "checkboxValue",
    "openBsModal",
    "bsModalReturnValue",
    "options",
    "accordionType",
  ],
  data() {
    return {
      optionsEnabled: false,
      typeOptions: [
        { value: "dynamic", label: "Dinâmico", selected: true },
        { value: "continuous", label: "Contínulo", selected: false },
        { value: "discrete", label: "Discreto", selected: false },
        { value: "diagonalCross", label: "Cruz Diagonal", selected: false },
        { value: "straightCross", label: "Cruz Reta", selected: false },
        { value: "horizontal", label: "Horizontal", selected: false },
        { value: "vertical", label: "Vertical", selected: false },
        { value: "curvedCW", label: "Curva CW", selected: false },
        { value: "curvedCCW", label: "Curva CCW", selected: false },
        { value: "cubicBezier", label: "Bezier Cúbico", selected: false },
      ],
      type: "dynamic",
      forceDirection: false,
      optionsForceDirection: [
        { value: "horizontal", label: "Horizontal", selected: true },
        { value: "vertical", label: "Vertical", selected: false },
        { value: "none", label: "Nenhum", selected: false },
      ],
      justStarted: false,
      roundness: "0.5",
      awatingResponse: [],
    };
  },
  mounted() {
    this.justStarted = true;
    console.log("Smooth Edge Accordion Component Mounted");
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
    InputSelect,
    LabelWithTooltip,
    InputRange,
  },
  methods: {
    optionsEnabledChange: function (value) {
      this.optionsEnabled = value;
      if (value) {
        if (!this.justStarted)
            this.$emit("message", "options-edges-smooth-enabled", this.accordionType, value);
      } else {
        if (!this.justStarted) {
            this.optionsEnabled = false;
            this.awatingResponse.push("repaint_canvas_edges_smooth_false");
            this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
        }
      }
      
    },
    updateType: function (value) {
      this.type = value;
      if (!this.justStarted)
        this.$emit("message", "options-edges-smooth-type", this.accordionType, value);
    },
    forceDirectionEnabledChange: function (value) {
      this.forceDirection = value;
      if (!this.justStarted)
        this.$emit(
          "message",
          "options-edges-smooth-forceDirection",
          this.accordionType,
          value
        );
    },
    chageForceDirection: function (value) {
      this.forceDirection = value;
      if (!this.justStarted)
        this.$emit(
          "message",
          "options-edges-smooth-forceDirection",
          this.accordionType,
          value
        );
    },
    changeRoundness: function (value) {
      this.roundness = value;
      if (!this.justStarted)
        this.$emit(
          "message",
          "options-edges-smooth-roundness",
          this.accordionType,
          value
        );
    },
    setValues(newValue, oldValue) {
      if (newValue == null) return;
      if ("edges" in newValue && typeof newValue.edges == "object") {
        if ("smooth" in newValue.edges && typeof newValue.edges.smooth == "object") {
          if ("enabled" in newValue.edges.smooth) {
            this.optionsEnabled = newValue.edges.smooth;
          }
          if ("type" in newValue.edges.smooth) {
            this.typeOptions.forEach((element, index, array) => {
              if (element.value == newValue.edges.smooth.type) {
                element.selected = true;
              } else {
                element.selected = false;
              }
            });
            this.type = newValue.edges.smooth.type;
          }
          if ("forceDirection" in newValue.edges.smooth) {
            if (typeof newValue.edges.smooth.forceDirection == "boolean") {
                this.forceDirection = newValue.edges.smooth.forceDirection;
            }
            if (typeof newValue.edges.smooth.forceDirection == "string") {
                this.forceDirection = true;
                this.optionsForceDirection.forEach((element, index, array)=>{
                    if (element.value == newValue.edges.smooth.forceDirection) {
                        element.selected = true;
                    } else {
                        element.selected = false;
                    }
                });
            }
          }
          if ("roundness" in newValue.edges.smooth) {
            this.roundness = newValue.edges.smooth.roundness;
          }
        }
        if ("smooth" in newValue.edges && typeof newValue.edges.smooth == "boolean") {
          this.optionsEnabled = false;
        }
      }
    },
  },
  watch: {
    options: {
        handler: function(newValue, oldValue) {
            this.setValues(newValue, oldValue);
        },
        deep: true
    },
    bsModalReturnValue: function (newValue, oldValue) {
      if (newValue == null || this.awatingResponse.length == 0) return;
      if (this.awatingResponse.includes("repaint_canvas_edges_smooth_false", 0)) {
        this.awatingResponse = this.awatingResponse.filter(function (e) {
          e != "repaint_canvas_edges_smooth_false";
        });
        if (newValue) {
          this.optionsEnabled = !newValue;
          this.$emit("message", "options-edges-smooth-enabled", this.accordionType, !newValue);
          this.$emit("message", "repaint-component", this.accordionType);
        } else {
          this.optionsEnabled = !newValue;
        }
      }
    },
  },
  emits: ["message", "open-bs-modal"],
};
</script>
