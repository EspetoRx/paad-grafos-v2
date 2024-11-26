<template>
    <div class="accordion accordion-flush border" :id="'accordionFlush-' + this.id">
        <AccordionItem v-for="(item, i) in accordionItems" :key="i" :id="item.item" :title="item.title" :flushId="this.id"
            :content="accordionItemsComponents.find((el) => {return el.item == item.item}).component"
            :switchButton="item.switch" :switchChecked="item.isChecked"
            :hasTooltip="item.hasTooltip" :tooltip="item.tooltip"
            :isCheckedEnabled="item.isCheckedEnabled"
            @toggle-switch-event="toggleSwitchEvent"
            @message="message"
        >
        </AccordionItem>
    </div>
</template>
<script>

import AccordionItem from './AccordionItem.vue';

export default {
    name: "Accordion Flush",
    props: [
        'id',
        'accordionItems',
        'accordionItemsComponents',
    ],
    components: {
        AccordionItem
    },
    methods: {
        toggleSwitchEvent(switchId, value) {
            this.$emit('toggle-switch-event', switchId, value);
        },
        message: function(message, value) {
            this.$emit('message', message, value);
        }
    },
    emits:['toggle-switch-event', 'message']
}
</script>