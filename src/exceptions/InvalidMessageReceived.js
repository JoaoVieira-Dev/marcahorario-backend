class InvalidMessageReceived extends Error {
  constructor() {
    super('Invalid Message');
    this.name = 'InvalidMessageReceived';
    this.message = 'Invalid Message';
  }
}

export default InvalidMessageReceived;
