// Adapted from https://medium.com/@chrislhow/scroll-to-scrub-videos-4664c29b4404
// Recommended encoding:
// ffmpeg -i input.mp4   \ # input file name
//   -vf scale=1280:-1   \ # width of output movie file in pixels
//   -movflags faststart \ # it never hurts
//   -vcodec libx264     \ # h.264 encoder
//   -crf 18             \ # quality setting, 18 = excellent
//   -g 2                \ # keyframe every x frames 
//   -pix_fmt yuv420p    \ # pixel format
//   -an                 \ # no audio (you won't hear it anyway)
//   output.mp4            # outfile file name



export class ScrollControlledVideo extends HTMLElement {
  static register(tagName) {
    customElements.define(
      tagName || "scroll-controlled-video",
      ScrollControlledVideo
    );
  }

  connectedCallback() {
    this.video = this.querySelector("video");
    // this.fetchVideo();
    this.observeVideos();
  }

  // Prefetch the video for smooth scrubbing
  fetchVideo() {
    const src = this.video.getAttribute("src");

    // Get the video
    fetch(src)
      .then((response) => response.blob())
      .then((response) => {
        const objectURL = URL.createObjectURL(response);
        this.video.setAttribute("src", objectURL);
      });
  }

  updateWrapperPositions() {
    const clientRect = this.wrapper.getBoundingClientRect();
    this.wrapperPositions = {
      top: clientRect.y + window.scrollY,
      bottom: clientRect.bottom - window.innerHeight + window.scrollY,
    };
  }

  handleScroll() {
    const { top, bottom } = this.wrapperPositions;

    const progress = Math.max(
      (window.scrollY - top) / (bottom - top),
      0
    );
    const seekTime = progress * this.video.duration;
    this.video.currentTime = seekTime;
  }

  observeVideos() {
    const handleScroll = this.handleScroll.bind(this);

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.wrapper =
              this.wrapper ||
              this.querySelector(".scroll-controlled-video-wrapper");
            if (!this.wrapperPositions) {
              // TODO also call on resize
              this.updateWrapperPositions();
            }
            document.addEventListener("scroll", handleScroll);
          } else {
            document.removeEventListener("scroll", handleScroll);
          }
        });
      },
      { threshold: 1 }
    );

    this.observer.observe(this.video);
  }
}

ScrollControlledVideo.register();
