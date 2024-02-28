import { Request, Response } from "express";
import Earning from "../models/earning.model";
import { loadStripe } from "@stripe/stripe-js";


export async function requestPayout(req: Request<{ id: string }>, res: Response) {
    const stripe = await loadStripe(process.env.STRIPE_API_KEY!);
    const id = req.params.id;
}

export async function connectInitiate(req: Request, res: Response) {}

export async function connectCallback(req: Request, res: Response) {}
