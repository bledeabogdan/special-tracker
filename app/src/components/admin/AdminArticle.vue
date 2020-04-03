<template>
  <div>
    <a-divider>{{
      this.$route.params.id ? "Update article" : "Create new article"
    }}</a-divider>
    <a-spin v-if="loading" size="large" style="width: 100%" />
    <div v-else class="container">
      <div class="form">
        <a-form
          layout="horizontal"
          :form="form"
          @submit="handleSubmit"
        >
          <a-form-item
            :validate-status="titleError() ? 'error' : ''"
            :help="titleError() || ''"
          >
            <a-input
              v-decorator="[
                'title',
                {
                  rules: [
                    { required: true, message: 'Please input the title!' }
                  ]
                }
              ]"
              placeholder="Title"
              allowClear
              @change="addValue('title')"
            >
              <a-icon
                slot="prefix"
                type="font-size"
                style="color:rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>
          <a-form-item
            :validate-status="shortDescriptionError() ? 'error' : ''"
            :help="shortDescriptionError() || ''"
          >
            <a-input
              v-decorator="[
                'shortDescription',
                {
                  rules: [
                    {
                      required: true,
                      message: 'Please input the short description! '
                    },
                    {
                      validator: this.minimumInput,
                      message: 'Maximum of 30 characters!'
                    }
                  ]
                }
              ]"
              placeholder="Short description"
              allowClear
              @change="addValue('short')"
            >
              <a-icon slot="prefix" type="dash" style="color:rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item
            :validate-status="descriptionError() ? 'error' : ''"
            :help="descriptionError() || ''"
          >
            <a-textarea
              v-decorator="[
                'description',
                {
                  rules: [
                    { required: true, message: 'Please input the description!' }
                  ]
                }
              ]"
              placeholder="Description"
              allowClear
              @change="addValue('description')"
            >
            </a-textarea>
          </a-form-item>
          <a-form-item>
            <a-upload
              name="avatar"
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              :beforeUpload="beforeUpload"
              @change="handleChange"
            >
              <img
                v-if="imageUrl"
                :src="imageUrl"
                alt="avatar"
                height="100px"
                width="100px"
              />
              <div v-else>
                <a-icon :type="imageLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">Image</div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item>
            <a-button
              v-if="!this.$route.params.id"
              type="primary"
              html-type="submit"
              :disabled="hasErrors(form.getFieldsError())"
            >
              Create new article
            </a-button>
            <a-button
              v-else
              type="normal"
              html-type="submit"
              :disabled="hasErrors(form.getFieldsError())"
            >
              Update article
            </a-button>
            <a-divider type="vertical" />
            <a-button type="dashed" html-type="reset">
              Reset
            </a-button>
          </a-form-item>
        </a-form>
      </div>
      <a-divider type="vertical" style="height: auto;" />
      <div class="preview">
        <span>Preview</span>
        <a-card hoverable>
          <img
            alt="example"
            :src="
              this.imageUrl
                ? this.imageUrl
                : 'https://www.freevector.com/uploads/vector/preview/23874/DD_Colorful_Abstract_Background_00493.jpg'
            "
            slot="cover"
            width="50px"
          />
          <a-card-meta
            :title="this.form.fieldsStore.getFieldValue('title')"
            :description="
              this.form.fieldsStore.getFieldValue('shortDescription')
            "
          >
            <a-avatar
              slot="avatar"
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            />
          </a-card-meta>
        </a-card>
        <a-progress :percent="this.percent" style="width: 100%" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../config/axios";
function hasErrors(fieldsError) {
  return (
    !Object.keys(fieldsError).some(field => fieldsError[field]) &&
    this.imageUrl == ""
  );
}
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  data() {
    return {
      percent: 0,
      values: [],
      loading: false,
      imageLoading: false,
      hasErrors,
      form: this.$form.createForm(this, { name: "horizontal_login" }),
      imageUrl: ""
    };
  },
  created() {
    this.getArticle();
  },
  mounted() {
    this.$nextTick(() => {
      // To disabled submit button at the beginning.
      this.form.validateFields();
    });
  },
  methods: {
    // Only show error after a field is touched.
    titleError() {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched("title") && getFieldError("title");
    },
    // Only show error after a field is touched.
    shortDescriptionError() {
      const { getFieldError, isFieldTouched } = this.form;
      return (
        isFieldTouched("shortDescription") && getFieldError("shortDescription")
      );
    },
    descriptionError() {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched("description") && getFieldError("description");
    },
    getArticle() {
      if (!this.$route.params.id) {
        return;
      }
      axios
        .get(`/article/${this.$route.params.id}`)
        .then(res => {
          const article = res.data.article;
          this.form.setFieldsValue({
            title: article.title,
            shortDescription: article.shortDescription,
            description: article.description
          });
          this.imageUrl = article.image;
          this.percent = 100;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.loading = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.$route.params.id) {
            axios
              .put(`/article/${this.$route.params.id}`, {
                ...values,
                image: this.imageUrl
              })
              .then(() => {
                this.loading = false;
                this.$notification.success({
                  message: "Article successfully updated!"
                });
                this.$router.push("/articles");
              })
              .catch(() => {
                this.loading = false;
                this.$notification.error({
                  message:
                    "Article could not be updated! Is the server up and running?"
                });
              });
          } else {
            axios
              .post("/admin/article", {
                ...values,
                image: this.imageUrl
              })
              .then(() => {
                this.loading = false;
                this.form.resetFields();
                this.handleReset();
                this.$notification.success({
                  message: "Article successfully created"
                });
              })
              .catch(() => {
                this.loading = false;
                this.handleReset();
                this.$notification.error({
                  message:
                    "Article could not be created! Is the server up and running?"
                });
              });
          }
        }
      });
    },
    minimumInput(rule, value, callback) {
      if (value.length > 30) {
        callback(true);
      }
      callback();
    },
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.imageLoading = true;
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl;
          this.imageLoading = false;
          this.addValue("image");
        });
      }
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("You can only upload JPG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("Image must smaller than 2MB!");
      }
      return isJpgOrPng && isLt2M;
    },
    updatePercent() {
      this.percent += 25;
    },
    downdatePercent() {
      this.percent -= 25;
    },
    addValue(value) {
      if (this.values.indexOf(value) === -1) {
        this.values.push(value);
        this.updatePercent();
      }
    },
    handleReset() {
      this.percent = 0;
      this.imageUrl = "";
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.form {
  width: 69%;
}
.preview {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 30%;
}
</style>
