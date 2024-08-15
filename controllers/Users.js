import User from "../models/UserModel.js";
//import db from "../config/Database.js";
import argon2 from "argon2";
import {Op} from "sequelize";
import nodemailer from "nodemailer";
import multer from "multer";


// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile_pictures/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('profilePicture');


export const uploadProfilePicture = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(500).json({ msg: "Error uploading profile picture" });
        }
        const profilePictureUrl = req.file.path;
        return res.status(200).json({ profilePictureUrl: profilePictureUrl });
    });
};

// Function to get all users
export const getUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search_query || ""; // Modified to accept flexible search query
    const offset = limit * page;
    let whereCondition = {};

    if (searchQuery) {
        whereCondition = {
            [Op.or]: [
                { fullname: { [Op.like]: '%' + searchQuery + '%' } },
                { email: { [Op.like]: '%' + searchQuery + '%' } },
                { role: { [Op.like]: '%' + searchQuery + '%' } }
                
            ]
        };
    }

    const totalRows = await User.count({ where: whereCondition });
    const totalPage = Math.ceil(totalRows / limit);
    const result = await User.findAll({
        where: whereCondition,
        offset: offset,
        limit: limit,
        order: [['id', 'DESC']]
    });

    res.json({
        result
        // page: page,
        // limit: limit,
        // totalRows: totalRows,
        // totalPage: totalPage
    });
};


export const getUserById = async(req, res) =>{
    try {
        const response = await User.findOne({
            attributes:['id', 'firstname', 'lastname', 'gender', 'numTel', 'birthday', 'email', 'role', 'profilePicture'],
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

////////////////////////////////////////////////////////
// Create a transporter using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "arij.ghazouani22@gmail.com", // SMTP username
        pass: "wyzf qrvy pzuf ljob", // SMTP password
    },
});

export const createUser = async (req, res) => {
    const { firstname, lastname, gender, numTel, birthday, email, password, confPassword, role } = req.body;
    
    // Check if password matches confirm password
    if (password !== confPassword) {
        return res.status(400).json({ msg: "Password and Confirm Password do not match" });
    }

   try {
        // Hash the password before storing it
        const hashPassword = await argon2.hash(password);

        // Create the user in the database
        await User.create({
            firstname: firstname, 
            lastname:lastname , 
            gender: gender, 
            numTel: numTel, 
            birthday: birthday,
            email: email,
            password: password,
            role: role
        });

        // Send email to the new user
        const mailOptions = {
            from: "arij.ghazouani22@gmail.com",
            to: email,
            subject: "Welcome to Our Application",
            html: `
                <p>Hello ${firstname} ${lastname},</p>
                <p>Your account has been created successfully.</p>
                <p>Your password: ${password}</p>
                <p>Please login using the credentials provided.</p>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                // Handle email sending error
            } else {
                console.log("Email sent:", info.response);
                // Email sent successfully
            }
        });

        res.status(201).json({ msg: "User added successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(400).json({ msg: error.message });
    }
};


// Block user account
export const blockUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        await User.update({ isActive: false }, { where: { id: userId } });
        res.status(200).json({ msg: "User blocked successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Activate user account
export const activateUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        await User.update({ isActive: true }, { where: { id: userId } });
        res.status(200).json({ msg: "User activated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const updateUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User not found"});
    const {firstname, lastname, email, password, confPassword, gender, birthday, numTel } = req.body;
    let hashPassword;
    if(password === "" || password === null){
        hashPassword = user.password
    }else{
        hashPassword = await argon2.hash(password);
    }
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    try {
        await User.update({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashPassword, 
            gender: gender,
            birthday: birthday,
            numTel: numTel
        },{
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const deleteUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "User not found"});
    try {
        await User.destroy({
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}



/*
export const updateUser = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    const { firstname, lastname, email, password, confPassword, role, isActive } = req.body;

    // Handle password update
    let hashPassword = user.password;
    if (password && confPassword && password === confPassword) {
        hashPassword = await argon2.hash(password);
    } else if (password && confPassword && password !== confPassword) {
        return res.status(400).json({ msg: "Password and Confirm Password do not match" });
    }

    // Handle role update
    const updatedRole = role || user.role;

    // Handle activation status update
    const updatedIsActive = isActive !== undefined ? isActive : user.isActive;

    try {
        await user.update({
            firstname: firstname || user.firstname,
            lastname: lastname || user.lastname
            email: email || user.email,
            password: hashPassword,
            role: updatedRole,
            isActive: updatedIsActive
        });

        res.status(200).json({ msg: "User Updated" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}
*/

////////




/*export const getUsers = async(req, res) =>{
    try {
        const response = await User.findAll({
            attributes:['id','fullname','email','role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}*/


/*export const createUser = async(req, res) =>{
    const {fullname, email, password, confPassword, role} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            fullname: fullname,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({msg: "User added Successfully"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}*/














/*
// Function to get all users
export const getUsers = async (req, res) => {
    try {
      const query = `
        SELECT id, fullname, email, role
        FROM users
      `;
      const [rows, fields] = await db.query(query);
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ msg: "Internal server error" });
    }
  };
  
  // Function to get a single user by ID
  export const getUserById = async (req, res) => {
    const userId = req.params.id; // Get the user ID from the request parameters
    try {
        const user = await db.query('SELECT id, fullname, email, role FROM users WHERE id = ?', {
            replacements: [userId],
            type: db.QueryTypes.SELECT
        }); // Fetch user by ID using raw SQL query

        if (user.length === 0) {
            return res.status(404).json({ msg: "User not found" }); // Handle case where user is not found
        }

        res.status(200).json(user[0]); // Respond with the fetched user
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ msg: "Internal server error" }); // Handle other errors
    }
}

  
  // Function to create a new user
  export const createUser = async (req, res) => {
    const { fullname, email, password, role } = req.body; // Destructure user details from req.body
    try {
        const newUser = await db.query('INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)', {
            replacements: [fullname, email, password, role],
            type: db.QueryTypes.INSERT
        }); // Insert new user using raw SQL query

        res.status(201).json({ msg: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ msg: "Internal server error" }); // Handle other errors
    }
}

  
  // Function to update a user
  export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ msg: "User ID is required" });
        }

        const { fullname, email, role } = req.body;
        if (!fullname || !email || !role) {
            return res.status(400).json({ msg: "Fullname, email, and role are required fields" });
        }

        await db.query('UPDATE users SET fullname = ?, email = ?, role = ? WHERE id = ?', {
            replacements: [fullname, email, role, userId],
            type: db.QueryTypes.UPDATE
        });

        res.status(200).json({ msg: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
}

  
  // Function to delete a user
  export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ msg: "User ID is required" });
        }

        await db.query('DELETE FROM users WHERE id = ?', {
            replacements: [userId],
            type: db.QueryTypes.DELETE
        });

        res.status(200).json({ msg: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
}

*/

