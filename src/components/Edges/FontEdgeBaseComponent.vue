<template>
    <p v-if="!checkboxValue" class="m-0">Ative para começar</p>
    <LabelWithTooltip v-if="checkboxValue" :labelValue="(sendObject) ? 'Enviando objeto' : 'Enviando String'"
        :tooltip="'Options.Edges.Font.' + capitalizeFirstLetter(arrowType) + ' (Toggle String/Object Sending) - Alterne entre o envio de string e de objeto.'"
        :forId="'font-string-sending-' + arrowType" :hasSwitch="true" :switchId="'font-string-sending-' + arrowType"
        :switchTooltip="'Options.Edges.Font.' + capitalizeFirstLetter(arrowType) + ' (Toggle String/Object Sending) - Alterne entre o envio de string e de objeto.'"
        :switchDisabled="false" :switchInitialValue="sendObject" :switchLabelEnabled="false"
        :switchTooltipEnabled="true" @checkbox-status-changed="sendObjectValue"></LabelWithTooltip>
    <InputGroupWithLabel v-if="checkboxValue && !sendObject" :prepend="'Texto:'" :append="true" :inputType="'text'"
        :tooltip="'Options.Edges.Font.' + capitalizeFirstLetter(arrowType) + ' (String) - Esse objeto define os detalhes do rótulo . Um versão curta também é suportada na forma ' +
            ' \'size face color\' por exemplo \'14px arial red\'.'" :inputInitialValue="fontString"
        @input-value-change="changeFontString"></InputGroupWithLabel>
    <InputGroupWithLabel v-if="checkboxValue && sendObject" :prepend="'Cor:'" :append="true" :inputType="'color'"
        :tooltip="'Options.Edges.Font.' + capitalizeFirstLetter(arrowType) + '.Color - A cor da letra modificada.'"
        :inputInitialValue="fontColor" @input-value-change="changeFontColor" :classes="'p-0 h-auto'">
    </InputGroupWithLabel>
    <InputRange v-if="checkboxValue && sendObject" :inputId="'size-range-' + arrowType" :isLabelEnabled="true" :min="0"
        :max="100" :step="0.1" :initialValue="fontSize" :labelValue="'Tamanho do rótulo modificado:'"
        :tooltip="'Options.Edges.Font.' + capitalizeFirstLetter(arrowType) + '.Size - O tamanho do rótulo modificado.'"
        @update-value-from-range-input="changeFontSize"></InputRange>
    <LabelWithTooltip v-if="checkboxValue && sendObject" :labelValue="'Face'"
        :tooltip="'Options.Edges.Font.' + capitalizeFirstLetter(arrowType) + '.Face - O estilo da fonte do texto.'"
        :forId="'options-edges-font-face-' + arrowType" :hasSwitch="false"></LabelWithTooltip>
    <InputSelect :selectId="'options-edges-font-face-' + arrowType" v-if="checkboxValue && sendObject"
        :options="options" @update-selection="changeFace"></InputSelect>
    <InputGroupWithLabel v-if="checkboxValue && sendObject" :prepend="'Modificador:'" :append="true" :inputType="'text'"
        :tooltip="'Options.Edges.Font.' + capitalizeFirstLetter(arrowType) + '.Mod - Uma string adicionada à face e ao tamanho ao determinar a fonte em negrito no texto do rótulo.'"
        :inputInitialValue="fontMod" @input-value-change="changeFontMod">
    </InputGroupWithLabel>
    <InputRange v-if="checkboxValue && sendObject" :inputId="'vadjust-range-' + arrowType" :isLabelEnabled="true" :min="-100"
        :max="100" :step="0.1" :initialValue="fontVadjust" :labelValue="'Ajuste vertical:'"
        :tooltip="'Options.Edges.Font.' + capitalizeFirstLetter(arrowType) + '.Vadjust - Uma correção específica da fonte para o posicionamento vertical da fonte em negrito no texto do rótulo. (Positivo está inativo.) O padrão é valign da fonte base.'"
        @update-value-from-range-input="changeVadjust"></InputRange>
</template>
<script>
import InputGroupWithLabel from '../Common/Inputs/InputGroupWithLabel.vue';
import LabelWithTooltip from '../Common/LabelWithTooltip.vue';
import InputRange from '../Common/Inputs/InputRange.vue';
import InputSelect from '../Common/Inputs/InputSelect.vue';
export default {
    name: "Font Edge Base Component",
    props: [
        'checkboxValue',
        'openBsModal',
        'bsModalReturnValue',
        'arrowType',
    ],
    data() {
        return {
            options: [
                { value: 'arial', label: 'Arial', selected: ((this.arrowType != "mono") ? true : false) },
                { value: 'verdana', label: 'Verdana', selected: false },
                { value: 'tahoma', label: 'Tahoma', selected: false },
                { value: 'Trebuchet MS', label: 'Trebuchet MS', selected: false },
                { value: 'Times New Roman', label: 'Times New Roman', selected: false },
                { value: 'Georgia', label: 'Georgia', selected: false },
                { value: 'Geramond', label: 'Geramond', selected: false },
                { value: 'Courier New', label: 'Courier New', selected: ((this.arrowType == "mono") ? true : false) },
                { value: 'Brush Script MT', label: 'Brush Script MT', selected: false }
            ],
            sendObject: false,
            fontString: (this.arrowType == 'mono') ? "16px Courier New black" : "14px arial black",
            fontColor: "#000000",
            fontSize: (this.arrowType == 'mono') ? '16' : '14',
            fontFace: (this.arrowType == 'mono') ? 'Courier New' : 'arial',
            fontMod: (this.arrowType == "bold" || this.arrowType == "boldital")?"bold":'',
            fontVadjust: "0"
        }
    },
    watch: {
    },
    methods: {
        capitalizeFirstLetter: function (val) {
            return String(val).charAt(0).toUpperCase() + String(val).slice(1);
        },
        sendObjectValue: function (val) {
            this.sendObject = val;
            if (val) {
                this.$emit("message", "options-edges-font-object-sending", this.arrowType, {});
            } else {
                this.$emit("message", "options-edges-font-object-sending", this.arrowType, "");
            }
        },
        changeFontString: function (val) {
            this.fontString = val;
            this.$emit("message", "options-edges-font-string", this.arrowType, val);
        },
        changeFontColor: function (val) {
            this.fontColor = val;
            this.$emit("message", "options-edges-font-color", this.arrowType, val);
        },
        changeFontSize: function (val) {
            this.fontSize = val;
            this.$emit("message", "options-edges-font-size", this.arrowType, val);
        },
        changeFace: function (val) {
            this.fontFace = val;
            this.$emit("message", "options-edges-font-face", this.arrowType, val);
        },
        changeFontMod: function (val) {
            this.fontMod = val;
            this.$emit("message", "options-edges-font-mod", this.arrowType, val);
        },
        changeVadjust: function(val) {
            this.fontVadjust = val;
            this.$emit("message", "options-edges-font-vadjust", this.arrowType, val);
        }
    },
    components: {
        LabelWithTooltip,
        InputGroupWithLabel,
        InputRange,
        InputSelect
    },
    mounted() {
        console.log("Font Edge Base Component Mounted.");
    },
    emits: ['message', 'open-bs-modal']
}
</script>