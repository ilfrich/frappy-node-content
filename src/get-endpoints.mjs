const getEndpoints = (app, contentStore, authMiddleware, options = {}) => {
    const apiPrefix = options.apiPrefix || "/api/content"

    // get all content items
    app.get(apiPrefix, authMiddleware, (req, res) => {
        const { references, contentType } = req.query
        let basePromise
        if (references != null) {
            if (contentType != null) {
                basePromise = contentStore.findByReferenceAndType(references, contentType)
            } else {
                basePromise = contentStore.findByReference(references)
            }
        } else if (contentType != null) {
            basePromise = contentStore.findByType(contentType)
        }
        else {
            basePromise = contentStore.getAll()
        }

        basePromise
            .then(items => {
                res.send(items)
            })
            .catch(err => {
                console.log("Error retrieving content", err)
                res.status(500).send({ status: "Cannot retrieve content" })
            })
    })

    app.get(`${apiPrefix}/:contentId`, authMiddleware, (req, res) => {
        contentStore.get(req.params.contentId).then(content => {
            if (content == null) {
                res.status(404).send({ status: "Not found" })
                return
            }
            res.send(content)
        })
    })
}

export default getEndpoints
