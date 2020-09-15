class MessageWithoutHandler extends Error {
  constructor(body, id) {
    const message = `Message of type [${body.type}] has no handler. SQS ID: ${id}`;
    super(message);
    this.body = body;
    this.name = 'MessageWithoutHandler';
    this.message = message;
  }
}

export default MessageWithoutHandler;
