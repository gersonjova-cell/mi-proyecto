const Anthropic = require('@anthropic-ai/sdk');
const { sendOrderEmail } = require('./email');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SIZES = ['S', 'M', 'L', 'XL'];
const MODELS = ['Regular Fit', 'Slim Fit', 'Oversize', 'Boxy Fit', 'Loose Fit'];

const STATE_PROMPTS = {
  ASK_NAME: {
    extract: 'Extrae el nombre y apellido de lo que dijo el cliente. Devuelve { "nombre": "...", "apellido": "..." } o null si no se proporcionó.',
    ask: 'Con mucho gusto. ¿Me podría proporcionar su nombre y apellido, por favor?'
  },
  ASK_SIZE: {
    extract: `Extrae la talla de playera de lo que dijo el cliente. Las opciones son: S, M, L, XL. Devuelve { "talla": "S/M/L/XL" } o null si no es clara.`,
    ask: '¿Qué talla desea? Las tallas disponibles son: S, M, L y XL.'
  },
  ASK_COLOR: {
    extract: 'Extrae el color deseado de lo que dijo el cliente. Devuelve { "color": "..." } o null si no se mencionó.',
    ask: '¿De qué color desea su playera?'
  },
  ASK_MODEL: {
    extract: `Extrae el modelo de playera de lo que dijo el cliente. Las opciones son: Regular Fit, Slim Fit, Oversize, Boxy Fit, Loose Fit. Devuelve { "modelo": "..." } o null si no es claro.`,
    ask: '¿Qué modelo de playera desea? Las opciones son: Regular Fit, Slim Fit, Oversize, Boxy Fit y Loose Fit.'
  },
  ASK_DELIVERY: {
    extract: 'Extrae el punto de entrega o dirección de lo que dijo el cliente. Devuelve { "entrega": "..." } o null si no se mencionó.',
    ask: '¿Cuál es su punto de entrega o dirección para el pedido?'
  },
  ASK_CONTACT: {
    extract: 'Extrae el número de teléfono o correo electrónico de lo que dijo el cliente. Devuelve { "contacto": "..." } o null si no se proporcionó.',
    ask: '¿Me podría proporcionar su número de teléfono o correo electrónico para confirmar su pedido?'
  }
};

const STATE_ORDER = ['ASK_NAME', 'ASK_SIZE', 'ASK_COLOR', 'ASK_MODEL', 'ASK_DELIVERY', 'ASK_CONTACT', 'CONFIRM'];

async function extractData(userInput, state) {
  if (!STATE_PROMPTS[state]) return null;

  const prompt = STATE_PROMPTS[state].extract;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    messages: [{
      role: 'user',
      content: `${prompt}\n\nCliente dijo: "${userInput}"\n\nResponde SOLO con el JSON válido, sin texto adicional.`
    }]
  });

  try {
    const text = message.content[0].text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return null;
  } catch {
    return null;
  }
}

async function handleCorrection(userInput, orderData) {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `Datos actuales del pedido: ${JSON.stringify(orderData, null, 2)}

El cliente quiere corregir algo y dijo: "${userInput}"

Identifica qué campo quiere corregir y cuál es el nuevo valor. Devuelve JSON con:
{
  "campo": "nombre|apellido|talla|color|modelo|entrega|contacto",
  "valor": "nuevo valor"
}
O null si no está claro. Responde SOLO con JSON.`
    }]
  });

  try {
    const text = message.content[0].text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return null;
  } catch {
    return null;
  }
}

function buildConfirmationSummary(data) {
  return `Permítame confirmar su pedido: ` +
    `Nombre: ${data.nombre} ${data.apellido}. ` +
    `Talla: ${data.talla}. ` +
    `Color: ${data.color}. ` +
    `Modelo: ${data.modelo}. ` +
    `Punto de entrega: ${data.entrega}. ` +
    `Contacto: ${data.contacto}. ` +
    `¿Es correcta esta información? Diga sí para confirmar o no para corregir algo.`;
}

async function isAffirmative(userInput) {
  const affirmatives = ['sí', 'si', 'yes', 'correcto', 'exacto', 'afirmativo', 'claro', 'así es', 'todo bien', 'está bien', 'ok', 'okay'];
  const lower = userInput.toLowerCase();
  return affirmatives.some(word => lower.includes(word));
}

async function processMessage(userInput, state, orderData) {
  const input = userInput ? userInput.trim() : '';

  if (state === 'INIT') {
    return {
      response: 'Bienvenido a nuestra tienda de playeras. ¿Me podría proporcionar su nombre y apellido, por favor?',
      nextState: 'ASK_NAME',
      updatedData: orderData
    };
  }

  if (state === 'CONFIRM') {
    const confirmed = await isAffirmative(input);

    if (confirmed) {
      await sendOrderEmail(orderData);
      return {
        response: 'Perfecto, su pedido ha sido registrado. En breve recibirá un mensaje, llamada o correo de confirmación. Muchas gracias por su preferencia. ¡Hasta pronto!',
        nextState: 'END',
        updatedData: orderData
      };
    } else {
      return {
        response: '¿Qué información desea corregir?',
        nextState: 'CORRECT',
        updatedData: orderData
      };
    }
  }

  if (state === 'CORRECT') {
    const correction = await handleCorrection(input, orderData);

    if (!correction) {
      return {
        response: 'No entendí bien qué desea corregir. ¿Podría indicarme qué dato está incorrecto?',
        nextState: 'CORRECT',
        updatedData: orderData
      };
    }

    const updatedData = { ...orderData, [correction.campo]: correction.valor };

    return {
      response: buildConfirmationSummary(updatedData),
      nextState: 'CONFIRM',
      updatedData
    };
  }

  // States with data extraction
  if (STATE_PROMPTS[state]) {
    const extracted = await extractData(input, state);
    const updatedData = { ...orderData };

    if (extracted) {
      Object.assign(updatedData, extracted);
    }

    const currentIndex = STATE_ORDER.indexOf(state);
    const allDataFields = {
      ASK_NAME: () => updatedData.nombre && updatedData.apellido,
      ASK_SIZE: () => updatedData.talla && SIZES.includes(updatedData.talla.toUpperCase()),
      ASK_COLOR: () => updatedData.color,
      ASK_MODEL: () => updatedData.modelo,
      ASK_DELIVERY: () => updatedData.entrega,
      ASK_CONTACT: () => updatedData.contacto
    };

    const dataComplete = allDataFields[state] ? allDataFields[state]() : false;

    if (!dataComplete) {
      let retryMsg = STATE_PROMPTS[state].ask;

      if (state === 'ASK_SIZE' && extracted && extracted.talla && !SIZES.includes(extracted.talla.toUpperCase())) {
        retryMsg = `Lo siento, esa talla no está disponible. ${STATE_PROMPTS.ASK_SIZE.ask}`;
      }

      return {
        response: retryMsg,
        nextState: state,
        updatedData
      };
    }

    const nextState = STATE_ORDER[currentIndex + 1];

    if (nextState === 'CONFIRM') {
      return {
        response: buildConfirmationSummary(updatedData),
        nextState: 'CONFIRM',
        updatedData
      };
    }

    return {
      response: STATE_PROMPTS[nextState].ask,
      nextState,
      updatedData
    };
  }

  return {
    response: 'Lo siento, ocurrió un error. Por favor, llame nuevamente.',
    nextState: 'END',
    updatedData: orderData
  };
}

module.exports = { processMessage };
