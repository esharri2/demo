export class DynamicButtonHandler extends HTMLElement {
  static register(tagName) {
    customElements.define(
      tagName || "dynamic-button-handler",
      DynamicButtonHandler
    );
  }

  connectedCallback() {
    this.observe();
    this.button = this.querySelector(".floating-button")
  }

  observe() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting }) => {
          if (isIntersecting) {
            console.log("intersecting...")
            this.button.classList.remove("hidden")
          } else {
            console.log("not...")
            this.button.classList.add("hidden")
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      }
    );
    this.observer.observe(this);
  }
}

DynamicButtonHandler.register();
