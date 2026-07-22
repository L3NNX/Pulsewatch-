import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  listUserMonitors,
  createMonitor,
  getMonitorById,
  updateMonitor,
  deleteMonitor,
  pauseMonitor,
  resumeMonitor,
  checkMonitorNow,
} from '../services/monitorService.js';
import { HttpMethod } from '@prisma/client';

export const createMonitorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  url: z.string().url('A valid HTTP or HTTPS URL is required'),
  method: z.nativeEnum(HttpMethod).optional().default(HttpMethod.GET),
  intervalSeconds: z.coerce.number().min(60, 'Minimum check interval is 60 seconds').default(300),
  timeoutMs: z.coerce.number().min(1000).max(30000).optional().default(10000),
  expectedStatusMin: z.coerce.number().min(100).max(599).optional().default(200),
  expectedStatusMax: z.coerce.number().min(100).max(599).optional().default(399),
});

export const updateMonitorSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  url: z.string().url().optional(),
  method: z.nativeEnum(HttpMethod).optional(),
  intervalSeconds: z.coerce.number().min(60).optional(),
  timeoutMs: z.coerce.number().min(1000).max(30000).optional(),
  expectedStatusMin: z.coerce.number().min(100).max(599).optional(),
  expectedStatusMax: z.coerce.number().min(100).max(599).optional(),
  isActive: z.boolean().optional(),
});

export async function handleListMonitors(req: Request, res: Response, next: NextFunction) {
  try {
    const monitors = await listUserMonitors(req.user!.id);
    res.status(200).json({ monitors });
  } catch (err) {
    next(err);
  }
}

export async function handleCreateMonitor(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createMonitorSchema.parse(req.body);
    const monitor = await createMonitor(req.user!.id, data);
    res.status(201).json({ monitor });
  } catch (err) {
    next(err);
  }
}

export async function handleGetMonitor(req: Request, res: Response, next: NextFunction) {
  try {
    const monitor = await getMonitorById(req.user!.id, req.params.id);
    res.status(200).json({ monitor });
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateMonitor(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateMonitorSchema.parse(req.body);
    const monitor = await updateMonitor(req.user!.id, req.params.id, data);
    res.status(200).json({ monitor });
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteMonitor(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await deleteMonitor(req.user!.id, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function handlePauseMonitor(req: Request, res: Response, next: NextFunction) {
  try {
    const monitor = await pauseMonitor(req.user!.id, req.params.id);
    res.status(200).json({ monitor });
  } catch (err) {
    next(err);
  }
}

export async function handleResumeMonitor(req: Request, res: Response, next: NextFunction) {
  try {
    const monitor = await resumeMonitor(req.user!.id, req.params.id);
    res.status(200).json({ monitor });
  } catch (err) {
    next(err);
  }
}

export async function handleCheckMonitor(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await checkMonitorNow(req.user!.id, req.params.id);
    res.status(200).json({ result });
  } catch (err) {
    next(err);
  }
}

