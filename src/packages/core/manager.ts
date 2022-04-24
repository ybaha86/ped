class Manager {

  #context = new Map();
  #ui = new Map();

  reset () {
    this.#context = new Map();
    this.#ui = new Map();
  }

  getContext <T>(context?: unknown): T {
    if (context) {
      if (!this.#context.has(context)) {
        this.#context.set(context, new (context as { new (): T })());
      }

      // navigate to the url if the asked context is not current context
      if (!(this.#context.get('current') instanceof (context as { new (): T }))) {
        this.#context.set('current', this.#context.get(context));
        this.#context.get('current').start();
      }
    }

    return this.#context.get('current') as T;
  }

  getUI <T>(ui?: unknown): T {
    if (ui) {
      if (!this.#ui.has(ui)) {
        this.#ui.set(ui, new (ui as { new (): T })());
      }

      this.#ui.set('current', this.#ui.get(ui));

      if (
        typeof this.#ui.get('current').navigate === 'function' &&
        typeof this.#ui.get('current').openPage === 'undefined'
      ) {
        this.#ui.get('current').navigate();
      }
    }

    return this.#ui.get('current') as T;
  }

}

export default new Manager();
