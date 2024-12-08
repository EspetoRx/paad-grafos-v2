<template>
    <p v-if="!checkboxValue" class="m-0">Ative para começar</p>
    <SwitchWithInfo
        v-if="checkboxValue" :switchId="'options-edges-font-object-sending'"
        :switchInitialValue="objectSendingValue" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Edges.Font (Toggle string/object sending) - Alterne entre envio de string e de objeto para o campo.'"
        :switchLabelEnabled="true" :switchLabelValue="(objectSendingValue) ? 'Enviando objeto' : 'Enviando string'"
        @checkbox-status-changed="changeObjectSending"
    ></SwitchWithInfo>
    <InputGroupWithLabel
    v-if="checkboxValue && !objectSendingValue" :prepend="'Texto'" :append="true" :inputType="'text'"
        :tooltip="'Options.Edges.Font (String) - Esse objeto define os detalhes do rótulo. Um versão curta também é suportada na forma ' +
                    ' \'size face color\' por exemplo \'14px arial red\'.' "
        :inputInitialValue="fontString" @input-value-change="changeFontString"
    ></InputGroupWithLabel>
    <LabelWithTooltip
        v-if="checkboxValue && objectSendingValue" 
        :labelValue="'Cor da fonte do rótulo'" 
        :tooltip="'Options.Edges.Font.Color'"
        :forId="'options-edges-font-color'" 
        :hasSwitch="false"
    ></LabelWithTooltip>
    <InputColorPicker v-if="checkboxValue && objectSendingValue" :colorPickerId="'options-edges-font-color'"
        :colorPickerDefaultColor="fontColor"
        :tooltip="'Options.Edges.Font.Color - A cor do rótulo.'"
        @update-color="changeFontColor"
    ></InputColorPicker>
    <InputRange v-if="checkboxValue && objectSendingValue" :inputId="'size-range'" :isLabelEnabled="true" :min="0" :max="100" :step="0.1" :initialValue="fontSize"
            :labelValue="'Tamanho da fonte:'" :tooltip="'Options.Edges.Font.Size - O tamanho da fonte.'"
            @update-value-from-range-input="changeFontSize"
    ></InputRange>
    <LabelWithTooltip
        v-if="checkboxValue && objectSendingValue" 
        :labelValue="'Face'" 
        :tooltip="'Options.Edges.Font.Face - O estilo da fonte do texto.'"
        :forId="'options-edges-font-face'" 
        :hasSwitch="false"
    ></LabelWithTooltip>
    <InputSelect :selectId="'options-edges-font-face'" v-if="checkboxValue && objectSendingValue" :options="[
            { value: 'arial', label: 'Arial', selected: true },
            { value: 'verdana', label: 'Verdana', selected: false },
            { value: 'tahoma', label: 'Tahoma', selected: false },
            { value: 'Trebuchet MS', label: 'Trebuchet MS', selected: false },
            { value: 'Times New Roman', label: 'Times New Roman', selected: false },
            { value: 'Georgia', label: 'Georgia', selected: false },
            { value: 'Geramond', label: 'Geramond', selected: false },
            { value: 'Courier New', label: 'Courier New', selected: false },
            { value: 'Brush Script MT', label: 'Brush Script MT', selected: false }
        ]" @update-selection="updateFace"></InputSelect>
    <SwitchWithInfo
        v-if="checkboxValue && objectSendingValue" :switchId="'options-edges-font-background-enabled'"
        :switchInitialValue="fontBackgroundEnabled" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Edges.Font.Background (Toggle color/undefined sending) - Alterne entre envio de Cor e de undefined para o campo.'"
        :switchLabelEnabled="true" :switchLabelValue="(fontBackgroundEnabled) ? 'Enviando Cor para Background' : 'Enviando undefined para Background'"
        @checkbox-status-changed="changeBackgroundEnabled"
    ></SwitchWithInfo>
    <InputColorPicker v-if="checkboxValue && objectSendingValue && fontBackgroundEnabled" :colorPickerId="'options-edges-font-background-color'"
        :colorPickerDefaultColor="fontBackground"
        :tooltip="'Options.Edges.Font.Background - Quando não undefined mas sim uma string de cor, um retângulo de plano de fundo será desenhando atrás do rótulo na cor selecionada.'"
        @update-color="changeBackgroundColor"
    ></InputColorPicker>
    <InputRange v-if="checkboxValue && objectSendingValue" :inputId="'strokeWidth-range'" :isLabelEnabled="true" :min="0" :max="100" :step="0.1" :initialValue="fontStrokeWidth"
            :labelValue="'Tamanho da borda do rótulo:'" :tooltip="'Options.Edges.Font.StrokeWidth - O tamanho da borda do rótulo.'"
            @update-value-from-range-input="changeStrokeWidth"
    ></InputRange>
    <InputGroupWithLabel v-if="checkboxValue && objectSendingValue && fontStrokeWidth != 0" :prepend="'Cor da borda:'" :append="true" :inputType="'color'" 
        :tooltip="'Options.Edges.Font.StrokeColor - A cor da borda.'"
        :inputInitialValue="fontStrokeColor" @input-value-change="changeFontStrokeColor"
        :classes="'p-0 h-auto'"
    ></InputGroupWithLabel>
    <LabelWithTooltip
        v-if="checkboxValue && objectSendingValue" 
        :labelValue="'Alinhamento'" 
        :tooltip="'Options.Edges.Font.Align - O Opções possíveis: \'horizontal\',\'superior\',\'meio\',\'inferior\'. O alinhamento determina como a etiqueta será alinhada na borda. O valor padrão horizontal alinha o rótulo horizontalmente, independentemente da orientação da borda. Quando for escolhida uma opção diferente de horizontal, a etiqueta se alinhará de acordo com a borda..'"
        :forId="'options-edges-font-align'" 
        :hasSwitch="false"
    ></LabelWithTooltip>
    <InputSelect :selectId="'options-edges-font-align'" v-if="checkboxValue && objectSendingValue" :options="[
            { value: 'horizontal', label: 'Horizontal', selected: true },
            { value: 'top', label: 'Superior', selected: false },
            { value: 'middle', label: 'Meio', selected: false },
            { value: 'bottom', label: 'Inferior', selected: false }
        ]" @update-selection="changeAlign"></InputSelect>
    <InputRange v-if="checkboxValue && objectSendingValue" :inputId="'vadjust-range'" :isLabelEnabled="true" :min="-100" :max="100" :step="0.1" :initialValue="fontVadjust"
            :labelValue="'Ajustamento vertical:'" :tooltip="'Options.Edges.Font.Vadjust - Uma correção específica da fonte para o posicionamento vertical da fonte base no texto do rótulo. (Positivo está baixo.).'"
            @update-value-from-range-input="changeVadjust"
    ></InputRange>
    <SwitchWithInfo
        v-if="checkboxValue && objectSendingValue" :switchId="'options-edges-font-multi-enabled'"
        :switchInitialValue="fontMultiEnabled" :switchTooltipEnabled="true"
        :switchTooltip="'Options.Edges.Font.Multi (Toggle boolean/string sending) - Alterne entre envio de Booleano e de String para o campo.'"
        :switchLabelEnabled="true" :switchLabelValue="(fontMultiEnabled) ? 'Enviando Hypertexto verdadeiro' : 'Enviando Hypertexto falso'"
        @checkbox-status-changed="changeMultiEnabled"
    ></SwitchWithInfo>
    <LabelWithTooltip
        v-if="checkboxValue && objectSendingValue && fontMultiEnabled" 
        :labelValue="'Estilo de Hypertexto'" 
        :tooltip="'Options.Edges.Font.Multi - O Opções possíveis: \'html\',\'markdown\',\'md\'. Se for falso, o rótulo será tratado como texto puro desenhado com a fonte base. Se verdadeiro ou \'html\' o rótulo pode ser multifonte, com negrito, itálico e marcação de código, interpretado como html. Se o valor for \'markdown\' ou \'md\' o rótulo poderá ser multifonte, com negrito, itálico e marcação de código, interpretado como markdown. As fontes negrito, itálico, negrito-itálico e monoespaçada podem ser configuradas nas propriedades font.bold, font.ital, font.boldital e font.mono, respectivamente.'"
        :forId="'options-edges-font-multi'" 
        :hasSwitch="false"
    ></LabelWithTooltip>
    <InputSelect :selectId="'options-edges-font-multi'" v-if="checkboxValue && objectSendingValue && fontMultiEnabled" :options="[
            { value: 'html', label: 'HTML', selected: true },
            { value: 'markdown', label: 'Markdown', selected: false },
            { value: 'md', label: 'Markdown (MD Option)', selected: false }
        ]" @update-selection="changeMulti"></InputSelect>
    <div class="border p-1" v-if="checkboxValue && objectSendingValue && fontMultiEnabled">
        <Accordion :accordionData="accordionData" @message="message" @open-bs-modal="openBsModalFunction" :bsModalReturnValue="bsModalReturnValue"></Accordion>
    </div>
