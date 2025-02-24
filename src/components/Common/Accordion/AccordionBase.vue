<template>
    <div class="accordion accordion-flush" :id="'accordion-' + this.Hash">
        <AccordionItem
            v-for="(item, i) in accordionData"
            :key="i"
            :accordionId="accordionId"
            :accordionTitle="item.title"
            :accordionBody="item.body"
            :tooltip="item.tooltip"
            :accordionItem="item.id"
            @message="message"
            @open-bs-modal="openBsModal"
            :bsModalReturnValue="bsModalReturnValue"
            :checkboxValue="item.checkboxValue"
            :options="options"
            :hasSwitchButton="hasSwitch(item.hasSwitchButton)"
        ></AccordionItem>
    </div>
</template>
<script>
import {hash} from '../../../utils/Hash';
import AccordionItem from './AccordionItem.vue';
export default {
    name: "Accordion Base Component",
    props: {
        accordionData: Array,
        bsModalReturnValue: {},
        options: Object,
    },
    data() {
        return {
            Hash: hash(),
            accordionId: 'accordion-'
        }
    },
    mounted() {
        console.log("Accordion Base Component Mounted");
        this.accordionId = 'accordion-' + this.Hash;
    },
    components: {
        AccordionItem
    },
    methods: {
        message: function (message, accordionItem, value) {
            this.$emit("message", message, accordionItem, value) ;
        },
        openBsModal: function(title, body) {
            this.$emit("open-bs-modal", title, body);
        },
        hasSwitch: function(switchValue) {
            if (typeof switchValue == "undefined") return true;
            else return switchValue;
        }
    },
    emits: ['message', "open-bs-modal"]
}
</script>