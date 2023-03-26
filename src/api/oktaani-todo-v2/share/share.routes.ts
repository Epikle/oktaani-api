import express from 'express';

const router = express.Router();

//api/v2/oktaani-todo-v2/share/
router.get('/', (_req, res) => {
  res.sendStatus(200);
});
// router.get('/:id', getShareById);
// router.post('/', createNewShare);
// router.delete('/:id', deleteShareById);

export default router;
