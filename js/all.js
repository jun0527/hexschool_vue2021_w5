const productModal = {
  data() {
    return {
      url: "https://vue3-course-api.hexschool.io/",
      path: "jun0527",
      productModal: "",
      tempData: {},
      tempQty: 0,
      isLoading: {
        modalArea: true,
        addCart: false
      }
    }
  },
  mounted() {
    this.productModal = new bootstrap.Modal(this.$refs.productModal, { backdrop: 'static', keyboard: false });
  },
  methods: {
    openModal(productId) {
      this.isLoading.modalArea = true;
      this.productModal.show();
      axios.get(`${this.url}api/${this.path}/product/${productId}`)
        .then((res) => {
          if (res.data.success) {
            this.tempData = res.data.product;
            this.tempData.imageUrl = `url(${res.data.product.imageUrl})`
            this.isLoading.modalArea = false;
          } else {
            console.log(res);
          }
        })
        .catch((err) => {
          console.dir(err);
        })
    },
    closeModal() {
      this.productModal.hide();
      this.tempData = {};
      this.tempQty = 0;
    },
    changeQty(status) {
      if (status === "reduce") {
        if (this.tempQty > 0) {
          this.tempQty--;
        }
      } else {
        this.tempQty++;
      }
    },
    addCart(productId, qty) {
      this.isLoading.addCart = true;
      if (qty === 0) {
        alert("商品數量不得為0！");
        this.isLoading.addCart = false;
        return;
      }
      this.$emit("add-cart", productId, qty);
      this.isLoading.addCart = false;
    }
  },
  template: `<div ref="productModal" class="modal fade productModal" tabindex="-1">
  <div class="modal-dialog modalWidth">
    <div class="modal-content">
      <div class="modal-header bg-dark">
        <h5 class="modal-title text-white" id="exampleModalLabel">產品介紹</h5>
        <button type="button" class="btn-close btn-close-white" @click="closeModal()"></button>
      </div>
      <div class="loadingArea d-flex justify-content-center align-items-center" v-if="isLoading.modalArea">
        <div class="spinner-border loading" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div class="modal-body row justify-content-between px-5 py-4">
        <div class="imgArea url rounded col-5" :style="{'background-image':tempData.imageUrl}"></div>
        <div class="content col-6 d-flex flex-column justify-content-between">
            <div>
            <h3 class="mb-3">{{tempData.title}}</h3>
            <p>{{tempData.description}}</p>
          </div>
          <div>
            <p class="fs-6 text-decoration-line-through mb-1">原價：NT$ {{ tempData.origin_price }}</p>
            <p class="fs-3">特價：NT$ {{ tempData.price }}<span class="fs-6 mx-1">(每{{tempData.unit}})</span></p>
            <div class="d-flex justify-content-between align-items-end">
              <p class="qtyArea d-flex align-items-center mb-0">購買數量：<i ref="reduce" class="fas fa-caret-left" @click="changeQty('reduce')"></i><span>{{tempQty}}</span><i class="fas fa-caret-right" @click="changeQty('add')"></i></p>
              <button type="button" class="btn btn-danger py-2" @click="addCart(tempData.id,tempQty)"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="isLoading.addCart"></span>加入購物車</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`
}
const deleteModal = {
  data() {
    return {
      url: "https://vue3-course-api.hexschool.io/",
      path: "jun0527",
      deleteModal: "",
      deleteProductTitle: "",
      deleteCartId: "",
      deleteStatus: ""
    }
  },
  mounted() {
    this.deleteModal = new bootstrap.Modal(this.$refs.deleteModal, { backdrop: 'static', keyboard: false })
  },
  methods: {
    openModal(cartId, status) {
      this.deleteCartId = cartId;
      this.deleteStatus = status;
      this.deleteModal.show();
    },
    closeModal() {
      this.deleteModal.hide();
      this.deleteProductTitle = "";
    },
    deleteCart() {
      axios.delete(`${this.url}api/${this.path}/cart/${this.deleteCartId}`)
        .then((res) => {
          if (res.data.success) {
            alert(`刪除購物車中${this.deleteProductTitle}成功！`);
            this.$emit("getCartData");
            this.closeModal();
          } else {
            alert("刪除購物車中產品失敗！");
            this.closeModal();
          }
        })
        .catch((err) => {
          console.dir(err);
        })
    },
    deleteCartAll() {
      axios.delete(`${this.url}api/${this.path}/carts`)
        .then((res) => {
          if (res.data.success) {
            alert("成功清空購物車！");
            this.$emit("getCartData");
            this.closeModal();
          } else {
            alert(`${res.data.message}`);
            this.closeModal();
          }
        })
        .catch((err) => {
          console.dir(err);
        })
    }
  },
  template: `<div class="modal fade" ref="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header bg-dark">
        <h5 class="modal-title text-white">刪除確認</h5>
        <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
      </div>
      <div class="modal-body">
        <p v-if="deleteStatus==='deleteOne'">確定要刪除購物車中{{deleteProductTitle}}？</p>
        <p v-else>確定要清空購物車？</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary"  @click="closeModal">取消</button>
        <button type="button" class="btn btn-danger" @click="deleteCart" v-if="deleteStatus==='deleteOne'">刪除</button>
        <button type="button" class="btn btn-danger" @click="deleteCartAll" v-else>清空購物車</button>
      </div>
    </div>
  </div>
</div>`
}
const submitModal = {
  data() {
    return {
      url: "https://vue3-course-api.hexschool.io/",
      path: "jun0527",
      submitModal: "",
      user: {},
      message: "",
      cartData: {},
      loading: {
        submit: false
      }
    }
  },
  mounted() {
    this.submitModal = new bootstrap.Modal(this.$refs.submitModal, { backdrop: 'static', keyboard: false })
  },
  methods: {
    openModal(user, message, cartData) {
      this.user = user;
      this.message = message;
      this.cartData = cartData;
      this.submitModal.show();
    },
    closeModal() {
      this.submitModal.hide();
    },
    submitOrder() {
      this.loading.submit = true;
      let obj = {
        data: {
          user: this.user,
          message: this.message
        }
      };
      axios.post(`${this.url}api/${this.path}/order`, obj)
        .then((res) => {
          if (res.data.success) {
            alert("訂單送出成功！");
            this.$emit("getCartData");
            this.$emit("clearData");
            this.closeModal();
            this.loading.submit = false;
          } else {
            alert("訂單送出失敗！");
            this.closeModal();
            this.loading.submit = false;
          }
        })
        .catch((err) => {
          console.dir(err);
        })
    }
  },
  template: `<div class="modal fade" ref="submitModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header bg-dark">
        <h5 class="modal-title text-white" id="exampleModalLabel">訂單確認</h5>
        <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
      </div>
      <div class="modal-body">
        <p>收件人姓名：{{user.name}}</p>
        <p>收件人email：{{user.email}}</p>
        <p>收件人電話：{{user.tel}}</p>
        <p>收件人地址：{{user.address}}</p>
        <p>留言：{{message}}</p>
          <p>訂單內容：</p>
        <div class="orderContent">
          <p v-for="item in cartData.carts" :key="item.id">{{item.product.title}} x {{item.qty}}</p>
          <p class="total">總金額：{{cartData.final_total}}</p>
        </div>
        
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
        <button type="button" class="btn btn-primary" @click="submitOrder"><span class="spinner-border spinner-border-sm"
        role="status" aria-hidden="true" v-if="loading.submit"></span>送出訂單</button>
      </div>
    </div>
  </div>
</div>`
}
const app = Vue.createApp({
  data() {
    return {
      url: "https://vue3-course-api.hexschool.io/",
      path: "jun0527",
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
      orderMessage: ""
    }
  },
  components: {
    productModal,
    deleteModal,
    submitModal
  },
  methods: {
    getProductData() {
      axios.get(`${this.url}api/${this.path}/products`)
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
      axios.get(`${this.url}api/${this.path}/cart`)
        .then((res) => {
          if (res.data.success) {
            this.cartData = res.data.data;
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
      axios.post(`${this.url}api/${this.path}/cart`, obj)
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
          openModal('deleteModal', cartId, index);
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
      axios.put(`${this.url}api/${this.path}/cart/${cartId}`, obj)
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