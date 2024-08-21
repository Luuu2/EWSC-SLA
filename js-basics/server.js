const express = require("express");
const path = require("path");
const sql = require("mssql/msnodesqlv8");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database configuration
const config = {
  driver: "msnodesqlv8",
  connectionString:
    "Driver={ODBC Driver 17 for SQL Server};Server=192.168.255.44,1433;Database=EWSC_SLAs;Uid=sa;Pwd=Astounding*02;",
};

// Connect to SQL Server
sql.connect(config, (err) => {
  if (err) console.log(err);
  else console.log("Connected to Microsoft SQL Server");
});

// API route to handle writing data
app.post("/api/saveData", (req, res) => {
  const { username, password } = req.body;
  const query = `INSERT INTO dbo.SystemUsers (email, passw) VALUES (@username, @password)`;

  const request = new sql.Request();
  request.input("username", sql.VarChar, username);
  request.input("password", sql.VarChar, password);

  request.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.send({ success: false, message: "Failed to save data." });
    } else {
      res.send({ success: true, message: "Data saved successfully!" });
    }
  });
});

// API route to handle reading data
app.get("/api/getData", (req, res) => {
  const query = "SELECT * FROM dbo.SystemUsers";

  const request = new sql.Request();
  request.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.send([]);
    } else {
      res.send(result.recordset);
    }
  });
});

//session management
app.use(
  session({
    secret:
      "93 d2 76 2e 35 14 9f f3 04 65 ee 7e db b6 1f ea 52 e7 89 28 db 5b 94 d6 ef f2 e3 3a 94 1a fc 77 b8 19 3f 63 32 f3 d1 f0 1c 49 bd cc 2c 7b ad b1 ba 6c 82 4e 76 15 db d9 a4 d3 b8 5c b7 91 c1 03", // replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true if using HTTPS
  })
);

// API route to check username and password
app.post("/api/checkCredentials", (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM dbo.SystemUsers WHERE name = @username AND passw = @password`;

  const request = new sql.Request();
  request.input("username", sql.VarChar, username);
  request.input("password", sql.VarChar, password);

  request.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.send({ success: false, message: "Database query failed." });
    } else {
      if (result.recordset.length > 0) {
        req.session.username = username;
        res.send({ success: true, message: "Login successful!" });
      } else {
        res.send({ success: false, message: "Invalid username or password." });
      }
    }
  });
});

// Add this route to handle SLA data saving
app.post("/api/saveSLA", (req, res) => {
  const { department, date, slaEntries } = req.body;
  const departmentId = 0;

  // Insert SLA data into the database
  const insertQuery = `
        INSERT INTO dbo.SLA_Entry (Dep_id,Quarter_, Date_year, Service_descr,Customer_resp, Service_level)
        VALUES (@department,@quarter, @date, @sla, @customerRes ,@serviceLevel)
    `;

  slaEntries.forEach((entry) => {
    const request = new sql.Request();
    request.input("department", sql.Int, department);
    request.input("quarter", sql.NVarChar, quarter);
    request.input("date", sql.Date, date);
    request.input("sla", sql.NVarChar, entry.sla);
    request.input("customerRes", sql.NVarChar, entry.customerRes);
    request.input("serviceLevel", sql.NVarChar, entry.serviceLevel);

    request.query(insertQuery, (err) => {
      if (err) {
        console.error("Database insertion error:", err);
        return res.json({
          success: false,
          message: "Database insertion failed.",
        });
      }
    });
  });

  res.json({ success: true, message: "Data saved successfully!" });
});

// API route to get the username
app.get("/api/getUsername", (req, res) => {
  // Get the username from the session
  const username = req.session.username || "Guest";
  res.json({ username });
});

function getFinancialQuarter(date) {
  date = new Date(date);

  if (isNaN(date.getTime())) {
    console.error("Invalid date");
    return null;
  }

  const month = date.getMonth() + 1; // getMonth() returns month from 0-11, so add 1 to get 1-12
  let quarter;

  if (month >= 4 && month <= 6) {
    quarter = "Q1";
  } else if (month >= 7 && month <= 9) {
    quarter = "Q2";
  } else if (month >= 10 && month <= 12) {
    quarter = "Q3";
  } else {
    quarter = "Q4";
  }

  return quarter;
}

app.post("/api/sla", async (req, res) => {
  let connection;
  try {
    // Establish the database connection
    connection = await sql.connect(config);

    const dateEntered = new Date(req.body.qrtDate);
    const quarter = getFinancialQuarter(dateEntered);
    const yearEntered = dateEntered;

    // Prepare an array to hold all SLA entries
    const slaEntries = [];

    // Process each SLA entry
    for (let i = 1; i <= 5; i++) {
      if (req.body[`sla${i}`]) {
        slaEntries.push({
          Dep_ID: req.body.department,
          Quarter_: quarter,
          Date_year: yearEntered,
          Service_desc_: req.body[`sla${i}`],
          Customer_resp: req.body[`customerRes${i}`],
          Service_level: req.body[`serviceLevel${i}`],
        });
      }
    }

    // Insert each SLA entry into the database
    for (const entry of slaEntries) {
      const request1 = new sql.Request(); // Create a new request for each entry

      request1.input("Dep_ID", sql.Int, entry.Dep_ID);
      request1.input("Quarter", sql.VarChar, entry.Quarter_);
      request1.input("DateYear", sql.Date, entry.Date_year);
      request1.input("ServiceDesc", sql.VarChar, entry.Service_desc_);
      request1.input("CustomerResp", sql.VarChar, entry.Customer_resp);
      request1.input("ServiceLevel", sql.VarChar, entry.Service_level);

      await request1.query(`
        INSERT INTO SLA_Entry (
            Dep_ID, Quarter_, Date_year, Service_descr, Customer_resp, Service_level
        ) VALUES (
            @Dep_ID, @Quarter, @DateYear, @ServiceDesc, @CustomerResp, @ServiceLevel
        )
      `);
    }
    res.json({ success: true, message: "SLA data saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred while saving the SLA data",
    });
  } finally {
    // Close the connection only if it was successfully opened
    if (connection) {
      await sql.close();
    }
  }
});

// Routes to serve HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/SLAentry", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "SLAentry.html"));
});

app.get("/SLArating", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "SLArating.html"));
});

app.get("/ImprvActn", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ImprvActn.html"));
});

app.get("/CustStats", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "CustStats.html"));
});

app.get("/ConsolRept", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ConsolRept.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
