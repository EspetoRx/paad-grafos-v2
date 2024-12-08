<template>
    <SwitchWithInfo
        :switchId="'height-constraint-object-enabled'"
        :switchDisabled="!this.checkboxValue"
        :switchInitialValue="this.heightConstraintObjectEnabled"
        :switchTooltipEnabled="true"
        :switchTooltip="'Toggle Options.Nodes.Font.HeightConstraint between number and object sending. - Alterne o envio de objeto ou de valor para o campo.'"
        :switchLabelEnabled="true"
        :switchLabelValue="(this.heightConstraintObjectEnabled)?'Enviando objeto para o campo.':'Enviando valor inteiro para o campo.'"
        @checkbox-status-changed="heightConstraintObjectEnableEvent"
    ></SwitchWithInfo>
    <InputRange
        :inputId="'height-constraint-range-value'"
        :isLabelEnabled="true"
        :min="0"
        :max="100"
        :step="1"
        :initialValue="this.heightConstraintIntegerValue"
        :labelValue="'Valor de constante de altura'"
        :tooltip="'Options.Nodes.Font.HeightConstraint (Value) - Modifique para alterar a constante de altura'"
        v-if="!this.heightConstraintObjectEnabled"
        :disabled="!this.checkboxValue"
        @update-value-from-range-input="updateHeightConstraintRangeValue"
    ></InputRange>
    <InputRange
        :inputId="'height-constraint-object-minimum'"
        :isLabelEnabled="true"
        :min="0"
        :max="100"
        :step="1"
        :initialValue="this.hCObjectMinimum"
        :labelValue="'Valor de constante de altura mínima'"
        :tooltip="'Options.Nodes.Font.HeightConstraint.Minimum - Se um número for especificado, o valor será usado como a altura mínima do vértice. A altura do vértice será definida como mínima se for menor que o valor.'"
        v-if="this.heightConstraintObjectEnabled"
        :disabled="!this.checkboxValue"
        @update-value-from-range-input="updateHeightConstraintObjectMinium"
    ></InputRange>
    <LabelWithTooltip
        :labelValue="'Alinhamento do rótulo na constante de altura'"
        :tooltip="'Os valores válidos são \'superior\', \'médio\' e \'inferior\'. Quando especificado, se a altura do texto da etiqueta for menor que o mínimo (incluindo quaisquer margens superiores ou inferiores), ela será deslocada verticalmente para a posição designada.'"
        :forId="'nodes-font-heightconstraint-align'"
        :hasSwitch="false"
        v-if="this.heightConstraintObjectEnabled"
    ></LabelWithTooltip>
    <InputSelect
        :selectId="'nodes-font-heightconstraint-align'"
        :options="[
            { value: 'top', label: 'Superior', selected: false },
            { value: 'middle', label: 'Medio', selected: true },
            { value: 'bottom', label: 'Inferior', selected: false },
        ]"
        :disabled="!this.checkboxValue"
        @update-selection="updateHeightConstraintObjectValign"
        v-if="this.heightConstraintObjectEnabled"
    ></InputSelect>
</template>
<script>
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';
import InputRange from '../Common/Inputs/InputRange.vue';
import InputSelect from '../Common/Inputs/InputSelect.vue';
import LabelWithTooltip from '../Common/LabelWithTooltip.vue';
export default{
    name: "Height Constraint Component",
    props: [
        'checkboxValue',
        'openBsModal',
        'bsModalReturnValue',
    ],
    components: {
        SwitchWithInfo,
        InputRange,
        InputSelect,
        LabelWithTooltip
    },
    data() {
        return {
            heightConstraintObjectEnabled: false,
            heightConstraintIntegerValue: 0,
            hCObjectMinimum: 0,
            hcObjectValign: 'middle'
        }
    },
    methods: {
        heightConstraintObjectEnableEvent: function(value) {
            this.heightConstraintObjectEnabled = value;
            this.$emit('message', 'height-constraint-object-enabled', value);
        },
        updateHeightConstraintRangeValue: function (value) {
            this.heightConstraintIntegerValue = parseInt(value);
            this.$emit('message', 'height-constraint-value', value);
        },
        updateHeightConstraintObjectMinium: function (value) {
            this.hCObjectMinimum = parseInt(value);
            this.$emit('message', 'height-constraint-object-minimum', value);
        },
        updateHeightConstraintObjectValign: function(value){
            this.hcObjectValign = value;
            this.$emit('message', 'height-constraint-object-valign', value);
        }
    },
    watch: {
        checkboxValue: function(newValue, oldValue) {
            if (newValue) {
                if (!this.heightConstraintObjectEnabled) {
                    this.updateHeightConstraintRangeValue(this.heightConstraintIntegerValue);
                } else {
                    this.updateHeightConstraintObjectMinium(this.hCObjectMinimum);
                    this.updateHeightConstraintObjectValign(this.hcObjectValign);
                }

            }
        },
        heightConstraintObjectEnabled: function(newValue, oldValue) {
            if (this.checkboxValue) {
                if (!newValue) {
                    this.updateHeightConstraintRangeValue(this.heightConstraintIntegerValue);
                } else {
                    this.updateHeightConstraintObjectMinium(this.hCObjectMinimum);
                    this.updateHeightConstraintObjectValign(this.hcObjectValign);
                }
            }
        }
    },
    emits: ["message", "open-bs-modal"]
}
</script>