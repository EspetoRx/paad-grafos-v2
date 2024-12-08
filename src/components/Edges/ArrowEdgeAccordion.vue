<template>
    <p class="mb-0" v-if="!checkboxValue">Ative para começar</p>
    <SwitchWithInfo v-if="checkboxValue" :switchId="'options-edges-arrows-object-sending'"
        :switchDisabled="!checkboxValue" :switchInitialValue="switchObjectEnabled" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Edges.Arrows (Toggle string/object sending) - Alterne entre envio de string e de objeto para o campo.'"
        :switchLabelEnabled="true" :switchLabelValue="(switchObjectEnabled) ? 'Enviando objeto' : 'Enviando string'"
        @checkbox-status-changed="changeObjectSending"></SwitchWithInfo>
    <InputGroupWithLabel v-if="checkboxValue && !switchObjectEnabled" :prepend="'Lista de setas'" :append="true" :inputType="'text'"
        :tooltip="'Options.Edges.Arrows (String) - Para desenhar uma seta com configurações padrão, uma string pode ser fornecida. Por ' +
            'exemplo: <code>arrows:\'to, from, middle\'</code> ou <code>\'to;from\'</code>' +
            ', qualquer combinação com qualquer símbolo separador está bem.'"
        :inputInitialValue="arrowsString" @input-value-change="changeArrowsString" :classes="(invalidArrowsString)?'is-invalid':''">
    </InputGroupWithLabel>
    <div class="border p-1" v-if="checkboxValue && switchObjectEnabled">
        <Accordion :accordionData="accordionData" @message="message" @open-bs-modal="openBsModal" :bsModalReturnValue="bsModalReturnValue"></Accordion>
    </div>
</template>
<script>
import InputGroupWithLabel from '../Common/Inputs/InputGroupWithLabel.vue';
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';
import Accordion from '../Common/Accordion/AccordionBase.vue';
export default {
    name: "Arrow Edge Accordion",
    props: {
        checkboxValue: Boolean,
        bsModalReturnValue: {}
    },
    data() {
        return {
            switchObjectEnabled: false,
            arrowsString: 'to',
            invalidArrowsString: false,
            arrowObject: {},
            accordionData: [],
            possibleValues: [
                'to',
                'middle',
                'from',
                'from, middle',
                'from, to',
                'from, middle, to',
                'middle, to',
                'from,middle',
                'from,to',
                'from,middle,to',
                'middle,to',
                'from;middle',
                'from;to',
                'from;middle;to',
                'middle;to'
            ],
        }
    },
    mounted() {
        console.log("Arrow Edge Accordion Component Mounted");
        this.accordionData.push(
            {
                id: 'from', 
                title: 'Setas De (From)', 
                body: 'ArrowsEdgeBaseComponent',
                tooltip: "Options.Edges.Arrows.From - Altere informações das setas de 'de'."
            },
            {
                id: 'middle', 
                title: 'Setas Ao Meio (Middle)', 
                body: 'ArrowsEdgeBaseComponent',
                tooltip: "Options.Edges.Arrows.Middle - Altere informações das setas de 'meio'."
            },
            {
                id: 'to', 
                title: 'Setas Para (To)', 
                body: 'ArrowsEdgeBaseComponent',
                tooltip: "Options.Edges.Arrows.To - Altere informações das setas de 'para'."
            },
        );
        
    },
    methods: {
        changeObjectSending: function (value) {
            this.switchObjectEnabled = value;
            if (value) {
                this.$emit('message', 'options-edges-arrows-disabled', false);
            }
        },
        changeArrowsString: function (value) {
            this.arrowsString = value;
            if (this.possibleValues.includes(value)) {
                this.$emit("message", "arrow-string-changed", value);
                this.invalidArrowsString = false;
            } else {
                this.invalidArrowsString = true;
            }
        },
        message: function(message, value) {
            this.$emit("message", message, value);
        },
        message: function(message, accordionItem, value) {
            if (message == 'update-checkbox-accordion') {
                this.$emit("message", 'options-edges-arrows-'+accordionItem+'-enabled', value);
            }
            if (message == 'toggle-image-height-enabled') {
                this.$emit("message", 'options-edges-arrows-'+accordionItem+'-image-height-enabled', value);
            }
            if (message == 'image-height-value') {
                this.$emit("message", 'options-edges-arrows-'+accordionItem+'-image-height-value', value);
            }
            if (message == 'toggle-image-width-enabled') {
                this.$emit("message", 'options-edges-arrows-'+accordionItem+'-image-width-enabled', value);
            }
            if (message == 'image-width-value') {
                this.$emit("message", 'options-edges-arrows-'+accordionItem+'-image-width-value', value);
            }
            if (message == 'scale-factor') {
                this.$emit("message", 'options-edges-arrows-'+accordionItem+'-scale-factor', value);
            }
            if (message == 'type') {
                this.$emit("message", 'options-edges-arrows-'+accordionItem+'-type', value);
            }
            if (message == 'src') {
                this.$emit("message", 'options-edges-arrows-'+accordionItem+'-src', value);
            }
        },
        openBsModal: function(title, body){
            this.$emit("open-bs-modal", title, body);
        }
    },
    components: {
        SwitchWithInfo,
        InputGroupWithLabel,
        Accordion
    },
    emits: ["message", "open-bs-modal"]
}
</script>