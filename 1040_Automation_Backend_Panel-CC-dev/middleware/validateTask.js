// middleware/validateTask.js
module.exports = (req, res, next) => {
    const {
        client_id,
        sub_client_id,
        task_uid
    } = req.body;
    if (!client_id || !sub_client_id || !task_uid) {
        return res.status(400).json({ error: 'client_id, sub_client_id, and task_uid are required.' });
    }
    // Additional validation can be added here
    next();
};
