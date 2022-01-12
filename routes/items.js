/*
 * All routes for items are defined here
 * Since this file is loaded in server.js into api/items,
 *   these routes are mounted onto /items
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();


module.exports = (db) => {

//--Login--//

  router.get('/login/:id', (req, res) => {
  const userType = req.params.id === 1 ? 'buyer' : 'seller';
  req.session.user_id = req.params.id;
  req.session.user_type = userType;
  res.redirect('/');
});

  //--GET ALL ITEMS--//

  router.get("/", (req, res) => {
    const queryParams = [];
    const { minimum_price, maximum_price } = req.query;

    let queryString = `
    SELECT *
    FROM items
    WHERE 1 = 1`

    if (minimum_price) {
      queryParams.push(parseInt(minimum_price));
      queryString += ` AND price >= $${queryParams.length}`;
    }

    if (maximum_price){
      queryParams.push(parseInt(maximum_price));
      queryString += ` AND price <= $${queryParams.length}`;
    }

  queryString += `ORDER BY price, title;`;

    db.query(queryString, queryParams)
      .then(data => {
        const items = data.rows;
        //console.log(items);
        res.render('index', { items });
        //res.send({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //--GET ONE ITEM--//

  router.get("/:id", (req, res) => {
    const id = req.params.id
    let query = `
    SELECT *
    FROM items
    WHERE id = 1;`;
    db.query(query)
      .then(data => {
        const items = data.rows;
        res.send({ items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //--GET ITEM BY PRICE--//

  // router.get("/", (req, res) => {
  //   let query = `
  //   SELECT *
  //   FROM items
  //   WHERE price BETWEEN 10 AND 100
  //   ORDER BY price, title;`;
  //   db.query(query)
  //     .then(data => {
  //       const items = data.rows;
  //       res.send({ items });
  //       console.log('GET ITEM BY PRICE');
  //     })
  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({ error: err.message });
  //     });
  // });


  //--GET ALL FAVES--// in user.js file move

  // router.get("/favourites", (req, res) => {
  //   const id = req.session.user_id;
  //   const user = users[id];
  //   console.log('ID:', id);
  //   console.log('U:', user);
  //   let query = `
  //   SELECT items.*
  //   FROM items
  //   JOIN favourites ON item_id = items.id
  //   JOIN users ON owner_id = users.id
  //   WHERE user_id = 1
  //   ORDER BY items.date_posted, items.title;`;

  //   db.query(query)
  //     .then(data => {
  //       const items = data.rows;
  //       res.render('favourites', { items });
  //       console.log('FAVE ITEMS LIST');
  //     })
  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({ error: err.message });
  //     });
  // });

  //--ADD TO FAVES--// in favourites.js, pass favourite obj data into body:

  router.post("/favourites", (req, res) => {
    let query = `
    INSERT INTO favourites(user_id, item_id)
    VALUES ($1, $2);`;

    db.query(query, queryParams)
      .then(data => {
        const items = data.rows;
        res.send({ items });
        console.log('ADD NEW FAVE');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

//--DELETE FROM FAVES--//

  router.delete("/favourites/:id", (req, res) => {
    let query = `
    DELETE FROM favourites
    WHERE item_id = 5 AND user_id = 1;`;

    db.query(query)
      .then(data => {
        const items = data.rows;
        res.send({ items });
        console.log('REMOVE FAVE');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //--GET ADD NEW ITEM FORM--//

  router.get("/new") //user id passed through body
  //res.render form

  //--ADD NEW ITEM--//

  router.post("/new", (req, res) => {
    let query = `
    INSERT INTO items (owner_id, title, location, price, description, thumbnail_photo_url, date_posted) VALUES (2, 'CELL2', 'Toronto', 20000, 'message', 'https://i.imgur.com/96St5p8.jpeg', '2022-01-10');`;

    db.query(query)
      .then(data => {
        const items = data.rows;
        res.send({ items });
        console.log('ADD NEW FAVE - POST');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //--DELETE ITEM FROM LISTINGS--//

  //router.delete
  router.delete("/:id", (req, res) => {
    let query = `
    DELETE FROM items
    WHERE items.id = 12;`;

    db.query(query)
      .then(data => {
        const items = data.rows;
        res.send({ items });
        console.log('DELETE ITEM FROM LISTINGS - POST');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //--RETURN ROUTER--//

  return router;
};