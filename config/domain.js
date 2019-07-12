module.exports = {
  PROTOCOL: process.env.DOMAIN_PROTOCOL || 'http',
  HOST: process.env.DOMAIN_HOST || '127.0.0.1',
  PORT: process.env.DOMAIN_PORT === '' ? process.env.DOMAIN_PORT : '4000',
  get URL() { return `${this.PROTOCOL}://${this.HOST}${!!this.PORT ? ':' + this.PORT : ''}` }
}