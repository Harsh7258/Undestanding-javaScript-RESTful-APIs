import express from 'express';
import { createUser, getUserByEmail } from './../db/users';
import { authentication, random } from './../helpers/index'; 

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.sendStatus(404);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if(!user){
            return res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication.salt, password);
        if(user.authentication.password !== expectedHash){
            return res.sendStatus(400);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('RESTFUL-API-REHT', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

        return res.status(200).json({
            status: 'success',
            data: user
        }).end()

    } catch (error) {
        console.log(error);
        res.sendStatus(404);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;
        if(!username || !password || !email) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);
        if(existingUser) {
            return res.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        return res.status(200).json({
            status: 'success',
            data: user
        }).end();
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
};

function aysnc(req: any, Request: any, res: any, Response: any) {
    throw new Error('Function not implemented.');
}
