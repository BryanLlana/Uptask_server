import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/adapter";
import User from "../../data/mongo/models/user.model";

export class AuthMiddleware {
  constructor(){}

  static async validateJwt (req: Request, res: Response, next: NextFunction) {
    const authorization = req.header('Authorization')
    if (!authorization) return res.status(401).json({ error: 'Token no registrado' })
    if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Token bearer inválido'})

    const token = authorization.split(' ')[1] || ''
    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token)
      if (!payload) return res.status(401).json({ error: 'Token no válido' })
      const user = await User.findById(payload.id).select('_id name email')
      if (!user) return res.status(401).json({ error: 'Token no válido'})
      
      req.body.user = user
      next()
    } catch (error) {
      console.log(error);
      res.status(500).json('Internal server error')
    }
  }
}