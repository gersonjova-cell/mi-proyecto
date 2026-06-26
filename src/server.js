require('dotenv').config();

const express = require('express');
const twilio = require('twilio');
const { processMessage } = require('./agent');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// In-memory session store (use Redis in production for multi-instance deployments)
const sessions = new Map();

function getSession(callSid) {
  if (!sessions.has(callSid)) {
    sessions.set(callSid, { state: 'INIT', data: {} });
  }
  return sessions.get(callSid);
}

function buildVoiceResponse(text, action, end = false) {
  const twiml = new twilio.twiml.VoiceResponse();

  if (end) {
    twiml.say({ language: 'es-MX', voice: 'Polly.Lupe' }, text);
    twiml.hangup();
  } else {
    const gather = twiml.gather({
      input: 'speech',
      action,
      language: 'es-MX',
      speechTimeout: 'auto',
      speechModel: 'phone_call',
      enhanced: true,
      method: 'POST'
    });
    gather.say({ language: 'es-MX', voice: 'Polly.Lupe' }, text);

    // Fallback if no input detected
    twiml.redirect({ method: 'POST' }, action + '?noInput=true');
  }

  return twiml.toString();
}

// Entry point: incoming call
app.post('/voice/incoming', async (req, res) => {
  const callSid = req.body.CallSid;
  const session = getSession(callSid);

  const { response, nextState, updatedData } = await processMessage('', session.state, session.data);
  sessions.set(callSid, { state: nextState, data: updatedData });

  const twiml = buildVoiceResponse(response, '/voice/gather');
  res.type('text/xml').send(twiml);
});

// Process speech input
app.post('/voice/gather', async (req, res) => {
  const callSid = req.body.CallSid;
  const speechResult = req.body.SpeechResult || '';
  const noInput = req.query.noInput === 'true';

  const session = getSession(callSid);

  let input = speechResult;
  if (noInput) {
    input = '';
  }

  console.log(`[${callSid}] State: ${session.state} | Input: "${input}"`);

  let response, nextState, updatedData;

  if (!input && !noInput) {
    // Empty speech - repeat current question
    const current = await processMessage('__repeat__', session.state, session.data);
    response = current.response;
    nextState = session.state;
    updatedData = session.data;
  } else if (noInput && !input) {
    response = 'Lo siento, no le escuché. ¿Podría repetir por favor?';
    nextState = session.state;
    updatedData = session.data;
  } else {
    const result = await processMessage(input, session.state, session.data);
    response = result.response;
    nextState = result.nextState;
    updatedData = result.updatedData;
  }

  sessions.set(callSid, { state: nextState, data: updatedData });

  const isEnd = nextState === 'END';
  const twiml = buildVoiceResponse(response, '/voice/gather', isEnd);

  if (isEnd) {
    sessions.delete(callSid);
  }

  res.type('text/xml').send(twiml);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', sessions: sessions.size });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Agente de pedidos escuchando en puerto ${PORT}`);
});
