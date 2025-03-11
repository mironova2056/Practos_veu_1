
Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
        <p>
            <label for="name">Name</label>
            <input id="name" v-model="name" placeholder="name" >
        </p>
        <p>
            <label for="review">Review</label>
            <textarea id="review" v-model="review" ></textarea>
        </p>
        <p>
            <label for="rating">Rating</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        <p>
            <label for="question">Would you recommend this product?</label>
            <div class="radio">
                <label>
                    <input type="radio" name="question" id="question-yes" value="yes" v-model="question">Yes
                </label>
                <br>
                 <label>
                    <input type="radio" name="question" id="question-no" value="no" v-model="question">No
                </label>
            </div>
        </p>
        <p>
            <input type="submit" value="Submit"></input>
        </p>
        <p v-if="errors.length">
            <b>Please correct the following error(s)</b>
            <ul>
                <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
            </ul>
        </p>
    </form>`,
    data() {
        return{
            name: null,
            review: null,
            rating: null,
            question: null,
            errors: [],
        }
    },
    methods: {
        onSubmit() {
            this.errors = [];
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    question: this.question,
                }
                this.$emit('review-submitted', productReview);
                this.name = null
                this.review = null
                this.rating = null
                this.question = null
            }else {
                if(!this.name) this.errors.push("Please enter a name");
                if(!this.review) this.errors.push("Please enter a review");
                if(!this.rating) this.errors.push("Please enter a rating");
                if(!this.question) this.errors.push("Please enter yes or no");
            }
        }
    }
})

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
                <p v-if="inStock > 0" >In Stock</p>
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
            <button class="add" v-on:click="addToCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Add to cart </button>
            <button class="delete" v-on:click="deleteFromCart">Delete </button>
            <a :href="link">More products like this</a>
            <div>
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{review.rating}}</p>
                        <p>{{review.review}}</p>
                    </li>
                </ul>
            </div>
            <product-review @review-submitted="addReview"></product-review>

        </div>
   </div>`,
    data() {
        return {
            product: "Socks",
            description: "A pair of warm, fuzzy socks.",
            brand: 'Vue Mastery',
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks.",
            onSale: true,
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
            selectedVariant: 0,
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        deleteFromCart() {
            this.$emit('delete-from-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        addReview(productReview) {
            this.reviews.push(productReview);
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
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id){
            this.cart.push(id);
        },
        deleteFromCart(id){
            this.cart = this.cart.filter(itemId=> itemId !== id);
            console.log(`Товар с ID ${id} был удален из корзины.`);
        }
    }
});
