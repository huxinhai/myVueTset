<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :width="width"
      :before-close="handleClose"
    >
      <slot></slot>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="Cancel">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "标题",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "30%",
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("updateVisible", val);
      },
    },
  },
  methods: {
    Cancel() {
      this.$emit("resetPopupData");
    },
    saveEdit() {
      this.$emit("submitPopupData");
    },
    handleClose() {
      this.$emit("handleClose");
    },
  },
};
</script>

<style>
</style>