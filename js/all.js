import productModal from './productModal.js';
import deleteModal from './deleteModal.js';
import submitModal from './submitModal.js';
const url = "https://vue3-course-api.hexschool.io/";
const path = "jun0527";
const app = Vue.createApp({
  data() {
    return {
      products: [],
      cartData: {},
      isLoading: {
        addCart: "",
        changeQty: ""
      },
      tempQty: 0,
      user: {
        name: "",
        email: "",
        tel: "",
        address: "",
      },
      orderMessage: "",
      noCart: true
    }
  },
  components: {
    productModal,
    deleteModal,
    submitModal
  },
  methods: {
    getProductData() {
      axios.get(`${url}api/${path}/products`)
        .then((res) => {
          if (res.data.success) {
            this.products = res.data.products;
          }
        })
        .catch((err) => {
          console.dir(err);
        })
    },
    getCartData() {
      axios.get(`${url}api/${path}/cart`)
        .then((res) => {
          if (res.data.success) {
            this.cartData = res.data.data;
            if(this.cartData.carts.length === 0){
              this.noCart = true;
            }else{
              this.noCart = false;
            }
          }
        })
        .catch((err) => {
          console.dir(err);
        })
    },
    openModal(modal, id, index) {
      if (modal === "productModal") {
        this.$refs.productModal.openModal(id);
      } else if (modal === "deleteOne") {
        this.$refs.deleteModal.deleteProductTitle = this.cartData.carts[index].product.title;
        this.$refs.deleteModal.openModal(id, modal);
      } else if (modal === "deleteAll") {
        this.$refs.deleteModal.openModal(id, modal);
      } else if (modal === "submitModal") {
        if (this.cartData.carts.length === 0) {
          alert("購物車中無商品，請將商品加入購物車後再送出訂單！");
          return;
        }
        this.$refs.submitModal.openModal(this.user, this.orderMessage, this.cartData);
      }
    },
    addCart(productId, qty = 1) {
      this.isLoading.addCart = productId;
      const obj = {
        data: {
          product_id: productId,
          qty: qty
        }
      }
      axios.post(`${url}api/${path}/cart`, obj)
        .then((res) => {
          if (res.data.success) {
            alert("加入購物車成功！");
            this.getCartData();
            this.$refs.productModal.closeModal();
            setTimeout(() => {
              this.isLoading.addCart = "";
            }, 3000)
          } else {
            alert("加入購物車失敗！");
            this.isLoading.addCart = "";
            this.$refs.productModal.closeModal();
          }
        })
        .catch((err) => {
          console.dir(err);
        })
    },
    changeQty(status, cartId, index) {
      this.tempQty = this.cartData.carts[index].qty;
      if (status === "reduce") {
        if (this.tempQty - 1 === 0) {
          this.openModal('deleteOne', cartId, index);
          return;
        }
        this.tempQty--;
      } else {
        this.tempQty++;
      }
      const obj = {
        data: {
          product_id: cartId,
          qty: this.tempQty
        }
      }
      axios.put(`${url}api/${path}/cart/${cartId}`, obj)
        .then((res) => {
          if (res.data.success) {
            alert("更改購物車數量成功！");
            this.isLoading.changeQty = cartId;
            this.getCartData();
            setTimeout(() => {
              this.isLoading.changeQty = "";
            }, 3000)
          }
        })
        .catch((err) => {
          console.dir(err);
        })
    },
    isPhone(value) {
      if (!value) {
        return "收件人電話 為必填"
      } else {
        const phoneNumber = /^(09)[0-9]{8}$/
        return phoneNumber.test(value) ? true : '收件人電話 須為正確的電話號碼'
      }

    },
    clearData() {
      this.user.name = "";
      this.user.email = "";
      this.user.tel = "";
      this.user.address = "";
      this.orderMessage = "";
    }
  },
  mounted() {
    this.getProductData();
    this.getCartData();
  },
})
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
VeeValidateI18n.loadLocaleFromURL('js/zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});
app.mount("#app");