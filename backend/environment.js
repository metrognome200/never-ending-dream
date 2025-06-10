// Environment and world state management
const weatherTypes = {
  clear: {
    name: "Clear",
    description: "The sky is clear and bright.",
    effects: {
      visibility: 100,
      movement: 1.0,
      creature_behavior: "normal"
    }
  },
  
  cloudy: {
    name: "Cloudy",
    description: "Gray clouds cover the sky, dimming the light.",
    effects: {
      visibility: 80,
      movement: 0.9,
      creature_behavior: "cautious"
    }
  },
  
  fog: {
    name: "Foggy",
    description: "Thick fog rolls through the forest, limiting visibility.",
    effects: {
      visibility: 40,
      movement: 0.7,
      creature_behavior: "aggressive"
    }
  },
  
  rain: {
    name: "Rainy",
    description: "Rain falls steadily, making the ground muddy and slippery.",
    effects: {
      visibility: 60,
      movement: 0.8,
      creature_behavior: "seeking_shelter"
    }
  },
  
  storm: {
    name: "Stormy",
    description: "A fierce storm rages, with thunder and lightning.",
    effects: {
      visibility: 30,
      movement: 0.5,
      creature_behavior: "territorial"
    }
  },
  
  mist: {
    name: "Misty",
    description: "A gentle mist hangs in the air, creating an ethereal atmosphere.",
    effects: {
      visibility: 70,
      movement: 0.95,
      creature_behavior: "mysterious"
    }
  }
};

const timeCycles = {
  dawn: {
    name: "Dawn",
    description: "The first light of day breaks over the horizon.",
    effects: {
      visibility: 60,
      creature_behavior: "waking",
      special_events: ["morning_dew", "bird_songs"]
    }
  },
  
  day: {
    name: "Day",
    description: "Bright sunlight filters through the trees.",
    effects: {
      visibility: 100,
      creature_behavior: "active",
      special_events: ["butterflies", "sunlight_beams"]
    }
  },
  
  dusk: {
    name: "Dusk",
    description: "The sun sets, casting long shadows across the forest.",
    effects: {
      visibility: 70,
      creature_behavior: "settling",
      special_events: ["fireflies", "evening_breeze"]
    }
  },
  
  night: {
    name: "Night",
    description: "Darkness falls, broken only by moonlight and stars.",
    effects: {
      visibility: 20,
      creature_behavior: "nocturnal",
      special_events: ["owl_hoots", "starlight"]
    }
  },
  
  midnight: {
    name: "Midnight",
    description: "The deepest part of the night, when magic is strongest.",
    effects: {
      visibility: 10,
      creature_behavior: "magical",
      special_events: ["aurora", "dream_walking"]
    }
  }
};

// Update time based on actions
function updateTime(state) {
  const newState = { ...state };
  const currentTime = newState.time;
  const timeOrder = ['dawn', 'day', 'dusk', 'night', 'midnight'];
  
  // Time progresses with certain actions
  if (newState.lastAction && newState.commandsUsed) {
    const timeSinceLastAction = Date.now() - newState.lastAction;
    const timeThreshold = 5 * 60 * 1000; // 5 minutes
    
    if (timeSinceLastAction > timeThreshold) {
      const currentIndex = timeOrder.indexOf(currentTime);
      const nextIndex = (currentIndex + 1) % timeOrder.length;
      newState.time = timeOrder[nextIndex];
      
      // Advance day count at dawn
      if (newState.time === 'dawn') {
        newState.dayCount = (newState.dayCount || 1) + 1;
      }
    }
  }
  
  return newState;
}

// Process weather changes
function processWeather(state) {
  const newState = { ...state };
  
  // Weather changes randomly but is influenced by time and location
  if (!newState.weatherTimer) {
    newState.weatherTimer = Date.now();
  }
  
  const weatherChangeThreshold = 10 * 60 * 1000; // 10 minutes
  const timeSinceWeatherChange = Date.now() - newState.weatherTimer;
  
  if (timeSinceWeatherChange > weatherChangeThreshold) {
    newState.weather = generateWeather(state);
    newState.weatherTimer = Date.now();
  }
  
  return newState;
}

