export default class MethodChain {
  constructor(obj) {
    if (!(this instanceof MethodChain)) {
      return new MethodChain(...obj);
    }

    this.obj = obj;

    // eslint-disable-next-line no-restricted-syntax
    for (const method in obj) {
      if (typeof obj[method] === 'function') {
        this[method] = (...args) => {
          this.obj[method](...args);
          return this;
        };
      }
    }
  }

  set(prop, val) {
    this.obj[prop] = val;
    return this;
  }
}
