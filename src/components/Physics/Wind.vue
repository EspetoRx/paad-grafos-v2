<template>
    <div class="accordion accordion-flush mt-1" id="accordionFlushWind">
        <div class="accordion-item">
            <div class="accordion-header" id="flush-wind">
                <button class="accordion-button collapsed p-1" type="button" data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseWind" aria-expanded="false" aria-controls="flush-collapseWind"
                    id="collapseWind" @click.prevent="this.isWindEnabled = !this.isWindEnabled">
                    <div class="d-flex w-100 justify-content-between pe-2">
                        <div>
                            Vento
                        </div>
                        <div class="flex-shrink-1 badge bg-info m-1" data-bs-toggle="tooltip"
                            title="Uma força que empurra todos os vértices não fixados numa dada direção. Requer que todos os vértices estejam conectados a 
                                    outras vértices que estão fixos, caso contrário vértices não anexados ficarão se movendo indefinidamente.">
                            <i class="fa-solid fa-info text-right"></i>
                        </div>
                    </div>
                </button>
            </div>
            <div id="flush-collapseWind" class="accordion-collapse collapse" aria-labelledby="flush-wind"
                data-bs-parent="#accordionFlushWind">
                <div class="accordion-body">
                    <div class="row">
                        <div class="input-group input-group-sm p-0 mb-1">
                            <span class="input-group-text" id="addon-physics-wind-x-label" data-bs-toggle="tooltip"
                                title="A quantidade de força a ser aplicada empurrando vértices não fixados para a direita (valores positivos) ou para a esquerda (valores negativos).">Coord
                                X:</span>
                            <input type="number" step="1" class="form-control" placeholder="windX"
                                aria-label="windX" aria-describedby="addon-physics-wind-x-label" id="physics-wind-x" v-model="windX">
                        </div>
                        <div class="input-group input-group-sm p-0 mb-1">
                            <span class="input-group-text" id="addon-physics-wind-y-label" data-bs-toggle="tooltip"
                                title="A quantidade de força a ser aplicada empurrando vértices não fixados para a baixo (valores positivos) ou para a cima (valores negativos).">Coord
                                Y:</span>
                            <input type="number" step="1" class="form-control" placeholder="windY"
                                aria-label="windY" aria-describedby="addon-physics-wind-y-label" id="physics-wind-y" v-model="windY">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "Wind",
    props: [
        'options',
        'network'
    ],
    data() {
        return {
            encapsulateOptions: null,
            encapsulateNetwork: null,
            isWindEnabled: false,
            windX: 0,
            windY: 0,
        }
    },
    watch: {
        isWindEnabled: function(newWindEnabled, oldWindEnabled) {
            this.encapsulateNetwork = this.network;
            this.encapsulateOptions = this.options;
        },

        windX: function(newWindX, oldWindX) {
            this.encapsulateOptions.physics.wind.x = newWindX;
            this.$emit('options-has-changed', this.encapsulateOptions);
        },

        windY: function(newWindY, oldWindY) {
            this.encapsulateOptions.physics.wind.y = newWindY;
            this.$emit('options-has-changed', this.encapsulateOptions);
        },
    },
    emits: ['options-has-changed']
}
</script>