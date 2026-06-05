export function forgotPasswordTemplate(opts: { name: string; resetUrl: string; expiresIn: string }) {
  return {
    subject: "Reset Kata Sandi - Simako",
    html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Kata Sandi</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #F4F7FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(10,37,64,.08); }
    .header { background: linear-gradient(135deg, #0A2540 0%, #0073E6 100%); padding: 40px 32px; text-align: center; }
    .logo { display: inline-flex; align-items: center; gap: 12px; }
    .logo-icon { width: 44px; height: 44px; background: rgba(255,255,255,.15); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; color: #fff; }
    .logo-text { font-size: 22px; font-weight: 900; color: #fff; letter-spacing: -0.5px; }
    .body { padding: 40px 32px; }
    h1 { font-size: 22px; font-weight: 800; color: #0A2540; margin-bottom: 12px; }
    p { font-size: 14px; color: #4a6080; line-height: 1.7; margin-bottom: 16px; }
    .btn { display: inline-block; background: #0073E6; color: #fff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 12px; margin: 8px 0 24px; }
    .btn:hover { background: #005bb5; }
    .link-box { background: #F4F7FA; border-radius: 10px; padding: 12px 16px; font-size: 12px; color: #0073E6; word-break: break-all; margin-bottom: 24px; }
    .divider { height: 1px; background: #E6F0FA; margin: 24px 0; }
    .footer { padding: 20px 32px 32px; text-align: center; font-size: 12px; color: #9ab; }
    .warning { background: #FFF8E6; border: 1px solid #FFDDA0; border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #92600A; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <div class="logo-icon">SK</div>
        <span class="logo-text">Simako</span>
      </div>
    </div>
    <div class="body">
      <h1>Reset Kata Sandi</h1>
      <p>Halo, <strong>${opts.name}</strong>!</p>
      <p>Kami menerima permintaan untuk mereset kata sandi akun Simako Anda. Klik tombol di bawah untuk membuat kata sandi baru.</p>

      <div style="text-align:center;margin:28px 0;">
        <a href="${opts.resetUrl}" class="btn">Reset Kata Sandi Sekarang</a>
      </div>

      <p style="font-size:13px;color:#4a6080;">Atau salin link ini ke browser Anda:</p>
      <div class="link-box">${opts.resetUrl}</div>

      <div class="warning">
        Link ini hanya berlaku selama <strong>${opts.expiresIn}</strong> dan hanya dapat digunakan sekali.
      </div>

      <div class="divider"></div>
      <p style="font-size:13px;color:#9ab;">Jika Anda tidak meminta reset kata sandi, abaikan email ini. Kata sandi Anda tidak akan berubah.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Simako. Platform pencarian kos di Purwokerto.<br/>
      <a href="${opts.resetUrl.split("/auth/")[0]}" style="color:#0073E6;">simako.web.id</a>
    </div>
  </div>
</body>
</html>`,
    text: `Reset Kata Sandi Simako\n\nHalo, ${opts.name}!\n\nKlik link berikut untuk mereset kata sandi Anda:\n${opts.resetUrl}\n\nLink berlaku selama ${opts.expiresIn}.\n\nJika Anda tidak meminta ini, abaikan email ini.\n\n-- Tim Simako`,
  };
}
