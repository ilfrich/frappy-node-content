const manageEndpoints = (app, contentStore, authMiddleware, options = {}) => {
    const apiPrefix = options.apiPrefix || "/api/content"

    // create new content element
    app.post(apiPrefix, authMiddleware, (req, res) => {
        contentStore
            .create(req.body)
            .then(newContentId => contentStore.get(newContentId))
            .then(newContent => {
                res.send(newContent)
            })
            .catch(err => {
                console.log("Error creating content", err)
                res.status(500).send({ status: "Could not create content" })
            })
    })

    app.post(`${apiPrefix}/:contentId`, authMiddleware, (req, res) => {
        const { contentId } = req.params
        contentStore
            .get(contentId)
            .then(content => {
                if (content == null) {
                    res.status(404).send({ status: "Not found" })
                    return null
                }

                // update item
                const payload = req.body || {}
                return contentStore
                    .updateContent(contentId, payload.label, payload.references || [], payload.content)
                    .then(() => contentStore.get(contentId))
                    .then(updatedContent => {
                        res.send(updatedContent)
                    })
            })
            .catch(err => {
                console.log("Error updating content", err)
                res.status(500).send({ status: "Could not update content" })
            })
    })

    // delete content
    app.delete(`${apiPrefix}/:contentId`, authMiddleware, (req, res) => {
        const { contentId } = req.params
        contentStore
            .get(contentId)
            .then(content => {
                if (content == null) {
                    res.status(404).send({ status: "Not found" })
                    return null
                }
                return contentStore.delete(contentId).then(() => {
                    res.send({
                        contentId,
                        deleted: true,
                    })
                })
            })
            .catch(err => {
                console.log("Error deleting content", err)
                res.status(500).send({
                    status: "Could not delete content",
                })
            })
    })
}

export default manageEndpoints
