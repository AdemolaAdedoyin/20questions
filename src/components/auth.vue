<template>
  <div class="vue-tempalte">
    <form v-if="state === 'login' && (!player1Verified || !player2Verified)" @submit.prevent="login()">
      <h3>Player {{player}} Sign In</h3>

      <div class="form-group">
        <label>Email address</label>
        <input v-model="loginObj.email" required type="email" class="form-control form-control-lg" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input
          v-model="loginObj.password"
          required
          type="password"
          class="form-control form-control-lg"
        />
      </div>
      <br>
      <button
      id="verifybutton"
        class="fullwidth btn btn-dark btn-lg btn-block"
      >
        Sign In
      </button>

      <p class="forgot-password text-right">
        No account, <b @click="changestate('signup')"  style="cursor:pointer;"> register? </b>
      </p>

      <!-- <p class="forgot-password text-right mt-2 mb-4"> <router-link :to="{ name: 'forgot-password' }">Forgot password ?</router-link>
      </p> -->

      <br>

      <div class="social-icons">
        <ul>
          <li>
            <a href="#"><i class="fa fa-google"></i></a>
          </li>
          <li>
            <a href="#"><i class="fa fa-facebook"></i></a>
          </li>
          <li>
            <a href="#"><i class="fa fa-twitter"></i></a>
          </li>
        </ul>
      </div>
    </form>

    <form @submit.prevent="signup()" v-else-if="state === 'signup' && (!player1Verified || !player2Verified)">
      <h3>Player {{player}} Sign Up</h3>

      <div class="form-group">
        <label>Full Name</label>
        <input required v-model="singupObj.name" type="text" class="form-control form-control-lg" />
      </div>

      <div class="form-group">
        <label>Email address</label>
        <input required v-model="singupObj.email" type="email" class="form-control form-control-lg" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input required v-model="singupObj.password" type="password" class="form-control form-control-lg" />
      </div>
      <br>
      <button id="verifybutton" class="fullwidth btn btn-dark btn-lg btn-block">
        Sign Up
      </button>

      <p class="forgot-password text-right">
        Already registered <b @click="changestate('login')" style="cursor:pointer;"> sign in? </b>
      </p>
    </form>

    <form @submit.prevent="submitWord()" v-else-if="askQuestion">
      <h3>Player {{player}}, Secret word</h3>

      <div class="form-group">
        <input v-model="toGuess" placeholder="Think of something" type="text" class="form-control form-control-lg" />
      </div>

      <br>

      <small> Your friend will have to guess it in 20 questions or less </small>


      <br><br>

      <button class="fullwidth btn btn-dark btn-lg btn-block">
        Send
      </button>

    </form>

    <form @submit.prevent="submitAnswer()" v-else-if="wordOrQuestion">
      <h3>Player {{player}}, Ask a question or guess the word</h3>

      <div class="form-group">
        <input v-model="guessed" type="text" class="form-control form-control-lg" />
      </div>

      <br>

      <small v-if="previousQuestion"> Previous question/word: <b> {{ previousQuestion }} </b> </small>
      <br>
      <small v-if="previousAnswer"> Previous Answer: <b> {{ previousAnswer }}  </b> <br> <br> </small>

      

      <button class="fullwidth btn btn-dark btn-lg btn-block">
        Send
      </button>

    </form>

    <form @submit.prevent="" v-else-if="answerGuess">
      <h3>Player {{player}} </h3>

      <div class="form-group" style="text-align: center;">
        {{ count }}. <b> {{ this.guessed }} </b>
      </div>

      <br>

      <button @click="checkAnswer('yh')" class="btn btn-success btn-lg btn-block">
        YES
      </button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

      <button @click="checkAnswer('no')" class="btn btn-danger btn-lg btn-block">
        NO
      </button> &nbsp;&nbsp;&nbsp;

      <button @click="checkAnswer('sometimes')" class="btn btn-secondary btn-lg btn-block">
        SOMETIMES
      </button>

      <br><br>

      <button @click="checkAnswer('correct')" class="fullwidth btn btn-warning btn-lg btn-block" v-if="guessed.split(' ').length === 1">
        YOU'VE GUESSED IT RIGHT!
      </button>

    </form>

    <div style="text-align: center; align-items: center; flex-direction: column; display: flex; padding-top: 20px;" v-else-if="limit || success">
      <h3>Player {{player}}</h3>

      <div v-if="limit">
        <svg class="failure" width="76" height="75" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M37.977 75c20.711 0 37.5-16.79 37.5-37.5S58.689 0 37.978 0C17.267 0 .477 16.79.477 37.5S17.268 75 37.978 75z" fill="#F5DBDB"/><g clip-path="url(#clip0)"><path d="M39.757 37.986l7.876-7.876a1.252 1.252 0 10-1.771-1.771l-7.876 7.876-7.877-7.876a1.252 1.252 0 10-1.771 1.771l7.877 7.876-7.877 7.876a1.252 1.252 0 101.771 1.771l7.877-7.876 7.876 7.876a1.249 1.249 0 001.771 0c.49-.489.49-1.282 0-1.771l-7.876-7.876z" fill="#CE0000"/></g><defs><clipPath id="clip0"><path fill="#fff" transform="translate(27.971 27.971)" d="M0 0h20.029v20.029H0z"/></clipPath></defs></svg>
        <h2 class="succces-header"> LIMIT REACHED </h2>
        <p class="success-msg"> You have reached the maximum tries </p>
      </div>
      <div v-else-if="success">
        <figure ref="loader" class="loader"></figure>
        <h2 class="succces-header"> CORRECT </h2>

        <p class="success-msg"> YOU'VE GUESSED IT! </p> <br>
        <small> The word was: <b> {{ toGuess }} </b> </small>
      </div>

    </div>
  </div>
