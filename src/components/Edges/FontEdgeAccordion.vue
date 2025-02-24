<style scoped>
.nested-enter-active,
.nested-leave-active {
  transition: all 0.3s ease-in-out;
}

/* delay leave of parent element */
.nested-leave-active {
  transition-delay: 0.25s;
}

.nested-enter-from,
.nested-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

/* we can also transition nested elements using nested selectors */
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

/* delay enter of nested element */
.nested-enter-active .inner {
  transition-delay: 0.25s;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  /*
  	Hack around a Chrome 96 bug in handling nested opacity transitions.
    This is not needed in other browsers or Chrome 99+ where the bug
    has been fixed.
  */
  opacity: 0.001;
}
</style>
<template>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-warning" v-if="!checkboxValue">
    <i class="fa-solid fa-circle-info me-2"></i> Ative Fonte para começar
  </p>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-danger" v-if="checkboxValue">
    <i class="fa-solid fa-circle-info me-2"></i> Desativar Fonte repinta canvas
  </p>
  <SwitchWithInfo
    v-if="checkboxValue"
    :switchId="'options-edges-font-object-sending'"
    :switchInitialValue="objectSendingValue"
    :switchTooltipEnabled="true"
    :switchTooltip="'Options.Edges.Font (Toggle string/object sending) - Alterne entre envio de string e de objeto para o campo.'"
    :switchLabelEnabled="true"
    :switchLabelValue="objectSendingValue ? 'Enviando objeto' : 'Enviando string'"
    @checkbox-status-changed="changeObjectSending"
  ></SwitchWithInfo>
  <InputGroupWithLabel
    v-if="checkboxValue && !objectSendingValue"
    :prepend="'Texto'"
    :append="true"
    :inputType="'text'"
    :tooltip="
      'Options.Edges.Font (String) - Esse objeto define os detalhes do rótulo. Um versão curta também é suportada na forma ' +
      ' \'size face color\' por exemplo \'14px arial red\'.'
    "
    :inputInitialValue="fontString"
    @input-value-change="changeFontString"
  ></InputGroupWithLabel>
  <LabelWithTooltip
    v-if="checkboxValue && objectSendingValue"
    :labelValue="'Cor da fonte do rótulo'"
    :tooltip="'Options.Edges.Font.Color'"
    :forId="'options-edges-font-color'"
    :hasSwitch="false"
  ></LabelWithTooltip>
  <InputColorPicker
    v-if="checkboxValue && objectSendingValue"
    :colorPickerId="'options-edges-font-color'"
    :colorPickerDefaultColor="fontColor"
    :tooltip="'Options.Edges.Font.Color - A cor do rótulo.'"
    @update-color="changeFontColor"
  ></InputColorPicker>
  <InputRange
    v-if="checkboxValue && objectSendingValue"
    :inputId="'size-range'"
    :isLabelEnabled="true"
    :min="0"
    :max="100"
    :step="0.1"
    :initialValue="fontSize"
    :labelValue="'Tamanho da fonte:'"
    :tooltip="'Options.Edges.Font.Size - O tamanho da fonte.'"
    @update-value-from-range-input="changeFontSize"
  ></InputRange>
  <LabelWithTooltip
    v-if="checkboxValue && objectSendingValue"
    :labelValue="'Face'"
    :tooltip="'Options.Edges.Font.Face - O estilo da fonte do texto.'"
    :forId="'options-edges-font-face'"
    :hasSwitch="false"
  ></LabelWithTooltip>
  <InputSelect
    :selectId="'options-edges-font-face'"
    v-if="checkboxValue && objectSendingValue"
    :options="faceOptions"
    @update-selection="updateFace"
  ></InputSelect>
  <SwitchWithInfo
    v-if="checkboxValue && objectSendingValue"
    :switchId="'options-edges-font-background-enabled'"
    :switchInitialValue="fontBackgroundEnabled"
    :switchTooltipEnabled="true"
    :switchTooltip="'Options.Edges.Font.Background (Toggle color/undefined sending) - Alterne entre envio de Cor e de undefined para o campo.'"
    :switchLabelEnabled="true"
    :switchLabelValue="
      fontBackgroundEnabled
        ? 'Enviando Cor para Background'
        : 'Enviando undefined para Background'
    "
    @checkbox-status-changed="changeBackgroundEnabled"
  ></SwitchWithInfo>
  <InputColorPicker
    v-if="checkboxValue && objectSendingValue && fontBackgroundEnabled"
    :colorPickerId="'options-edges-font-background-color'"
    :colorPickerDefaultColor="fontBackground"
    :tooltip="'Options.Edges.Font.Background - Quando não undefined mas sim uma string de cor, um retângulo de plano de fundo será desenhando atrás do rótulo na cor selecionada.'"
    @update-color="changeBackgroundColor"
  ></InputColorPicker>
  <InputRange
    v-if="checkboxValue && objectSendingValue"
    :inputId="'strokeWidth-range'"
    :isLabelEnabled="true"
    :min="0"
    :max="100"
    :step="0.1"
    :initialValue="fontStrokeWidth"
    :labelValue="'Tamanho da borda do rótulo:'"
    :tooltip="'Options.Edges.Font.StrokeWidth - O tamanho da borda do rótulo.'"
    @update-value-from-range-input="changeStrokeWidth"
  ></InputRange>
  <LabelWithTooltip
    v-if="checkboxValue && objectSendingValue && fontStrokeWidth != 0"
    :labelValue="'Cor da borda'"
    :tooltip="'Options.Edges.Font.StrokeColor - A cor da borda.'"
    :forId="'options-edges-font-strokeColor'"
    :hasSwitch="false"
  ></LabelWithTooltip>
  <InputColorPicker
    v-if="checkboxValue && objectSendingValue && fontStrokeWidth != 0"
    :colorPickerId="'options-edges-font-strokeColor'"
    :colorPickerDefaultColor="fontStrokeColor"
    :tooltip="'Options.Edges.Font.StrokeColor - A cor da borda.'"
    @update-color="changeFontStrokeColor"
  ></InputColorPicker>
  <LabelWithTooltip
    v-if="checkboxValue && objectSendingValue"
    :labelValue="'Alinhamento'"
    :tooltip="'Options.Edges.Font.Align - O Opções possíveis: \'horizontal\',\'superior\',\'meio\',\'inferior\'. O alinhamento determina como a etiqueta será alinhada na borda. O valor padrão horizontal alinha o rótulo horizontalmente, independentemente da orientação da borda. Quando for escolhida uma opção diferente de horizontal, a etiqueta se alinhará de acordo com a borda..'"
    :forId="'options-edges-font-align'"
    :hasSwitch="false"
  ></LabelWithTooltip>
  <InputSelect
    :selectId="'options-edges-font-align'"
    v-if="checkboxValue && objectSendingValue"
    :options="alignOptions"
    @update-selection="changeAlign"
  ></InputSelect>
  <InputRange
    v-if="checkboxValue && objectSendingValue"
    :inputId="'vadjust-range'"
    :isLabelEnabled="true"
    :min="-100"
    :max="100"
    :step="0.1"
    :initialValue="fontVadjust"
    :labelValue="'Ajustamento vertical:'"
    :tooltip="'Options.Edges.Font.Vadjust - Uma correção específica da fonte para o posicionamento vertical da fonte base no texto do rótulo. (Positivo está baixo.).'"
    @update-value-from-range-input="changeVadjust"
  ></InputRange>
  <SwitchWithInfo
    v-if="checkboxValue && objectSendingValue"
    :switchId="'options-edges-font-multi-enabled'"
    :switchInitialValue="fontMultiEnabled"
    :switchTooltipEnabled="true"
    :switchTooltip="'Options.Edges.Font.Multi (Toggle boolean/string sending) - Alterne entre envio de Booleano e de String para o campo.'"
    :switchLabelEnabled="true"
    :switchLabelValue="
      fontMultiEnabled ? 'Enviando Hypertexto verdadeiro' : 'Enviando Hypertexto falso'
    "
    @checkbox-status-changed="changeMultiEnabled"
  ></SwitchWithInfo>

  <Transition name="nested" :duration="350">
    <div v-if="checkboxValue && objectSendingValue && fontMultiEnabled">
      <LabelWithTooltip
        v-if="checkboxValue && objectSendingValue && fontMultiEnabled"
        :labelValue="'Estilo de Hypertexto'"
        :tooltip="'Options.Edges.Font.Multi - O Opções possíveis: \'html\',\'markdown\',\'md\'. Se for falso, o rótulo será tratado como texto puro desenhado com a fonte base. Se verdadeiro ou \'html\' o rótulo pode ser multifonte, com negrito, itálico e marcação de código, interpretado como html. Se o valor for \'markdown\' ou \'md\' o rótulo poderá ser multifonte, com negrito, itálico e marcação de código, interpretado como markdown. As fontes negrito, itálico, negrito-itálico e monoespaçada podem ser configuradas nas propriedades font.bold, font.ital, font.boldital e font.mono, respectivamente.'"
        :forId="'options-edges-font-multi'"
        :hasSwitch="false"
      ></LabelWithTooltip>
      <InputSelect
        :selectId="'options-edges-font-multi'"
        :options="multiOptions"
        @update-selection="changeMulti"
      ></InputSelect>
      <Accordion
        class="mt-1"
        v-if="checkboxValue && objectSendingValue && fontMultiEnabled"
        :accordionData="accordionData"
        :bsModalReturnValue="bsModalReturnValue"
        :options="options"
        @message="message"
        @open-bs-modal="openBsModalFunction"
      ></Accordion>
    </div>
  </Transition>