// Generate weather based on current conditions
function generateWeather(state) {
  const currentWeather = state.weather;
  const currentTime = state.time;
  const location = state.location;
  
  // Weather probabilities based on time
  const timeWeatherChances = {
    dawn: { clear: 0.4, mist: 0.3, cloudy: 0.2, rain: 0.1 },
    day: { clear: 0.5, cloudy: 0.3, rain: 0.15, storm: 0.05 },
    dusk: { clear: 0.3, cloudy: 0.4, fog: 0.2, rain: 0.1 },
    night: { clear: 0.4, cloudy: 0.3, fog: 0.2, mist: 0.1 },
    midnight: { clear: 0.6, mist: 0.3, fog: 0.1 }
  };
  
  // Location-specific weather modifications
  const locationWeatherModifiers = {
    river_bank: { rain: 0.2, storm: 0.1 },
    waterfall: { rain: 0.3, mist: 0.2 },
    dark_cave: { fog: 0.3, mist: 0.2 },
    mysterious_grove: { mist: 0.4, fog: 0.2 }
  };
  
  // Get base chances for current time
  const baseChances = timeWeatherChances[currentTime] || timeWeatherChances.day;
  
  // Apply location modifiers
  const finalChances = { ...baseChances };
  if (locationWeatherModifiers[location]) {
    for (const [weather, modifier] of Object.entries(locationWeatherModifiers[location])) {
      finalChances[weather] = (finalChances[weather] || 0) + modifier;
    }
  }
  
  // Normalize probabilities
  const total = Object.values(finalChances).reduce((sum, chance) => sum + chance, 0);
  for (const weather in finalChances) {
    finalChances[weather] /= total;
  }
  
  // Generate random weather
  const random = Math.random();
  let cumulative = 0;
  
  for (const [weather, chance] of Object.entries(finalChances)) {
    cumulative += chance;
    if (random <= cumulative) {
      return weather;
    }
  }
  
  return 'clear'; // Fallback
}

// Get environmental effects
function getEnvironmentalEffects(state) {
  const weather = weatherTypes[state.weather];
  const time = timeCycles[state.time];
  
  if (!weather || !time) {
    return {
      visibility: 100,
      movement: 1.0,
      creature_behavior: "normal",
      description: ""
    };
  }
  
  // Combine weather and time effects
  const effects = {
    visibility: Math.min(weather.effects.visibility, time.effects.visibility),
    movement: weather.effects.movement,
    creature_behavior: weather.effects.creature_behavior,
    description: `${weather.description} ${time.description}`
  };
  
  // Special effects for certain combinations
  if (state.weather === 'storm' && state.time === 'night') {
    effects.visibility = Math.max(5, effects.visibility - 20);
    effects.movement *= 0.7;
    effects.description += " The storm makes the night even darker and more dangerous.";
  }
  
  if (state.weather === 'fog' && state.time === 'midnight') {
    effects.visibility = Math.max(5, effects.visibility - 15);
    effects.description += " The fog seems to move with a mind of its own in the magical midnight hour.";
  }
  
  return effects;
}

// Get special events based on environment
function getSpecialEvents(state) {
  const events = [];
  const weather = weatherTypes[state.weather];
  const time = timeCycles[state.time];
  
  // Weather-based events
  if (state.weather === 'storm') {
    events.push({
      type: "lightning",
      description: "Lightning flashes, briefly illuminating the forest.",
      effect: "temporary_visibility_boost"
    });
  }
  
  if (state.weather === 'fog') {
    events.push({
      type: "mysterious_sounds",
      description: "Strange sounds echo through the fog, their source unclear.",
      effect: "creature_aggression_increase"
    });
  }
  
  // Time-based events
  if (time.effects.special_events) {
    for (const event of time.effects.special_events) {
      events.push({
        type: event,
        description: getEventDescription(event),
        effect: getEventEffect(event)
      });
    }
  }
  
  // Location-specific events
  const locationEvents = getLocationEvents(state.location, state);
  events.push(...locationEvents);
  
  return events;
}

// Get event description
function getEventDescription(eventType) {
  const descriptions = {
    morning_dew: "Dewdrops sparkle on the leaves, catching the morning light.",
    bird_songs: "Birds sing their morning songs, filling the air with music.",
    butterflies: "Colorful butterflies dance in the sunlight.",
    sunlight_beams: "Beams of sunlight break through the canopy, creating golden pools of light.",
    fireflies: "Fireflies begin to glow, creating tiny points of light in the darkness.",
    evening_breeze: "A gentle evening breeze rustles the leaves.",
    owl_hoots: "An owl hoots in the distance, its call echoing through the night.",
    starlight: "Starlight filters through the canopy, creating a magical atmosphere.",
    aurora: "An ethereal aurora dances across the sky, painting it with otherworldly colors.",
    dream_walking: "The boundary between dreams and reality seems to blur."
  };
  
  return descriptions[eventType] || "Something interesting happens.";
}

// Get event effect
function getEventEffect(eventType) {
  const effects = {
    morning_dew: "healing_boost",
    bird_songs: "morale_boost",
    butterflies: "happiness_boost",
    sunlight_beams: "energy_boost",
    fireflies: "light_source",
    evening_breeze: "calming_effect",
    owl_hoots: "wisdom_boost",
    starlight: "magic_boost",
    aurora: "reality_shift",
    dream_walking: "dream_power"
  };
  
  return effects[eventType] || "no_effect";
}

