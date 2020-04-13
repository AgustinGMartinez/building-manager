"use strict";

var validateUserId = function validateUserId(req) {
  if (req.params.user_id && req.params.user_id !== req.user.id.toString()) throw new CustomError(403, 'Sin trampas please');
};

exports.validateUserId = validateUserId;