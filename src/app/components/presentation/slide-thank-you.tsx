import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, ShieldCheck, Lock, Key, Fingerprint, Eye, Server } from 'lucide-react';
import { TEXT_STYLES } from './design-system';

export function SlideThankYou() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random particles for background
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  const securityIcons = [
    { Icon: Shield, delay: 0, position: { x: -200, y: -100 } },
    { Icon: ShieldCheck, delay: 0.2, position: { x: 200, y: -100 } },
    { Icon: Lock, delay: 0.4, position: { x: -220, y: 50 } },
    { Icon: Key, delay: 0.6, position: { x: 220, y: 50 } },
    { Icon: Fingerprint, delay: 0.8, position: { x: -150, y: 150 } },
    { Icon: Eye, delay: 1.0, position: { x: 150, y: 150 } },
    { Icon: Server, delay: 1.2, position: { x: 0, y: -150 } },
  ];

  return (
    <div className="w-full h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Animated Background Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-red-400 rounded-full opacity-30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Orbiting Security Icons */}
      <div className="absolute inset-0 flex items-center justify-center">
        {securityIcons.map(({ Icon, delay, position }, index) => (
          <motion.div
            key={index}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.4, 0.4, 0],
              scale: [0, 1, 1, 1.2],
              x: [0, position.x, position.x, position.x * 1.2],
              y: [0, position.y, position.y, position.y * 1.2],
            }}
            transition={{
              duration: 4,
              delay: delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Icon className="w-12 h-12 text-red-400" strokeWidth={1.5} />
          </motion.div>
        ))}
      </div>

      {/* Central Shield Animation */}
      <motion.div
        className="absolute"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          duration: 1.5,
          ease: 'easeOut',
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Shield className="w-32 h-32 text-red-500 opacity-10" strokeWidth={1} />
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-12">
        {/* Thank You Text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.h1
            className="text-[72px] font-bold mb-6 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0%', '100%', '0%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundSize: '200% auto',
            }}
          >
            Thank You
          </motion.h1>
        </motion.div>

        {/* Secure Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="inline-flex items-center gap-3 px-6 py-3 bg-white border-2 border-red-500 rounded-full shadow-lg"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <ShieldCheck className="w-6 h-6 text-red-500" />
          </motion.div>
          <span className="text-base font-bold text-gray-900">Secured & Analyzed</span>
        </motion.div>

        {/* Bottom Security Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 flex justify-center gap-8"
        >
          {[Lock, Key, Fingerprint].map((Icon, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4 + index * 0.2 }}
            >
              <div className="p-3 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200">
                <Icon className="w-6 h-6 text-red-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pulse Effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-2 border-red-200 pointer-events-none"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-2 border-red-300 pointer-events-none"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 3,
            delay: 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Date Footer */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <p className="text-sm text-gray-400 font-medium">
          Analysis Period: October 2025 - January 2026
        </p>
      </motion.div>
    </div>
  );
}