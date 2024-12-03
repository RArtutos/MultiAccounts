import { Request, Response } from 'express';
import { sql } from '../database/setup.js';
import { logger } from '../utils/logger.js';

export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await sql`
      SELECT * FROM streaming_services
    `;
    res.json({ services });
  } catch (error) {
    logger.error('Error fetching services:', error);
    res.status(500).json({ error: 'Error al obtener los servicios' });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { name, baseUrl, logo } = req.body;
    
    const [service] = await sql`
      INSERT INTO streaming_services (name, base_url, logo)
      VALUES (${name}, ${baseUrl}, ${logo})
      RETURNING *
    `;
    
    res.status(201).json(service);
  } catch (error) {
    logger.error('Error creating service:', error);
    res.status(500).json({ error: 'Error al crear el servicio' });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, baseUrl, logo } = req.body;
    
    const [service] = await sql`
      UPDATE streaming_services
      SET name = ${name}, base_url = ${baseUrl}, logo = ${logo}
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json(service);
  } catch (error) {
    logger.error('Error updating service:', error);
    res.status(500).json({ error: 'Error al actualizar el servicio' });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [service] = await sql`
      DELETE FROM streaming_services
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    logger.error('Error deleting service:', error);
    res.status(500).json({ error: 'Error al eliminar el servicio' });
  }
};