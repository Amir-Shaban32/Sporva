import { Request , Response } from "express";


export const getUsers = (req:Request , res:Response) => {

    try {
        res.status(200).json({
            message:"All users"
        })
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        res.status(500).json({
            status: "fail",
            message: err.message
        })
    };
}