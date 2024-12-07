<template>
    <p class="mt-1 mb-1" v-if="!checkboxValue">Ative para enviar</p>
    <SwitchWithInfo v-if="checkboxValue" :switchId="'options-nodes-scaling-label'" :switchDisabled="labelDisabled"
        :switchInitialValue="labelValue" :switchTooltipEnabled="true"
        :switchTooltip="'Optons.Nodes.Sacaling.Label - Isso pode ser falso se o rótulo não puder ser dimensionado com o vértice. Se for verdadeiro, ele será dimensionado usando as configurações padrão. Para maior personalização, você pode fornecer um objeto.'"
        :switchLabelEnabled="true" :switchLabelValue="'Escalamento de rótulo ' + (labelValue ? 'ativo' : 'inativo')"
        @checkbox-status-changed="changeLabelEnabled"></SwitchWithInfo>
    <SwitchWithInfo v-if="checkboxValue && labelValue" :switchId="'options-nodes-scaling-label-object'"
        :switchDisabled="labelObjectDisabled" :switchInitialValue="labelObjectValue" :switchTooltipEnabled="true"
        :switchTooltip="'Optons.Nodes.Sacaling.Label (Object sending toggler) - Alterne entre o envio de booleano e o envio de objeto quando o booleano for true.'"
        :switchLabelEnabled="true" :switchLabelValue="'Enviando ' + (labelObjectValue ? 'objeto' : 'booleano')"
        @checkbox-status-changed="changeLabelObjectEnabled"></SwitchWithInfo>
    <div v-if="labelObjectValue" class="border p-1 mt-1 mb-2">
        <SwitchWithInfo v-if="checkboxValue && labelValue" :switchId="'options-nodes-scaling-label-object-enabled'"
            :switchDisabled="labelObjectEnabledDisabled" :switchInitialValue="labelObjectEnabledValue"
            :switchTooltipEnabled="true"
            :switchTooltip="'Optons.Nodes.Sacaling.Label.Enabled - Ative ou desative o dimensionamento do rótulo. Se esta opção não estiver definida, ela será definida como verdadeira se alguma das propriedades deste objeto estiver definida.'"
            :switchLabelEnabled="true"
            :switchLabelValue="'Envio de escala de rótulo ' + (labelObjectEnabledValue ? 'ativo' : 'desativado')"
            @checkbox-status-changed="changeLabelObjectEnabledValue"></SwitchWithInfo>
        <InputGroupWithLabel v-if="checkboxValue && labelValue" :disabled="!checkboxValue"
            :prepend="'Tamanho mínimo do róutulo:'" :append="true" :inputType="'number'"
            :tooltip="'Options.Nodes.Scaling.Label.Min - O tamanho mínimo da fonte usado para rótulos durante o dimensionamento.'"
            :inputInitialValue="labelObjectMinValue" @input-value-change="changeLabelObjectMin"></InputGroupWithLabel>
        <InputGroupWithLabel v-if="checkboxValue && labelValue" :disabled="!checkboxValue"
            :prepend="'Tamanho máximo do róutulo:'" :append="true" :inputType="'number'"
            :tooltip="'Options.Nodes.Scaling.Label.Max - O tamanho máximo da fonte usado para rótulos durante o dimensionamento.'"
            :inputInitialValue="labelObjectMaxValue" @input-value-change="changeLabelObjectMax" :min="1" :max="100"
            :step="1"></InputGroupWithLabel>
        <InputGroupWithLabel v-if="checkboxValue && labelValue" :disabled="!checkboxValue"
            :prepend="'Visibilidade máxima do róutulo:'" :append="true" :inputType="'number'"
            :tooltip="'Options.Nodes.Scaling.Label.maxVisibility - Ao aumentar o zoom, a fonte também fica maior. Você pode limitar o tamanho da fonte percebido usando esta opção. Se definido como 30, a fonte nunca parecerá maior que 30 com zoom de 100%.'"
            :inputInitialValue="labelObjectMaxVisibilityValue" @input-value-change="changeLabelObjectMaxVisibility"
            :min="1" :max="100" :step="1"></InputGroupWithLabel>
        <InputGroupWithLabel v-if="checkboxValue && labelValue" :disabled="!checkboxValue"
            :prepend="'Limite de desenho do róutulo:'" :append="true" :inputType="'number'"
            :tooltip="'Options.Nodes.Scaling.Label.drawTrheshold - Ao diminuir o zoom, a fonte ficará menor. Isso define um limite inferior para quando a fonte é desenhada. Ao usar o dimensionamento de fonte, você pode usar isso junto com maxVisible para mostrar primeiro rótulos de vértices importantes quando diminuir o zoom e mostrar apenas o restante ao aumentar o zoom.'"
            :inputInitialValue="labelObjectDrawThresholdValue" @input-value-change="changeLabelObjectDrawThreshold"
            :min="1" :max="100" :step="1"></InputGroupWithLabel>
    </div>
    <InputGroupWithLabel v-if="checkboxValue" :disabled="!checkboxValue" :prepend="'Valor mínimo:'" :append="true"
        :inputType="'number'"
        :tooltip="'Options.Nodes.Scaling.Min - Se os vértices tiverem um valor, seus tamanhos serão determinados pelo valor, pela função de escala e pelos valores mínimo e máximo. O valor mínimo é o valor mínimo permitido.'"
        :inputInitialValue="min" @input-value-change="minChange"></InputGroupWithLabel>
    <InputGroupWithLabel v-if="checkboxValue" :disabled="!checkboxValue" :prepend="'Valor máximo:'" :append="true"
        :inputType="'number'"
        :tooltip="'Options.Nodes.Scaling.Max - Este é o tamanho máximo permitido quando os vértices são dimensionados usando a opção de valor.'"
        :inputInitialValue="max" @input-value-change="maxChange"></InputGroupWithLabel>
    <InputTextArea v-if="checkboxValue && labelValue" :inputId="'options-nodes-scaling-customScalingFunction'"
        :inputEnabled="customScalingFunctionSwitchValue" :inputInitialValue="customScalingFunctionValue"
        :inputPlaceholder="'// JS CODE HERE'" :inputRows="10" :isLabelEnabled="true"
        :labelValue="'Função de escala customizada'"
        :tooltip="'Options.Nodes.Scaling.CustomScalingFunction - Se os vértices tiverem campos de valor, esta função determinará como o tamanho dos vértices será dimensionado com base em seus valores. A função padrão está abaixo. A função recebe o valor mínimo do conjunto, o valor máximo, a soma total de todos os valores e por fim o valor do nó ou aresta em que atua. Deve retornar um valor entre 0 e 1. Os vértices e arestas calculam seu tamanho conforme exemplo. Observação: maxSize e minSize são os valores scaling.max e scaling.min fornecidos nas opções.'"
        :hasSwitch="true" :switchId="'options-nodes-scaling-customScalingFunction-switch'"
        :switchTooltip="'Options.Nodes.Scaling.CustomScalingFunction - '" :switchDisabled="false"
        :switchInitialValue="customScalingFunctionSwitchValue" :switchLabelEnabled="false" :switchLabelValue="false"
        @checkbox-value-change="customScalingFunctionSwitchValueChange"
        @input-value-change="customScalingFunctionValueChange">
    </InputTextArea>
    <button v-if="checkboxValue && labelValue && customScalingFunctionSwitchValue"
        class="btn btn-primary form-control mt-2" @click.preven="updateCustomScalingFunction">Atualizar
        customização</button>