</template>
<script>
import InputColorPicker from "../Common/Inputs/InputColorPicker.vue";
import InputGroupWithLabel from "../Common/Inputs/InputGroupWithLabel.vue";
import LabelWithTooltip from "../Common/LabelWithTooltip.vue";
import SwitchWithInfo from "../Common/SwitchWithInfo.vue";
import InputSelect from "../Common/Inputs/InputSelect.vue";
import InputRange from "../Common/Inputs/InputRange.vue";

export default {
  name: "Font Edge Accordion",
  props: [
    "checkboxValue",
    "openBsModal",
    "bsModalReturnValue",
    "accordionType",
    "options",
  ],
  data() {
    return {
      fontString: "14px arial #343434",
      objectSendingValue: false,
      fontColor: "#343434",
      fontSize: "14",
      fontFace: "arial",
      fontBackgroundEnabled: false,
      fontBackground: "#ffffff",
      fontStrokeWidth: 2,
      fontStrokeColor: "#ffffff",
      fontAlign: "horizontal",
      fontVadjust: "0",
      fontMultiEnabled: false,
      multi: false,
      fontBold: false,
      fontItal: false,
      fontBoldItal: false,
      fontMono: false,
      accordionData: [
        {
          id: "bold",
          title: "Negrito",
          body: "FontEdgeBaseComponent",
          tooltip: "Options.Edges.Font.Bold - Altere informações de negrito dos rótulos.",
          checkboxValue: this.fontBold,
        },
        {
          id: "ital",
          title: "Itálico",
          body: "FontEdgeBaseComponent",
          tooltip: "Options.Edges.Font.Ital - Altere informações de itálico dos rótulos.",
          checkboxValue: this.fontItal,
        },
        {
          id: "boldital",
          title: "Negrito e Itálico",
          body: "FontEdgeBaseComponent",
          tooltip:
            "Options.Edges.Font.Boldital - Altere informações de itálico e negrito dos rótulos.",
          checkboxValue: this.fontBoldItal,
        },
        {
          id: "mono",
          title: "Monoespaçadas",
          body: "FontEdgeBaseComponent",
          tooltip:
            "Options.Edges.Font.Mono - Altere informações de itálico e negrito dos rótulos.",
          checkboxValue: this.fontMono,
        },
      ],
      faceOptions: [
        { value: "arial", label: "Arial", selected: true },
        { value: "verdana", label: "Verdana", selected: false },
        { value: "tahoma", label: "Tahoma", selected: false },
        { value: "Trebuchet MS", label: "Trebuchet MS", selected: false },
        { value: "Times New Roman", label: "Times New Roman", selected: false },
        { value: "Georgia", label: "Georgia", selected: false },
        { value: "Geramond", label: "Geramond", selected: false },
        { value: "Courier New", label: "Courier New", selected: false },
        { value: "Brush Script MT", label: "Brush Script MT", selected: false },
      ],
      alignOptions: [
        { value: "horizontal", label: "Horizontal", selected: true },
        { value: "top", label: "Superior", selected: false },
        { value: "middle", label: "Meio", selected: false },
        { value: "bottom", label: "Inferior", selected: false },
      ],
      multiOptions: [
        { value: "html", label: "HTML", selected: true },
        { value: "markdown", label: "Markdown", selected: false },
        { value: "md", label: "Markdown (MD Option)", selected: false },
      ],
    };
  },
  methods: {
    changeFontString: function (value) {
      this.fontString = value;
      this.$emit("message", "options-edges-font-string-value", this.accordionType, value);
    },
    changeObjectSending: function (value) {
      this.objectSendingValue = value;
      this.$emit(
        "message",
        "options-edges-font-object-sending",
        this.accordionType,
        value
      );
    },
    changeFontColor: function (value) {
      this.fontColor = value;
      this.$emit("message", "options-edges-font-color", this.accordionType, value);
    },
    changeFontSize: function (value) {
      if (!isNaN(value)) {
        this.fontSize = value;
        this.$emit(
          "message",
          "options-edges-font-size",
          this.accordionType,
          parseInt(value)
        );
      }
    },
    updateFace: function (value) {
      this.fontFace = value;
      this.$emit("message", "options-edges-font-face", this.accordionType, value);
    },
    changeBackgroundEnabled: function (value) {
      this.fontBackgroundEnabled = value;
      this.$emit(
        "message",
        "options-edges-font-background-enabled",
        this.accordionType,
        value
      );
    },
    changeBackgroundColor: function (value) {
      this.fontBackground = value;
      this.$emit(
        "message",
        "options-edges-font-background-color",
        this.accordionType,
        value
      );
    },
    changeStrokeWidth: function (value) {
      this.fontStrokeWidth = value;
      this.$emit("message", "options-edges-font-strokeWidth", this.accordionType, value);
    },
    changeFontStrokeColor: function (value) {
      this.fontStrokeColor = value;
      this.$emit("message", "options-edges-font-strokeColor", this.accordionType, value);
    },
    changeAlign: function (value) {
      this.fontAlign = value;
      this.$emit("message", "options-edges-font-align", this.accordionType, value);
    },
    changeVadjust: function (value) {
      this.fontVadjust = value;
      this.$emit(
        "message",
        "options-edges-font-vadjust",
        this.accordionType,
        parseFloat(value)
      );
    },
    changeMultiEnabled: function (value) {
      this.fontMultiEnabled = value;
      console.log("Font multi enabled: " + this.fontMultiEnabled);
      this.multi = "html";
      this.$emit(
        "message",
        "options-edges-font-multi-enabled",
        this.accordionType,
        value
      );
    },
    changeMulti: function (value) {
      this.multi = value;
      this.$emit("message", "options-edges-font-multi", this.accordionType, value);
    },
    message: function (field, type, value) {
      this.$emit("message", field + "-" + type, this.accordionType, value);
    },
    openBsModalFunction: function (title, body) {
      this.$emit("open-bs-modal", title, body);
    },
  },
  components: {
    InputGroupWithLabel,
    SwitchWithInfo,
    LabelWithTooltip,
    InputColorPicker,
    InputSelect,
    InputRange,
  },
  mounted() {
    console.log("Font Edge Accordion Mounted");
    this.accordionData.push();
  },
  watch: {
    options: {
      handler: function (newValue, oldValue) {
        if ("edges" in newValue && typeof newValue.edges == "object") {
          if ("font" in newValue.edges && typeof newValue.edges.font == "string") {
            this.objectSendingValue = false;
            this.fontString = newValue.edges.font;
          }
          if ("font" in newValue.edges && typeof newValue.edges.font == "object") {
            this.objectSendingValue = true;
            if ("color" in newValue.edges.font) {
              this.fontColor = newValue.edges.font.color;
            }
            if ("size" in newValue.edges.font) {
              this.fontSize = newValue.edges.font.size;
            }
            if ("face" in newValue.edges.font) {
              this.faceOptions.forEach((element, index, array) => {
                if (element.value == newValue.edges.font.face) {
                  element.selected = true;
                } else {
                  element.selected = false;
                }
              });
              this.fontFace = newValue.edges.font.face;
            }
            if ("background" in newValue.edges.font) {
              this.fontBackgroundEnabled = true;
              if (typeof newValue.edges.font.background == "string") {
                this.fontBackground = newValue.edges.font.background;
              }
            }
            if ("strokeWidth" in newValue.edges.font) {
              this.fontStrokeWidth = newValue.edges.font.strokeWidth;
            }
            if ("strokeColor" in newValue.edges.font) {
              this.fontStrokeColor = newValue.edges.font.strokeColor;
            }
            if ("align" in newValue.edges.font) {
              this.alignOptions.forEach((element, index, arr) => {
                if (element.value == newValue.edges.font.align) {
                  element.selected = true;
                } else {
                  element.selected = false;
                }
              });
              this.fontAlign = newValue.edges.font.align;
            }
            if ("vadjusst" in newValue.edges.font) {
              this.fontVadjust = newValue.edges.font.vadjust;
            }
            if ("multi" in newValue.edges.font) {
              if (typeof newValue.edges.font.multi == "boolean") {
                this.fontMultiEnabled = newValue.edges.font.multi;
              } else if (typeof newValue.edges.font.multi == "string") {
                this.fontMultiEnabled = true;
                this.multiOptions.forEach((element, index, array) => {
                  if (element.value == newValue.edges.font.multi) {
                    element.selected = true;
                  } else {
                    element.selected = false;
                  }
                });
                this.multi = newValue.edges.font.multi;
              }
            }
            if ("bold" in newValue.edges.font) {
              if (Object.keys(newValue.edges.font.bold).length == 0) {
                this.fontBold = false;
              } else {
                this.fontBold = true;
              }
              this.accordionData[0].checkboxValue = this.fontBold;
            }
            if ("ital" in newValue.edges.font) {
              if (Object.keys(newValue.edges.font.ital).length == 0) {
                this.fontItal = false;
              } else {
                this.fontItal = true;
              }
              this.accordionData[1].checkboxValue = this.fontItal;
            }
            if ("boldital" in newValue.edges.font) {
              if (Object.keys(newValue.edges.font.boldital).length == 0) {
                this.fontBoldItal = false;
              } else {
                this.fontBoldItal = true;
              }
              this.accordionData[2].checkboxValue = this.fontBoldItal;
            }
            if ("mono" in newValue.edges.font) {
              if (Object.keys(newValue.edges.font.mono).length == 0) {
                this.fontMono = false;
              } else {
                this.fontMono = true;
              }
              this.accordionData[3].checkboxValue = this.fontMono;
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
