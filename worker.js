// ATOUT SERVICES 29 - formularz kontaktowy
// Wysylka przez Cloudflare Email Service (send_email binding).
// Wymaga zweryfikowanej domeny nadawcy w panelu Cloudflare.

const DEST = "contact@atoutservices29.fr";
const FROM = "site@atoutservices29.fr";

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function replyHtml(d) {
  const rows = [
    ["Nom", d.name], ["Téléphone", d.phone], ["E-mail", d.email],
    ["Prestation", d.service], ["Code postal", d.code_postal]
  ].filter(([, v]) => v && String(v).trim());

  return [
    '<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.55;color:#1a1a1a">',
    '<h2 style="margin:0 0 16px">Nouvelle demande de devis</h2>',
    '<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">',
    rows.map(([k, v]) =>
      `<tr><td style="border-bottom:1px solid #e5e5e5;width:130px"><strong>${esc(k)}</strong></td>` +
      `<td style="border-bottom:1px solid #e5e5e5">${esc(v)}</td></tr>`
    ).join(""),
    '<tr><td style="padding-top:12px;vertical-align:top"><strong>Description</strong></td>',
    `<td style="padding-top:12px;white-space:pre-wrap">${esc(d.message)}</td></tr>`,
    "</table></div>"
  ].join("");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method !== "POST" || url.pathname !== "/api/contact") {
      return env.ASSETS.fetch(request);
    }

    // Prosty limit: jeden formularz na adres IP na 10 minut.
    // (Rate limiting wymaga bindingu; bez niego chroni sam honeypot + walidacja.)
    let form;
    try {
      form = await request.formData();
    } catch {
      return json({ ok: false, error: "Requete invalide." }, 400);
    }

    const get = (k) => (form.get(k) == null ? "" : String(form.get(k)).trim());

    if (get("botcheck")) return json({ ok: false, error: "Requete invalide." }, 400);

    const data = {
      name: get("name"),
      phone: get("phone"),
      email: get("email"),
      service: get("service"),
      code_postal: get("code_postal"),
      message: get("message")
    };

    if (data.name.length < 2) return json({ ok: false, error: "Indiquez votre nom." }, 400);
    if (data.phone.replace(/\D/g, "").length < 10) {
      return json({ ok: false, error: "Indiquez un numero de telephone valide." }, 400);
    }
    if (!data.service) return json({ ok: false, error: "Choisissez une prestation." }, 400);
    if (!/^\d{5}$/.test(data.code_postal)) {
      return json({ ok: false, error: "Indiquez un code postal a 5 chiffres." }, 400);
    }
    if (data.message.length < 10) {
      return json({ ok: false, error: "Decrivez votre besoin en quelques phrases." }, 400);
    }

    try {
      await env.EMAIL.send({
        to: DEST,
        from: FROM,
        subject: `Devis ${data.service} - ${data.code_postal} - ${data.name}`,
        replyTo: data.email || undefined,
        html: replyHtml(data),
        text:
          `Nouvelle demande de devis\n\n` +
          `Nom : ${data.name}\nTelephone : ${data.phone}\n` +
          `E-mail : ${data.email || "-"}\nPrestation : ${data.service}\n` +
          `Code postal : ${data.code_postal}\n\n${data.message}`
      });
    } catch (err) {
      console.error("send failed:", err && (err.code || err.message));
      return json({ ok: false, error: "L'envoi a echoue. Appelez-nous au 06 67 96 78 81." }, 502);
    }

    return json({ ok: true }, 200);
  }
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
