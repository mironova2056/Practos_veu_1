
Vue.component('product', {
    template: `<div class="product">
    // Здесь будет весь HTML-код, который раньше был в элементе с классом product
   </div>`,
    data() {
        return {
            product: "Socks",
            description: "A pair of warm, fuzzy socks.",
            brand: 'Vue Mastery',
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks.",
            onSale: 1,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,
                }
            ],
            sizes: ['S', 'M', 'L', 'XL'],
            cart: 0,
            selectedVariant: 0,
        }
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        deleteFromCart() {
            if (this.cart > 0) {
                this.cart -= 1
            }
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image(){
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        sale(){
            if(this.onSale){
                return this.brand + ' ' + this.product + 'On Sale';
            } else {
                return this.brand + ' ' + this.product + 'NOT On Sale';
            }
        }
    }
})


let app = new Vue({
    el: '#app',
});
