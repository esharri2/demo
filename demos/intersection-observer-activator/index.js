export class IntersectionObserverActivator extends HTMLElement {
  static register(tagName) {
    customElements.define(
      tagName || "intersection-observer-activator",
      IntersectionObserverActivator
    );
  }

  connectedCallback() {
    this.classesToAdd = this.getAttribute("classes-to-add");
    this.classesToRemove = this.getAttribute("classes-to-remove");
    if (this.classesToAdd || this.classesToRemove) {
      this.rootMargin = this.getAttribute("root-margin") || "0px";
      this.scrollMargin = this.getAttribute("scroll-margin") || "0px";
      this.threshold = this.getAttribute("threshold") || 0;
      this.observe();
    }
  }

  observe() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) {
            const classList = this.classList
            if (this.classesToRemove) {
              console.log(this.classesToRemove.split(","))
              classList.remove.apply(classList, this.classesToRemove.split(","));
            }

            if (this.classesToAdd) {
              classList.add.apply(classList, this.classesToAdd.split(","));
            }

            this.observer.disconnect();
          }
        });
      },
      {
        rootMargin: this.rootMargin,
        scrollMargin: this.scrollMargin,
        threshold: this.threshold,
      }
    );
    this.observer.observe(this);
  }
}

IntersectionObserverActivator.register();
