This folder contains end-to-end tests implemented using
[Playwright](https://playwright.dev/).

## Create a QR code

```bash
npx qrcode -t png -o qr-code.png -q 40 -e L "http://localhost:8080/29a.5392db"
```

## Converting PNG files to MJPEG

```bash
ffmpeg -loop 1 -i qr-code.png -pix_fmt yuv420p -t 0.05 qr-code.y4m
```
