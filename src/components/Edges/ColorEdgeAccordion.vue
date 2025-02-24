<template>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-warning" v-if="!checkboxValue">
    <i class="fa-solid fa-circle-info me-2"></i> Ative Cor para começar
  </p>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-danger" v-if="checkboxValue">
    <i class="fa-solid fa-circle-info me-2"></i> Desativar Cor repinta canvas
  </p>
  <SwitchWithInfo
    v-if="checkboxValue"
    :switchDisabled="false"
    :switchId="'options-edges-color'"
    :switchInitialValue="colorStringSendingEnabled"
    :switchTooltipEnabled="true"
    :switchTooltip="'Options.Edges.Color (Toggle string/object sending) - Alterne entre envio de string e de objeto para o campo.'"
    :switchLabelEnabled="true"
    :switchLabelValue="
      colorStringSendingEnabled ? 'Enviando objeto para ' : 'Enviando cor única'
    "
    @checkbox-status-changed="changeObjectSending"
  ></SwitchWithInfo>
  <InputColorPicker
    v-if="checkboxValue && !colorStringSendingEnabled"
    :colorPickerId="'options-edges-color-string-input'"
    :colorPickerDefaultColor="colorStringSendingValue"
    :tooltip="'Options.Edges.Color (String sending value) - Defina o valor da string de cor das arestas.'"
    :disabled="false"
    @update-color="updateColorString"
  ></InputColorPicker>

  <LabelWithTooltip
    v-if="checkboxValue && colorStringSendingEnabled && colorInherit == false"
    :forId="'options-edges-color-color'"
    :hasSwitch="false"
    :labelValue="'Selecione a cor das arestas'"
    :switchDisabled="false"
    :tooltip="'Options.Edges.Color.Color - A cor da aresta quando não está selecionada o com o mouse pairando sobre a mesma (assumindo que pairar esteja habilitado no módulo de iterações).'"
  >
  </LabelWithTooltip>
  <InputColorPicker
    v-if="checkboxValue && colorStringSendingEnabled && colorInherit == false"
    :colorPickerId="'options-edges-color-color'"
    :colorPickerDefaultColor="colorObjectColor"
    :tooltip="'Options.Edges.Color.Color - A cor da aresta quando não está selecionada o com o mouse pairando sobre a mesma (assumindo que pairar esteja habilitado no módulo de iterações).'"
    @update-color="sendColor"
  ></InputColorPicker>

  <LabelWithTooltip
    v-if="checkboxValue && colorStringSendingEnabled && colorInherit == false"
    :forId="'options-edges-color-highlight'"
    :hasSwitch="false"
    :labelValue="'Cor da aresta selecionada'"
    :switchDisabled="false"
    :tooltip="'Options.Edges.Color.Highlight - A cor da aresta quando está selecionada.'"
  ></LabelWithTooltip>
  <InputColorPicker
    v-if="checkboxValue && colorStringSendingEnabled && colorInherit == false"
    :colorPickerId="'options-edges-color-highlight'"
    :colorPickerDefaultColor="colorHighlight"
    :tooltip="'Options.Edges.Color.Color - A cor da aresta quando não está selecionada o com o mouse pairando sobre a mesma (assumindo que pairar esteja habilitado no módulo de iterações).'"
    @update-color="sendHighlight"
  ></InputColorPicker>

  <LabelWithTooltip
    v-if="checkboxValue && colorStringSendingEnabled && colorInherit == false && (Object.hasOwn(this.options.interaction,'hover') && this.options.interaction.hover)"
    :forId="'options-edges-color-hover'"
    :hasSwitch="false"
    :labelValue="'Cor da aresta c/ mouse pairando'"
    :switchDisabled="false"
    :tooltip="'Options.Edges.Color.Hover - A cor da aresta quando o mouse passa sobre ela (assumindo que o foco está ativado no módulo de interação).'"
  >
  </LabelWithTooltip>
  <InputColorPicker
    v-if="checkboxValue && colorStringSendingEnabled && colorInherit == false && (Object.hasOwn(this.options.interaction,'hover') && this.options.interaction.hover)"
    :colorPickerId="'options-edges-color-hover'"
    :colorPickerDefaultColor="colorHover"
    :tooltip="'Options.Edges.Color.Hover - A cor da aresta quando o mouse passa sobre ela (assumindo que o foco está ativado no módulo de interação).'"
    @update-color="sendHover"
  ></InputColorPicker>
  
  <LabelWithTooltip
    v-if="checkboxValue && colorStringSendingEnabled"
    :labelValue="'Herdar'"
    :tooltip="
      'Options.Edges.Color.Inherit. Quando cor, destaque ou foco são definidos, herdar é definido ' +
      'como falso! As opções suportadas são: verdadeiro, falso, \'de\',\'para\',\'ambos\'. O valor padrão ' +
      'é \'de\', que faz o mesmo que verdadeiro: a borda herdará a cor da borda do nó no lado \'de\'. ' +
      'Quando definido como \'to\', a cor da borda do nó \'to\' será usada. Quando definido como \'ambos\', ' +
      'a cor desaparecerá da cor inicial para a cor inicial. \'ambos\' é computacionalmente intensivo porque o gradiente é recalculado a cada redesenho. Isto é necessário porque os ângulos mudam quando os nós se movem.'
    "
    :forId="'input-select-inherit'"
    :hasSwitch="false"
  >
  </LabelWithTooltip>
  <InputSelect
    v-if="checkboxValue && colorStringSendingEnabled"
    :selectId="'input-select-inherit'"
    :options="[
      { value: false, label: 'Falso', selected: true },
      { value: true, label: 'Verdadeiro', selected: false },
      { value: 'from', label: 'De (From)', selected: false },
      { value: 'to', label: 'Para (To)', selected: false },
      { value: 'both', label: 'Ambos', selected: false },
    ]"
    :disabled="false"
    @update-selection="changeInherit"
  ></InputSelect>
  
  <InputRange
    v-if="checkboxValue && colorStringSendingEnabled"
    :inputId="'opacity-range'"
    :isLabelEnabled="true"
    :min="0"
    :max="1"
    :step="0.1"
    :initialValue="colorOpacity"
    :labelValue="'Opacidade'"
    :tooltip="'Options.Edges.Color.Opacity - Pode ser útil definir a opacidade de uma aresta sem alterar manualmente todas as cores. A opção de opacidade converterá todas as cores (também ao usar herdar) para aderir à opacidade fornecida. O intervalo permitido da opção de opacidade está entre 0 e 1. Isso é feito apenas uma vez para que o impacto no desempenho não seja muito grande.'"
    @update-value-from-range-input="changeOpacity"
  ></InputRange>
