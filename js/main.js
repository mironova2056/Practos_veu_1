let eventBus = new Vue();

Vue.component('product-review', {
    template: `  
        <form class="review-form" @submit.prevent="onSubmit">  
            <p>  
                <label for="name">Name</label>  
                <input id="name" v-model="name" placeholder="name" required>  
            </p>  
            <p>  
                <label for="review">Review</label>  
                <textarea id="review" v-model="review" required></textarea>  
            </p>  
            <p>  
                <label for="rating">Rating</label>  
                <select id="rating" v-model.number="rating" required>  
                    <option value="">Select a rating</option>  
                    <option>5</option>  
                    <option>4</option>  
                    <option>3</option>  
                    <option>2</option>  
                    <option>1</option>  
                </select>  
            </p>  
            <p>  
                <label>Would you recommend this product?</label>  
                <div class="radio">  
                    <label for="question-yes">  
                        <input type="radio" name="question" id="question-yes" value="yes" v-model="question">Yes  
                    </label>  
                    <br>  
                    <label for="question-no">  
                        <input type="radio" name="question" id="question-no" value="no" v-model="question">No  
                    </label>  
                </div>  
            </p>  
            <p>  
                <input type="submit" value="Submit">  
            </p>  
            <p v-if="errors.length">  
                <b>Please correct the following error(s)</b>  
                <ul>  
                    <li v-for="(error, index) in errors" :key="index">{{ error }}</li>  
                </ul>  
            </p>  
        </form>  
    `,
    data() {
        return {
            name: '',
            review: '',
            rating: null,
            question: null,
            errors: [],
        }
    },
    methods: {
        onSubmit() {
            this.errors = [];
            if (this.name.trim() && this.review.trim() && this.rating !== null && this.question !== null) {
                const productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    question: this.question,
                };
                this.$emit('review-submitted', productReview);
                this.name = '';
                this.review = '';
                this.rating = null;
                this.question = null;
            } else {
                if (!this.name.trim()) this.errors.push("Please enter a name");
                if (!this.review.trim()) this.errors.push("Please enter a review");
                if (this.rating === null) this.errors.push("Please select a rating");
                if (this.question === null) this.errors.push("Please select 'Yes' or 'No'");
            }
        }
    }
});

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        productDetails: {
            type: Object,
            required: true
        },
        shippingCost: {
            type: String,
            required: true
        }
    },
    template: `  
        <div>  
            <ul>  
                <span class="tab"  
                      :class="{ activeTab: selectedTab === tab }"  
                      v-for="(tab, index) in tabs"  
                      @click="selectedTab = tab">  
                    {{ tab }}  
                </span>  
            </ul>  
            <div v-show="selectedTab === 'Reviews'">  
                <p v-if="!reviews.length">There are no reviews yet.</p>  
                <ul>  
                    <li v-for="review in reviews" :key="review.name">  
                        <p>{{ review.name }}</p>  
                        <p>Rating: {{ review.rating }}</p>  
                        <p>{{ review.review }}</p>  
                    </li>  
                </ul>  
            </div>  
            <div v-show="selectedTab === 'Make a Review'">  
                <product-review @review-submitted="addReview"></product-review>  
            </div>  
            <div v-show="selectedTab === 'Shipping'">  
                <h3>Shipping Information</h3>  
                <p>Shipping Cost: {{ shippingCost }}</p>  
            </div>  
            <div v-show="selectedTab === 'Details'">  
                <h3>Product Details</h3>  
                <ul>  
                    <li v-for="(value, key) in productDetails" :key="key">{{ key }}: {{ value }}</li>  
                </ul>  
            </div>  
        </div>  
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews',
        }
    },
    methods: {
        addReview(review) {
            this.$emit('review-submitted', review);
        }
    }
});

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `  
        <div class="product">  
            <div class="product-image">  
                <img :src="image" :alt="altText" />  
            </div>  
            <div class="product-info">  
                <h1>{{ title }}</h1>  
                <p>{{ description }}</p>  
                <div class="product-stock">  
                    <p v-if="inStock > 0">In Stock</p>  
                    <p v-else :class="{empty: !inStock}">Out of Stock</p>  
                    <span v-show="onSale">On Sale</span>  
                </div>  
                <product-details :details="productDetails"></product-details>  
                <ol>  
                    <li v-for="size in sizes">{{ size }}</li>  
                </ol>  
                <p>Shipping: {{ shipping }}</p>  
                <div v-for="(variant, index) in variants" :key="variant.variantId">  
                    <p>{{ variant.variantColor }}</p>  
                </div>  
                <div class="color-boxes">  
                    <div v-for="(variant, index) in variants"  
                         :key="variant.variantId"  
                         :style="{backgroundColor: variant.variantColor}"  
                         @mouseover="updateProduct(index)"  
                         class="color-box">  
                    </div>  
                </div>  
                <button class="add" @click="addToCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Add to cart</button>  
                <button class="delete" @click="deleteFromCart" :disabled="!inStock">Delete</button>  
                <a :href="link">More products like this</a>  
                <product-tabs :reviews="reviews"  
                              @review-submitted="addReview"  
                              :productDetails="productDetails"  
                              :shippingCost="shipping">  
                </product-tabs>  
            </div>  
        </div>  
    `,
    data() {
        return {
            product: "Socks",
            description: "A pair of warm, fuzzy socks.",
            brand: 'Vue Mastery',
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks.",
            onSale: true,
            productDetails: {
                material: '80% cotton, 20% polyester',
                features: 'Gender-neutral'
            },
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
        },
        addReview(productReview) {
            this.reviews.push(productReview);
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' On Sale';
            } else {
                return this.brand + ' ' + this.product + ' Not On Sale';
            }
        },
        shipping() {
            return this.premium ? "Free" : "2.99";
        }
    }
});

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        deleteFromCart(id) {
            this.cart = this.cart.filter(itemId => itemId !== id);
            console.log(`Product with ID ${id} removed from cart.`);
        }
    }
});