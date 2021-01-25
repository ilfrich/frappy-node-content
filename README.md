# Node Content

NodeJS functionality to Manage And Use Content 

## Usage

This example uses the MongoDB store to store content. You can replace that if needed with the MySQL store for content.
You can use your own auth middleware if you desire.

So, this example only works with: `npm i -S @frappy/node-authentication @frappy/js-mongo-content-store @frappy/node-content mongodb express body-parser`

```javascript
import express from "express"
import bodyParser from "body-parser"
import nodeContent from "@frappy/node-content"
import { authMiddleware } from "@frappy/node-authentication"
import { ContentStore } from "@frappy/js-mongo-content-store"
import mongodb from "mongodb"

// app configuration with default fallbacks
const HTTP_PORT = process.env.PORT || 3000  // port with fallback to 3000
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017"

// create express app
const app = express()
// mount parser for application/json content
app.use(bodyParser.json({ limit: "100mb" }))


// create mongoDB connection
mongodb.MongoClient.connect(MONGO_URL, {
    useNewUrlParser: true,
}).then(client => {
	// initialise store
    const contentStore = new CoontentStore(client, "playbook", "content")
	
    // register endpoints
	
    const tokenCache = {}
    // requires permission "content" to manage content
    nodeContent.registerAdminEndpoints(app, contentStore, authMiddleware("content", tokenCache))  
    nodeContent.registerGetEndpoints(app, contentStore, authMiddleware(null, tokenCache))
})


// Start the app
app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`)
})
```

## Options

**`registerAdminEndpoints`** has the following options:

- `apiPrefix` - default `/api/content` - the prefix under which to register the API endpoints for content administration

**`registerGetEndpoints`** has the following options:

- `apiPrefix` - default `/api/content` - the prefix under which to register the API endpoints for content retrieval.

