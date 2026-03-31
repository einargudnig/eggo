import { Resend } from 'resend';

const resend = new Resend("re_J4jyjQh1_JiVNppq1d82Xd3MbXnXadGP8");
const prerender = false;
const POST = async ({ request }) => {
  const { name, email, message } = await request.json();
  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ error: "Vinsamlegast fylltu út alla reiti." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const { error } = await resend.emails.send({
    from: "Eggo Contact <onboarding@resend.dev>",
    to: "eggo@eggo.is",
    subject: `Ný fyrirspurn frá ${name}`,
    replyTo: email,
    html: `
      <h2>Ný fyrirspurn af vefsíðu</h2>
      <p><strong>Nafn:</strong> ${name}</p>
      <p><strong>Netfang:</strong> ${email}</p>
      <p><strong>Skilaboð:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `
  });
  if (error) {
    console.error("Resend error:", error);
    return new Response(
      JSON.stringify({
        error: "Ekki tókst að senda skilaboð. Reyndu aftur síðar.",
        detail: error.message
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
