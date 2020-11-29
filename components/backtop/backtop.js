Component({
    data: {},
    properties: {
        showBackTop: {
            type: Boolean,
            value: false,
        }
    },
    methods: {
        backTop() {
            this.triggerEvent('BackTop')
        },
    },
});