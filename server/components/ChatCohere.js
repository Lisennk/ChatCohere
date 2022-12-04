const cohere = require('cohere-ai');
const config = require('config');
const moment = require('moment');

const token = config.get('cohere.token');
cohere.init(token);

class ChatCohere {

    /**
     * Returns prompt
     * @param chatHistory
     * @returns {string}
     */
    getPrompt(chatHistory) {

        const promptExamples = [
            [
                {
                    author: 'user',
                    text: 'What is a customer development?'
                },
                {
                    author: 'bot',
                    text: 'Customer development is a process in which a business or organization seeks to understand the needs and desires of its customers. It involves conducting market research, gathering feedback from customers, and using that information to develop products and services that meet their needs. This approach is often used in the early stages of product development, when a company is trying to validate its ideas and identify potential markets. By taking a customer-centered approach, businesses can increase the chances of success for their products and services.'
                },
                {
                    author: 'user',
                    text: 'can you shorten it to one sentence?'
                },
                {
                    author: 'bot',
                    text: 'Customer development is the process of gathering and using information about customers needs and desires to develop products and services that meet their needs.',
                },
                {
                    author: 'user',
                    text: 'now translate that sentence to spanish'
                },
                {
                    author: 'bot',
                    text: 'El desarrollo del cliente es el proceso de recopilación y uso de información sobre las necesidades y deseos de los clientes para desarrollar productos y servicios que satisfagan sus necesidades.',
                },
            ],
            [
                {
                    author: 'user',
                    text: 'Explain quantum computing in simple terms',
                },
                {
                    author: 'bot',
                    text: 'Quantum computing is a type of computing that uses the principles of quantum mechanics to perform operations on data. In classical computing, data is represented as bits, which can have a value of 0 or 1. In quantum computing, data is represented using quantum bits, or qubits, which can exist in a superposition of both 0 and 1 at the same time. This allows quantum computers to perform certain operations, such as factoring large numbers, much more quickly than classical computers. Because of this, quantum computers have the potential to solve certain problems that are impractical or impossible for classical computers to solve.'
                },
                {
                    author: 'user',
                    text: 'and what is a bit?'
                },
                {
                    author: 'bot',
                    text: 'In computing, a bit is the smallest unit of data. It is a binary digit, which can have a value of either 0 or 1. Bits are typically used to represent information in a computer, with each bit representing a single piece of information. For example, a byte, which is a unit of data that consists of eight bits, can represent a single character in a text document. In this way, bits are the building blocks of all digital information in a computer.',
                },
            ],
            [
                {
                    author: 'user',
                    text: 'Generate an exciting Twitter post using this hashtag #ai',
                },
                {
                    author: 'bot',
                    text: '"#AI is taking over the world! New developments in artificial intelligence are making it smarter and more capable every day. It\'s an exciting time to be alive! #innovation #technology"'
                }
            ],
            [
                {
                    author: 'user',
                    text: 'Got any creative ideas for a 10 year old’s birthday?',
                },
                {
                    author: 'bot',
                    text: 'Here are a few ideas for a 10 year old\'s birthday party:\n' +
                        '\n' +
                        '1. Have a sleepover party. This is a classic birthday party idea that most kids love. Invite a few of the birthday child\'s friends over for a night of fun and games. You could even set up a tent in the backyard for a camping-themed sleepover party.\n' +
                        '\n' +
                        '2. Have a movie night. Rent a few of the birthday child\'s favorite movies and set up a home theater in the living room. Pop some popcorn and break out the candy for a fun night of movie watching.\n' +
                        '\n' +
                        '3. Have a themed party. Choose a theme that the birthday child is interested in, such as superheroes, princesses, or dinosaurs, and plan activities and decorations around that theme. You could even have the kids come dressed in costume.\n' +
                        '\n' +
                        '4. Have a sports-themed party. If the birthday child is into sports, consider having a sports-themed party. Set up a mini-obstacle course or a scavenger hunt with sports-themed challenges. You could also have a friendly game of soccer or basketball.\n' +
                        '\n' +
                        '5. Have a craft party. If the birthday child enjoys being creative, consider having a craft party. Set up a few different craft stations with supplies and let the kids get creative. You could have a station for making jewelry, a station for painting, and a station for making paper airplanes.\n' +
                        '\n' +
                        'Overall, the key to planning a successful birthday party for a 10 year old is to choose activities and games that they will enjoy. It\'s also a good idea to involve them in the planning process so that they feel like they have a say in how their special day is celebrated.'
                },
                {
                    author: 'user',
                    text: 'what if he doesn\'t have any friends?'
                },
                {
                    author: 'bot',
                    text: 'If the birthday child doesn\'t have any friends, there are still plenty of ways to celebrate their special day. For example, you could organize a family party. Invite the birthday child\'s siblings, cousins, aunts, uncles, and grandparents to come celebrate with them. Play games, have a cake, and give the birthday child special attention on their big day.',
                },
            ],
            [
                {
                    author: 'user',
                    text: 'Who founded OpenAI?'
                },
                {
                    author: 'bot',
                    text: 'OpenAI was founded by Elon Musk, Sam Altman, Greg Brockman, John Schulman, and Ilya Sutskever. Is there something specific you would like to know about the company or its founders?'
                }
            ],
            [
                {
                    author: 'user',
                    text: 'Rewrite the following sentence for clarity: "It\'s an open-source alternative for ChatGPT we made on hackathon"',
                },
                {
                    author: 'bot',
                    text: '"We made an open-source alternative for ChatGPT during a hackathon."'
                }
            ],
        ]

        let prompt = `Assistant can perform user instructions, provide long informative responses, and never repeats itself.\n\n`;

        promptExamples.forEach(example => {
            example.forEach(message => {
                prompt += `${message.author === 'user' ? 'User' : 'Assistant'}: ${message.text}\n\n`;
            });

            prompt += `--\n\n`
        })

        chatHistory.forEach(message => {
           prompt += `${message.author === 'user' ? 'User' : 'Assistant'}: ${message.text}\n\n`;
        });

        prompt += `Assistant:`;

        return prompt;
    }

    /**
     * Returns response text
     * @param chatHistory
     * @returns {Promise<void>}
     */
    async getResponse(chatHistory) {
        const prompt = this.getPrompt(chatHistory);
        console.log(prompt);

        const response = await cohere.generate({
            prompt,
            model: 'command-xlarge-20221108',
            max_tokens: 300,
            temperature: 0.5,
            stop_sequences: ['Assistant', 'User']
        });

        const generation = response.body.generations[0];
        generation.text = generation.text.replace('\nUser', '').replace('\nAssistant', '').trim();

        return generation;
    }
}

module.exports = ChatCohere;