
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('example', require('./components/Example.vue'));
Vue.component('chat-log', require('./components/ChatLog.vue'));
Vue.component('chat-message', require('./components/ChatMessage.vue'));
Vue.component('chat-composer', require('./components/ChatComposer.vue'));
Vue.component('chat-users-block', require('./components/ChatUsersBlock.vue'));
Vue.component('chat-user', require('./components/ChatUser.vue'));

const app = new Vue({
    el: '#app',
    data () {
      return {
        messages: [],
        usersInRoom: []
      }
    },
    methods : {
      addMessage (message) {
        this.messages.push(message)
        axios.post('/messages', message)
          .then(response => {
            // console.log(response)
          })
      }
    },
    created () {
      axios.get('/messages')
        .then(response => {
          this.messages = response.data
        })

      Echo.join('chat')
        .here((users) => {
          this.usersInRoom = users;
        })
        .joining((user) => {
          this.usersInRoom.push(user)
        })
        .leaving((user) => {
          this.usersInRoom = this.usersInRoom.filter(u => u != user)
        })
        .listen('MessagePosted', (e) => {
          this.messages.push({
            text: e.message.text,
            user: e.user
          })
        });
    }
});
