const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

const { createToken } = require('../utils/jwt');

const prisma = require('../utils/db.js');

const { z } = require('zod');


//Schema of user 

const userSchema = z.object({
    name: z.string()
        .min(2, "Le nom doit avoir au moins 2 caractères")
        .max(12, "Le nom ne peut pas dépasser 12 caractères"),
    email: z.string()
        .email("Email invalide") // Vérifie la présence de @ et .
});


//Create one user

function validateUserCreation (req, res, next) {
    //ZOD CHECK VALID 
    const validation = userSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ 
            message: "Données invalides",
            errors: validation.error.errors
        });
    }

    console.log("Validate Checked");
    next();
    //
}


router.post('/register', validateUserCreation, async (req, res) => {
    try {
        // Validation des données avec Zod
        const validation = userSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({ 
                message: "Données invalides",
                errors: validation.error.errors
            });
        }

        const { email, name , password} = req.body;
    
        console.log( email, name, password);
        
        //hash du mdp et enregistrement BDD user (ne pas oublier "npm install bcrypt")
        const saltRounds = 10;

        bcrypt.hash(password, saltRounds, async function(err,hash){
            console.log("hash", hash)

            const user = await prisma.user.create({
                data: {email, name, password: hash}
            })

            return res.json(user);
        })

        //
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur' });
    }
});

router.post('/login', async (req,res,next) =>{
    try{
        const {email, password} = req.body;

        if (!email || !password) {
            throw new Error('Missing arguments')
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });


        bcrypt.compare(password, user.password)
            .then(result => {
                if (result) {
                    const token = createToken({ username: email});
                    return res.status(200).json( token );
                } else {
                    throw new Error('Incorrect credentials');
                }
            });
    }catch (error) {

    }
})

//List all users
router.get('/getall', async (req,res) =>  {
    const users = await prisma.user.findMany();
    return res.json(users)
});

//Show one user details
router.get('/getbyid/:id', async (req,res) =>  {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(id),
        }
    })

    if (!user){
        return res.status(404).json({ message: "This user doesn't exist" });
    }

    return res.json(user)
});


//Update one user data
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { email, name, password } = req.body;
    
        console.log( email, name, password);

        const userexist = await prisma.user.findUnique({
            where: {
                id: parseInt(id),
            }
        })

        if (!userexist) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { email, name, password },
        });

        return res.json(updatedUser)

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur' });
    }
});


//Dete one user*

router.delete('/deleteuser/:id', async (req,res) =>  {
    try{
        const { id } = req.params;

        const userExist = await prisma.user.findUnique({
            where: {
                id: parseInt(id),
            }
        })

        if(!userExist){
            return res.status(500).json({message: 'Utilisateur non trouver'})
        }

        await prisma.user.delete({
            where: { id: parseInt(id) },
        });

        return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Erreur' });
    }
});


module.exports = router;