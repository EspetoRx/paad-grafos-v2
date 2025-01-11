<template>
  <p v-if="!checkboxValue">Ative para começar</p>
  <LabelWithTooltip
    v-if="checkboxValue"
    :labelValue="`Enviando ${
      sendingFunction == false ? ' booleano verdadeiro' : ' função'
    }`"
    :tooltip="
      'Options.Manipulation.AddNode (Toggle boolean/function) - Alterne o envio de booleano e função para o Adicionar Vértice. ' +
      `Quando você fornece um booleano, você apenas alterna o botão 'adicionar vértice' na GUI do sistema de manipulação. A falta de função de manipulação pode afetar a API ao usar os métodos. Quando uma função é fornecida, ela será chamada quando o usuário clicar na tela no modo 'addNode'. Essa função receberá duas variáveis: as propriedades do nó que pode ser criado e uma função de retorno de chamada. Se você chamar a função de retorno de chamada com as propriedades do novo nó, o nó será adicionado.`
    "
    :forId="'options-manipulation-addNode-toggle'"
    :hasSwitch="true"
    :switchId="'options-manipulation-addNode-toggle'"
    :switchDisabled="false"
    :switchInitialValue="sendingFunction"
    :switchLabelEnabled="false"
    :switchTooltipEnabled="false"
    @checkbox-status-changed="changeManipulationObjectSending"
  ></LabelWithTooltip>
  <InputTextArea
    v-if="sendingFunction"
    :inputId="'options.manipulation.addNodeFunction'"
    :inputEnabled="addNodeFunctionEditingEnabled"
    :inputInitialValue="addNodeFunctionText"
    :inputPlaceholder="'//JS para adicionar vértices'"
    :inputRows="5"
    :isLabelEnabled="true"
    :labelValue="''"
    :tooltip="'Options.Manipulation.addNode Function Sending - Ao fornecer um booleano, você apenas alterna o botão \'adicionar vértice\' na GUI do sistema de manipulação. A falta de função de manipulação pode afetar a API ao usar os métodos. Quando uma função é fornecida, ela será chamada quando o usuário clicar na tela no modo \'addNode\'. Esta função receberá duas variáveis: as propriedades do vértice que podem ser criadas e uma função de retorno de chamada. Se você chamar a função de retorno de chamada com as propriedades do novo vértice, o vértice será adicionado.'"
    :hasSwitch="true"
    :switchId="'options.manipulation.addNodeFunction.switch'"
    :switchTooltip="'Options.Manipulation.addNode Function Editing Enabled - Ative ou desative a edição da função de Adição de vértices.'"
    :switchDisabled="false"
    :switchInitialValue="addNodeFunctionEditingEnabled"
    :switchLabelEnabled="true"
    :switchLabelValue="'Habilitar edição da função'"
    @input-value-change="changeAddNodeFunction"
    @checkbox-value-change="changeAddNodeFunctionEditing"
  ></InputTextArea>
  <button type="button" class="btn btn-primary btn-sm form-control mt-2"
  	v-if="addNodeFunctionEditingEnabled" @click.prevent="sendUpdateNodeFunction">
    <i class="fa-solid fa-right-to-bracket"></i> Enviar Função
  </button>
</template>
<script>
import LabelWithTooltip from "../Common/LabelWithTooltip.vue";
import InputTextArea from "../Common/Inputs/InputTextArea.vue";
export default {
  name: "Add Node Base Component",
  props: ["checkboxValue", "bsModalReturnValue", "accordionType", "options"],
  data() {
    return {
      sendingFunction: false,
      addNodeFunctionEditingEnabled: false,
      addNodeFunction: null,
      addNodeFunctionText: "",
    };
  },
  methods: {
    changeManipulationObjectSending: function (value) {
      this.sendingFunction = value;
      if (!value) {
        this.$emit(
          "message",
          "options-manipulation-addNode-booelan",
          this.accordionType,
          true
        );
      } else if (this.addNodeFunctionText != "") {
        this.addNodeFunction = eval(this.addNodeFunctionText);
      } else {
        import("./Scripts/AddNodeHelpScript.js?raw")
          .then((res) => res.default)
          .then((t) => {
            this.sendUpdateNodeFunction(t);
          });
      }
    },
    changeAddNodeFunction: function (value) {
		this.addNodeFunctionText = value;
	},
    changeAddNodeFunctionEditing: function (value) {
      this.addNodeFunctionEditingEnabled = value;
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
	sendUpdateNodeFunction: function(t) {
		if (t != undefined && typeof t == "string") {
			this.addNodeFunctionText = t;
			this.addNodeFunction = eval(t);
		} else {
			this.addNodeFunction = eval(this.addNodeFunctionText);
		}
		if (this.addNodeFunction != null) {
			this.$emit(
			"message",
			"options-manipulation-addNode-function",
			this.accordionType,
			this.addNodeFunction
			);
		}
		this.addNodeFunctionEditingEnabled = false;
	}
  },
  mounted() {
    console.log("Add Node Base Component Mounted");
  },
  components: {
    LabelWithTooltip,
    InputTextArea,
  },
  emits: ["message", "open-bs-modal", "send-toast"],
};
</script>
