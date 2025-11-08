// Wrap autoplay video element with one or more source elements that have the `src` attribute replaced with `data-src`
export class LazyLoadVideo extends HTMLElement {
  static register(tagName) {
    customElements.define(tagName || "lazy-load-video", LazyLoadVideo);
  }

  connectedCallback() {
    this.lazyVideos = this.querySelectorAll("video:has([data-src])");
    this.observeVideos();
  }

  observeVideos() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(({target, isIntersecting}) => {
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

LazyLoadVideo.register();