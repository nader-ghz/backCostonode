import User from "../models/UserModel.js";
//import db from "../config/Database.js";
import argon2 from "argon2";

export const Login = async (req, res) =>{
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });

    if(!user) return res.status(404).json({msg: "User not found"});
    if (!user.isActive) return res.status(403).json({ msg: "Account is inactive" }); // Add this line
    
    const match = await argon2.verify(user.password, req.body.password);
    if(!match) return res.status(400).json({msg: "Wrong Password"});
    
    req.session.userId = user.id;
    //const { id, firstname, lastname, email, role } = user;
    const id = user.id;
    const firstname = user.firstname;
    const lastname = user.lastname;
    const email = user.email;
    const role = user.role;
    res.status(200).json({id,firstname, lastname, email, role});
}

export const Me = async (req, res) =>{
    if(!req.session.userId){
        return res.status(401).json({msg: "Please log in to your account!"});
    }
    const user = await User.findOne({
        attributes:['id','firstname', 'lastname' ,'email','role'],
        where: {
            id: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User not found"});
    res.status(200).json(user);
}

export const logOut = (req, res) =>{
    req.session.destroy((err)=>{
        if(err) return res.status(400).json({msg: "Unable to logout"});
        res.status(200).json({msg: "You have logged out"});
    });
}

/*
export const Login = async (req, res) => {
    const { email, password } = req.body; // Destructure email and password from req.body
    try {
        const [user, metadata] = await db.query('SELECT * FROM users WHERE email = ?', {
            replacements: [email],
            type: db.QueryTypes.SELECT
        }); // Find user by email using raw SQL query

        if (!user) return res.status(404).json({ msg: "User not found" });

        // Assuming user.password is the hashed password stored in the database
        const match = await argon2.verify(user.password, password); // Verify password
        if (!match) return res.status(400).json({ msg: "Wrong Password" });

        req.session.userId = user.id; // Set session userId

        // Respond with user details
        const { id, fullname, role } = user;
        res.status(200).json({ id, fullname, email, role });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ msg: "Internal server error" }); // Handle other errors
    }
}

export const Me = async (req, res) =>{
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Please log in to your account!" });
    }
    try {
        const userResult = await db.query(
            "SELECT id, fullname, email, role FROM users WHERE id = ?",
            {
                replacements: [req.session.userId],
                type: db.QueryTypes.SELECT
            }
        );
        const user = userResult[0];
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

export const logOut = (req, res) =>{
    req.session.destroy((err)=>{
        if (err) {
            console.error("Error logging out:", err);
            return res.status(400).json({ msg: "Unable to logout" });
        }
        res.status(200).json({ msg: "You have logged out" });
    });
}
*/