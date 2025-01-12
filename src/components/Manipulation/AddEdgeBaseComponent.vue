<template>
  <p v-if="!checkboxValue">Ative para começar</p>
  <LabelWithTooltip
    v-if="checkboxValue"
    :labelValue="`Enviando ${
      sendingFunction == false ? ' booleano verdadeiro' : ' função'
    }`"
    :tooltip="
      'Options.Manipulation.AddEdge (Toggle boolean/function) - Alterne o envio de booleano e função para o Adicionar Aresta. ' +
      `Se for booleano, alterne a disponibilidade do botão 'addEdge' na GUI, a API por meio dos métodos ainda funcionará, exceto (obviamente) que não haverá função de manipulador. Quando uma função é fornecida, ela será chamada quando o usuário arrastar a nova borda de um nó para o próximo no modo 'addEdge'. Esta função receberá duas variáveis: as propriedades da borda que podem ser criadas e uma função de retorno de chamada. Se você chamar a função de retorno de chamada com as propriedades da nova borda, a borda será adicionada.`
    "
    :forId="'options-manipulation-addEdge-toggle'"
    :hasSwitch="true"
    :switchId="'options-manipulation-addEdge-toggle'"
    :switchDisabled="false"
    :switchInitialValue="sendingFunction"
    :switchLabelEnabled="false"
    :switchTooltipEnabled="false"
    @checkbox-status-changed="changeManipulationObjectSending"
  ></LabelWithTooltip>
  <InputTextArea
    v-if="sendingFunction"
    :inputId="'options.manipulation.addEdgeFunction'"
    :inputEnabled="addEdgeFunctionEditingEnabled"
    :inputInitialValue="addEdgeFunctionText"
    :inputPlaceholder="'//JS para adicionar arestas'"
    :inputRows="5"
    :isLabelEnabled="true"
    :labelValue="''"
    :tooltip="'Options.Manipulation.addEdge Function Sending - Ao fornecer um booleano, você apenas alterna o botão \'adicionar aresta\' na GUI do sistema de manipulação. A falta de função de manipulação pode afetar a API ao usar os métodos. Quando uma função é fornecida, ela será chamada quando o usuário clicar na tela no modo \'addEdge\'. Esta função receberá duas variáveis: as propriedades da aresta que podem ser criadas e uma função de retorno de chamada. Se você chamar a função de retorno de chamada com as propriedades da nova aresta, a aresta será adicionada.'"
    :hasSwitch="true"
    :switchId="'options.manipulation.addEdgeFunction.switch'"
    :switchTooltip="'Options.Manipulation.addEdge Function Editing Enabled - Ative ou desative a edição da função de Adição de arestas.'"
    :switchDisabled="false"
    :switchInitialValue="addEdgeFunctionEditingEnabled"
    :switchLabelEnabled="true"
    :switchLabelValue="'Habilitar edição da função'"
    @input-value-change="changeAddEdgeFunction"
    @checkbox-value-change="changeAddEdgeFunctionEditing"
  ></InputTextArea>
  <button type="button" class="btn btn-primary btn-sm form-control mt-2"
  	v-if="addEdgeFunctionEditingEnabled" @click.prevent="sendUpdateEdgeFunction">
    <i class="fa-solid fa-right-to-bracket"></i> Enviar Função
  </button>
</template>
<script>
import LabelWithTooltip from "../Common/LabelWithTooltip.vue";
import InputTextArea from "../Common/Inputs/InputTextArea.vue";
export default {
  name: "Add Edge Base Component",
  props: ["checkboxValue", "bsModalReturnValue", "accordionType", "options"],
  data() {
    return {
      sendingFunction: false,
      addEdgeFunctionEditingEnabled: false,
      addEdgeFunction: null,
      addEdgeFunctionText: "",
    };
  },
  methods: {
    changeManipulationObjectSending: function (value) {
      this.sendingFunction = value;
      if (!value) {
        this.$emit(
          "message",
          "options-manipulation-addEdge-booelan",
          this.accordionType,
          true
        );
      } else if (this.addEdgeFunctionText != "") {
        this.addEdgeFunction = eval(this.addEdgeFunctionText);
      } else {
        import("./Scripts/AddEdgeHelpScript.js?raw")
          .then((res) => res.default)
          .then((t) => {
            this.sendUpdateEdgeFunction(t);
          });
      }
    },
    changeAddEdgeFunction: function (value) {
		this.addEdgeFunctionText = value;
	},
    changeAddEdgeFunctionEditing: function (value) {
      this.addEdgeFunctionEditingEnabled = value;
      if (value) {
        this.$emit("message", "send-toast", {
          toastTitle: "Cuidado",
          toastIcon: "fa-circle-exclamation",
          toastBody:
            "O input de Javascript pode levar a erros e a travamentos da aplicação. Use com cautela!",
          toastClasses: " bg-danger text-black",
        });
      }
    },
    sendUpdateEdgeFunction: function(t) {
      if (t != undefined && typeof t == "string") {
        this.addEdgeFunctionText = t;
        this.addEdgeFunction = eval(t);
      } else {
        this.addEdgeFunction = eval(this.addEdgeFunctionText);
      }
      if (this.addEdgeFunction != null) {
        this.$emit(
        "message",
        "options-manipulation-addEdge-function",
        this.accordionType,
        this.addEdgeFunction
        );
      }
      this.addEdgeFunctionEditingEnabled = false;
    }
  },
  mounted() {
    console.log("Add Edge Base Component Mounted");
  },
  watch: {
    "options": function(newValue, oldValue) {
      if (newValue != null) {
        if (
          newValue.manipulation != null &&
          newValue.manipulation.addEdge != null &&
          typeof newValue.manipulation.addEdge == "function"
        ) {
          this.addEdgeFunction = this.options.manipulation.addEdge;
          this.addEdgeFunctionText = this.options.manipulation.addEdge;
          this.sendingFunction = true;
        }
      }
    }
  },
  components: {
    LabelWithTooltip,
    InputTextArea,
  },
  emits: ["message", "open-bs-modal", "send-toast"],
};
</script>
