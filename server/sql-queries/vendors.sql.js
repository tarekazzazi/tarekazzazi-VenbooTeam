// Get the database connection
const pool = require("../modules/pool");


// -----------------------------------------------------------
// Function that returns the list of vendors from the database
function getVendorsList(req, res) {

  // Initialize the parameters as a blank array
  let sqlParams = [];
  // Initialize a where clause to the set later
  let setWhereClause = ""


  // -------------------------------------------------
  // Determine the logic to use based on the user-type
  switch (req.user.type) {
    // Admin & Host switch case
    case "admin":
    case "host":
      // Keep the `setWhereClause` as a blank string
      break;
    // Vendor switch case
    case "vendor":
      // Set the host-specific query
      setWhereClause = "AND events.user_id = $1"
      // Add the current user to the params list
      sqlParams.push(req.user.id);
      break;
    // Set default case for non-registered users
    // TODO: Add logic for this use-case
    default:
      break;
    // -------------------------------------------------
  }

  // Build the base SQL query
  let sqlQuery = `
    SELECT
      "user".id,
      "user".first_name,
      "user".last_name,
      "user".title,
      "user".business_name,
      "user".description,
      "user".phone,
      "addresses".city,
      "addresses".state,
      COALESCE(json_agg(
        DISTINCT jsonb_build_object(
          'id', "events".id,
          'name', "events".name,
          'venue_id', "events".venue_id,
          'description', "events".description,
          'start_date', "events".start_date,
          'end_date', "events".end_date,
          'approved_by_host', "booth_applications".approved_by_host
        )
      ) FILTER (WHERE events.id IS NOT NULL), '[]') AS events,
      COALESCE(json_agg(DISTINCT "tags".*)
        FILTER (WHERE "tags"."id" IS NOT NULL), '[]')
        AS tags
    FROM "user"
    JOIN "addresses"
      ON "user".address_id = "addresses".id
    JOIN "booth_applications"
      ON "user".id = "booth_applications".user_id
    JOIN "booths"
      ON "booths".id = "booth_applications".booth_id
    JOIN "events"
      ON "events".id = "booths".event_id
    LEFT JOIN "vendor_tags"
      ON "user".id = "vendor_tags".user_id
    LEFT JOIN "tags"
      ON "tags".id = "vendor_tags".tag_id
    WHERE "user".type = 'vendor'
      AND "booth_applications".approved_by_host != 'REJECTED'
      ${setWhereClause}
    GROUP BY "user".id, "addresses".city, "addresses".state;`


  // Create the pool query
  pool
    .query(sqlQuery, sqlParams)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log(`Error in get vendor router with ${error}`);
      res.sendStatus(500);
    })
}


// -----------------------------------------------------------
// Function that returns cost values from the database over
// a time range for an admin user
function getCostsOverTimeRange(req, res) {

  // Only allow admins to to access the query
  if (req.user.type !== "admin") {
    return res.sendStatus(401)
  }

  // Set the sqlQuery
  const sqlQuery = `
    SELECT
      events.id,
      events.user_id,
      events.description,
      events.name,
      events.start_date,
      events.end_date,
      events.venue_id,
      events.verified,
      COALESCE(json_agg(
        DISTINCT jsonb_build_object(
          'id', "booth_applications".id,
          'business_name', "user".business_name,
          'description', "user".description,
          'booth_cost', "booths".cost,
          'income', ROUND("booths".cost  * "booths".service_charge, 2),
          'host_payment', ROUND("booths".cost - ("booths".cost  * "booths".service_charge), 2)
        )
      ) FILTER (WHERE "booth_applications".id IS NOT NULL), '[]')
        AS "approved_booths"
    FROM "events"
    JOIN "booths"
      ON "events".id = "booths".event_id
    JOIN "booth_applications"
      ON "booths".id = "booth_applications".booth_id
    JOIN "user"
      ON "user".id = "booth_applications".user_id
    WHERE "booth_applications".approved_by_host = 'APPROVED'
    GROUP BY "events".id;
  `

  // Make the request to database
  pool.query(sqlQuery)
  .then((result) => {
    res.send(result.rows);
  })
  .catch((error) => {
    console.log(`Error in get approved-vendor-booth router with ${error}`);
    res.sendStatus(500);
  })
}


// -----------------------------------------------------------
// Function that gets a list of all vendors from the database
function getAllVendors(req, res) {

  // Set the SQL query
  const sqlQuery = `
    SELECT
      "user".id,
      "user".first_name,
      "user".last_name,
      "user".title,
      "user".business_name,
      "user".description,
      "user".phone,
      "addresses".city,
      "addresses".state,
      COALESCE(json_agg(DISTINCT "tags".*)
        FILTER (WHERE tags.id IS NOT NULL), '[]')
        as tags
      FROM "user"
      JOIN "addresses"
        ON "user".address_id = "addresses".id
      LEFT JOIN "vendor_tags"
        ON "user".id = "vendor_tags".user_id
      LEFT JOIN "tags"
        ON "tags".id = "vendor_tags".tag_id
      WHERE "user".type = 'vendor'
      GROUP BY "user".id, "addresses".city, "addresses".state;
  `

  // Query the database
  pool.query(sqlQuery)
   .then((result) => {
    return res.send(result.rows);
  })
  .catch((error) => {
    console.log(`Error in get vendor router with ${error}`);
    return res.sendStatus(500);
  });
}

module.exports = { getAllVendors, getCostsOverTimeRange, getVendorsList }