</template>

<script>
import { loadAnimation } from 'lottie-web'
import successImg from '@/assets/check.json'
import axios from 'axios'

const NEW_BASE_URL = process.env.VUE_APP_NEW_BASE_URL || 'http://8c23-197-210-47-243.ngrok.io';

export default {
  data() {
    return {
      loginObj: {
        email: "",
        password: "",
      },
      singupObj: {
        name: "",
        email: "",
        password: "",
      },
      state: "login",
      player: 1,
      count: 1,
      maxTries: 20,
      previousQuestion: '',
      previousAnswer: '',
      player1Verified: false,
      player2Verified: false,
      askQuestion: false,
      guessed: '',
      toGuess: '',
      answerGuess: false,
      wordOrQuestion: false,
      attempted: false,
      success: false,
      limit: false,
    };
  },
  methods: {
    startAnimation () {
      setTimeout(() => {
        loadAnimation({
          container: this.$refs.loader,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          animationData: successImg,
          rendererSettings: {
            progressiveLoad: true,
            hideOnTransparent: true
          }
        })
      }, 200)
    },
    login() {
      let submitBtn = document.getElementById('verifybutton')
      submitBtn.disabled = true

      this.auth('login', this.loginObj)
      .then((resp) => {
        submitBtn.disabled = false
        if (resp.data.data) {
          this.$notify({
            group: 'foo',
            title: 'Successful',
            text: 'User successfully loged in',
          });
          if (this.player === 1) {
            this.player = 2
            this.player1Verified = true;
            this.singupObj = {};
            this.loginObj = {};
            this.state = 'login';
          } else {
            this.player2Verified = true;
            this.askQuestion = true;
            this.player = 1;
          }
        }
      })
      .catch((err) => {
        submitBtn.disabled = false
        this.$notify({
          group: 'foo',
          type: 'warn',
          title: (err.response && err.response.data) ? err.response.data.code : 'Request Failed',
          text: (err.response && err.response.data) ? err.response.data.message : 'Request Failed',
        });
      });
    },
    signup () {
      let submitBtn = document.getElementById('verifybutton')
      submitBtn.disabled = true

      this.auth('signup', this.singupObj)
      .then((resp) => {
        submitBtn.disabled = false
        if (resp.data.data) {
          this.loginObj.email = this.singupObj.email;
          this.loginObj.password = this.singupObj.password;
          this.login()
        }
      })
      .catch((err) => {
        submitBtn.disabled = false
        this.$notify({
          group: 'foo',
          type: 'warn',
          title: (err.response && err.response.data) ? err.response.data.code : 'Request Failed',
          text: (err.response && err.response.data) ? err.response.data.message : 'Request Failed',
        });
      });
    },
    submitWord () {
      if (this.toGuess.split(' ').length > 1 || !this.toGuess || !isNaN(this.toGuess)) {
        this.$notify({
          group: 'foo',
          type: 'warn',
          title: 'NOT VALID',
          text: 'Must be a word'
        });
      } else {
        this.wordOrQuestion = true; this.askQuestion = false; this.player = 2;
      }
    },
    submitAnswer () {
      if (!this.guessed || (this.guessed && !isNaN(this.guessed))) {
        this.$notify({
          group: 'foo',
          type: 'warn',
          title: 'NOT VALID',
          text: 'Must be a word or question'
        });
      } else if (this.guessed) {
        this.player = 1;
        this.answerGuess = true;
        this.wordOrQuestion = false
      }
    },
    auth (value, obj) {
      if (value === 'login') {
        const url = `${NEW_BASE_URL}/v1/auth/login`
          return axios({
            method: 'post',
            url: url,
            headers: {
              'Content-Type': 'application/json',
            },
            data: {
              ...obj,
            }
          })
      } else if (value === 'signup') {
        const url = `${NEW_BASE_URL}/v1/auth/signup`
          return axios({
            method: 'post',
            url: url,
            headers: {
              'Content-Type': 'application/json',
            },
            data: {
              ...obj,
            }
          })
      }
    },
    checkAnswer (value) {
      this.player = 2;
      if (value === 'correct') {
        if (this.guessed.toLowerCase() === this.toGuess.toLowerCase()) {
          this.answerGuess = false;
          this.success = true;
          this.startAnimation();
        } else {
          this.player = 1;
          this.$notify({
          group: 'foo',
          type: 'warn',
          title: 'INCORRECT',
          text: 'Words do not match'
        });
        }
      } else if (this.count === this.maxTries) {
        this.limit = true;
        this.answerGuess = false;
      } else if (['sometimes', 'yh', 'no'].includes(value)) {
        this.wordOrQuestion = true
        this.answerGuess = false;
        this.count += 1;
        this.attempted = true;
        this.previousQuestion = `${this.guessed}`;
        this.previousAnswer = value;
        this.guessed = ''
      }
    },
    changestate (state) {
      this.state = state;
    }
  },
};
</script>
