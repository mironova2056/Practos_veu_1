
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `<div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText" />
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>
            <div class="product-stock">
                <p v-if="inStock" >In Stock</p>
                <p v-else :class="{empty: !inStock}">Out of Stock</p>
                <span v-show="onSale">On Sale</span>
            </div>
            <product-details :details="details"></product-details>
            <ol>
                <li v-for="size in sizes">{{ size }}</li>
            </ol>
            <p>Shipping: {{shipping}}</p>
            <div v-for="variant in variants" :key="variant.variantId">
                <p>{{ variant.variantColor }}</p>
            </div>
            <div class="color-box"
                 v-for="(variant, index) in variants"
                 :key="variant.variantId"
                 :style="{backgroundColor: variant.variantColor}"
                 @mouseover="updateProduct (index)"
            >
            </div>
            <a :href="link">More products like this</a>
            <div class="cart">
                <p>Cart {{ cart }}</p>
                <button class="add" v-on:click="addToCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Add to cart </button>
                <button class="delete" v-on:click="deleteFromCart">Delete </button>
            </div>
        </div>
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
        },
        shipping(){
            if(this.premium){
                return "Free";
            }else {
                return 2.99
            }
        }
    }
})
Vue.component('product-details', {
    props: {
      details: {
          type: Array,
          required: false
      }
    },
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `,
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true
    }
});