</template>
<script>
import InputColorPicker from '../Common/Inputs/InputColorPicker.vue';
import InputGroupWithLabel from '../Common/Inputs/InputGroupWithLabel.vue';
import LabelWithTooltip from '../Common/LabelWithTooltip.vue';
import SwitchWithInfo from '../Common/SwitchWithInfo.vue';
import InputSelect from '../Common/Inputs/InputSelect.vue';
import InputRange from '../Common/Inputs/InputRange.vue';
import Accordion from '../Common/Accordion/AccordionBase.vue';
export default {
    name: "Font Edge Accordion",
    props: [
        'checkboxValue',
        'openBsModal',
        'bsModalReturnValue'
    ],
    data(){
        return {
            fontString: "14px arial #343434",
            objectSendingValue: false,
            fontColor: "#343434",
            fontSize: "14",
            fontFace: "arial",
            fontBackgroundEnabled: false,
            fontBackground: "#ffffff",
            fontStrokeWidth: 2,
            fontStrokeColor: "#ffffff",
            fontAlign: 'horizontal',
            fontVadjust: "0",
            fontMultiEnabled: false,
            multi: false,
            accordionData: [],

        }
    },
    methods: {
        changeFontString: function(value) {
            this.fontString = value;
            this.$emit("message", "options-edges-font-string-value", value);
        },
        changeObjectSending: function(value) {
            this.objectSendingValue = value;
            this.$emit("message", "options-edges-font-object-sending", value)
        },
        changeFontColor: function(value) {
            this.fontColor = value;
            this.$emit("message", "options-edges-font-color", value);
        },
        changeFontSize: function(value) {
            if (!isNaN(value)) {
                this.fontSize = value
                this.$emit("message", "options-edges-font-size", value);
            }
        },
        updateFace: function(value) {
            this.fontFace = value;
            this.$emit("message", "options-edges-font-face", value);
        },
        changeBackgroundEnabled: function(value) {
            this.fontBackgroundEnabled = value;
            this.$emit("message", "options-edges-font-background-enabled", value);
        },
        changeBackgroundColor: function(value) {
            this.fontBackground = value;
            this.$emit("message", "options-edges-font-background-color", value);
        },
        changeStrokeWidth: function(value) {
            this.fontStrokeWidth = value;
            this.$emit("message", "options-edges-font-strokeWidth", value);
        },
        changeFontStrokeColor: function(value) {
            this.fontStrokeColor = value;
            this.$emit("message", "options-edges-font-strokeColor", value);
        },
        changeAlign: function(value) {
            this.fontAlign = value;
            this.$emit("message", "options-edges-font-align", value);
        },
        changeVadjust: function(value) {
            this.fontVadjust = value;
            this.$emit("message", "options-edges-font-vadjust", value);
        },
        changeMultiEnabled: function(value) {
            this.fontMultiEnabled = value;
            this.multi = value;
            this.$emit("message", 'options-edges-font-multi-enabled', value);
        },
        changeMulti: function(value) {
            this.multi = value;
            this.$emit("message", "options-edges-font-multi", value);
        },
        message: function(message, accordionType, value) {
            this.$emit("message", message+"-"+accordionType, value);
        },
        openBsModalFunction: function(title, body) {
            this.$emit("open-bs-modal", title, body);
        }
    },
    components: {
        InputGroupWithLabel,
        SwitchWithInfo,
        LabelWithTooltip,
        InputColorPicker,
        InputSelect,
        InputRange,
        Accordion
    },
    mounted() {
        console.log("Font Edge Accordion Mounted");
        this.accordionData.push(
            {
                id: 'bold', 
                title: 'Negrito', 
                body: 'FontEdgeBaseComponent',
                tooltip: "Options.Edges.Font.Bold - Altere informações de negrito dos rótulos."
            },
            {
                id: 'ital', 
                title: 'Itálico', 
                body: 'FontEdgeBaseComponent',
                tooltip: "Options.Edges.Font.Ital - Altere informações de itálico dos rótulos."
            },
            {
                id: 'boldital', 
                title: 'Negrito e Itálico', 
                body: 'FontEdgeBaseComponent',
                tooltip: "Options.Edges.Font.Boldital - Altere informações de itálico e negrito dos rótulos."
            },
            {
                id: 'mono', 
                title: 'Monoespaçadas', 
                body: 'FontEdgeBaseComponent',
                tooltip: "Options.Edges.Font.Mono - Altere informações de itálico e negrito dos rótulos."
            },
        );
    },
    emits: ["message", 'open-bs-modal']
}
</script>