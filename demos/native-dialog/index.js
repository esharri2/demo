class ModalOpenTrigger extends HTMLElement {
  static register(tagName) {
    customElements.define(tagName || "modal-open-trigger", ModalOpenTrigger);
  }

  connectedCallback() {
    this.button = this.querySelector("button");
    if (this.button) {
      this.button.addEventListener("click", () => {
        const modal = document.getElementById(this.dataset.for);
        modal?.showModal();
      });
    } else {
      console.error("modal-open-trigger must contain a button element.");
    }
  }
}

ModalOpenTrigger.register();


class ModalCloseTrigger extends HTMLElement {
  static register(tagName) {
    customElements.define(tagName || "modal-close-trigger", ModalCloseTrigger);
  }

  connectedCallback() {
    this.button = this.querySelector("button");
    if (this.button) {
      this.button.addEventListener("click", () => {
        this.button.closest('dialog')?.close()
      });
    } else {
      console.error("modal-close-trigger must contain a button element.");
    }
  }
}

ModalCloseTrigger.register();
