<template>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-warning" v-if="!checkboxValue">
    <i class="fa-solid fa-circle-info me-2"></i> Ative Setas
    {{ capitalizeFirstLetter(accordionType) }} para começar
  </p>
  <InputGroupWithLabel
    v-if="checkboxValue"
    :prepend="'Fator de escala:'"
    :append="true"
    :inputType="'number'"
    :tooltip="
      'Options.Edges.Arrows.' +
      capitalizeFirstLetter(accordionType) +
      '.ScaleFactor value. O fator de escala permite alterar o tamanho da ponta da seta.'
    "
    :inputInitialValue="scaleFactor"
    @input-value-change="changeScaleFactorValue"
    :min="0.1"
    :max="5"
    :step="0.1"
  ></InputGroupWithLabel>

  <LabelWithTooltip
    v-if="checkboxValue"
    :labelValue="'Tipo de seta'"
    :tooltip="
      'Options.Edges.Arrows.' +
      capitalizeFirstLetter(accordionType) +
      '.Type value. O tipo de ponto de extremidade. Os valores possíveis são: seta, barra, círculo e imagem. O padrão é seta.'
    "
    :forId="'input-select-' + accordionType + '-type'"
    :hasSwitch="false"
  ></LabelWithTooltip>
  <InputSelect
    v-if="checkboxValue"
    :selectId="'input-select-' + accordionType + '-type'"
    :options="arrowTypeOptions"
    :disabled="false"
    @update-selection="changeType"
  ></InputSelect>

  <InputUrl
    v-if="checkboxValue && type == 'image'"
    :idInput="'input-url-' + accordionType + '-src'"
    labelValue="Url da imagem"
    :placeholder="'https://www.google.com'"
    :tooltip="
      'Options.Edges.Arrows.' +
      capitalizeFirstLetter(accordionType) +
      '.Src - O URL do tipo de seta da imagem.'
    "
    :urlInitalValue="src"
    @url-value-update="changeSrc"
  ></InputUrl>

  <SwitchWithInfo
    v-if="checkboxValue && type == 'image'"
    :switchId="'options-edges-arrows-' + accordionType + '-imageHeight'"
    :switchDisabled="false"
    :switchInitialValue="imageHeightEnabled"
    :switchTooltipEnabled="true"
    :switchTooltip="
      'Options.Edges.Arrows.' +
      capitalizeFirstLetter(accordionType) +
      '.ImageHeight sending. A altura da seta da imagem. A altura do arquivo de imagem é usada se não estiver definida.'
    "
    :switchLabelEnabled="true"
    :switchLabelValue="'Habilitar altura da imagem'"
    @checkbox-status-changed="toggleImageHeightEnabled"
  ></SwitchWithInfo>
  <p
    class="mb-0 p-1 ps-2 mt-1 alert alert-danger"
    v-if="checkboxValue && type == 'image' && imageHeightEnabled"
  >
    <i class="fa-solid fa-circle-info me-2"></i> Desativar altura da imagem repinta canvas
  </p>
  <InputGroupWithLabel
    v-if="checkboxValue && type == 'image' && imageHeightEnabled"
    :prepend="'Altura da imagem:'"
    :append="true"
    :inputType="'number'"
    :tooltip="
      'Options.Edges.Arrows.' +
      capitalizeFirstLetter(accordionType) +
      '.ImageHeight value. A altura da seta da imagem. A altura do arquivo de imagem é usada se não estiver definida.'
    "
    :inputInitialValue="imageHeightValue"
    @input-value-change="changeImageHeightValue"
  ></InputGroupWithLabel>
  <SwitchWithInfo
    v-if="checkboxValue && type == 'image'"
    :switchId="'options-edges-arrows-' + accordionType + '-imageWidth'"
    :switchDisabled="false"
    :switchInitialValue="imageWidthEnabled"
    :switchTooltipEnabled="true"
    :switchTooltip="
      'Options.Edges.Arrows.' +
      capitalizeFirstLetter(accordionType) +
      '.ImageWidth sending. A largura da seta da imagem. A largura do arquivo de imagem é usada se não estiver definida.'
    "
    :switchLabelEnabled="true"
    :switchLabelValue="'Habilitar largura da imagem'"
    @checkbox-status-changed="toggleImageWidthEnabled"
  ></SwitchWithInfo>
  <p
    class="mb-0 p-1 ps-2 mt-1 alert alert-danger"
    v-if="checkboxValue && type == 'image' && imageWidthEnabled"
  >
    <i class="fa-solid fa-circle-info me-2"></i> Desativar largura da imagem repinta
    canvas
  </p>
  <InputGroupWithLabel
    v-if="checkboxValue && type == 'image' && imageWidthEnabled"
    :prepend="'Largura da imagem:'"
    :append="true"
    :inputType="'number'"
    :tooltip="
      'Options.Edges.Arrows.' +
      capitalizeFirstLetter(accordionType) +
      '.ImageWidth value. A largura da seta da imagem. A largura do arquivo de imagem é usada se não estiver definida.'
    "
    :inputInitialValue="imageWidthValue"
    @input-value-change="changeImageWidthValue"
  ></InputGroupWithLabel>
