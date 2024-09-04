const express = require('express');
const Project = require('../models/Project');
const router = express.Router();
const Component = require('../models/Component');
const SubComponent=require('../models/SubComponent')
// Create Project
router.post('/create', async (req, res) => {
    // const { name } = req.body;
 
    // try {
    //     const project = new Project({ name });
    //     await project.save();
    //     res.status(201).json({ message: 'Project created successfully', projectId: project._id, projectName: project.name });
    // } catch (err) {
    //     res.status(400).json({ error: err.message });
    // }
    const { name, htmlContent } = req.body; // Expecting HTML content
 
    try {
        const newProject = new Project({
            name: name || htmlContent // Save HTML content if that's what you want to use
        });
 
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(500).json({ error: 'Error creating project' });
    }
});
 
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find({});
        res.status(200).json({ projects });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
 
router.get('/name/:projectId', async (req, res) => {
    const { projectId } = req.params;
 
    try {
        const project = await Project.findById(projectId).select('name'); // Fetch only the name field
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json({ project });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'An error occurred while fetching the project' });
    }
});
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the project and populate components and subcomponents
        const project = await Project.findById(id)
            .populate({
                path: 'components',
                model: 'Component',
                populate: {
                    path: 'subComponents',
                    model: 'SubComponent'
                }
            });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Send the populated project data as a response
        res.status(200).json({ project });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'An error occurred while fetching the project' });
    }
});

 
// router.get('/all-projects', async (req, res) => {
//     try {
//         const projects = await Project.find({})
//             .populate({
//                 path: 'components',
//                 populate: {
//                     path: 'subComponents',
//                     model: 'SubComponent'
//                 }
//             });
 
//         res.status(200).json({ projects });
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });
// router.get('/all-projects', async (req, res) => {
//     try {
//         // Fetch all projects and populate components and subcomponents
//         const projects = await Project.find({})
//             .populate({
//                 path: 'components', // Populate the components field
//                 model: 'Component',
//                 populate: {
//                     path: 'subComponents', // Within each component, populate the subComponents field
//                     model: 'SubComponent'
//                 }
//             });
 
//         // Logging the projects for debugging
//         console.log(JSON.stringify(projects, null, 2));
 
//         // Send the populated projects data as a response
//         res.status(200).json({ projects });
//     } catch (err) {
//         console.error('Error fetching projects:', err); // Log errors for debugging
//         res.status(400).json({ error: err.message });
//     }
// });
router.get('/all-projects', async (req, res) => {
    try {
        // Fetch all projects and populate components and subcomponents
        const projects = await Project.find({})
            .populate({
                path: 'components',
                populate: {
                    path: 'subComponents',
                    model: 'SubComponent'
                }
            });
 
        // Logging the projects for debugging
        console.log(JSON.stringify(projects, null, 2));
 
        // Send the populated projects data as a response
        res.status(200).json({ projects });
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(400).json({ error: err.message });
    }
});
 
 
module.exports = router;
 