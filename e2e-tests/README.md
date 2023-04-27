This folder contains end-to-end tests implemented using
[Playwright](https://playwright.dev/).

## Converting PNG files to MJPEG

```bash
ffmpeg -i qr-code.png -pix_fmt yuv420p qr-code.mjpeg
```
