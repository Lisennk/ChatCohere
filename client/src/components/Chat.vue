<script>
import axios from "axios";
import SendIcon from 'vue-material-design-icons/Send.vue';
import RefreshIcon from 'vue-material-design-icons/Refresh.vue';
import AccountCircleIcon from 'vue-material-design-icons/AccountCircle.vue';
import RobotIcon from 'vue-material-design-icons/Robot.vue';
import LightBulbIcon from 'vue-material-design-icons/Lightbulb.vue';

export default {
  components: {
    SendIcon,
    RefreshIcon,
    AccountCircleIcon,
    RobotIcon,
    LightBulbIcon
  },
  data: () => ({
    axios,
    chatHistory: [
    ],
    loading: false,
    sessionStarted: false,
  }),
  computed: {
  },
  methods: {
    send() {
      this.sessionStarted = true;
      window.scrollTo(0, document.body.scrollHeight);
      this.saveNewUserMessage();
      this.loading = true;
      axios.post(`https://agi.chat/conversation/response/create`, {
        chatHistory: this.chatHistory
      }).then(response => {
        this.loading = false;
        console.log(response.data.response.text);
        this.saveNewBotMessage(response.data.response.text);
      }).catch(e => {
        this.loading = false;
        console.log(e);
      });
    },

    async retry() {
      this.chatHistory = this.chatHistory.slice(0, this.chatHistory.length - 1);
      await this.send();
    },

    /**
     * Saves new bot message
     * @param text
     */
    saveNewBotMessage(text) {
      this.chatHistory.push({
        author: 'bot',
        text
      })
    },

    /**
     * Adds user message to the chat history
     */
    saveNewUserMessage() {
      const userMessage = this.$refs.input.innerText;
      if (!userMessage.trim()) return;

      this.chatHistory.push({
        text: userMessage,
        author: 'user'
      });

      this.$refs.input.innerText = '';
    }
  },
  mounted() {
  }
}
</script>

<template>
  <template v-if="sessionStarted">
    <div class="chatHistory">
      <template v-for="message in chatHistory">
        <div :class="{message: true, incoming: message.author === 'bot', outcoming: message.author === 'user'}">
          <div class="content">
            <div class="avatar">
              <template v-if="message.author === 'user'">
                <account-circle-icon/>
              </template>
              <template v-else>
                <robot-icon/>
              </template>
            </div>
            <div class="text">
              {{message.text}}
            </div>
          </div>
        </div>
      </template>
      <template v-if="loading">
        <div class="message incoming">
          <div class="content">
            <div class="avatar">
              <robot-icon/>
            </div>
            <div class="text">
              Loading...
            </div>
          </div>
        </div>
      </template>
      <div style="height: 250px"></div>
    </div>
  </template>
  <template v-else>
    <div class="features">
      <h1>ChatCohere</h1>
      <div class="examples">
        <div class="example">
          "Explain quantum computing in simple terms"
        </div>
        <div class="example">
          "Got any creative ideas for a 10 year old’s birthday?"
        </div>
        <div class="example">
          "How do I make an HTTP request in Javascript?"
        </div>
      </div>
      <div class="examples examplesblock2">
        <div class="example">
          "Fix grammar and rewrite the following sentence for clarity"
        </div>
        <div class="example">
          "Who founded OpenAI and when?"
        </div>
        <div class="example">
          "Generate an exciting Twitter post using this hashtag"
        </div>
      </div>
      <div class="smallText">
        Made for the <a href="https://lablab.ai/event/generative-ai-hackathon">Generative AI Hackathon</a>. Follow <a href="https://twitter.com/TarasPohrebniak">@TarasPohrebniak</a> for more.
      </div>
    </div>
  </template>

  <div class="bottomContainer">
    <button v-if="sessionStarted" @click="retry" class="retry">
      <refresh-icon/>
      Try again
    </button>
    <div class="inputContainer">
      <div ref="input" contenteditable="true" class="textarea"></div>
      <button @click="send"><send-icon/></button>
    </div>
  </div>
</template>

<style>

</style>
