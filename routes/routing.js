const express = require('express');

const RoutingService = require('./../services/routing');

const router = express.Router();
const service = new RoutingService();


router.get('/optimal-route',
  async (req, res, next) => {
    try {
      const {
        maximun_distance,
        considerer_traffic,
        plot,
        maximun_distance_between_points
      } = req.body;

      const route = await service.getOptimalRoute(
        maximun_distance,
        considerer_traffic,
        plot,
        maximun_distance_between_points
      );
      res.json(route);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
