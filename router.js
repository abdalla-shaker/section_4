const fs = require("fs");

const serverHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  res.setHeader("Content-Type", "text/html");
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    return req.on("end", () => {
      const bufferedMessage = Buffer.concat(body).toString();
      const message = bufferedMessage.split("=")[1];

      fs.writeFile("message.txt", message, (err) => {
        res.writeHead(302, { Location: "/" });
        return res.end();
      });
    });
  }

  if (url === "/discussion") {
    res.write(`
        <html>
          <head>
            <title>Message</title>
          </head>

          <body>
            <h1>Please enter a message</h1>
            <form action="/message" method="POST">
              <input type="text" name="message" />
              <button type="submit">Send</button>
            </form>
          </body>
        </html>
      `);

    return res.end();
  }

  res.write(`
      <html>
      <head>
        <title>My server page</title>
      </head>

      <body>
        <h1>Hello to my main server page.</h1>
      </body>
      </html>
    `);
  res.end();
};

module.exports = serverHandler;
