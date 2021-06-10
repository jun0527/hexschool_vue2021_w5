export default {
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