</template>
<script>
import SwitchWithInfo from "../Common/SwitchWithInfo.vue";
import InputGroupWithLabel from "../Common/Inputs/InputGroupWithLabel.vue";
import InputSelect from "../Common/Inputs/InputSelect.vue";
import LabelWithTooltip from "../Common/LabelWithTooltip.vue";
import InputUrl from "../Common/Inputs/InputUrl.vue";
export default {
  name: "Arrows Edge Base Component",
  props: ["accordionType", "checkboxValue", "bsModalReturnValue", "options"],
  data() {
    return {
      awatingResponse: [],
      arrowTypeOptions: [
        { value: "arrow", label: "Seta", selected: true },
        { value: "bar", label: "Barra", selected: false },
        { value: "box", label: "Caixa", selected: false },
        { value: "circle", label: "Círculo", selected: false },
        { value: "curve", label: "Curvo", selected: false },
        { value: "diamond", label: "Diamante", selected: false },
        { value: "image", label: "Imagem", selected: false },
        { value: "inv_curve", label: "Curva Inversa", selected: false },
        { value: "inv_triangle", label: "Triângulo Inverso", selected: false },
        { value: "triangle", label: "Triângulo", selected: false },
        { value: "vee", label: "Vee", selected: false },
        { value: "crow", label: "Crow", selected: false },
      ],
      imageHeightEnabled: false,
      imageHeightValue: 32,
      imageWidthEnabled: false,
      imageWidthValue: 32,
      scaleFactor: 1,
      type: "arrow",
      src: new URL(`/public/images/arrow.png`, import.meta.url).href,
    };
  },
  mounted() {
    console.log("Arrows Edge Base Component Mounted");
    if (typeof this.options.edges.arrows == "object") {
      if (this.accordionType == "to") {
        if (typeof this.options.edges.arrows.to.scaleFactor == "number") {
          this.scaleFactor = this.options.edges.arrows.to.scaleFactor;
        }
        if (typeof this.options.edges.arrows.to.type != "undefined") {
          this.type = this.options.edges.arrows.to.type;
          this.arrowTypeOptions.forEach((element) => {
            if (element.value == this.type) {
              element.selected = true;
            } else {
              element.selected = false;
            }
          });
        }
        if (typeof this.options.edges.arrows.to.src != "undefined") {
            this.src = this.options.edges.arrows.to.src;
        }
        if (typeof this.options.edges.arrows.to.imageHeight != "undefined") {
            this.imageHeightValue = parseInt(this.options.edges.arrows.to.imageHeight);
            this.imageHeightEnabled = true;
        }
        if (typeof this.options.edges.arrows.to.imageWidth != "undefined") {
            this.imageWidthValue = parseInt(this.options.edges.arrows.to.imageWidth);
            this.imageWidthEnabled = true;
        }
      } else if (this.accordionType == "middle") {
        if (typeof this.options.edges.arrows.middle.scaleFactor == "number") {
          this.scaleFactor = this.options.edges.arrows.middle.scaleFactor;
        }
        if (typeof this.options.edges.arrows.middle.type != "undefined") {
          this.type = this.options.edges.arrows.middle.type;
          this.arrowTypeOptions.forEach((element) => {
            if (element.value == this.type) {
              element.selected = true;
            } else {
              element.selected = false;
            }
          });
        }
        if (typeof this.options.edges.arrows.middle.src != "undefined") {
            this.src = this.options.edges.arrows.middle.src;
        }
        if (typeof this.options.edges.arrows.middle.imageHeight != "undefined") {
            this.imageHeightValue = parseInt(this.options.edges.arrows.middle.imageHeight);
            this.imageHeightEnabled = true;
        }
        if (typeof this.options.edges.arrows.middle.imageWidth != "undefined") {
            this.imageWidthValue = parseInt(this.options.edges.arrows.middle.imageWidth);
            this.imageWidthEnabled = true;
        }
      } else if (this.accordionType == "from") {
        if (typeof this.options.edges.arrows.from.scaleFactor == "number") {
          this.scaleFactor = this.options.edges.arrows.from.scaleFactor;
        }
        if (typeof this.options.edges.arrows.from.type != "undefined") {
          this.type = this.options.edges.arrows.from.type;
          this.arrowTypeOptions.forEach((element) => {
            if (element.value == this.type) {
              element.selected = true;
            } else {
              element.selected = false;
            }
          });
        }
        if (typeof this.options.edges.arrows.from.src != "undefined") {
            this.src = this.options.edges.arrows.from.src;
        }
        if (typeof this.options.edges.arrows.from.imageHeight != "undefined") {
            this.imageHeightValue = parseInt(this.options.edges.arrows.from.imageHeight);
            this.imageHeightEnabled = true;
        }
        if (typeof this.options.edges.arrows.from.imageWidth != "undefined") {
            this.imageWidthValue = parseInt(this.options.edges.arrows.from.imageWidth);
            this.imageWidthEnabled = true;
        }
      }
    }
  },
  methods: {
    capitalizeFirstLetter: function (val) {
      return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    },
    toggleImageHeightEnabled: function (value) {
      this.imageHeightEnabled = value;
      if (value) {
        this.$emit("message", "toggle-image-height-enabled", this.accordionType, value);
      } else {
        this.awatingResponse.push("repaint_canvas_image_height_enabled");
        this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
      }
    },
    toggleImageWidthEnabled: function (value) {
      if (value) {
        this.imageWidthEnabled = value;
        this.$emit("message", "toggle-image-width-enabled", this.accordionType, value);
      } else {
        this.imageWidthEnabled = value;
        this.awatingResponse.push("repaint_canvas_image_width_enabled");
        this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
      }
    },
    changeImageHeightValue: function (value) {
      this.imageHeightValue = value;
      if (this.imageHeightEnabled && !isNaN(value)) {
        this.$emit("message", "image-height-value", this.accordionType, parseInt(value));
      }
    },
    changeImageWidthValue: function (value) {
      this.imageWidthValue = value;
      if (this.imageWidthEnabled && !isNaN(value)) {
        this.$emit("message", "image-width-value", this.accordionType, parseInt(value));
      }
    },
    changeScaleFactorValue: function (value) {
      this.scaleFactor = value;
      if (!isNaN(value)) {
        this.$emit("message", "scale-factor", this.accordionType, parseFloat(value));
      }
    },
    changeType: function (value) {
      this.type = value;
      this.$emit("message", "type", this.accordionType, value);
    },
    changeSrc: function (value) {
      this.src = value;
      this.$emit("message", "src", this.accordionType, value);
    },
  },
  components: {
    SwitchWithInfo,
    InputGroupWithLabel,
    InputSelect,
    LabelWithTooltip,
    InputUrl,
  },
  watch: {
    bsModalReturnValue: function (newValue, oldValue) {
      if (newValue == null) return;
      if (this.awatingResponse.includes("repaint_canvas_image_height_enabled", 0)) {
        this.awatingResponse = this.awatingResponse.filter(function (e) {
          e != "repaint_canvas_image_height_enabled";
        });
        if (newValue) {
          this.imageHeightEnabled = false;
          this.$emit("message", "toggle-image-height-enabled", this.accordionType, false);
        } else {
          this.imageHeightEnabled = true;
        }
      }
      if (this.awatingResponse.includes("repaint_canvas_image_width_enabled", 0)) {
        this.awatingResponse = this.awatingResponse.filter(function (e) {
          e != "repaint_canvas_image_width_enabled";
        });
        this.imageWidthEnabled = !newValue;
        this.$emit(
          "message",
          "toggle-image-width-enabled",
          this.accordionType,
          !newValue
        );
      }
    },
    options: {
      handler: function (newValue, oldValue) {
        //console.log(newValue);
      },
      deep: true,
    },
  },
  emits: ["message", "open-bs-modal"],
};
</script>
