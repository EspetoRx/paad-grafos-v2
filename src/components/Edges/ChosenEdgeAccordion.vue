<template>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-danger" v-if="!checkboxValue">
    <i class="fa-solid fa-circle-info me-2"></i> Ative "Escolhido" para começar. Ativar
    repinta canvas.
  </p>
  <p class="mb-0 p-1 ps-2 mt-1 alert alert-danger" v-if="checkboxValue">
    <i class="fa-solid fa-circle-info me-2"></i> Desativar "Escolhido" repinta canvas
  </p>
  <InputTextArea
    v-if="checkboxValue"
    :inputId="'input-function-chosen-edges-edge'"
    :inputEnabled="edgesFunctionChosen"
    :inputInitialValue="edgesFunctionText"
    :inputPlaceholder="'//JS de atualização de aresta'"
    :inputRows="10"
    :isLabelEnabled="true"
    :labelValue="'Enviar função de atualização das arestas'"
    :tooltip="
      'Options.Edges.Chosen.Edge Function - Qualquer um dos argumentos recebidos pode ser usado para ' +
      'determinar mudanças características. Se uma propriedade não for atribuída especificamente pela função ' +
      'fornecida, ela permanecerá inalterada. Uma função específica pode ser atribuída a cada aresta ' +
      'específica em suas opções, ou a todas as opções de arestas do grafo.'
    "
    :hasSwitch="true"
    :switchId="'input-function-chosen-edges-switch-edge'"
    :switchTooltip="'Options.Edges.Chosen.Edge Toggle between function sending and boolean sending. - Alterne entre o envio de booleano e função.'"
    :switchDisabled="!checkboxValue"
    :switchInitialValue="edgesFunctionChosen"
    :switchLabelEnabled="false"
    @checkbox-value-change="enableEdgeFunction"
    @input-value-change="updateEdgeFunctionText"
  ></InputTextArea>
  <button
    type="button"
    class="btn btn-primary form-control"
    v-if="checkboxValue && edgesFunctionChosen"
    @click.prevent="sendNewFunction"
  >
    Enviar função (Repinta Canvas)
  </button>
  <InputTextArea
    v-if="checkboxValue"
    :inputId="'input-function-chosen-edges-label'"
    :inputEnabled="labelFunctionChosen"
    :inputInitialValue="labelFunctionText"
    :inputPlaceholder="'//JS de atualização de aresta'"
    :inputRows="10"
    :isLabelEnabled="true"
    :labelValue="'Enviar função de atualização dos rótulos'"
    :tooltip="
      'Options.Edges.Chosen.Label Function - Qualquer um dos argumentos recebidos pode ser usado para ' +
      'determinar mudanças características. Se uma propriedade não for atribuída especificamente pela função ' +
      'fornecida, ela permanecerá inalterada. Uma função específica pode ser atribuída a cada aresta ' +
      'específica em suas opções, ou a todas as opções de arestas do grafo.'
    "
    :hasSwitch="true"
    :switchId="'input-function-chosen-edges-switch-label'"
    :switchTooltip="'Options.Edges.Chosen.Label Toggle between function sending and boolean sending. - Alterne entre o envio de booleano e função.'"
    :switchDisabled="!checkboxValue"
    :switchInitialValue="labelFunctionChosen"
    :switchLabelEnabled="false"
    @checkbox-value-change="enableLabelFunction"
    @input-value-change="updateLabelFunctionText"
  ></InputTextArea>
  <button
    type="button"
    class="btn btn-primary form-control"
    v-if="checkboxValue && labelFunctionChosen"
    @click.prevent="sendNewLabelFunction"
  >
    Enviar função (Repinta Canvas)
  </button>