</template>
<script>
import InputColorPicker from "../Common/Inputs/InputColorPicker.vue";
import InputRange from "../Common/Inputs/InputRange.vue";
import InputSelect from "../Common/Inputs/InputSelect.vue";
import InputText from "../Common/Inputs/InputText.vue";
import LabelWithTooltip from "../Common/LabelWithTooltip.vue";
import SwitchWithInfo from "../Common/SwitchWithInfo.vue";

export default {
  name: "Color Edge Component",
  props: [
    "checkboxValue",
    "openBsModal",
    "bsModalReturnValue",
    "accordionType",
    "options",
  ],
  data() {
    return {
      colorStringSendingEnabled: false, //False for String, true for objec
      colorStringSendingValue: "#2B7CE9",
      colorObjectColor: "#2B7CE9",
      colorHighlight: "#2B7CE9",
      colorHover: "#2B7CE9",
      colorInherit: "false",
      colorOpacity: "1",
    };
  },
  components: {
    SwitchWithInfo,
    InputText,
    InputColorPicker,
    LabelWithTooltip,
    InputSelect,
    InputRange,
  },
  methods: {
    changeObjectSending: function (value) {
      this.colorStringSendingEnabled = value;
      if (value) {
        this.$emit("message", "options-edges-color-object", this.accordionType, value);
      } else {
        this.$emit("message", "options-edges-color-string", this.accordionType, this.colorStringSendingValue);
      }
      
    },
    updateColorString: function (value) {
      this.colorStringSendingValue = value;
      this.$emit("message", "options-edges-color-string", this.accordionType, value);
    },
    sendColor: function (value) {
      this.colorObjectColor = value;
      this.$emit("message", "options-edges-color-color", this.accordionType, value);
    },
    sendHighlight: function (value) {
      this.colorHighlight = value;
      this.$emit("message", "options-edges-color-highlight", this.accordionType, value);
    },
    sendHover: function (value) {
      this.colorHover = value;
      this.$emit("message", "options-edges-color-hover", this.accordionType, value);
    },
    changeInherit: function (value) {
      this.colorInherit = value;
      this.$emit("message", "options-edges-color-inherit", this.accordionType, value);
    },
    changeOpacity: function (value) {
      this.colorOpacity = value;
      this.$emit(
        "message",
        "options-edges-color-opacity",
        this.accordionType,
        parseFloat(value)
      );
    },
  },
  mounted() {
    console.log("Color Edge Component Mounted");
  },
  watch: {
    options: {
      handler: function (newValue, oldValue) {
        if ('edges' in newValue && typeof newValue.edges == "object") {
            if ('color' in newValue.edges && typeof newValue.edges.color == "string") {
                this.colorStringSendingEnabled = false;
                this.colorStringSendingValue = newValue.edges.color;    
            }
            if ('color' in newValue.edges && typeof newValue.edges.color == "object") {
                this.colorStringSendingEnabled = true;
                if ('color' in newValue.edges.color) {
                    this.colorObjectColor = newValue.edges.color.color;
                }
                if ('highlight' in newValue.edges.color) {
                    this.colorHighlight = newValue.edges.color.highlight;
                }
                if ('hover' in newValue.edges.color) {
                    this.colorHover = newValue.edges.color.hover;
                }
                if ('inheirit' in newValue.edges.color) {
                    this.colorInherit = newValue.edges.color.inheirit;
                }
                if ('opacity' in newValue.edges.color) {
                    this.colorOpacity = newValue.edges.color.opacity;
                }
            }
        }
      },
      deep: true,
    },
  },
  emits: ["message", "open-bs-modal"],
};
</script>
