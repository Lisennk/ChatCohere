const ChatCohere = require('../../components/ChatCohere');
const chatCohereClinet = new ChatCohere();

/**
 * Empathy controller
 */
class ResponseController {

    /**
     * Creates empathy
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    static async create(req, res) {

        try {


            let response = await chatCohereClinet.getResponse(req.body.chatHistory);

            return res.send({
                success: true,
                type: 'RESPONSE',
                response: {
                    text: response.text
                }
            });

        } catch (e) {
            console.log(`EmpathyController error, `, e);
            return res.status(500).json({
                success: false,
                type: 'INTERNAL_ERROR',
                error: e.message
            });
        }
    }
}

module.exports = ResponseController;