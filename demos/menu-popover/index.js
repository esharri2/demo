
// Handle open on hover effects for nav megamenu toggles (click functionality is handled natively by the Popover API)
class MegamenuToggle extends HTMLElement {
  static register(tagName) {
    customElements.define(tagName || "megamenu-toggle", MegamenuToggle);
  }

  connectedCallback() {
    // Elements
    this.link = this.querySelector("a");
    this.menu = document.getElementById(
      this.querySelector("[popovertarget]")?.getAttribute("popovertarget"),
    );


    if (!this.link || !this.menu) {
      return;
    }
    this.bindEvents();
  }

  bindEvents() {
    this.link.addEventListener("mouseenter", (event) => {
      this.openMenu();
    });

    this.link.addEventListener("mouseleave", (event) => {
      const {toElement} = event;

      // Close if mouse is not in the nav or the dialog
      if (!toElement.matches("nav, dialog") & !toElement.closest("nav, dialog")) {
        this.closeMenu();
      }
    });
  }

  openMenu() {
    this.menu.showPopover();
  }

  closeMenu() {
    this.menu.hidePopover();
  }
}

MegamenuToggle.register();
