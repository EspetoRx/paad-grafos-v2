<template>
    <p v-if="!checkboxValue" class="m-0">Ative para começar</p>
    <InputTextArea v-if="checkboxValue" :inputId="'input-function-chosen-edges-edge'" :inputEnabled="edgesFunctionChosen"
        :inputInitialValue="edgesFunctionText" :inputPlaceholder="'//JS de atualização de aresta'" :inputRows="10"
        :isLabelEnabled="true" :labelValue="'Enviar função de atualização das arestas'" :tooltip="'Options.Edges.Chosen.Edge Function - Qualquer um dos argumentos recebidos pode ser usado para ' +
            'determinar mudanças características. Se uma propriedade não for atribuída especificamente pela função ' +
            'fornecida, ela permanecerá inalterada. Uma função específica pode ser atribuída a cada aresta ' +
            'específica em suas opções, ou a todas as opções de arestas do grafo.'" :hasSwitch="true"
        :switchId="'input-function-chosen-edges-switch-edge'"
        :switchTooltip="'Options.Edges.Chosen.Edge Toggle between function sending and boolean sending. - Alterne entre o envio de booleano e função.'"
        :switchDisabled="!checkboxValue" :switchInitialValue="edgesFunctionChosen" :switchLabelEnabled="false"
        @checkbox-value-change="enableEdgeFunction" @input-value-change="updateEdgeFunctionText"></InputTextArea>
    <button type="button" class="btn btn-primary form-control" v-if="checkboxValue && edgesFunctionChosen"
        @click.prevent="sendNewFunction">Enviar função (Repinta Canvas)</button>
    <InputTextArea v-if="checkboxValue" :inputId="'input-function-chosen-edges-label'" :inputEnabled="labelFunctionChosen"
        :inputInitialValue="labelFunctionText" :inputPlaceholder="'//JS de atualização de aresta'" :inputRows="10"
        :isLabelEnabled="true" :labelValue="'Enviar função de atualização dos rótulos'" :tooltip="'Options.Edges.Chosen.Label Function - Qualquer um dos argumentos recebidos pode ser usado para ' +
            'determinar mudanças características. Se uma propriedade não for atribuída especificamente pela função ' +
            'fornecida, ela permanecerá inalterada. Uma função específica pode ser atribuída a cada aresta ' +
            'específica em suas opções, ou a todas as opções de arestas do grafo.'" :hasSwitch="true"
        :switchId="'input-function-chosen-edges-switch-label'"
        :switchTooltip="'Options.Edges.Chosen.Label Toggle between function sending and boolean sending. - Alterne entre o envio de booleano e função.'"
        :switchDisabled="!checkboxValue" :switchInitialValue="labelFunctionChosen" :switchLabelEnabled="false"
        @checkbox-value-change="enableLabelFunction" @input-value-change="updateLabelFunctionText"></InputTextArea>
    <button type="button" class="btn btn-primary form-control" v-if="checkboxValue && labelFunctionChosen"
        @click.prevent="sendNewLabelFunction">Enviar função (Repinta Canvas)</button>
</template>
<script>
import InputTextArea from '../Common/Inputs/InputTextArea.vue';
export default {
    name: "Chosen Edge Accordion",
    props: [
        'checkboxValue',
        'openBsModa',
        'bsModalReturnValue'
    ],
    data() {
        return {
            edgesFunctionChosen: false,
            edgesFunctionText: "",
            edgesFunction: null,
            awatingResponse: [],
            labelFunctionChosen: false,
            labelFunctionText: "",
            labelFunction: null
        }
    },
    mounted() {
        console.log("Chosen Edge Accordion Mounted");
    },
    methods: {
        sendNewFunction: function () {
            this.edgesFunction = eval(this.edgesFunctionText);
            this.$emit("message", "options-edges-chosen-edge-function-value", this.edgesFunction);
        },
        sendNewLabelFunction: function () {
            this.labelFunction = eval(this.labelFunctionText);
            this.$emit("message", "options-edges-chosen-label-function-value", this.labelFunction);
        },
        updateEdgeFunctionText: function (value) {
            this.edgesFunctionText = value;
        },
        updateLabelFunctionText: function(value) {
            this.labelFunctionText = value;
        },
        enableEdgeFunction: function (newValue) {
            this.edgesFunctionChosen = newValue;

            if (newValue) {
                this.awatingResponse.push("repaint_canvas_edges_chosen_edge");
                this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
            } else if (!newValue) {
                this.awatingResponse.push("repaint_canvas_edges_chosen_edge");
                this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas");
            }
        },
        enableLabelFunction: function (newValue) {
            this.labelFunctionChosen = newValue;

            if (newValue) {
                this.awatingResponse.push("repaint_canvas_edges_chosen_label");
                this.$emit("open-bs-modal", "Repaint canvas?", "RepaintCanvas");
            } else {
                this.awatingResponse.push("repaint_canvas_edges_chosen_label");
                this.$emit("open-bs-modal", "Repintar o canvas?", "RepaintCanvas")
            }
        }
    },
    watch: {
        bsModalReturnValue: function (newValue, oldValue) {
            if (newValue == null || this.awatingResponse.length == 0) return;
            if (this.awatingResponse.includes("repaint_canvas_edges_chosen_edge", 0)) {
                this.$emit('message', 'options-edges-chosen-edge-function', true);
                if (this.edgesFunctionChosen && newValue && this.edgesFunctionText == "") {
                    import('./scripts/edgesChosenFunction.js?raw')
                        .then(res => res.default)
                        .then((t) => {
                            this.edgesFunctionText = t;
                            this.edgesFunction = eval(t);

                            if (this.edgesFunction != null) {
                                this.$emit("message", "send-toast", {
                                    toastTitle: "Cuidado",
                                    toastIcon: "fa-circle-exclamation",
                                    toastBody: "O input de Javascript pode levar a erros e a travamentos da aplicação. Use com cautela!",
                                    toastClasses: " bg-danger text-black"
                                });
                            }

                            this.$emit('message', 'options-edges-chosen-edge-function-value', this.edgesFunction);
                        });
                } else if (this.edgesFunctionChosen && this.edgesFunctionText != "") {
                    this.edgesFunction = eval(this.edgesFunctionText);
                    this.$emit('message', 'options-edges-chosen-edge-function-value', this.edgesFunction);
                }
            }
            if (this.awatingResponse.includes("repaint_canvas_edges_chosen_label", 0)) {
                this.$emit('message', 'options-edges-chosen-label-function', true);
                if (this.labelFunctionChosen && newValue && this.labelFunctionText == "") {
                    import('./scripts/labelsChosenFunction.js?raw')
                        .then(res => res.default)
                        .then((t) => {
                            this.labelFunctionText = t;
                            this.labelFunction = eval(t);

                            if (this.labelFunction != null) {
                                this.$emit("message", "send-toast", {
                                    toastTitle: "Cuidado",
                                    toastIcon: "fa-circle-exclamation",
                                    toastBody: "O input de Javascript pode levar a erros e a travamentos da aplicação. Use com cautela!",
                                    toastClasses: " bg-danger text-black"
                                });
                            }

                            this.$emit('message', 'options-edges-chosen-label-function-value', this.labelFunction);
                        });
                } else if (this.labelFunctionChosen && this.labelFunctionText != "") {
                    this.labelFunction = eval(this.labelFunctionText);
                    this.$emit('message', 'options-edges-chosen-label-function-value', this.labelFunction);
                }
            }
        }
    },
    components: {
        InputTextArea
    },
    emits: ['message', 'open-bs-modal']
}
</script>