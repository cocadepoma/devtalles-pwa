class Camera {
  constructor(videoNode) {
    this.videoNode = videoNode;
  }

  turnOn() {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: 300,
        height: 300,
      }
    }).then(stream => {
      this.videoNode.srcObject = stream;
      this.stream = stream;
    });
  }

  turnOff() {
    this.videoNode.pause();

    if (this.stream) {
      this.stream.getTracks()[0].stop();
    }
  }

  takePhoto() {
    // Create a canvas element to take the photo
    let canvas = document.createElement('canvas');

    // Set the dimensions of the canvas
    canvas.setAttribute('width', 300);
    canvas.setAttribute('height', 300);

    // Get the context of the canvas
    let context = canvas.getContext('2d');

    // Draw the image on the canvas
    context.drawImage(this.videoNode, 0, 0, canvas.width, canvas.height);

    // Create the image
    let photo = context.canvas.toDataURL();

    // Clean the canvas
    context = null;
    canvas = null;

    return photo;
  }
}