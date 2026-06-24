import QRCode from "qrcode";

export async function getExpoUrl(port: number): Promise<string | null> {
  try {
    const res = await fetch(`http://localhost:${port}/`, {
      headers: {
        Accept: "application/expo+json,application/json",
        "Expo-Platform": "ios",
        "Expo-Api-Version": "1",
      },
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      const text = await res.text();
      if (text.trimStart().startsWith("{")) {
        const data = JSON.parse(text) as { hostUri?: string };
        if (data.hostUri) return `exp://${data.hostUri}`;
      }
    }
  } catch {}

  const domain = process.env["REPLIT_EXPO_DEV_DOMAIN"];
  if (!domain) return null;
  return port === 19000 ? `exp://${domain}` : `exp://${domain}:${port}`;
}

async function makeSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    margin: 1,
    color: { dark: "#000000", light: "#FFFFFF" },
    width: 200,
  });
}

export async function isMetroUp(port: number): Promise<boolean> {
  try {
    const res = await fetch(`http://localhost:${port}/status`, {
      signal: AbortSignal.timeout(1000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function buildQrPage(
  azaUrl: string | null,
  payvoraUrl: string | null,
  azaUp = false,
  payvoraUp = false,
): Promise<string> {
  const [azaSvg, payvoraSvg] = await Promise.all([
    azaUrl ? makeSvg(azaUrl) : Promise.resolve(""),
    payvoraUrl ? makeSvg(payvoraUrl) : Promise.resolve(""),
  ]);

  const bothUp = azaUp && payvoraUp;
  const statusText = bothUp
    ? "Both apps are running and ready."
    : azaUp
      ? "AZA Mobile is running. Payvora is starting…"
      : payvoraUp
        ? "Payvora is running. AZA Mobile is starting…"
        : "Starting Metro bundlers — refresh in a moment.";

  const card = (
    name: string,
    port: number,
    isUp: boolean,
    dotClass: string,
    url: string | null,
    svg: string,
  ) => /* html */ `
    <div class="card">
      <div class="card-header">
        <div class="app-dot ${isUp ? dotClass : "offline"}"></div>
        <span class="app-name">${name}</span>
        <span class="app-port">:${port}</span>
      </div>
      <div class="qr-wrap">
        ${
          svg
            ? svg
            : `<div class="no-url">Metro starting…<br/>refresh in a moment</div>`
        }
      </div>
      <span class="pill-label">Expo URL</span>
      <div class="url-chip ${url ? "active" : ""}">
        ${url ?? "Waiting for tunnel…"}
      </div>
    </div>`;

  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Expo Go — QR Scanner</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      min-height: 100vh;
      background: #0A0A0F;
      color: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 16px 48px;
    }

    header { text-align: center; margin-bottom: 40px; }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #00D9A015;
      border: 1px solid #00D9A030;
      border-radius: 99px;
      padding: 4px 12px;
      font-size: 11px;
      font-weight: 600;
      color: #00D9A0;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-bottom: 14px;
    }

    h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
    h1 span { color: #00D9A0; }

    .subtitle {
      margin-top: 8px;
      font-size: 14px;
      color: rgba(255,255,255,0.45);
      line-height: 1.5;
    }

    .cards {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      max-width: 740px;
    }

    .card {
      background: #12121A;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 20px;
      padding: 28px 24px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      flex: 1;
      min-width: 280px;
      max-width: 340px;
      transition: border-color 0.2s;
    }

    .card:hover { border-color: rgba(0,217,160,0.25); }

    .card-header {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .app-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      background: #00D9A0;
      flex-shrink: 0;
    }

    .app-dot.purple { background: #8B5CF6; }
    .app-dot.offline { background: #555566; }

    .app-name { font-size: 16px; font-weight: 700; letter-spacing: -0.2px; }

    .app-port {
      margin-left: auto;
      font-size: 11px;
      color: rgba(255,255,255,0.35);
      font-weight: 500;
      background: rgba(255,255,255,0.05);
      border-radius: 6px;
      padding: 2px 8px;
    }

    .qr-wrap {
      background: #FFFFFF;
      border-radius: 14px;
      padding: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

    .qr-wrap svg { display: block; width: 100%; height: auto; border-radius: 4px; }

    .url-chip {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 10.5px;
      color: rgba(255,255,255,0.4);
      word-break: break-all;
      line-height: 1.5;
      font-family: "SF Mono", "Fira Code", monospace;
    }

    .url-chip.active { color: #00D9A0; background: #00D9A008; border-color: #00D9A020; }

    .pill-label {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255,255,255,0.3);
      letter-spacing: 0.5px;
      text-transform: uppercase;
      align-self: flex-start;
    }

    .no-url {
      font-size: 12px;
      color: rgba(255,255,255,0.25);
      text-align: center;
      padding: 20px 0;
      background: transparent;
    }

    .instruction {
      margin-top: 36px;
      text-align: center;
      max-width: 420px;
    }

    .instruction p {
      font-size: 13px;
      color: rgba(255,255,255,0.35);
      line-height: 1.8;
    }

    .instruction strong { color: rgba(255,255,255,0.6); }

    .reload-btn {
      margin-top: 24px;
      background: none;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 99px;
      color: rgba(255,255,255,0.45);
      font-size: 12px;
      font-weight: 500;
      padding: 8px 20px;
      cursor: pointer;
      transition: all 0.15s;
      letter-spacing: 0.3px;
    }

    .reload-btn:hover { border-color: #00D9A040; color: #00D9A0; }
  </style>
</head>
<body>
  <header>
    <div class="badge">● Live</div>
    <h1>Scan to open in <span>Expo Go</span></h1>
    <p class="subtitle">Open the Expo Go app on your phone and scan a QR code below.<br/>${statusText}</p>
  </header>

  <div class="cards">
    ${card("AZA Mobile", 19000, azaUp, "purple", azaUrl, azaSvg)}
    ${card("Payvora Mobile", 19665, payvoraUp, "", payvoraUrl, payvoraSvg)}
  </div>

  <div class="instruction">
    <p>
      <strong>1.</strong> Install <strong>Expo Go</strong> on iOS or Android.<br/>
      <strong>2.</strong> Tap "Scan QR Code" in Expo Go.<br/>
      <strong>3.</strong> Point your camera at either QR code above.
    </p>
  </div>

  <button class="reload-btn" onclick="location.reload()">↺ &nbsp;Refresh QR codes</button>
</body>
</html>`;
}
