/// <reference types="google.maps" />

declare namespace google.maps {
  interface Window {
    google: typeof google
  }
}

declare global {
  interface Window {
    google: typeof google
  }
}
