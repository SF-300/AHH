// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const cmd = require("node-cmd");
const crypto = require("crypto");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(() => {
    if (!exists) {
        db.run(
            "CREATE TABLE Dreams (id INTEGER PRIMARY KEY AUTOINCREMENT, dream TEXT)"
        );
        console.log("New table Dreams created!");

        // insert default dreams
        db.serialize(() => {
            db.run(
                'INSERT INTO Dreams (dream) VALUES ("Find and count some sheep"), ("Climb a really tall mountain"), ("Wash the dishes")'
            );
        });
    } else {
        console.log('Database "Dreams" ready to go!');
        db.each("SELECT * from Dreams", (err, row) => {
            if (row) {
                console.log(`record: ${row.dream}`);
            }
        });
    }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
    response.sendFile(`${__dirname}/views/index.html`);
});

// endpoint to get all the dreams in the database
app.get("/getDreams", (request, response) => {
    db.all("SELECT * from Dreams", (err, rows) => {
        response.send(JSON.stringify(rows));
    });
});

// endpoint to add a dream to the database
app.post("/addDream", (request, response) => {
    console.log(`add to dreams ${request.body.dream}`);

    // DISALLOW_WRITE is an ENV variable that gets reset for new projects
    // so they can write to the database
    if (!process.env.DISALLOW_WRITE) {
        const cleansedDream = cleanseString(request.body.dream);
        db.run(`INSERT INTO Dreams (dream) VALUES (?)`, cleansedDream, error => {
            if (error) {
                response.send({ message: "error!" });
            } else {
                response.send({ message: "success" });
            }
        });
    }
});

// endpoint to clear dreams from the database
app.get("/clearDreams", (request, response) => {
    // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
    if (!process.env.DISALLOW_WRITE) {
        db.each(
            "SELECT * from Dreams",
            (err, row) => {
                console.log("row", row);
                db.run(`DELETE FROM Dreams WHERE ID=?`, row.id, error => {
                    if (row) {
                        console.log(`deleted row ${row.id}`);
                    }
                });
            },
            err => {
                if (err) {
                    response.send({ message: "error!" });
                } else {
                    response.send({ message: "success" });
                }
            }
        );
    }
});

// Github webhook listener
app.post('/git', verifySignature, (req, res) => {
  if (req.headers['x-github-event'] == 'push') {
    cmd.get('bash git.sh', (err, data) => {
      if (err) return console.log(err)
      console.log(data)
      cmd.run('refresh')
      return res.status(200).send(data)
    })
  } else if(req.headers['x-github-event'] == 'ping') {
    return res.status(200).send('PONG')
  } else {
    return res.status(200).send('Unsuported Github event. Nothing done.')
  }
})

const verifySignature = (req, res, next) => {
  const payload = JSON.stringify(req.body)
  const hmac = crypto.createHmac('sha1', process.env.GITHUB_SECRET)
  const digest = 'sha1=' + hmac.update(payload).digest('hex')
  const checksum = req.headers['x-hub-signature']

  if (!checksum || !digest || checksum !== digest) {
    return res.status(403).send('auth failed')
  }

  return next()
};

// helper function that prevents html/css/script malice
const cleanseString = function(string) {
    return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});
