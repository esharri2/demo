// Handle open on hover effects for nav megamenu toggles (click functionality is handled natively by the Popover API)
class NavigationPopoverToggle extends HTMLElement {
  static register(tagName) {
    customElements.define(tagName || "navigation-popover-toggle", NavigationPopoverToggle);
  }

  connectedCallback() {
    // Elements
    this.link = this.querySelector("a");
    this.relatedPopover = document.getElementById(
      this.querySelector("[popovertarget]")?.getAttribute("popovertarget"),
    );

    if (!this.link || !this.relatedPopover) {
      return;
    }
    this.bindEvents();
  }

  bindEvents() {
    this.link.addEventListener("mouseenter", (event) => {
      this.openMenu();
    });

    this.link.addEventListener("mouseleave", (event) => {
      const { toElement } = event;

      // Close if mouse is not in the nav or the dialog
      if (
        !toElement.matches("nav, dialog") & !toElement.closest("nav, dialog")
      ) {
        this.closePopover();
      }
    });
  }

  openMenu() {
    this.relatedPopover.showPopover();
  }

  closePopover() {
    this.relatedPopover.hidePopover();
  }
}

NavigationPopoverToggle.register();

// Close popover on mouseout
class NavigationPopoverControl extends HTMLElement {
  static register(tagName) {
    customElements.define(tagName || "navigation-popover-control", NavigationPopoverControl);
  }

  animationOptions = [
    [
      { transform: "translateX(-100%)", display: "none" },
      {
        transform: "translateX(0)",
        display: "block",
      },
    ],
    {
      duration: 500,
      fill: "forwards",
      easing: "ease-in-out"
    },
  ];

  connectedCallback() {
    // Elements
    this.relatedPopover = this.querySelector("[popover]");
    this.header = document.querySelector("header");

    this.relatedPopoverAnimation = null;
    this.headerFillAnimation = null;

    if (!this.relatedPopover) {
      return;
    }

    this.bindEvents();
  }


  bindEvents() {
    // Use the web animation API to coordinate animation of popover and the header fill to make it look like popover is under the header
    this.relatedPopover.addEventListener("toggle", (event) => {
      [this.relatedPopoverAnimation, this.headerFillAnimation].forEach((animation) => {
        if (animation) animation.cancel();
      });
      if (event.newState === "open") {
        if (!this.headerFill) {
          this.headerFill = document.createElement("div");
          this.headerFill.classList.add("header__fill");
          this.header.insertAdjacentElement("afterbegin", this.headerFill);
        }

        this.relatedPopoverAnimation = this.relatedPopover.animate(...this.animationOptions);
        this.headerFillAnimation = this.headerFill.animate(
          ...this.animationOptions,
        );
      } else {
        this.headerFillAnimation.reverse();
        this.relatedPopoverAnimation.reverse();
      }
    });

    this.relatedPopover.addEventListener("mouseleave", (event) => {
      this.closePopover();
    });
  }

  closePopover() {
    this.relatedPopover.hidePopover();
  }
}

NavigationPopoverControl.register();
