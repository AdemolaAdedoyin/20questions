<template>
  <div class="vue-tempalte">
    <form>
      <h3>Forgot Password</h3>

      <div class="form-group">
        <label>Email address</label>
        <input type="email" class="form-control form-control-lg" />
      </div>

      <button type="submit" class="fullwidth btn btn-dark btn-lg btn-block">
        Reset password
      </button>

      <p class="forgot-password text-right">
        Already registered
        <router-link :to="{ name: 'auth' }">sign in?</router-link>
      </p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>