</template>
<script>
import InputTextArea from "../Common/Inputs/InputTextArea.vue";
export default {
  name: "Chosen Edge Accordion",
  props: [
    "checkboxValue",
    "openBsModa",
    "bsModalReturnValue",
    "accordionType",
    "options",
  ],
  data() {
    return {
      edgesFunctionChosen: false,
      edgesFunctionText: "",
      edgesFunction: null,
      edgesFunctionAwaitingCanvas: false,
      awatingResponse: [],
      labelFunctionChosen: false,
      labelFunctionText: "",
      labelFunction: null,
      labelFunctionAwaitingCanvas: false,
    };
  },
  mounted() {
    console.log("Chosen Edge Accordion Mounted");
  },
  methods: {
    sendNewFunction: function () {
      this.edgesFunction = eval(this.edgesFunctionText);
      this.$emit(
        "message",
        "options-edges-chosen-edge-function-value",
        this.accordionType,
        this.edgesFunction
      );
    },
    sendNewLabelFunction: function () {
      this.labelFunction = eval(this.labelFunctionText);
      this.$emit(
        "message",
        "options-edges-chosen-label-function-value",
        this.accordionType,
        this.labelFunction
      );
    },
    updateEdgeFunctionText: function (value) {
      this.edgesFunctionText = value;
    },
    updateLabelFunctionText: function (value) {
      this.labelFunctionText = value;
    },
    enableEdgeFunction: function (newValue) {
      this.edgesFunctionChosen = newValue;

      if (!this.edgesFunctionAwaitingCanvas) {
        this.awatingResponse.push("repaint_canvas_edges_chosen_edge");
        this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
        this.edgesFunctionAwaitingCanvas = true;
      }
    },
    enableLabelFunction: function (newValue) {
      this.labelFunctionChosen = newValue;

      if (!this.labelFunctionAwaitingCanvas) {
        this.awatingResponse.push("repaint_canvas_edges_chosen_label");
        this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
        this.labelFunctionAwaitingCanvas = true;
      }
    },
  },
  watch: {
    bsModalReturnValue: function (newValue, oldValue) {
      if (newValue == null || this.awatingResponse.length == 0) return;
      if (this.awatingResponse.includes("repaint_canvas_edges_chosen_edge", 0)) {
        //this.$emit("message", "options-edges-chosen-edge-function", true);
        if (this.edgesFunctionChosen && newValue && this.edgesFunctionText == "") {
          import("./scripts/edgesChosenFunction.js?raw")
            .then((res) => res.default)
            .then((t) => {
              this.edgesFunctionText = t;
              this.edgesFunction = eval(t);

              if (this.edgesFunction != null) {
                this.$emit("message", "send-toast", {
                  toastTitle: "Cuidado",
                  toastIcon: "fa-circle-exclamation",
                  toastBody:
                    "O input de Javascript pode levar a erros e a travamentos da aplicação. Use com cautela!",
                  toastClasses: " bg-danger text-black",
                });
              }

              this.$emit(
                "message",
                "options-edges-chosen-edge-function-value",
                this.accordionType,
                this.edgesFunction
              );

              setTimeout(() => (this.edgesFunctionAwaitingCanvas = false), 200);
            });
        } else if (newValue && this.edgesFunctionChosen && this.edgesFunctionText != "") {
          this.edgesFunction = eval(this.edgesFunctionText);
          this.$emit(
            "message",
            "options-edges-chosen-edge-function-value",
            this.accordionType,
            this.edgesFunction
          );
          setTimeout(() => (this.edgesFunctionAwaitingCanvas = false), 200);
        } else if (!this.edgesFunctionChosen){
          this.edgesFunction = null;
          this.edgesFunctionText = "";
          this.$emit(
            "message",
            "options-edges-chosen-edge-function-dismiss",
            this.accordionType,
            this.edgesFunction
          );
          setTimeout(() => (this.edgesFunctionAwaitingCanvas = false), 200);
        } else if (!newValue) {
          this.edgesFunctionChosen = false;
          setTimeout(() => (this.edgesFunctionAwaitingCanvas = false), 200);
        }
      }
      if (this.awatingResponse.includes("repaint_canvas_edges_chosen_label", 0)) {
        if (this.labelFunctionChosen && newValue && this.labelFunctionText == "") {
          import("./scripts/labelsChosenFunction.js?raw")
            .then((res) => res.default)
            .then((t) => {
              this.labelFunctionText = t;
              this.labelFunction = eval(t);

              if (this.labelFunction != null) {
                this.$emit("message", "send-toast", {
                  toastTitle: "Cuidado",
                  toastIcon: "fa-circle-exclamation",
                  toastBody:
                    "O input de Javascript pode levar a erros e a travamentos da aplicação. Use com cautela!",
                  toastClasses: " bg-danger text-black",
                });
              }

              this.$emit(
                "message",
                "options-edges-chosen-label-function-value",
                this.accordionType,
                this.labelFunction
              );

              setTimeout(() => (this.labelFunctionAwaitingCanvas = false), 200);
            });
        } else if (newValue && this.labelFunctionChosen && this.labelFunctionText != "") {
          this.labelFunction = eval(this.labelFunctionText);
          this.$emit(
            "message",
            "options-edges-chosen-label-function-value",
            this.accordionType,
            this.labelFunction
          );
          setTimeout(() => (this.labelFunctionAwaitingCanvas = false), 200);
        } else if (!this.labelFunctionChosen) {
          this.labelFunction = null;
          this.labelFunctionText = "";
          this.$emit(
                "message",
                "options-edges-chosen-label-function-dismiss",
                this.accordionType,
                this.labelFunction
              );

              setTimeout(() => (this.labelFunctionAwaitingCanvas = false), 200);
        } else if (!newValue) {
          this.labelFunctionChosen = false;
          setTimeout(() => (this.labelFunctionAwaitingCanvas = false), 200);
        }
      }
    },
    options: {
      handler: function (newValue, oldValue) {
        if ("edges" in newValue && typeof newValue.edges == "object") {
          if (typeof newValue.edges.chosen == "object") {
            if (typeof newValue.edges.chosen.edge == "function") {
              this.edgesFunction = newValue.edges.chosen.edge;
              this.edgesFunctionChosen = true;
              this.edgesFunctionText = newValue.edges.chosen.edge.toString();
            } else if (typeof newValue.edges.chosen.edge != "function") {
              this.edgesFunctionChosen = false;
            }
            if (typeof newValue.edges.chosen.label == "function") {
              this.labelFunction = newValue.edges.chosen.label;
              this.labelFunctionChosen = true;
              this.labelFunctionText = newValue.edges.chosen.label.toString();
            } else if (typeof newValue.edges.chosen.label != "function") {
              this.labelFunctionChosen = false;
            }
          }
        }
      },
      deep: true,
    },
  },
  components: {
    InputTextArea,
  },
  emits: ["message", "open-bs-modal"],
};
</script>
