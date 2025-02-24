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
  <Accordion
    :accordionData="accordion1Data"
    :bsModalReturnValue="bsModalReturnValue"
    :options="options"
    @message="message"
    @open-bs-modal="openBsModal"
  ></Accordion>
  <SwitchWithInfo
    :switchId="'options-edges-arrowStrikethrough'"
    :switchDisabled="false"
    :switchInitialValue="arrowStrikethrough"
    :switchTooltipEnabled="true"
    :switchTooltip="'Options.Nodes.ArrowStrikethrough - Quando falso, a aresta para na seta. Isso pode ser útil se você tiver linhas grossas e quiser que a seta termine em um ponto. As setas do meio não são afetadas por isso.'"
    :switchLabelEnabled="true"
    :switchLabelValue="'Tachamento da seta'"
    @checkbox-status-changed="emitArrowStriketrhough"
  ></SwitchWithInfo>
  <Accordion
    :accordionData="accordion2Data"
    :bsModalReturnValue="bsModalReturnValue"
    :options="options"
    @message="message"
    @open-bs-modal="openBsModal"
  ></Accordion>
  <SwitchWithInfo
    :switchId="'options-edges-dashes'"
    :switchDisabled="false"
    :switchInitialValue="dashes"
    :switchTooltipEnabled="true"
    :switchTooltip="'Options.Edges.Dashes - Quando verdadeiro, a aresta será desenhada como uma linha tracejada. Você pode personalizar os travessões fornecendo um Array. Matriz formart: Matriz de números, comprimento do intervalo, comprimento do traço, comprimento do intervalo, comprimento do traço, ... etc. A matriz é repetida até que a distância seja preenchida. Ao usar linhas tracejadas em versões do IE anteriores a 11, a linha será desenhada em linha reta, não suave.'"
    :switchLabelEnabled="true"
    :switchLabelValue="'Traçado'"
    @checkbox-status-changed="emitDashes"
  ></SwitchWithInfo>
  <Transition name="nested" :duration="350">
    <div class="border mt-1 mb-1 p-2" v-if="dashes">
      <SwitchWithInfo
        :switchId="'options-edges-dashes-object'"
        :switchDisabled="false"
        :switchInitialValue="dashesArraySending"
        :switchTooltipEnabled="true"
        :switchTooltip="'Options.Edges.Dashes (Toggle array sending) - Alterne entre envio de booleano e de vetor.'"
        :switchLabelEnabled="true"
        :switchLabelValue="dashesArraySending ? 'Enviando vetor' : 'Enviando booleano'"
        @checkbox-status-changed="emitDashesArray"
      >
      </SwitchWithInfo>
      <InputGroupWithLabel
        v-if="dashesArraySending"
        :prepend="'Tamanho do traço:'"
        :append="true"
        :inputType="'number'"
        :tooltip="'Options.Edges.Dashes[0] - Tamanho do traço.'"
        :inputInitialValue="dashesArray[0]"
        @input-value-change="chngeEdgesDashesOf0"
      >
      </InputGroupWithLabel>
      <InputGroupWithLabel
        v-if="dashesArraySending"
        :prepend="'Tamanho do espaço:'"
        :append="true"
        :inputType="'number'"
        :tooltip="'Options.Edges.Dashes[1] - Tamanho do espaço.'"
        :inputInitialValue="dashesArray[1]"
        @input-value-change="chngeEdgesDashesOf1"
      >
      </InputGroupWithLabel>
    </div>
  </Transition>
  <Accordion
    :accordionData="accordion3Data"
    :bsModalReturnValue="bsModalReturnValue"
    :options="options"
    @message="message"
    @open-bs-modal="openBsModal"
  ></Accordion>
  <SwitchWithInfo
    :switchId="'options-edges-hidden'"
    :switchDisabled="false"
    :switchInitialValue="hidden"
    :switchTooltipEnabled="true"
    :switchTooltip="'Options.Edges.Hidden - Quando verdadeiro, a aresta não é desenhada. No entanto, ainda faz parte da simulação de física!'"
    :switchLabelEnabled="true"
    :switchLabelValue="'Ocultar'"
    @checkbox-status-changed="emitHidden"
  ></SwitchWithInfo>
  <SwitchWithInfo
    :switchId="'options-edges-hover-width-function'"
    :switchDisabled="false"
    :switchInitialValue="hoverWidthFunctionSending"
    :switchTooltipEnabled="true"
    :switchTooltip="'Options.Edges.HoverWidth - Quando verdadeiro, a aresta não é desenhada. No entanto, ainda faz parte da simulação de física!'"
    :switchLabelEnabled="true"
    :switchLabelValue="
      'Largura do foco - ' +
      (hoverWidthFunctionSending ? 'Enviando função' : 'Enviando número')
    "
    @checkbox-status-changed="emitHoverWidth"
  ></SwitchWithInfo>
  <div v-if="!hoverWidthFunctionSending">
    <InputGroupWithLabel
      :prepend="'Largura do foco:'"
      :append="true"
      :inputType="'number'"
      :tooltip="'Options.Edges.HoverWidth - Tamanho da largura do foco.'"
      :inputInitialValue="hoverWidthValue"
      @input-value-change="changeHoverWidth"
      :step="0.5"
    >
    </InputGroupWithLabel>
  </div>
  <div class="border mt-1 mb-1 p-1" v-else>
    <InputTextArea
      :inputId="'options-edges-hoverwidth-function'"
      :inputEnabled="hoverWidthFunctionInputEnabled"
      :inputInitialValue="hoverWidthFunctionText"
      :inputPlaceholder="'//JS code para o hoverWidth'"
      :inputRows="3"
      :isLabelEnabled="true"
      :labelValue="'Função para a largura de foco'"
      :tooltip="'Options.Edges.HoverWidth (As function) - Função do tamanho da largura do foco'"
      :hasSwitch="true"
      :switchId="'options-edges-hoverwidth-funtion-switch'"
      :switchTooltip="'Options.Edges.HoverWidth (As function) - Função do tamanho da largura do foco'"
      :switchDisabled="false"
      :switchInitialValue="hoverWidthFunctionSwitchValue"
      :switchLabelEnabled="false"
      @checkbox-value-change="enableHoverWidthFunction"
      @input-value-change="changeHoverWidthFunction"
    ></InputTextArea>
    <button
      v-if="hoverWidthFunctionInputEnabled"
      type="button"
      class="btn btn-primary form-control mt-2"
      @click.prevent="sendEdgesHoverWidthFunction"
    >
      Registrar função
    </button>
  </div>
  <SwitchWithInfo
    :switchId="'options-edges-label-highlight-bold'"
    :switchDisabled="false"
    :switchInitialValue="labelHighlightBold"
    :switchTooltipEnabled="true"
    :switchTooltip="'Options.Edges.LabelHighlightBold - Determina se o rótulo fica em negrito ou não quando a borda é selecionada.'"
    :switchLabelEnabled="true"
    :switchLabelValue="'Destaque do rótulo em negrito'"
    @checkbox-status-changed="emitLabelHighlightBold"
  ></SwitchWithInfo>
  <InputGroupWithLabel
    :prepend="'Comprimento da mola:'"
    :append="true"
    :inputType="'number'"
    :tooltip="'Options.Edges.length - A simulação física dá às arestas um comprimento de mola. Esse valor pode substituir o comprimento da mola em repouso.'"
    :inputInitialValue="length"
    @input-value-change="emitLength"
    :step="0.5"
  ></InputGroupWithLabel>
  <SwitchWithInfo
    :switchId="'options-edges-physics'"
    :switchDisabled="false"
    :switchInitialValue="physics"
    :switchTooltipEnabled="true"
    :switchTooltip="'Options.Edges.Physics - Quando verdadeiro, a aresta faz parte da simulação física. Quando falso, não atuará como mola.'"
    :switchLabelEnabled="true"
    :switchLabelValue="'Física'"
    @checkbox-status-changed="emitPhysics"
  ></SwitchWithInfo>
  <Accordion
    :accordionData="accordion4Data"
    :bsModalReturnValue="bsModalReturnValue"
    :options="options"
    @message="message"
    @open-bs-modal="openBsModal"
  ></Accordion>
  <SwitchWithInfo
    :switchId="'options-edges-selectionWidth-choice'"
    :switchDisabled="false"
    :switchInitialValue="selectionWidthFunctionSending"
    :switchTooltipEnabled="true"
    :switchTooltip="'Options.Edges.SelectionWidth (Toggle function/number sending) - A selectionWidth determina a largura da aresta quando a aresta é selecionada. Se um número for fornecido, esse número será adicionado à largura.'"
    :switchLabelEnabled="true"
    :switchLabelValue="
      'Largura da seleção - ' +
      (selectionWidthFunctionSending ? 'Enviando objeto' : 'Enviando número')
    "
    @checkbox-status-changed="toggleSelectionWidth"
  ></SwitchWithInfo>
  <div class="border mt-1 mb-1 p-1" v-if="selectionWidthFunctionSending">
    <InputTextArea
      :inputId="'options-edges-selectionWidth-function'"
      :inputEnabled="selectionWidthSwitchValue"
      :inputInitialValue="selectionWidthValueFunctionText"
      :inputPlaceholder="'//JS code para o hoverWidth'"
      :inputRows="3"
      :isLabelEnabled="true"
      :labelValue="'Função para largura da seleção'"
      :tooltip="'Options.Edges.selectionWidth (As function) - Como a largura pode ser alterada pelo valor e pelas funções de escala, um multiplicador constante ou valor agregado pode não fornecer os melhores resultados. Para resolver isso, você pode fornecer uma função. Ele recebe a largura numérica da borda. Neste exemplo simples, multiplique a largura por 2. Você pode taylor a lógica na função, desde que ela retorne um número.'"
      :hasSwitch="true"
      :switchId="'options-edges-selectionWidth-function-switch'"
      :switchTooltip="'Options.Edges.selectionWidth (As function) - Como a largura pode ser alterada pelo valor e pelas funções de escala, um multiplicador constante ou valor agregado pode não fornecer os melhores resultados. Para resolver isso, você pode fornecer uma função. Ele recebe a largura numérica da borda. Neste exemplo simples, multiplique a largura por 2. Você pode taylor a lógica na função, desde que ela retorne um número.'"
      :switchDisabled="false"
      :switchInitialValue="selectionWidthSwitchValue"
      :switchLabelEnabled="false"
      @checkbox-value-change="enableSelectionWidthFunction"
      @input-value-change="changeSelectionWidthFunctionValue"
    ></InputTextArea>
    <button
      v-if="selectionWidthSwitchValue"
      type="button"
      class="btn btn-primary form-control mt-2"
      @click.prevent="sendEdgesSelectionWidthFunction"
    >
      Registrar função
    </button>
  </div>
  <div v-else>
    <InputGroupWithLabel
      :prepend="'Valor da largura de seleção:'"
      :append="true"
      :inputType="'number'"
      :tooltip="'Options.Edges.SelectionWidth (Number value) - A selectionWidth determina a largura da aresta quando a aresta é selecionada. Se um número for fornecido, esse número será adicionado à largura.'"
      :inputInitialValue="selectionWidthValue"
      @input-value-change="changeSelectionWidthValue"
      :step="0.5"
    ></InputGroupWithLabel>
  </div>
  <Accordion
    :accordionData="accordion5Data"
    :bsModalReturnValue="bsModalReturnValue"
    :options="options"
    @message="message"
    @open-bs-modal="openBsModal"
  ></Accordion>
