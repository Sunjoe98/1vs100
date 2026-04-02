const path = require('path');
const fs = require('fs');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const questionsPath = path.join(__dirname, 'data', 'questions.json');
const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

const players = new Map();
let hostId = null;
let questionIndex = 0;
let activeQuestion = null;
let stage = 'lobby';
let lastReveal = null;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (_, res) => {
  res.json({ status: 'ok', stage, players: players.size });
});

io.on('connection', (socket) => {
  socket.on('join', ({ name, role }) => {
    if (role === 'host') {
      hostId = socket.id;
      socket.emit('host-control', buildHostState());
      broadcastState();
      return;
    }

    if (role === 'player') {
      const displayName = (name || '').trim() || `Spieler ${players.size + 1}`;
      players.set(socket.id, {
        id: socket.id,
        name: displayName,
        status: 'alive',
        score: 0,
        answer: null,
      });
    }

    socket.emit('state', buildPublicState());
    broadcastState();
  });

  socket.on('host-start-question', () => {
    if (socket.id !== hostId || questions.length === 0) return;
    activeQuestion = questions[questionIndex % questions.length];
    questionIndex += 1;
    lastReveal = null;
    stage = 'question';
    players.forEach((player) => {
      player.answer = null;
    });
    const payload = {
      prompt: activeQuestion.prompt,
      options: activeQuestion.options,
      number: questionIndex,
      total: questions.length,
    };
    io.emit('question-started', payload);
    broadcastState();
    socket.emit('host-control', buildHostState());
  });

  socket.on('submit-answer', (optionIndex) => {
    const player = players.get(socket.id);
    if (!player || stage !== 'question' || typeof optionIndex !== 'number') return;
    player.answer = optionIndex;
    broadcastState();
  });

  socket.on('host-reveal-answer', () => {
    if (socket.id !== hostId || !activeQuestion) return;
    stage = 'reveal';
    const correctIndex = activeQuestion.correctIndex;
    const eliminated = [];

    players.forEach((player) => {
      if (player.status !== 'alive') return;
      if (player.answer === correctIndex) {
        player.score += 1;
      } else {
        player.status = 'out';
        eliminated.push(player.id);
      }
      player.answer = null;
    });

    lastReveal = {
      correctIndex,
      eliminated,
      mobAlive: getMobAliveCount(),
      answerCounts: getAnswerCounts(activeQuestion.options.length),
    };

    io.emit('question-reveal', lastReveal);
    broadcastState();
    socket.emit('host-control', buildHostState());
  });

  socket.on('host-reset-game', () => {
    if (socket.id !== hostId) return;
    questionIndex = 0;
    activeQuestion = null;
    lastReveal = null;
    stage = 'lobby';
    players.forEach((player) => {
      player.status = 'alive';
      player.score = 0;
      player.answer = null;
    });
    io.emit('game-reset');
    broadcastState();
    socket.emit('host-control', buildHostState());
  });

  socket.on('disconnect', () => {
    if (socket.id === hostId) {
      hostId = null;
    }
    players.delete(socket.id);
    broadcastState();
  });
});

function broadcastState() {
  io.emit('state', buildPublicState());
  if (hostId) {
    io.to(hostId).emit('host-control', buildHostState());
  }
}

function buildPublicState() {
  const optionCount = activeQuestion?.options?.length || 0;

  return {
    stage,
    questionNumber: questionIndex,
    totalQuestions: questions.length,
    mobAlive: getMobAliveCount(),
    answerCounts: getAnswerCounts(optionCount),
    lastReveal,
    players: Array.from(players.values()).map((player) => ({
      id: player.id,
      name: player.name,
      score: player.score,
      status: player.status,
      answered: player.answer !== null,
    })),
    activeQuestion:
      stage === 'question' && activeQuestion
        ? {
            prompt: activeQuestion.prompt,
            options: activeQuestion.options,
            number: questionIndex,
            total: questions.length,
          }
        : null,
  };
}

function buildHostState() {
  return {
    stage,
    hostConnected: !!hostId,
    questionNumber: questionIndex,
    totalQuestions: questions.length,
    mobAlive: getMobAliveCount(),
    activeQuestion,
    lastReveal,
    players: Array.from(players.values()),
  };
}

function getMobAliveCount() {
  let alive = 0;
  players.forEach((player) => {
    if (player.status === 'alive') alive += 1;
  });
  return alive;
}

function getAnswerCounts(optionCount) {
  if (!optionCount) return [];
  const counts = new Array(optionCount).fill(0);
  players.forEach((player) => {
    if (player.status !== 'alive' || player.answer === null || player.answer === undefined) return;
    const idx = Number(player.answer);
    if (Number.isInteger(idx) && idx >= 0 && idx < optionCount) {
      counts[idx] += 1;
    }
  });
  return counts;
}

const port = process.env.PORT || 3000;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`1vs100 Server läuft auf http://localhost:${port}`);
});
