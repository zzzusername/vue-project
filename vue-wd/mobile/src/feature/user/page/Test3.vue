<template>
  <div>
    <!-- Note that 'ref' is important here (value can be anything). read the description about `ref` below. -->
    <vue-croppie ref=croppieRef
    :enableOrientation="true"
    :mouseWheelZoom="false"
    :showZoomer="false"
    :viewport="{ width: 300, height: 300, type: 'square' }"
    :boundary="{ width: '100vw', height: '100vw'}"
    >
    </vue-croppie>
  <!-- the result -->
    <img v-bind:src="cropped">

    <button @click="bind()">Bind</button>
    <!-- Rotate angle is Number -->
    <button @click="rotate(-90)">Rotate Left</button>
    <button @click="rotate(90)">Rotate Right</button>
    <button @click="crop()">Crop</button>
  </div>
</template>

<script>

export default {
  mounted() {
    // Upon mounting of the component, we accessed the .bind({...})
    // function to put an initial image on the canvas.
    this.$refs.croppieRef.bind({
      url: 'http://i.imgur.com/Fq2DMeH.jpg'
    })
  },
  data() {
    return {
      cropped: null,
      images: [
        'http://i.imgur.com/fHNtPXX.jpg',
        'http://i.imgur.com/ecMUngU.jpg',
        'http://i.imgur.com/7oO6zrh.jpg',
        'http://i.imgur.com/miVkBH2.jpg'
      ]
    }
  },
  methods: {
    bind() {
      // Randomize cat photos, nothing special here.
      let url = this.images[Math.floor(Math.random() * 4)]

      // Just like what we did with .bind({...}) on
      // the mounted() function above.
      this.$refs.croppieRef.bind({
        url: url
      })
    },
    crop() {
      // Here we are getting the result via callback function
      // and set the result to this.cropped which is being
      // used to display the result above.
      let options = {
        format: 'jpeg',
        size: {
          width: 300,
          height: 300
        }
      }
      this.$refs.croppieRef.result(options, (output) => {
        this.cropped = output
      })
    },
    rotate(rotationAngle) {
      // Rotates the image
      this.$refs.croppieRef.rotate(rotationAngle)
    }
  }
}
</script>
