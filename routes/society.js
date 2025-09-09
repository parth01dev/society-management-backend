import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import { createSociety, getAllSocieties, getSocietyById, updateSociety, deleteSociety, addWingToSociety, getWingsOfSociety, addFloorToWing, getFloorsOfWing, addFlatToFloor, getFlatsOfFloor, getPendingJoinRequests, requestToJoinFlat, respondToJoinRequest } from '../controllers/societyController.js';

const router = Router();

// 1. Society CRUD routes (authentication required)
router.post('/create', authMiddleware, createSociety);  // Create a new society
router.get('/', authMiddleware, getAllSocieties);  // Get all societies
router.get('/:id', authMiddleware, getSocietyById);  // Get society by ID
router.put('/:id', authMiddleware, updateSociety);  // Update a society
router.delete('/:id', authMiddleware, deleteSociety);  // Delete a society

// 2. Wing CRUD routes (authentication required)
router.post('/:id/wing', authMiddleware, addWingToSociety);  // Add a wing to a society
router.get('/:id/wings', authMiddleware, getWingsOfSociety);  // Get wings of a society

// 3. Floor CRUD routes (authentication required)
router.post('/:societyId/wing/:wingId/floor', authMiddleware, addFloorToWing);  // Add a floor to a wing
router.get('/:societyId/wing/:wingId/floors', authMiddleware, getFloorsOfWing);  // Get all floors of a wing

// 4. Flat CRUD routes (authentication required)
router.post('/:societyId/wing/:wingId/floor/:floorNumber/flat', authMiddleware, addFlatToFloor);  // Add flat to a floor
router.get('/:societyId/wing/:wingId/floor/:floorNumber/flats', authMiddleware, getFlatsOfFloor);  // Get all flats of a floor

router.get('/society/:societyId/wing/:wingId/floor/:floorNumber/flat/:flatNumber/requests/pending', getPendingJoinRequests);
// 5. Resident join request routes (authentication required)
router.post('/request-to-join', authMiddleware, requestToJoinFlat);  // Send request to join a flat
router.post('/respond-to-join-request', authMiddleware, respondToJoinRequest);  // Accept/Reject join request

export default router;
