const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    components: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Component' }],
    htmlContent: { type: String }
});

module.exports = mongoose.model('Project', ProjectSchema);

