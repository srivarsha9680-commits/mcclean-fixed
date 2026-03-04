// server.ts — Custom Next.js server with Socket.io
// Run with: npx ts-node --project tsconfig.server.json server.ts
// Or compile and run the JS output

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new SocketIOServer(httpServer, {
    path: '/api/socket',
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // Make io accessible globally for API routes if needed
  (global as any).io = io;

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join booking room for real-time updates
    socket.on('join-booking', (bookingId: string) => {
      socket.join(`booking-${bookingId}`);
      console.log(`Socket ${socket.id} joined booking-${bookingId}`);
    });

    // Cleaner broadcasts their location
    socket.on(
      'location-update',
      (data: { bookingId: string; lat: number; lng: number }) => {
        socket.to(`booking-${data.bookingId}`).emit('cleaner-location', {
          lat: data.lat,
          lng: data.lng,
        });
      }
    );

    // Cleaner marks arrival
    socket.on(
      'cleaner-arrived',
      (data: { bookingId: string; timestamp: string }) => {
        io.to(`booking-${data.bookingId}`).emit('cleaner-arrived', data);
      }
    );

    // Photo uploaded (before / after)
    socket.on(
      'photo-uploaded',
      (data: { bookingId: string; type: 'before' | 'after'; url: string }) => {
        io.to(`booking-${data.bookingId}`).emit('photo-uploaded', data);
      }
    );

    // Chat messages
    socket.on(
      'send-message',
      (data: { bookingId: string; senderId: string; content: string }) => {
        io.to(`booking-${data.bookingId}`).emit('new-message', {
          ...data,
          timestamp: new Date().toISOString(),
        });
      }
    );

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
