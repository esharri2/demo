
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


// Close popover on mouseout
class PopoverControl extends HTMLElement {
  static register(tagName) {
    customElements.define(tagName || "popover-control", PopoverControl);
  }

  connectedCallback() {
    // Elements
    this.menu = this.querySelector("[popover]")

    if (!this.menu) {
      return;
    }

    this.bindEvents();
  }

  bindEvents() {
    this.menu.addEventListener("mouseenter", (event) => {
      console.log("enter...")
    });

    this.menu.addEventListener("mouseleave", (event) => {
      const {toElement} = event;
      this.closeMenu()

      console.log("leave, ", toElement)


    });
  }

  closeMenu() {
    this.menu.hidePopover();
  }
}

PopoverControl.register();