// Get location-specific events
function getLocationEvents(location, state) {
  const events = [];
  
  switch (location) {
    case 'mysterious_grove':
      if (state.time === 'midnight') {
        events.push({
          type: "fairy_dance",
          description: "Fairies dance in a circle, their wings glowing with magical light.",
          effect: "magic_boost"
        });
      }
      break;
      
    case 'waterfall':
      if (state.weather === 'rain') {
        events.push({
          type: "rainbow",
          description: "A beautiful rainbow forms in the waterfall's mist.",
          effect: "happiness_boost"
        });
      }
      break;
      
    case 'ancient_ruins':
      if (state.time === 'night') {
        events.push({
          type: "ancient_whispers",
          description: "Ancient whispers echo from the ruins, speaking of forgotten secrets.",
          effect: "knowledge_boost"
        });
      }
      break;
      
    case 'river_bank':
      if (state.time === 'dawn') {
        events.push({
          type: "morning_fishing",
          description: "Fish jump in the river, creating ripples in the calm water.",
          effect: "food_opportunity"
        });
      }
      break;
      
    case 'deep_forest':
      if (state.weather === 'fog') {
        events.push({
          type: "shadow_movement",
          description: "Shadows seem to move independently in the fog.",
          effect: "stealth_boost"
        });
      }
      break;
  }
  
  return events;
}

// Apply environmental effects to game state
function applyEnvironmentalEffects(state) {
  const newState = { ...state };
  const effects = getEnvironmentalEffects(state);
  const events = getSpecialEvents(state);
  
  // Apply visibility effects
  newState.visibility = effects.visibility;
  
  // Apply movement effects
  newState.movementModifier = effects.movement;
  
  // Apply creature behavior changes
  newState.creatureBehavior = effects.creature_behavior;
  
  // Apply event effects
  for (const event of events) {
    applyEventEffect(newState, event);
  }
  
  // Update survival mechanics based on weather
  if (newState.weather === 'storm') {
    newState.fatigue = Math.min(100, newState.fatigue + 2);
  }
  
  if (newState.weather === 'rain') {
    newState.thirst = Math.max(0, newState.thirst - 1);
  }
  
  if (newState.time === 'night') {
    newState.fatigue = Math.min(100, newState.fatigue + 1);
  }
  
  return newState;
}

// Apply event effect to state
function applyEventEffect(state, event) {
  switch (event.effect) {
    case "healing_boost":
      state.health = Math.min(100, state.health + 5);
      break;
      
    case "morale_boost":
      state.morale = Math.min(100, (state.morale || 50) + 10);
      break;
      
    case "happiness_boost":
      state.happiness = Math.min(100, (state.happiness || 50) + 15);
      break;
      
    case "energy_boost":
      state.fatigue = Math.max(0, state.fatigue - 10);
      break;
      
    case "light_source":
      state.flags.hasLight = true;
      break;
      
    case "calming_effect":
      state.stress = Math.max(0, (state.stress || 0) - 10);
      break;
      
    case "wisdom_boost":
      state.skills.knowledge = Math.min(100, state.skills.knowledge + 2);
      break;
      
    case "magic_boost":
      state.skills.magic = Math.min(100, (state.skills.magic || 0) + 3);
      break;
      
    case "reality_shift":
      state.flags.realityShifted = true;
      break;
      
    case "dream_power":
      state.flags.dreamPower = true;
      break;
      
    case "stealth_boost":
      state.skills.stealth = Math.min(100, state.skills.stealth + 2);
      break;
      
    case "food_opportunity":
      state.flags.foodAvailable = true;
      break;
      
    case "knowledge_boost":
      state.skills.knowledge = Math.min(100, state.skills.knowledge + 3);
      break;
  }
}

// Get environmental description
function getEnvironmentalDescription(state) {
  const effects = getEnvironmentalEffects(state);
  const events = getSpecialEvents(state);
  
  let description = effects.description;
  
  // Add event descriptions
  for (const event of events) {
    description += `\n\n${event.description}`;
  }
  
  // Add environmental warnings
  if (effects.visibility < 30) {
    description += "\n\n⚠️ Visibility is very low. Be careful!";
  }
  
  if (effects.movement < 0.7) {
    description += "\n\n⚠️ Movement is difficult due to the weather.";
  }
  
  return description;
}

module.exports = {
  updateTime,
  processWeather,
  getEnvironmentalEffects,
  getSpecialEvents,
  applyEnvironmentalEffects,
  getEnvironmentalDescription,
  weatherTypes,
  timeCycles
}; 