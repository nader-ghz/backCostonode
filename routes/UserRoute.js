import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    blockUser, 
    activateUser,
    uploadProfilePicture
} from "../controllers/Users.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', verifyUser, adminOnly, getUserById);
router.post('/users',  createUser);
//router.patch('/users/:id', verifyUser, adminOnly, updateUser);
router.patch('/users/:id', verifyUser,adminOnly,  updateUser);
router.delete('/users/:id', verifyUser, adminOnly, deleteUser);
router.put('/users/:id/block', verifyUser, adminOnly, blockUser);
router.put('/users/:id/activate', verifyUser, adminOnly, activateUser);

// Route for uploading profile pictures
router.post('/users/upload-profile-picture', verifyUser, uploadProfilePicture);



export default router;