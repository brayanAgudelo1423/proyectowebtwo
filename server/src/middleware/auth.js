// Session-based authentication middleware
function verifySession(req, res, next) {
  if (!req.session || !req.session.user) return res.status(401).json({ message: 'not authenticated' });
  req.user = req.session.user;
  return next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) return res.status(401).json({ message: 'not authenticated' });
    if (req.session.user.role !== role) return res.status(403).json({ message: 'forbidden' });
    req.user = req.session.user;
    return next();
  };
}

function allowSelfOrRole(role) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) return res.status(401).json({ message: 'not authenticated' });
    const paramId = Number(req.params.id);
    const u = req.session.user;
    if (u.role === role || u.id === paramId) {
      req.user = u;
      return next();
    }
    return res.status(403).json({ message: 'forbidden' });
  };
}

module.exports = { verifySession, requireRole, allowSelfOrRole };
