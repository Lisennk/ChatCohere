const ChatCohere = require('../components/ChatCohere');
const chatCohereClient = new ChatCohere();

(async () => {

    const response = await chatCohereClient.getResponse([
        {
            text: 'What is a customer development interview?',
            author: 'user'
        }
    ]);

    console.log({
        response
    })

})();