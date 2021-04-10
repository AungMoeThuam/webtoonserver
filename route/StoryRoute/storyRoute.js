const router = require("express").Router();
const database = require("../../database/db.config");
const upload = require("../middlewares/normalMiddlewares/imgUp.middleware.js");

router.post("/stories", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.send(err);
      return;
    }
    const title = req.body.title;
    const storyBody = req.body.storyBody;
    const imageName = req.file.filename;

    database.query(
      "INSERT INTO story (title,body,created,updated,imageUrl) VALUES (?,?,?,?,?)",
      [title, storyBody, new Date(), new Date(), imageName],
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send({
            meta: {
              status: "success",
              id: result.insertId,
            },
            result: {
              message: "created",
              result: {
                id: result.insertId,
                title,
                storyBody,
                imageName,
              },
            },
          });
        }
      }
    );
  });
});

router.get("/stories", (req, res) => {
  database.query(" SELECT * FROM story", (err, result) => {
    if (err) {
      res.send({
        meta: {
          total: 0,
        },
        error: {
          message: "there is something wrong",
        },
      });
    }
    if (result.length > 0) {
      res.send({
        meta: {
          status: "success",
          records: result.length,
        },

        result,
      });
    }
  });
});

router.get("/stories/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM story WHERE id = ?";

  database.query(query, id, (err, result) => {
    if (err) {
      res.send({
        meta: {
          status: "failed",
          id,
        },
        error: {
          message: " server error",
        },
      });
    }
    if (result.length > 0) {
      res.send({
        meta: {
          status: "success",
          id,
        },
        result: result[0],
      });
    } else {
      res.send({
        meta: {
          status: "failed",
          id,
        },
        error: {
          message: `the record does not exist`,
        },
      });
    }
  });
});

router.get("/stories/page/:page", (req, res) => {
  const { page } = req.params;
  const row = 10;
  const offset = (page - 1) * 10;
  const query = `SELECT id,title,body,created,imageUrl FROM story LIMIT ${offset} , ${row};
  SELECT COUNT(id) AS count FROM story `;

  database.query(query, (err, result) => {
    if (err) {
      res.send(err);
    }
    const number = Math.ceil(result[1][0].count / 10);
    let i = 1;
    var pageNumbers = [];
    for (i; i <= number; i++) {
      pageNumbers.push(i);
    }

    res.send({
      meta: {
        status: "success",
        totalPage: number,
        currentPage: page,
        pageNumbers: [...pageNumbers],
        records: result[0].length,
      },
      result: result[0],
    });
  });
});

router.get("/stories/related/:id/:page", (req, res) => {
  const { id, page } = req.params;

  const row = 6;
  const offset = (page - 1) * 6;
  const query = `SELECT id,title,body,created,imageUrl FROM story WHERE id <> ? LIMIT ${offset},${row}`;

  database.query(query, id, (err, result) => {
    if (err) {
      res.send({
        meta: {
          status: "failed",
        },
        error: {
          message: "there is something wrong",
        },
      });
    } else {
      res.send({
        meta: {
          status: "success",
          records: result.length,
        },
        records: {
          result,
        },
      });
    }
  });
});

module.exports = router;
