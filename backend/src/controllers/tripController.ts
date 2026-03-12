import { Response } from 'express';
import pool from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

export const createTrip = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    const { destination, startDate, endDate, budget } = req.body;

    if (!destination || !startDate || !endDate || budget == null || budget === '') {
      return res.status(400).json({
        message: 'Missing required fields: destination, startDate, endDate, budget',
        success: false,
      });
    }

    const parsedBudget = parseFloat(budget);
    if (Number.isNaN(parsedBudget) || parsedBudget < 0) {
      return res.status(400).json({
        message: 'Budget must be a valid positive number',
        success: false,
      });
    }

    const result = await pool.query(
      `INSERT INTO trips (user_id, destination, start_date, end_date, budget)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING trip_id, user_id, destination, start_date, end_date, budget, created_at`,
      [userId, destination.trim(), startDate, endDate, parsedBudget]
    );

    const trip = result.rows[0];

    res.status(201).json({
      success: true,
      trip: {
        id: trip.trip_id,
        trip_id: trip.trip_id,
        user_id: trip.user_id,
        destination: trip.destination,
        start_date: trip.start_date,
        end_date: trip.end_date,
        budget: Number(trip.budget),
        created_at: trip.created_at,
      },
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      message: 'Failed to create trip',
      success: false,
    });
  }
};
