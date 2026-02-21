export class ScrollControlledVideo extends HTMLElement {
  static register(tagName) {
    customElements.define(
      tagName || "scroll-controlled-video",
      ScrollControlledVideo,
    );
  }

  connectedCallback() {
    this.video = this.querySelector("video");
    this.fetchVideo();
    this.observeVideos();
  }

  initLenis() {
    // Initialize Lenis
    this.lenis = new Lenis({
      autoRaf: true,
      smoothWheel: false
    });

    // Listen for the scroll event and log the event data
    this.lenis.on("scroll", (e) => {
      this.handleScroll(e);
    });
  }

  // Prefetch the video for smooth scrubbing
  fetchVideo() {
    this.video.addEventListener(
      "loadedmetadata",
      () => {
        console.log("loaded metadata", this.video.currentSrc);
        fetch(this.video.currentSrc)
          .then((response) => response.blob())
          .then((response) => {
            const objectURL = URL.createObjectURL(response);
            this.video.setAttribute("src", objectURL);
          });
      },
      { once: true },
    );
  }

  // Get the video
  updateWrapperPositions() {
    console.log("func: updateWrapperPositions");
    const clientRect = this.wrapper.getBoundingClientRect();
    this.wrapperPositions = {
      top: clientRect.y + window.scrollY,
      bottom: clientRect.bottom - window.innerHeight + window.scrollY,
    };
  }

  handleScroll(event) {
    const { top, bottom } = this.wrapperPositions;

    const progress = Math.max((event.targetScroll - top) / (bottom - top), 0);
    const seekTime = progress * this.video.duration;
    this.video.currentTime = seekTime;
  }

  observeVideos() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.lenis) {
            this.wrapper =
              this.wrapper ||
              this.querySelector(".scroll-controlled-video-wrapper");
            if (!this.wrapperPositions) {
              // TODO also call on resize
              this.updateWrapperPositions();
            }
            this.initLenis();
          }
        });
      },
      { threshold: 1 },
    );

    this.observer.observe(this.video);
  }
}

ScrollControlledVideo.register();
