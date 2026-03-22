// AI service for dress code classification and outfit recommendations

export interface OutfitRecommendation {
  dressCode: string;
  recommendation: string;
  reasoning: string;
}

// Classify dress code based on event context
export function classifyDressCode(
  eventTitle: string,
  eventDescription: string,
  calendarType: string,
  isVirtual: boolean
): string {
  const title = eventTitle.toLowerCase();
  const desc = eventDescription?.toLowerCase() || '';
  
  // Formal events
  if (title.includes('interview') || title.includes('presentation') || 
      title.includes('conference') || desc.includes('formal')) {
    return 'Business Formal';
  }
  
  // Business casual
  if (title.includes('meeting') || title.includes('client') || 
      calendarType === 'Work' && !isVirtual) {
    return 'Business Casual';
  }
  
  // Smart casual
  if (title.includes('dinner') || title.includes('networking') || 
      title.includes('social')) {
    return 'Smart Casual';
  }
  
  // Athletic
  if (title.includes('gym') || title.includes('workout') || 
      title.includes('yoga') || title.includes('run')) {
    return 'Athletic';
  }
  
  // Default to casual
  return 'Casual';
}

// Generate outfit recommendation based on dress code and weather
export async function generateOutfitRecommendation(
  dressCode: string,
  temperature: number,
  condition: string,
  eventContext?: string
): Promise<OutfitRecommendation> {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  let recommendation = '';
  let reasoning = '';
  
  const isCold = temperature < 50;
  const isCool = temperature >= 50 && temperature < 65;
  const isWarm = temperature >= 65 && temperature < 80;
  const isHot = temperature >= 80;
  const isRainy = condition.toLowerCase().includes('rain');
  
  switch (dressCode) {
    case 'Business Formal':
      if (isCold) {
        recommendation = 'Suit with overcoat, dress shoes, and warm accessories';
        reasoning = 'Cold weather requires layering while maintaining formal appearance';
      } else if (isWarm || isHot) {
        recommendation = 'Lightweight suit, dress shirt, tie, and dress shoes';
        reasoning = 'Warm weather calls for breathable fabrics in formal attire';
      } else {
        recommendation = 'Full suit, dress shirt, tie, and polished dress shoes';
        reasoning = 'Perfect temperature for traditional business formal wear';
      }
      break;
      
    case 'Business Casual':
      if (isCold) {
        recommendation = 'Dress pants, button-down shirt, sweater, and loafers';
        reasoning = 'Layer with a sweater for warmth while staying professional';
      } else if (isWarm || isHot) {
        recommendation = 'Chinos, polo or short-sleeve button-down, loafers';
        reasoning = 'Light, breathable business casual for warm conditions';
      } else {
        recommendation = 'Dress pants, button-down shirt, blazer optional, dress shoes';
        reasoning = 'Classic business casual for comfortable temperatures';
      }
      break;
      
    case 'Smart Casual':
      if (isCold) {
        recommendation = 'Dark jeans, nice sweater or cardigan, boots or clean sneakers';
        reasoning = 'Smart layers that work for cold weather social settings';
      } else if (isWarm || isHot) {
        recommendation = 'Chinos or nice jeans, casual button-down or polo, clean sneakers';
        reasoning = 'Polished but comfortable for warm weather gatherings';
      } else {
        recommendation = 'Nice jeans or chinos, casual shirt, jacket optional, clean shoes';
        reasoning = 'Balanced smart casual for moderate temperatures';
      }
      break;
      
    case 'Athletic':
      if (isCold) {
        recommendation = 'Thermal athletic wear, layers, running jacket, athletic shoes';
        reasoning = 'Stay warm with technical fabrics designed for cold weather activity';
      } else if (isWarm || isHot) {
        recommendation = 'Moisture-wicking shorts, breathable athletic shirt, running shoes';
        reasoning = 'Light, breathable athletic wear for warm weather exercise';
      } else {
        recommendation = 'Athletic pants or shorts, performance shirt, athletic shoes';
        reasoning = 'Standard athletic attire for moderate temperature workouts';
      }
      break;
      
    case 'Casual':
    default:
      if (isCold) {
        recommendation = 'Jeans, warm sweater or hoodie, jacket, comfortable shoes';
        reasoning = 'Casual layers to stay warm and comfortable';
      } else if (isWarm || isHot) {
        recommendation = 'Lightweight chinos or tailored shorts, breathable cotton t-shirt or polo, comfortable sneakers or smart casual sandals';
        reasoning = 'For a casual and comfortable look in pleasant warm weather, choose lightweight fabrics';
      } else {
        recommendation = 'Jeans or casual pants, comfortable shirt, sneakers';
        reasoning = 'Relaxed casual wear for comfortable temperatures';
      }
      break;
  }
  
  // Add weather-specific advice
  if (isRainy) {
    recommendation += '. Bring a rain jacket or umbrella';
    reasoning += '. Rain expected';
  }
  
  return {
    dressCode,
    recommendation,
    reasoning
  };
}

// Get balanced day recommendation
export async function getBalancedDayRecommendation(
  events: any[],
  weatherConditions: any[]
): Promise<string> {
  if (events.length === 0) {
    return "You're all done for today. Check tomorrow's forecast to plan ahead. Balanced day - dress code and weather both matter.";
  }
  
  const dressCode = events[0]?.dressCode || 'Casual';
  return `Balanced day - dress code and weather both matter.`;
}
