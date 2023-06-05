This folder contains end-to-end tests implemented using
[Playwright](https://playwright.dev/).

## Create a QR code

```bash
npx qrcode -t png -o qr-code.png -e L "https://muninn.thingy.rocks/29a.5392db"
```

## Converting PNG files to MJPEG

```bash
ffmpeg -i qr-code.png -pix_fmt yuv420p qr-code.mjpeg
```