</template>
<script>
import SwitchWithInfo from "../Common/SwitchWithInfo.vue";
import InputGroupWithLabel from "../Common/Inputs/InputGroupWithLabel.vue";
import InputTextArea from "../Common/Inputs/InputTextArea.vue";
export default {
  name: "Edges Componenet",
  props: ["bsModalReturnValue", "localOptions"],
  data() {
    return {
      options: null,
      awatingResponse: [],

      arrowsEnabled: false,
      endPointOffsetEnabled: false,
      arrowStrikethrough: false,
      chosenEnabled: false,
      colorEnabled: false,
      dashes: false,
      dashesArraySending: false,
      dashesArray: [5, 5],
      fontEnabled: false,
      hidden: false,
      hoverWidthFunctionSending: false,
      hoverWidthValue: 2,
      hoverWidthFunctionText: "",
      hoverWidthFunctionInputEnabled: false,
      hoverWidthFunctionSwitchValue: false,
      labelHighlightBold: false,
      length: "",
      physics: true,
      scalingEnabled: false,
      selectionWidthFunctionSending: false,
      selectionWidthSwitchValue: false,
      selectionWidthValueFunctionText: "",
      selectionWidthValueFunction: null,
      selectionWidthValue: 1,
      shadowEnabled: false,
      smoothEnabled: false,
      widhtConstraintEnabled: false,

      accordion1Data: [
        {
          id: "edges-arrows",
          title: "Setas",
          tooltip:
            "Options.Edges.Arrows - Para desenhar uma seta com configurações padrão, uma string pode ser fornecida. Por " +
            "exemplo: <code>arrows:'to, from, middle'</code> ou <code>'to;from'</code>" +
            ", qualquer combinação com qualquer símbolo separador está bem. Se quiser controlar " +
            "o tamanho das pontas das setas, você pode fornecer um objeto",
          body: "ArrowEdgeAccordion",
          checkboxValue: this.arrowsEnabled,
        },
        {
          id: "edges-endPointOffset",
          title: "Deslocamento do ponto final",
          tooltip:
            "Options.Edges.EndPointOffset - Ajuste os pontos finais. Pode ser útil se você quiser que os pontos finais sejam" +
            " colocados nas bordas dos nós. Este recurso só é possível quando o arrowStrikethrough for verdadeiro.",
          body: "EndpointOffsetAccordion",
          checkboxValue: this.endPointOffsetEnabled,
        },
      ],

      accordion2Data: [
        {
          id: "edges-chosen",
          title: "Escolhido",
          tooltip:
            "Options.Edges.Chosen - Quando verdadeiro, selecionar ou passar o mouse sobre uma borda irá alterá-la" +
            " e as características de seu rótulo de acordo com o padrão. Quando falso, nenhuma alteração na " +
            "aresta ou em seu rótulo ocorrerá quando a aresta for escolhida. Se um objeto for fornecido, um " +
            "ajuste mais refinado das características da borda e da etiqueta estará disponível quando uma borda for escolhida.",
          body: "ChosenEdgeAccordion",
          checkboxValue: this.chosenEnabled,
        },
        {
          id: "edges-color",
          title: "Cor ",
          tooltip:
            "Options.Edges.Color - O objeto de cor contem as informações de cor da aresta em todas as situações. " +
            " Quando as arestas somente precisam de uma única cor, um valor de cor 'rbg(120, 32, 14)',  " +
            "'#ffffff' ou 'red' pode ser aplicado ao invés de um objeto.",
          body: "ColorEdgeAccordion",
          checkboxValue: this.colorEnabled,
        },
      ],

      accordion3Data: [
        {
          id: "edges-font",
          title: "Fonte",
          switch: true,
          tooltip:
            "Esse objeto define os detalhes do rótulo. Um versão curta também é suportada na forma " +
            " 'size face color' por exemplo '14px arial red'.",
          body: "FontEdgeAccordion",
          checkboxValue: this.fontEnabled,
        },
      ],

      accordion4Data: [
        {
          id: "edges-scaling",
          title: "Dimensionamento",
          switch: true,
          tooltip:
            "Se a opção de valor for especificada, a largura das bordas será dimensionada de acordo com as propriedades deste objeto. Lembre-se de que ao usar o dimensionamento, a opção de largura é negligenciada.",
          body: "ScalingEdgeAccordion",
          checkboxValue: this.scalingEnabled,
        },
      ],

      accordion5Data: [
        {
          id: "edges-selfReference",
          title: "Autorreferência / Laços",
          hasSwitchButton: false,
          tooltip:
            "O objeto de cor contem as informações de cor da aresta em todas as situações. " +
            " Quando as arestas somente precisam de uma única cor, um valor de cor 'rbg(120, 32, 14)',  " +
            "'#ffffff' ou 'red' pode ser aplicado ao invés de um objeto.",
          body: "SelfReferenceEdgeAccordion",
        },
        {
          id: "edges-shadow",
          title: "Sombra",
          tooltip:
            "Options.Edges.Shadow (Toggle false/true) - Quando verdadeiro, a aresta projeta uma sombra usando as configurações padrão. Isso fornece o raio do círculo e a posição.",
          body: "ShadowEdgeAccordion",
          checkboxValue: this.shadowEnabled,
        },
        {
          id: "edges-smooth",
          title: "Maciez",
          tooltip:
            "Options.Edges.Smooth (Toggle false/true) - Quando verdadeiro, a aresta é desenhada como uma " +
            "curva Bézier dinâmica. O desenho dessas curvas demora mais que o das curvas retas, mas fica melhor. " +
            "Há uma diferença entre curvas suaves dinâmicas e curvas suaves estáticas. As curvas suaves dinâmicas " +
            "possuem um nó de suporte invisível que participa da simulação física. Se você tiver muitas arestas, " +
            "considere escolher um tipo diferente de curvas suaves e dinâmicas para obter melhor desempenho.",
          body: "SmoothEdgeAccordion",
          checkboxValue: this.smoothEnabled,
        },
        {
          id: "edges-widthConstraint",
          title: "Constante de Largura",
          checkboxValue: this.widhtConstraintEnabled,
          body: "WidthConstraintEdgeAccordion",
          tooltip:
            "Options.Edges.WidthConstraint (Toggle false/true) - Se for falso, nenhuma restrição de largura será aplicada. Se um número for especificado, a largura máxima do rótulo da borda será definida como o valor. As linhas do rótulo da borda serão quebradas para ficarem abaixo do máximo.",
        },
      ],
    };
  },
  mounted() {
    console.log("Edges Component Mounted");
    this.options = this.localOptions;
    this.checkEdgesExists();
  },
  watch: {
    bsModalReturnValue: function (newValue, oldValue) {
      if (newValue == null || this.awatingResponse.length == 0) return;
      if (this.awatingResponse.includes("repaint_canvas_arrows_string", 0)) {
        this.awatingResponse = this.awatingResponse.filter(function (e) {
          e != "repaint_canvas_arrows_string";
        });
        if (newValue) {
          this.arrowsEnabled = false;
          delete this.localOptions.edges.arrows;
          this.$emit("canvas-key-change", true);
        } else {
          this.arrowsEnabled = true;
          this.accordion1Data[0].checkboxValue = true;
        }
      }
      if (this.awatingResponse.includes("repaint_canvas_arrows_endPointOffset", 0)) {
        this.awatingResponse = this.awatingResponse.filter(function (e) {
          e != "repaint_canvas_arrows_endPointOffset";
        });
        if (newValue) {
          this.endPointOffset = false;
          delete this.localOptions.edges.endPointOffset;
          this.$emit("canvas-key-change", true);
        } else {
          this.endPointOffset = true;
          this.accordion1Data[1].checkboxValue = true;
        }
      }

      if (this.awatingResponse.includes("repaint_canvas_edges_chosen_false", 0)) {
        this.awatingResponse = this.awatingResponse.filter(function (e) {
          e != "repaint_canvas_edges_chosen_false";
        });
        if (newValue) {
          this.localOptions.edges.chosen = false;
          this.$emit("canvas-key-change", true);
        } else {
          this.chosenEnabled = true;
          this.accordion2Data[0].checkboxValue = true;
        }
      }
      if (this.awatingResponse.includes("repaint_canvas_edges_chosen_true", 0)) {
        this.awatingResponse = this.awatingResponse.filter(function (e) {
          e != "repaint_canvas_edges_chosen_true";
        });
        if (newValue) {
          this.localOptions.edges.chosen = true;
          this.$emit("canvas-key-change", true);
        } else {
          this.chosenEnabled = false;
          this.accordion2Data[0].checkboxValue = false;
        }
      }

      if (this.awatingResponse.includes("repaint_canvas_edges_color_false", 0)) {
        this.awatingResponse = this.awatingResponse.filter(function (e) {
          e != "repaint_canvas_edges_color_false";
        });
        if (newValue) {
          if (Object.hasOwn(this.localOptions.edges, "color")) {
            delete this.localOptions.edges.color;
          }
          this.$emit("canvas-key-change", true);
        } else {
          this.colorEnabled = true;
          this.accordion2Data[1].checkboxValue = true;
        }
      }

      if (this.awatingResponse.includes("repaint_canvas_edges_font_false", 0)) {
        this.awatingResponse = this.awatingResponse.filter(function (e) {
          e != "repaint_canvas_edges_font_false";
        });
        if (newValue) {
          if (Object.hasOwn(this.localOptions.edges, "font")) {
            delete this.localOptions.edges.font;
          }
          this.$emit("canvas-key-change", true);
        } else {
          this.fontEnabled = true;
          this.accordion3Data[0].checkboxValue = true;
        }
      }

      if (this.awatingResponse.includes("repaint_canvas_edges_scaling_false", 0)) {
        this.awatingResponse = this.awatingResponse.filter(function (e) {
          e != "repaint_canvas_edges_scaling_false";
        });
        if (newValue) {
          if (Object.hasOwn(this.localOptions.edges, "scaling")) {
            delete this.localOptions.edges.scaling;
          }
          this.$emit("canvas-key-change", true);
        } else {
          this.scalingEnabled = true;
          this.accordion4Data[0].checkboxValue = true;
        }
      }

      if (this.awatingResponse.includes("repaint_canvas_edges_widthConstraint_false", 0)) {
        this.awatingResponse = this.awatingResponse.filter(function (e) {
          e != "repaint_canvas_edges_widthConstraint_false";
        });
        if (newValue) {
          if (Object.hasOwn(this.localOptions.edges, "widthConstraint")) {
            delete this.localOptions.edges.widthConstraint;
          }
          this.$emit("canvas-key-change", true);
        } else {
          this.widhtConstraintEnabled = true;
          this.accordion5Data[3].checkboxValue = true;
        }
      }
    },
    localOptions: {
      handler: function (newValue, oldValue) {
        this.$emit("options-has-changed", newValue);
      },
      deep: true,
    },
    options: {
      handler: function (newValue, oldValue) {
        if (typeof newValue.edges != "object") {
          this.arrowsEnabled = false;
          this.accordion1Data[0].checkboxValue = false;
        } else {
          if (typeof newValue.edges.arrows == "undefined") {
            this.arrowsEnabled = false;
            this.accordion1Data[0].checkboxValue = false;
          } else if (
            typeof newValue.edges.arrows == "string" ||
            typeof newValue.edges.arrows == "object"
          ) {
            this.arrowsEnabled = true;
            this.accordion1Data[0].checkboxValue = true;
          }
          if (typeof newValue.edges.endPointOffset == "undefined") {
            this.endPointOffsetEnabled = false;
            this.accordion1Data[1].checkboxValue = false;
          } else if (typeof newValue.edges.endPointOffset == "object") {
            this.endPointOffsetEnabled = true;
            this.accordion1Data[1].checkboxValue = true;
          }
          if (typeof newValue.edges.arrowStrikethrough == "undefined") {
            this.arrowStrikethrough = false;
          } else if (typeof newValue.edges.arrowStrikethrough == "boolean") {
            this.arrowStrikethrough = newValue.edges.arrowStrikethrough;
          }
          if (typeof newValue.edges.chosen == "undefined") {
            this.chosenEnabled = false;
            this.accordion2Data[0].checkboxValue = this.chosenEnabled;
          } else if (typeof newValue.edges.chosen == "object") {
            this.chosenEnabled = true;
            this.accordion2Data[0].checkboxValue = this.chosenEnabled;
          } else if (typeof newValue.edges.chosen == "boolean") {
            this.chosenEnabled = newValue.edges.chosen;
            this.accordion2Data[0].checkboxValue = newValue.edges.chosen;
          }
          if (typeof newValue.edges.color == "undefined") {
            this.colorEnabled = false;
            this.accordion2Data[1].checkboxValue = this.colorEnabled;
          } else if (
            typeof newValue.edges.color == "string" ||
            typeof newValue.edges.color == "object"
          ) {
            this.colorEnabled = true;
            this.accordion2Data[1].checkboxValue = this.colorEnabled;
          }

          if (typeof newValue.edges.dashes == "undefined") {
            this.dashes = false;
          } else if (typeof newValue.edges.dashes == "boolean") {
            this.dashes = newValue.edges.dashes;
            this.dashesArraySending = false;
          } else if (typeof newValue.edges.dashes == "object") {
            this.dashes = true;
            this.dashesArraySending = true;
            this.dashesArray[0] = newValue.edges.dashes["0"];
            this.dashesArray[1] = newValue.edges.dashes["1"];
          }

          if (typeof newValue.edges.font == "undefined") {
            this.fontEnabled = false;
          } else if (
            typeof newValue.edges.font == "string" ||
            typeof newValue.edges.font == "object"
          ) {
            this.fontEnabled = true;
            this.accordion3Data[0].checkboxValue = this.fontEnabled;
          }

          if (typeof newValue.edges.hidden == "undefined") {
            this.hidden = false;
          } else if (typeof newValue.edges.hidden == "boolean") {
            this.hidden = newValue.edges.hidden;
          }

          if (typeof newValue.edges.hoverWidth == "undefined") {
            this.hoverWidthFunctionSending = false;
          } else if (typeof newValue.edges.hoverWidth == "number") {
            this.hoverWidthFunctionSending = false;
            this.hoverWidthValue = newValue.edges.hoverWidth;
          } else if (typeof newValue.edges.hoverWidth == "function") {
            this.hoverWidthFunctionSending = true;
            this.hoverWidthFunctionText = newValue.edges.hoverWidth.toString();
            this.hoverWidthFunction = newValue.edges.hoverWidth;
          }

          if (typeof newValue.edges.labelHighlightBold == "undefined") {
            this.labelHighlightBold = true;
          } else if (typeof newValue.edges.labelHighlightBold == "boolean") {
            this.labelHighlightBold = newValue.edges.labelHighlightBold;
          }

          if (typeof newValue.edges.length == "number") {
            this.length = newValue.edges.length;
          }

          if (typeof newValue.edges.physics == "boolean") {
            this.physics = newValue.edges.physics;
          }

          if (typeof newValue.edges.scaling == "undefined") {
            this.scalingEnabled = false;
            this.accordion4Data[0].checkboxValue = this.scalingEnabled;
          } else if (typeof newValue.edges.scaling == "object") {
            this.scalingEnabled = true;
            this.accordion4Data[0].checkboxValue = this.scalingEnabled;
          }

          if (typeof newValue.edges.selectionWidth == "undefined") {
            this.selectionWidthFunctionSending = false;
          } else if (typeof newValue.edges.selectionWidth == "number") {
            this.selectionWidthFunctionSending = false;
            this.selectionWidthValue = newValue.edges.selectionWidth;
          } else if (typeof newValue.edges.selectionWidth == "function") {
            this.selectionWidthFunctionSending = true;
            this.selectionWidthValueFunction = newValue.edges.selectionWidth;
            this.selectionWidthValueFunctionText = newValue.edges.selectionWidth.toString();
          }

          if (typeof newValue.edges.shadow == "undefined") {
            this.shadowEnabled = false;
          } else if (typeof newValue.edges.shadow == "boolean") {
            this.shadowEnabled = newValue.edges.shadow;
            this.accordion5Data[1].checkboxValue = this.shadowEnabled;
          } else if (typeof newValue.edges.shadow == "object") {
            this.shadowEnabled = newValue.edges.shadow.enabled;
            this.accordion5Data[1].checkboxValue = this.shadowEnabled;
          }

          if (typeof newValue.edges.smooth == "undefined") {
            this.smoothEnabled = false;
          } else if (typeof newValue.edges.smooth == "boolean") {
            this.smoothEnabled = newValue.edges.smooth;
            this.accordion5Data[2].checkboxValue = this.smoothEnabled;
          } else if (typeof newValue.edges.smooth == "object") {
            this.smoothEnabled = newValue.edges.smooth.enabled;
            this.accordion5Data[2].checkboxValue = this.smoothEnabled;
          }

          if (typeof newValue.edges.widthConstraint == "undefined") {
            this.widhtConstraintEnabled = false;
          } else if (typeof newValue.edges.widthConstraint == "boolean" ||
            typeof newValue.edges.widthConstraint == "number"
          ) {
            this.widhtConstraintEnabled = true;
            this.accordion5Data[3].checkboxValue = this.widhtConstraintEnabled;
          }
        }
      },
      deep: true,
    },
  },
  components: {},
  methods: {
    message: function (message, accordionItem, value) {
      console.log(message, accordionItem, value);

      if (accordionItem == "edges-arrows") {
        if (message == "update-checkbox-accordion") {
          if (!value) {
            if (
              typeof this.localOptions.edges == "object" &&
              typeof this.localOptions.edges.arrows != "undefined"
            ) {
              this.arrowsEnabled = false;
              this.accordion1Data[0].checkboxValue = false;
              this.awatingResponse.push("repaint_canvas_arrows_string");
              this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
            }
          }
        }
        if (
          typeof this.localOptions.edges == "object" &&
          message == "arrow-string-changed"
        ) {
          this.localOptions.edges.arrows = value;
        }
        if (typeof this.localOptions.edges == "object" && message == "arrows-object") {
          this.localOptions.edges.arrows = value;
        }
        if (
          typeof this.localOptions.edges == "object" &&
          message == "options-edges-arrows-to-enabled"
        ) {
          this.localOptions.edges.arrows.to.enabled = value;
        }
        if (
          typeof this.localOptions.edges == "object" &&
          message == "options-edges-arrows-middle-enabled"
        ) {
          this.localOptions.edges.arrows.middle.enabled = value;
        }
        if (
          typeof this.localOptions.edges == "object" &&
          message == "options-edges-arrows-from-enabled"
        ) {
          this.localOptions.edges.arrows.from.enabled = value;
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-to-scale-factor"
        ) {
          this.localOptions.edges.arrows.to.scaleFactor = parseFloat(value);
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-from-scale-factor"
        ) {
          this.localOptions.edges.arrows.from.scaleFactor = parseFloat(value);
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-middle-scale-factor"
        ) {
          this.localOptions.edges.arrows.middle.scaleFactor = parseFloat(value);
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-to-type"
        ) {
          this.localOptions.edges.arrows.to.type = value;
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-from-type"
        ) {
          this.localOptions.edges.arrows.from.type = value;
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-middle-type"
        ) {
          this.localOptions.edges.arrows.middle.type = value;
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-to-src"
        ) {
          this.localOptions.edges.arrows.to.src = value;
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-from-src"
        ) {
          this.localOptions.edges.arrows.from.src = value;
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-middle-src"
        ) {
          this.localOptions.edges.arrows.middle.src = value;
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-to-image-height-enabled"
        ) {
          if (!value) {
            delete this.localOptions.edges.arrows.to.imageHeight;
            this.$emit("canvas-key-change", true);
          }
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-middle-image-height-enabled"
        ) {
          if (!value) {
            delete this.localOptions.edges.arrows.middle.imageHeight;
            this.$emit("canvas-key-change", true);
          }
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-from-image-height-enabled"
        ) {
          if (!value) {
            delete this.localOptions.edges.arrows.from.imageHeight;
            this.$emit("canvas-key-change", true);
          }
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-to-image-height-value"
        ) {
          this.localOptions.edges.arrows.to.imageHeight = parseInt(value);
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-from-image-height-value"
        ) {
          this.localOptions.edges.arrows.from.imageHeight = parseInt(value);
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-middle-image-height-value"
        ) {
          this.localOptions.edges.arrows.middle.imageHeight = parseInt(value);
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-to-image-width-enabled"
        ) {
          if (!value) {
            delete this.localOptions.edges.arrows.to.imageWidth;
            this.$emit("canvas-key-change", true);
          }
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-from-image-width-enabled"
        ) {
          if (!value) {
            delete this.localOptions.edges.arrows.from.imageWidth;
            this.$emit("canvas-key-change", true);
          }
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-middle-image-width-enabled"
        ) {
          if (!value) {
            delete this.localOptions.edges.arrows.middle.imageWidth;
            this.$emit("canvas-key-change", true);
          }
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-to-image-width-value"
        ) {
          this.localOptions.edges.arrows.to.imageWidth = parseInt(value);
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-from-image-width-value"
        ) {
          this.localOptions.edges.arrows.from.imageWidth = parseInt(value);
        }
        if (
          typeof this.localOptions.edges == "object" &&
          typeof this.localOptions.edges.arrows == "object" &&
          message == "options-edges-arrows-middle-image-width-value"
        ) {
          this.localOptions.edges.arrows.middle.imageWidth = parseInt(value);
        }
      }
      if (accordionItem == "edges-endPointOffset") {
        if (message == "update-checkbox-accordion") {
          if (!value) {
            if (
              typeof this.localOptions.edges == "object" &&
              typeof this.localOptions.edges.endPointOffset != "undefined"
            ) {
              this.endPointOffsetEnabled = false;
              this.accordion1Data[1].checkboxValue = false;
              this.awatingResponse.push("repaint_canvas_arrows_endPointOffset");
              this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
            }
          } else {
            this.localOptions.edges.endPointOffset = {
              to: 0,
              from: 0,
            };
          }
        }
        if (message == "options-edges-endpointoffset-from") {
          this.localOptions.edges.endPointOffset.from = parseFloat(value);
        }
        if (message == "options-edges-endpointoffset-to") {
          this.localOptions.edges.endPointOffset.to = parseFloat(value);
        }
      }
      if (accordionItem == "edges-chosen") {
        if (message == "update-checkbox-accordion") {
          if (!value) {
            if (
              (typeof this.localOptions.edges.chosen == "boolean" &&
                this.localOptions.edges.chosen == true) ||
              typeof this.localOptions.edges.chosen == "object"
            ) {
              this.chosenEnabled = false;
              this.accordion2Data[0].checkboxValue = false;
              this.awatingResponse.push("repaint_canvas_edges_chosen_false");
              this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
            }
          } else {
            if (
              typeof this.localOptions.edges.chosen == "undefined" ||
              (typeof this.localOptions.edges.chosen == "boolean" &&
                this.localOptions.edges.chosen == false)
            ) {
              this.chosenEnabled = true;
              this.accordion2Data[0].checkboxValue = true;
              this.awatingResponse.push("repaint_canvas_edges_chosen_true");
              this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
            }
          }
        }
        if (message == "options-edges-chosen-edge-function-value") {
          if (typeof this.localOptions.edges.chosen == "boolean") {
            this.localOptions.edges.chosen = {};
          }
          this.localOptions.edges.chosen.edge = value;
          this.$emit("canvas-key-change", true);
        }
        if (message == "options-edges-chosen-edge-function-dismiss") {
          if (typeof this.localOptions.edges.chosen == "object") {
            delete this.localOptions.edges.chosen.edge;
            this.$emit("options-has-changed", this.localOptions);
            this.$emit("canvas-key-change", true);
          }
        }
        if (message == "options-edges-chosen-label-function-value") {
          if (typeof this.localOptions.edges.chosen == "boolean") {
            this.localOptions.edges.chosen = {};
          }
          this.localOptions.edges.chosen.label = value;
          this.$emit("canvas-key-change", true);
        }
        if (message == "options-edges-chosen-label-function-dismiss") {
          if (typeof this.localOptions.edges.chosen == "object") {
            delete this.localOptions.edges.chosen.label;
            this.$emit("canvas-key-change", true);
          }
        }
      }
      if (accordionItem == "edges-color") {
        if (message == "update-checkbox-accordion") {
          if (!value) {
            if (
              typeof this.localOptions.edges.color == "string" ||
              typeof this.localOptions.edges.color == "object"
            ) {
              this.colorEnabled = false;
              this.accordion2Data[1].checkboxValue = false;
              this.awatingResponse.push("repaint_canvas_edges_color_false");
              this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
            }
          } else {
            if (typeof this.localOptions.edges.color == "undefined") {
              this.colorEnabled = true;
              this.accordion2Data[1].checkboxValue = true;
              this.localOptions.edges.color = "#2B7CE9";
            }
          }
        }
        if (message == "options-edges-color-string") {
          this.localOptions.edges.color = value;
        }
        if (message == "options-edges-color-object") {
          this.localOptions.edges.color = {
            inherit: "from",
          };
        }
        if (message == "options-edges-color-color") {
          this.localOptions.edges.color.color = value;
        }
        if (message == "options-edges-color-highlight") {
          this.localOptions.edges.color.highlight = value;
        }
        if (message == "options-edges-color-hover") {
          this.localOptions.edges.color.hover = value;
        }
        if (message == "options-edges-color-inherit") {
          if (value != false) {
            delete this.localOptions.edges.color.color;
            delete this.localOptions.edges.color.hover;
            delete this.localOptions.edges.color.highlight;
          }
          this.localOptions.edges.color.inherit = value;
        }
        if (message == "options-edges-color-opacity") {
          this.localOptions.edges.color.opacity = value;
        }
      }
      if (accordionItem == "edges-font") {
        if (message == "update-checkbox-accordion") {
          if (!value) {
            if (
              typeof this.localOptions.edges.font == "string" ||
              typeof this.localOptions.edges.font == "object"
            ) {
              this.fontEnabled = false;
              this.accordion3Data[0].checkboxValue = false;
              this.awatingResponse.push("repaint_canvas_edges_font_false");
              this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
            }
          } else {
            if (typeof this.localOptions.edges.font == "undefined") {
              this.fontEnabled = true;
              this.accordion3Data[0].checkboxValue = true;
              this.localOptions.edges.font = "14px arial #343434";
            }
          }
        }
        if (message == "options-edges-font-string-value") {
          this.localOptions.edges.font = value;
        }
        if (message == "options-edges-font-object-sending") {
          this.localOptions.edges.font = {};
        }
        if (message == "options-edges-font-color") {
          this.localOptions.edges.font.color = value;
        }
        if (message == "options-edges-font-size") {
          this.localOptions.edges.font.size = value;
        }
        if (message == "options-edges-font-face") {
          this.localOptions.edges.font.face = value;
        }
        if (message == "options-edges-font-strokeWidth") {
          this.localOptions.edges.font.strokeWidth = parseFloat(value);
        }
        if (message == "options-edges-font-align") {
          this.localOptions.edges.font.align = value;
        }
        if (message == "options-edges-font-vadjust") {
          this.localOptions.edges.font.vadjust = value;
        }
        if (message == "options-edges-font-background-enabled") {
          if (value) {
            this.localOptions.edges.font.background = "";
          } else {
            if (typeof this.localOptions.edges.font.background != "undefined") {
              delete this.localOptions.edges.font.background;
            }
          }
        }
        if (message == "options-edges-font-background-color") {
          this.localOptions.edges.font.background = value;
        }
        if (message == "options-edges-font-strokeColor") {
          this.localOptions.edges.font.strokeColor = value;
        }
        if (message == "options-edges-font-multi-enabled") {
          if (value) this.localOptions.edges.font.multi = "html";
          else this.localOptions.edges.font.multi = false;
        }
        if (message == "options-edges-font-multi") {
          this.localOptions.edges.font.multi = value;
        }
        if (message == "update-checkbox-accordion-bold") {
          if (value) {
            this.localOptions.edges.font.bold = "14px arial black";
          } else {
            if (typeof this.localOptions.edges.font.bold != "undefined") {
              this.localOptions.edges.font.bold = {};
              delete this.localOptions.edges.bold;
            }
          }
        }
        if (message == "options-edges-font-string-bold") {
          this.localOptions.edges.font.bold = value;
        }
        if (message == "options-edges-font-object-sending-bold") {
          if (typeof value == "string") {
            this.localOptions.edges.font.bold = "14px arial black";
          } else {
            this.localOptions.edges.font.bold = value;
          }
        }
        if (message == "options-edges-font-color-bold") {
          this.localOptions.edges.font.bold.color = value;
        }
        if (message == "options-edges-font-size-bold") {
          this.localOptions.edges.font.bold.size = parseInt(value);
        }
        if (message == "options-edges-font-face-bold") {
          this.localOptions.edges.font.bold.face = value;
        }
        if (message == "options-edges-font-vadjust-bold") {
          this.localOptions.edges.font.bold.vadjust = parseInt(value);
        }

        if (message == "update-checkbox-accordion-boldital") {
          if (value) {
            this.localOptions.edges.font.boldital = "14px arial black";
          } else {
            if (typeof this.localOptions.edges.font.boldital != "undefined") {
              this.localOptions.edges.font.boldital = {};
              delete this.localOptions.edges.boldital;
            }
          }
        }
        if (message == "options-edges-font-string-boldital") {
          this.localOptions.edges.font.boldital = value;
        }
        if (message == "options-edges-font-object-sending-boldital") {
          if (typeof value == "string") {
            this.localOptions.edges.font.boldital = "14px arial black";
          } else {
            this.localOptions.edges.font.boldital = value;
          }
        }
        if (message == "options-edges-font-color-boldital") {
          this.localOptions.edges.font.boldital.color = value;
        }
        if (message == "options-edges-font-size-boldital") {
          this.localOptions.edges.font.boldital.size = parseInt(value);
        }
        if (message == "options-edges-font-face-boldital") {
          this.localOptions.edges.font.boldital.face = value;
        }
        if (message == "options-edges-font-vadjust-boldital") {
          this.localOptions.edges.font.boldital.vadjust = parseInt(value);
        }

        if (message == "update-checkbox-accordion-ital") {
          if (value) {
            this.localOptions.edges.font.ital = "14px arial black";
          } else {
            if (typeof this.localOptions.edges.font.ital != "undefined") {
              this.localOptions.edges.font.ital = {};
              delete this.localOptions.edges.ital;
            }
          }
        }
        if (message == "options-edges-font-string-ital") {
          this.localOptions.edges.font.ital = value;
        }
        if (message == "options-edges-font-object-sending-ital") {
          if (typeof value == "string") {
            this.localOptions.edges.font.ital = "14px arial black";
          } else {
            this.localOptions.edges.font.ital = value;
          }
        }
        if (message == "options-edges-font-color-ital") {
          this.localOptions.edges.font.ital.color = value;
        }
        if (message == "options-edges-font-size-ital") {
          this.localOptions.edges.font.ital.size = parseInt(value);
        }
        if (message == "options-edges-font-face-ital") {
          this.localOptions.edges.font.ital.face = value;
        }
        if (message == "options-edges-font-vadjust-ital") {
          this.localOptions.edges.font.ital.vadjust = parseInt(value);
        }

        if (message == "update-checkbox-accordion-mono") {
          if (value) {
            this.localOptions.edges.font.mono = "16px Courier black";
          } else {
            if (typeof this.localOptions.edges.font.mono != "undefined") {
              this.localOptions.edges.font.mono = {};
              delete this.localOptions.edges.mono;
            }
          }
        }
        if (message == "options-edges-font-string-mono") {
          this.localOptions.edges.font.mono = value;
        }
        if (message == "options-edges-font-object-sending-mono") {
          if (typeof value == "string") {
            this.localOptions.edges.font.mono = "16px Courier black";
          } else {
            this.localOptions.edges.font.mono = value;
          }
        }
        if (message == "options-edges-font-color-mono") {
          this.localOptions.edges.font.mono.color = value;
        }
        if (message == "options-edges-font-size-mono") {
          this.localOptions.edges.font.mono.size = parseInt(value);
        }
        if (message == "options-edges-font-face-mono") {
          this.localOptions.edges.font.mono.face = value;
        }
        if (message == "options-edges-font-vadjust-mono") {
          this.localOptions.edges.font.mono.vadjust = parseInt(value);
        }
      }
      if (accordionItem == "edges-scaling") {
        if (message == "update-checkbox-accordion") {
          if (!value) {
            if (typeof this.localOptions.edges.scaling == "object") {
              this.scalingEnabled = false;
              this.accordion4Data[0].checkboxValue = false;
              this.awatingResponse.push("repaint_canvas_edges_scaling_false");
              this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
            }
          } else {
            if (typeof this.localOptions.edges.scaling == "undefined") {
              this.scalingEnabled = true;
              this.accordion4Data[0].checkboxValue = true;
              this.localOptions.edges.scaling = {};
            }
          }
        }
        if (message == "options-edges-scaling-min") {
          this.localOptions.edges.scaling.min = parseInt(value);
        }
        if (message == "options-edges-scaling-max") {
          this.localOptions.edges.scaling.max = parseInt(value);
        }
        if (message == "update-checkbox-accordion-scalingLabel") {
          this.localOptions.edges.scaling.label = value;
          this.$emit("canvas-key-change", true);
        }
        if (message == "options-edges-scaling-object-sending-scalingLabel") {
          this.localOptions.edges.scaling.label = { enabled: value };
        }
        if (message == "options-edges-scaling-object-min-scalingLabel") {
          this.localOptions.edges.scaling.label.min = parseInt(value);
        }
        if (message == "options-edges-scaling-object-max-scalingLabel") {
          this.localOptions.edges.scaling.label.max = parseInt(value);
        }
        if (message == "options-edges-scaling-object-maxVisible-scalingLabel") {
          this.localOptions.edges.scaling.label.maxVisible = parseInt(value);
        }
        if (message == "options-edges-scaling-object-drawThreshold-scalingLabel") {
          this.localOptions.edges.scaling.label.drawThreshold = parseInt(value);
        }
        if (message == "options-edges-scaling-customScalingFunction") {
          if (value != null) {
            this.localOptions.edges.scaling.customScalingFunction = value;
          } else {
            this.localOptions.edges.scaling.customScalingFunction = () => {};
            delete this.localOptions.edges.scaling.customScalingFunction;
          }
        }
        if (message == "repaint-component") {
          this.$emit("canvas-key-change", true);
        }
      }
      if (accordionItem == "edges-selfReference") {
        if (typeof this.localOptions.edges.selfReference != "object") {
          this.localOptions.edges.selfReference = {};
        }
        if (message == "options-edges-selfReference-size") {
          this.localOptions.edges.selfReference.size = parseInt(value);
        }
        if (message == "options-edges-selfReference-angle") {
          this.localOptions.edges.selfReference.angle = parseFloat(value);
        }
        if (message == "options-edges-selfReference-render-behind-the-node") {
          this.localOptions.edges.selfReference.renderBehindTheNode = value;
        }
      }
      if (accordionItem == "edges-shadow") {
        if (message == "update-checkbox-accordion") {
          if (!value) {
            if (
              typeof this.localOptions.edges.shadow == "object" ||
              typeof this.localOptions.edges.shadow == "boolean"
            ) {
              this.shadowEnabled = false;
              this.accordion5Data[1].checkboxValue = false;
              this.localOptions.edges.shadow = false;
            }
          } else {
            if (typeof this.localOptions.edges.shadow == "undefined") {
              this.shadowEnabled = true;
              this.accordion5Data[1].checkboxValue = true;
              this.localOptions.edges.shadow = true;
            }
          }
        }
        if (message == "options-edges-shadow-object-enabled") {
          if (value) {
            if (typeof this.localOptions.edges.shadow == "boolean") {
              this.localOptions.edges.shadow = { enabled: true };
            }
          } else {
            this.localOptions.edges.shadow = true;
            this.$emit("canvas-key-change", true);
          }
        }
        if (message == "options-edges-shadow-color") {
          this.localOptions.edges.shadow.color = value;
        }
        if (message == "options-edges-shadow-size") {
          this.localOptions.edges.shadow.size = parseInt(value);
        }
        if (message == "options-edges-shadow-x") {
          this.localOptions.edges.shadow.x = parseInt(value);
        }
        if (message == "options-edges-shadow-y") {
          this.localOptions.edges.shadow.y = parseInt(value);
        }
      }
      if (accordionItem == "edges-smooth") {
        if (message == "update-checkbox-accordion") {
          if (!value) {
            if (
              typeof this.localOptions.edges.smooth == "object" ||
              typeof this.localOptions.edges.smooth == "boolean"
            ) {
              this.smoothEnabled = false;
              this.accordion5Data[2].checkboxValue = false;
              this.localOptions.edges.smooth = false;
            }
          } else {
            if (
              typeof this.localOptions.edges.smooth == "undefined" ||
              typeof this.localOptions.edges.smooth == "boolean"
            ) {
              this.smoothEnabled = true;
              this.accordion5Data[2].checkboxValue = true;
              this.localOptions.edges.smooth = true;
            }
          }
        }
        if (message == "options-edges-smooth-enabled") {
          if (value) {
            if (typeof this.localOptions.edges.smooth != "object") {
              this.localOptions.edges.smooth = { enabled: true };
            }
          } else {
            this.localOptions.edges.smooth = false;
            this.localOptions.edges.smooth = true;
          }
        }
        if (message == "options-edges-smooth-type") {
          this.localOptions.edges.smooth.type = value;
        }
        if (message == "options-edges-smooth-forceDirection") {
          this.localOptions.edges.smooth.forceDirection = value;
        }
        if (message == "options-edges-smooth-roundness") {
          this.localOptions.edges.smooth.roundness = parseFloat(value);
        }
        if (message == "repaint-component") {
          this.$emit("canvas-key-change", true);
        }
      }
      if (accordionItem == "edges-widthConstraint") {
        if (message == "update-checkbox-accordion") {
          if (!value) {
            if (
              typeof this.localOptions.edges.widthConstraint == "number" ||
              typeof this.localOptions.edges.widthConstraint == "boolean"
            ) {
              this.widhtConstraintEnabled = false;
              this.accordion5Data[3].checkboxValue = false;
              this.awatingResponse.push("repaint_canvas_edges_widthConstraint_false");
              this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
            }
          } else {
            if (typeof this.localOptions.edges.widthConstraint == "undefined") {
              this.widhtConstraintEnabled = true;
              this.accordion5Data[3].checkboxValue = true;
              this.localOptions.edges.widthConstraint = true;
            }
          }
        }
        if (message == "options-edges-widthConstraint-value") {
          this.localOptions.edges.widthConstraint = parseInt(value);
        }
      }
      if (message == "send-toast") {
        this.$emit("send-toast", accordionItem);
      }
    },
    checkEdgesExists() {
      if (typeof this.localOptions.edges != "object") {
        this.localOptions.edges = {};
      }
    },
    emitArrowStriketrhough: function (value) {
      this.arrowStrikethrough = value;
      this.localOptions.edges.arrowStrikethrough = value;
    },
    emitDashes: function (value) {
      this.dashes = value;
      this.localOptions.edges.dashes = value;
    },
    emitDashesArray: function (value) {
      this.dashesArraySending = value;
      if (value == true) {
        this.localOptions.edges.dashes = this.dashesArray;
      } else {
        this.localOptions.edges.dashes = true;
      }
    },
    chngeEdgesDashesOf0: function (value) {
      this.dashesArray[0] = parseInt(value);
      this.localOptions.edges.dashes = this.dashesArray;
    },
    chngeEdgesDashesOf1: function (value) {
      this.dashesArray[1] = parseInt(value);
      this.localOptions.edges.dashes = this.dashesArray;
    },
    emitHidden: function (value) {
      this.hidden = value;
      this.localOptions.edges.hidden = value;
    },
    emitHoverWidth: function (value) {
      this.hoverWidthFunctionSending = value;
      if (!value) {
        this.localOptions.edges.hoverWidth = this.hoverWidthValue;
      } else {
        import("./scripts/edgesHoverWidthFunction.js?raw")
          .then((res) => res.default)
          .then((t) => {
            this.hoverWidthFunctionText = t;
            this.hoverWidthFunction = eval(t);

            if (this.hoverWidthFunction != null) {
              this.localOptions.edges.hoverWidth = this.hoverWidthFunction;
              this.$emit("send-toast", {
                toastTitle: "Cuidado",
                toastIcon: "fa-circle-exclamation",
                toastBody:
                  "O input de Javascript pode levar a erros e a travamentos da aplicação. Use com cautela!",
                toastClasses: " bg-danger text-black",
              });
            }
          });
      }
    },
    changeHoverWidth: function (value) {
      this.hoverWidthValue = value;
      this.options.edges.hoverWidth = parseFloat(value);
    },
    enableHoverWidthFunction: function (value) {
      this.hoverWidthFunctionSwitchValue = value;
      this.hoverWidthFunctionInputEnabled = value;
    },
    sendEdgesHoverWidthFunction: function () {
      this.hoverWidthFunction = eval(this.hoverWidthFunctionText);
      this.options.edges.hoverWidth = this.hoverWidthFunction;
      this.hoverWidthFunctionInputEnabled = false;
      this.hoverWidthFunctionSwitchValue = false;
    },
    changeHoverWidthFunction: function (value) {
      this.hoverWidthFunctionText = value;
    },
    emitLabelHighlightBold: function (value) {
      this.optionsEdgesLabelHighlightBold = value;
      this.options.edges.labelHighlightBold = value;
    },
    emitLength: function (value) {
      if (!isNaN(value) && !isNaN(parseFloat(value))) {
        this.length = value;
        this.options.edges.length = value;
      } else {
        this.length = undefined;
        this.options.edges.length = undefined;
      }
    },
    emitPhysics: function (value) {
      this.physics = value;
      this.options.edges.physics = value;
    },
    toggleSelectionWidth: function (value) {
      this.selectionWidthFunctionSending = value;
      if (value) {
        if (
          this.selectionWidthValueFunctionText == "" &&
          this.selectionWidthValueFunction == null
        ) {
          import("./scripts/edgesSelectedWidthFunction.js?raw")
            .then((res) => res.default)
            .then((t) => {
              this.selectionWidthValueFunctionText = t;
              this.selectionWidthValueFunction = eval(t);

              if (this.selectionWidthValueFunction != null) {
                this.options.edges.selectionWidth = this.selectionWidthValueFunction;
                this.$emit("send-toast", {
                  toastTitle: "Cuidado",
                  toastIcon: "fa-circle-exclamation",
                  toastBody:
                    "O input de Javascript pode levar a erros e a travamentos da aplicação. Use com cautela!",
                  toastClasses: " bg-danger text-black",
                });
              }
            });
        } else {
          this.selectionWidthValueFunction = eval(this.selectionWidthValueFunctionText);
          this.options.edges.selectionWidth = this.selectionWidthValueFunction;
        }
      } else {
        this.options.edges.selectionWidth = this.selectionWidthValue;
      }
    },
    changeSelectionWidthValue: function (value) {
      this.selectionWidthValue = parseFloat(value);
      this.options.edges.selectionWidth = parseFloat(value);
    },
    enableSelectionWidthFunction: function (value) {
      this.selectionWidthSwitchValue = value;
    },
    sendEdgesSelectionWidthFunction: function () {
      this.selectionWidthSwitchValue = false;
      this.selectionWidthValueFunction = eval(this.selectionWidthValueFunctionText);
      this.options.edges.selectionWidth = this.selectionWidthValueFunction;
    },
    changeSelectionWidthFunctionValue: function (value) {
      this.selectionWidthValueFunctionText = value;
    },
    openBsModal: function (title, body) {
      this.$emit("open-bs-modal", title, body);
    },
  },
  components: { SwitchWithInfo, InputGroupWithLabel, InputTextArea },
  emits: ["canvas-key-change", "open-bs-modal", "options-has-changed", "send-toast"],
};
</script>