</template>
<script>
import InputGroupWithLabel from '../Common/Inputs/InputGroupWithLabel.vue';
import InputTextArea from '../Common/Inputs/InputTextArea.vue';
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';
export default {
    name: "Scaling Node Accordion",
    props: [
        'checkboxValue', 'bsModalReturnValue', 'openBsModal'
    ],
    data() {
        return {
            min: 10,
            max: 30,
            labelDisabled: false,
            labelValue: true,
            labelObjectValue: false,
            labelObjectDisabled: false,
            labelObjectEnabledValue: true,
            labelObjectEnabledDisabled: false,
            labelObjectMinValue: 14,
            labelObjectMaxValue: 30,
            labelObjectMaxVisibilityValue: 30,
            labelObjectDrawThresholdValue: 5,
            customScalingFunctionEnabled: true,
            customScalingFunctionSwitchValue: false,
            customScalingFunctionValue: null,
            customScalingFunctionFunction: null
        }
    },
    methods: {
        minChange: function (value) {
            this.min = value;
            this.$emit("message", "options-nodes-scaling-min", value);
        },
        maxChange: function (value) {
            this.max = value;
            this.$emit("message", "options-nodes-scaling-max", value);
        },
        changeLabelEnabled: function (value) {
            this.labelValue = value;
            this.$emit("message", "options-nodes-scaling-label", value);
        },
        changeLabelObjectEnabled: function (value) {
            this.labelObjectValue = value;
            this.$emit("message", "options-nodes-scaling-object", value);
        },
        changeLabelObjectEnabledValue: function (value) {
            this.labelObjectEnabledValue = value;
            this.$emit("message", "options-nodes-scaling-object-enabled", value);
        },
        changeLabelObjectMin: function (value) {
            this.labelObjectMinValue = value;
            this.$emit("message", "options-nodes-scaling-object-min", value);
        },
        changeLabelObjectMax: function (value) {
            this.labelObjectMaxValue = value;
            this.$emit("message", "options-nodes-scaling-object-max", value);
        },
        changeLabelObjectMaxVisibility: function (value) {
            this.labelObjectMaxVisibilityValue = value;
            this.$emit("message", "options-nodes-scaling-object-max-visibility", value);
        },
        changeLabelObjectDrawThreshold: function (value) {
            this.labelObjectDrawThresholdValue = value;
            this.$emit("message", "options-nodes-scaling-object-draw-threshold", value);
        },
        customScalingFunctionSwitchValueChange: function (value) {
            this.customScalingFunctionSwitchValue = value;
            if (value) {
                if (this.customScalingFunctionValue == null) {
                    import('./scripts/scalingCustomFunction.js?raw')
                        .then(res => res.default)
                        .then((t) => {
                            //const s = document.querySelector('#app');
                            this.customScalingFunctionValue = t;
                            this.customScalingFunctionFunction = eval(t);

                            if (this.customScalingFunctionFunction != null) {
                                this.$emit("message", "options-nodes-scaling-customScalingFunction", this.customScalingFunctionFunction);
                                this.$emit("message", "send-toast", {
                                    toastTitle: "Cuidado",
                                    toastIcon: "fa-circle-exclamation",
                                    toastBody: "O input de Javascript pode levar a erros e a travamentos da aplicação. Use com cautela! Você pode saber mais sobre essa opção <a class='text-white' href='https://visjs.github.io/vis-network/docs/network/nodes.html'>neste link</a>.",
                                    toastClasses: " bg-danger text-black"
                                });
                            }
                        });
                } else {
                    this.customScalingFunctionFunction = eval(this.customScalingFunctionValue);
                    this.$emit("message", "options-nodes-scaling-customScalingFunction", this.customScalingFunctionFunction);
                }
                    
            }
        },
        customScalingFunctionValueChange: function (value) {
            this.customScalingFunctionValue = value;
        },
        updateCustomScalingFunction: function () {
            try {
                this.customScalingFunctionFunction = eval(this.customScalingFunctionValue);
                this.customScalingFunctionSwitchValue = false;
                this.$emit("message", "options-nodes-scaling-customScalingFunction", this.customScalingFunctionFunction);
            } catch (ex) {
                this.$emit("message", "send-toast", {
                    toastTitle: "Erro",
                    toastIcon: "fa-circle-exclamation",
                    toastBody: "Algo aconteceu ao tentar salvar essa função de customScaling",
                    toastClasses: " bg-danger text-black"
                });
            }
        }
    },
    components: {
        InputGroupWithLabel,
        SwitchWithInfo,
        InputTextArea
    },
    emits: ['message', 'open-bs-modal']
}
</script>