const crypto = require('crypto');

// Telegram Mini App data validation
function validateTelegramData(initData) {
  try {
    // Parse the init data
    const params = new URLSearchParams(initData);
    
    // Check if hash is present
    const hash = params.get('hash');
    if (!hash) {
      console.log('No hash found in init data');
      return false;
    }
    
    // Remove hash from params for validation
    params.delete('hash');
    
    // Sort parameters alphabetically
    const sortedParams = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    // Create secret key (in production, this should be your bot token)
    const secretKey = process.env.TELEGRAM_BOT_TOKEN || 'test_secret_key';
    
    // Create HMAC-SHA-256 hash
    const hmac = crypto.createHmac('sha256', 'WebAppData');
    hmac.update(secretKey);
    hmac.update(sortedParams);
    const calculatedHash = hmac.digest('hex');
    
    // Compare hashes
    const isValid = calculatedHash === hash;
    
    if (!isValid) {
      console.log('Hash validation failed');
      console.log('Expected:', calculatedHash);
      console.log('Received:', hash);
    }
    
    return isValid;
  } catch (error) {
    console.error('Error validating Telegram data:', error);
    return false;
  }
}

// Extract user information from init data
function extractUserInfo(initData) {
  try {
    const params = new URLSearchParams(initData);
    
    const userInfo = {
      id: params.get('user.id'),
      first_name: params.get('user.first_name'),
      last_name: params.get('user.last_name'),
      username: params.get('user.username'),
      language_code: params.get('user.language_code'),
      is_premium: params.get('user.is_premium') === 'true',
      allows_write_to_pm: params.get('user.allows_write_to_pm') === 'true'
    };
    
    // Clean up undefined values
    Object.keys(userInfo).forEach(key => {
      if (userInfo[key] === null) {
        delete userInfo[key];
      }
    });
    
    return userInfo;
  } catch (error) {
    console.error('Error extracting user info:', error);
    return null;
  }
}

// Extract chat information from init data
function extractChatInfo(initData) {
  try {
    const params = new URLSearchParams(initData);
    
    const chatInfo = {
      id: params.get('chat.id'),
      type: params.get('chat.type'),
      title: params.get('chat.title'),
      username: params.get('chat.username'),
      photo_url: params.get('chat.photo.url')
    };
    
    // Clean up undefined values
    Object.keys(chatInfo).forEach(key => {
      if (chatInfo[key] === null) {
        delete chatInfo[key];
      }
    });
    
    return chatInfo;
  } catch (error) {
    console.error('Error extracting chat info:', error);
    return null;
  }
}

// Extract start parameter from init data
function extractStartParam(initData) {
  try {
    const params = new URLSearchParams(initData);
    return params.get('start_param');
  } catch (error) {
    console.error('Error extracting start param:', error);
    return null;
  }
}

// Validate user permissions
function validateUserPermissions(userInfo, requiredPermissions = []) {
  if (!userInfo || !userInfo.id) {
    return {
      valid: false,
      reason: 'No valid user information'
    };
  }
  
  // Check if user is banned (implement your own ban logic)
  if (isUserBanned(userInfo.id)) {
    return {
      valid: false,
      reason: 'User is banned'
    };
  }
  
  // Check if user has required permissions
  for (const permission of requiredPermissions) {
    if (!hasPermission(userInfo, permission)) {
      return {
        valid: false,
        reason: `Missing permission: ${permission}`
      };
    }
  }
  
  return {
    valid: true,
    userInfo: userInfo
  };
}

// Check if user is banned (placeholder implementation)
function isUserBanned(userId) {
  // Implement your own ban logic here
  // For example, check against a database of banned users
  const bannedUsers = process.env.BANNED_USERS ? 
    process.env.BANNED_USERS.split(',').map(id => id.trim()) : [];
  
  return bannedUsers.includes(userId.toString());
}

// Check if user has specific permission (placeholder implementation)
function hasPermission(userInfo, permission) {
  // Implement your own permission logic here
  // For example, check user roles, premium status, etc.
  
  switch (permission) {
    case 'premium':
      return userInfo.is_premium === true;
    case 'write_pm':
      return userInfo.allows_write_to_pm === true;
    case 'admin':
      // Check if user is admin (implement your own admin logic)
      return false;
    default:
      return true; // Default to allowing access
  }
}

// Create a secure session token
function createSessionToken(userId, timestamp = Date.now()) {
  const secret = process.env.SESSION_SECRET || 'default_session_secret';
  const data = `${userId}:${timestamp}`;
  
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(data);
  const signature = hmac.digest('hex');
  
  return `${data}:${signature}`;
}

// Validate session token
function validateSessionToken(token) {
  try {
    const parts = token.split(':');
    if (parts.length !== 3) {
      return { valid: false, reason: 'Invalid token format' };
    }
    
    const [userId, timestamp, signature] = parts;
    const secret = process.env.SESSION_SECRET || 'default_session_secret';
    const data = `${userId}:${timestamp}`;
    
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(data);
    const calculatedSignature = hmac.digest('hex');
    
    if (signature !== calculatedSignature) {
      return { valid: false, reason: 'Invalid signature' };
    }
    
    // Check if token is expired (24 hours)
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (tokenAge > maxAge) {
      return { valid: false, reason: 'Token expired' };
    }
    
    return {
      valid: true,
      userId: userId,
      timestamp: parseInt(timestamp)
    };
  } catch (error) {
    console.error('Error validating session token:', error);
    return { valid: false, reason: 'Token validation error' };
  }
}

// Rate limiting for API calls
const rateLimitStore = new Map();

function checkRateLimit(userId, action, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const key = `${userId}:${action}`;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, []);
  }
  
  const requests = rateLimitStore.get(key);
  
  // Remove old requests outside the time window
  const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
  rateLimitStore.set(key, validRequests);
  
  // Check if limit is exceeded
  if (validRequests.length >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: validRequests[0] + windowMs
    };
  }
  
  // Add current request
  validRequests.push(now);
  
  return {
    allowed: true,
    remaining: limit - validRequests.length,
    resetTime: now + windowMs
  };
}

// Clean up old rate limit entries
setInterval(() => {
  const now = Date.now();
  const maxAge = 5 * 60 * 1000; // 5 minutes
  
  for (const [key, requests] of rateLimitStore.entries()) {
    const validRequests = requests.filter(timestamp => now - timestamp < maxAge);
    if (validRequests.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, validRequests);
    }
  }
}, 60000); // Clean up every minute

// Log security events
function logSecurityEvent(event, userId, details = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event: event,
    userId: userId,
    details: details,
    ip: details.ip || 'unknown'
  };
  
  console.log('SECURITY EVENT:', JSON.stringify(logEntry));
  
  // In production, you might want to send this to a logging service
  // or store it in a database for monitoring
}

module.exports = {
  validateTelegramData,
  extractUserInfo,
  extractChatInfo,
  extractStartParam,
  validateUserPermissions,
  createSessionToken,
  validateSessionToken,
  checkRateLimit,
  logSecurityEvent
}; 