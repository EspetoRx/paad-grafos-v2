<template>
    <p v-if="!checkboxValue" class="m-0">Habilite para começar</p>
    <!-- <InputGroupWithLabel v-if="checkboxValue" :prepend="'Mínimo: '" :append="true" :inputType="'number'" :min="1" :max="100" :step="1"
        :tooltip="'Options.Edges.Scaling.Min - Se as arestas tiverem um valor, suas larguras serão determinadas pelo valor, pela função de escala e pelos valores mínimo e máximo. O valor mínimo é o valor mínimo permitido.'"
        :inputInitialValue="min" @input-value-change="changeMin" 
    ></InputGroupWithLabel> -->
    <div v-if="checkboxValue" class="alert alert-danger mt-1 p-1 mb-0"><i class="fa-solid fa-circle-exclamation"></i>
        Cuidado: Alterações redesenham o canvas!</div>
    <InputRange v-if="checkboxValue" :inputId="'min-range'" :isLabelEnabled="true" :min="1" :max="max" :step="1"
        :initialValue="min" :labelValue="'Mínimo'"
        :tooltip="'Options.Edges.Scaling.Min - Se as arestas tiverem um valor, suas larguras serão determinadas pelo valor, pela função de escala e pelos valores mínimo e máximo. O valor mínimo é o valor mínimo permitido.'"
        @update-value-from-range-input="changeMin"></InputRange>
    <InputRange v-if="checkboxValue" :inputId="'max-range'" :isLabelEnabled="true" :min="min" :max="100" :step="1"
        :initialValue="max" :labelValue="'Máximo'"
        :tooltip="'Options.Edges.Scaling.Max - Esta é a largura máxima permitida quando as arestas são dimensionadas usando a opção de valor.'"
        @update-value-from-range-input="changeMax"></InputRange>
    <Accordion v-if="checkboxValue" :accordionData="accordionData" @message="message"
        @open-bs-modal="openBsModalFunction" :bsModalReturnValue="bsModalReturnValue"></Accordion>
    <InputTextArea
        v-if="checkboxValue"
        :inputId="'input-textarea-scaling-function'"
        :inputEnabled="functionEnabled"
        :inputInitialValue="functionText"
        :inputPlaceholder="'//JS code for scalin function'"
        :inputRows="10"
        :isLabelEnabled="true"
        :labelValue="'Função customizada de dimensionamento'"
        :tooltip="'Options.Edges.Scaling.customScalingFunction - '"
        :hasSwitch="true"
        :switchId="'input-textarea-scaling-function-switch'"
        :switchTooltip="'Se arestas possuem campos de valor, esta função determina como o tamanho dos arestas é dimensionado com base em seus valores. A função padrão está colocadada. A função recebe o valor mínimo do conjunto, o valor máximo, a soma total de todos os valores e por fim o valor do nó ou aresta em que atua. Ele deve retornar um valor entre 0 e 1. Observação: maxWidth e minWidth são os valores scaling.max e scaling.min fornecidos nas opções.'"
        :switchDisabled="false"
        :switchInitialValue="functionEnabled"
        :switchLabelEnabled="false"
        @checkbox-value-change="checkboxValueChange"
        @input-value-change="inputValueChange"
    ></InputTextArea>
    <button type="button" class="btn btn-primary form-control mt-2" v-if="functionEnabled" @click.prevent="changeFunction">Atualizar função (Redesenha canvas)</button>
</template>
<script>
import InputGroupWithLabel from '../Common/Inputs/InputGroupWithLabel.vue';
import InputRange from '../Common/Inputs/InputRange.vue';
import Accordion from '../Common/Accordion/AccordionBase.vue';
import InputTextArea from '../Common/Inputs/InputTextArea.vue';
export default {
    name: "Scaling Edge Component",
    props: [
        'checkboxValue',
        'openBsModal',
        'bsModalReturnValue'
    ],
    data() {
        return {
            min: 1,
            max: 15,
            accordionData: [
                {
                    id: 'scalingLabel',
                    title: 'Label',
                    body: 'ScalingLabelEdgeBaseComponent',
                    tooltip: "Options.Edges.Scaling.Label (Toggle true/false) - Altere informações de dimensionamento dos rótulos."
                }
            ],
            functionEnabled: false,
            functionText: "",
            function: null
        }
    },
    methods: {
        changeMin: function (val) {
            this.min = val;
            this.$emit("message", "options-edges-scaling-min", val);
            this.$emit("message", 'repaint-component');
        },
        changeMax: function (value) {
            this.max = value;
            this.$emit("message", 'options-edges-scaling-max', value);
            this.$emit("message", 'repaint-component');
        },
        changeFunction: function () {
            if (this.functionEnabled && this.functionText == "") {
                import('./scripts/edgesScalingFunction.js?raw')
                    .then(res => res.default)
                    .then((t) => {
                        this.functionText = t;
                        this.function = eval(t);

                        if (this.edgesFunction != null) {
                            this.$emit("message", "send-toast", {
                                toastTitle: "Cuidado",
                                toastIcon: "fa-circle-exclamation",
                                toastBody: "O input de Javascript pode levar a erros e a travamentos da aplicação. Use com cautela!",
                                toastClasses: " bg-danger text-black"
                            });
                        }

                        this.$emit('message', 'options-edges-scaling-customScalingFunction', this.function);
                        this.$emit('message', 'repaint-component');
                    });
            } else if (this.functionEnabled && this.functionText != "") {
                this.function = eval(this.functionText);
                this.$emit('message', 'options-edges-scaling-customScalingFunction', this.function);
                this.$emit('message', 'repaint-component');
            }
        },
        message: function (message, accordionType, value) {
            if (message != "repaint-component") {
                this.$emit("message", message + "-" + accordionType, value);
            } else if (message != "update-checkbox-accordion") {
                this.$emit("message", message + "-" + accordionType, value);
                this.$emit("message", "repaint-component");
            } else {
                this.$emit("message", "repaint-component");
            }

        },
        openBsModalFunction: function (title, body) {
            this.$emit("open-bs-modal", title, body);
        },
        inputValueChange: function(value) {
            this.functionText = value;
        },
        checkboxValueChange: function(value) {
            this.functionEnabled = value;
            this.changeFunction();
        }
    },
    mounted() {
        console.log("Scaling Edge Componenet Mounted");
    },
    components: {
        InputGroupWithLabel,
        InputRange,
        Accordion,
        InputTextArea
    },
    emits: ["message", "open-bs-modal"]
}
</script>