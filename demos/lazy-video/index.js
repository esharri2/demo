export class LazyVideo extends HTMLElement {
  static register(tagName) {
    customElements.define(tagName || "lazy-video", LazyVideo);
  }

  constructor() {
    super();

    this.attrs = {
      autoPause: "auto-pause",
    };

    this.options = {
      autoPause: this.hasAttribute(this.attrs.autoPause),
    };

    this.video = this.querySelector("video");

    // If auto-pause is not used and native loading attribute is used (and it's supported), bail -- there's nothing to do!
    if (
      !this.video ||
      (!this.options.autoPause &&
        this.querySelector("video[loading]") &&
        "loading" in HTMLVideoElement.prototype)
    ) {
      console.log("TESTING: Component has nothing to do.");
      return;
    }

    this.observeVideos();
  }

  connectedCallback() {
    console.log(this);
    console.log("check...", this.getAttribute("auto-pause"));
    // Select all videos
    this.lazyVideos = this.querySelectorAll("video:has([data-src])");
    this.observeVideos();
  }

  observeVideos() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        // TODO should we also check if video element is display: hidden?
        if (isIntersecting) {
          this.loadVideo(target);
        }
      });
    });

    this.lazyVideos.forEach((video) => {
      this.observer.observe(video);
    });
  }

  loadVideo(video) {
    for (const source in video.children) {
      const videoSource = video.children[source];
      if (
        typeof videoSource.tagName === "string" &&
        videoSource.tagName === "SOURCE"
      ) {
        videoSource.src = videoSource.dataset.src;
      }
    }

    video.load();
    this.observer.unobserve(video);
  }
}

LazyVideo.register();
