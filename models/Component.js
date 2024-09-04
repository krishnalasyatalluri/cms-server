// const mongoose = require('mongoose');
 
// const ComponentSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
//     subComponents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubComponent' }]
// });
 
// module.exports = mongoose.model('Component', ComponentSchema);
const mongoose = require('mongoose');
 
const ComponentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    subComponents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubComponent' }],
    htmlContent: {
        type: String
    },
    images: [{ type: String }]
});
 
module.exports = mongoose.model('Component', ComponentSchema);
 