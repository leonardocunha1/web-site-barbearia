import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { addDays, addHours, addMinutes, startOfMonth } from 'date-fns';
import 'dotenv/config';

const prisma = new PrismaClient();

// Load credentials from environment
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
const PROFESSIONAL_PASSWORD = process.env.SEED_PROFESSIONAL_PASSWORD || 'Senha@123';
const CLIENT_PASSWORD = process.env.SEED_CLIENT_PASSWORD || 'Senha@123';
const SEED_EMAIL_DOMAIN = process.env.SEED_EMAIL_DOMAIN || 'seed.local';

const ADMIN_COUNT = 2;
const PROFESSIONAL_COUNT = 5;
const CLIENT_COUNT = 10;

const PASSWORD_HASH_ROUNDS = 6;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
}

function buildEmail(prefix: string, index: number): string {
  const suffix = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `${prefix}.${index}.${suffix}@${SEED_EMAIL_DOMAIN}`;
}

function buildPhone(seed: number): string {
  return `1199${String(seed).padStart(7, '0')}`;
}

function shuffleArray<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

async function main() {
  if (process.env.NODE_ENV !== 'dev') {
    throw new Error('Seed permitido apenas com NODE_ENV=dev');
  }

  console.log('🌱 Começando o seed do banco de dados...\n');

  // Limpar dados existentes (cuidado em produção!)
  console.log('🗑️  Limpando dados anteriores...');
  await prisma.couponRedemption.deleteMany();
  await prisma.bonusRedemption.deleteMany();
  await prisma.bonusTransaction.deleteMany();
  await prisma.userBonus.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.bookingItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.holiday.deleteMany();
  await prisma.businessHours.deleteMany();
  await prisma.serviceProfessional.deleteMany();
  await prisma.service.deleteMany();
  await prisma.professional.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.log.deleteMany();
  await prisma.user.deleteMany();

  // 1. Criar Usuários
  console.log('\n👤 Criando usuários...');

  const adminNames = ['Administrador 1', 'Administrador 2'];
  const professionalNames = [
    'Pedro Barbeiro',
    'Roberto Silva',
    'Gustavo Oliveira',
    'Marcos Lima',
    'Felipe Santos',
  ];
  const clientNames = [
    'João Silva',
    'Lucas Santos',
    'Fernando Costa',
    'Mariana Oliveira',
    'Carlos Mendes',
    'Ana Souza',
    'Bruno Almeida',
    'Camila Rocha',
    'Diego Martins',
    'Juliana Ribeiro',
  ];

  const adminPasswordHash = await hashPassword(ADMIN_PASSWORD);
  const professionalPasswordHash = await hashPassword(PROFESSIONAL_PASSWORD);
  const clientPasswordHash = await hashPassword(CLIENT_PASSWORD);

  const adminUsers = await Promise.all(
    adminNames.slice(0, ADMIN_COUNT).map((name, index) =>
      prisma.user.create({
        data: {
          name,
          email: buildEmail('admin', index + 1),
          password: adminPasswordHash,
          phone: buildPhone(100 + index),
          role: 'ADMIN',
          emailVerified: true,
          active: true,
        },
      }),
    ),
  );
  console.log(`✅ ${adminUsers.length} admins criados`);

  const clientUsers = await Promise.all(
    clientNames.slice(0, CLIENT_COUNT).map((name, index) =>
      prisma.user.create({
        data: {
          name,
          email: buildEmail('cliente', index + 1),
          password: clientPasswordHash,
          phone: buildPhone(200 + index),
          role: 'CLIENT',
          emailVerified: true,
          active: true,
        },
      }),
    ),
  );
  console.log(`✅ ${clientUsers.length} clientes criados`);

  const professionalUsers = await Promise.all(
    professionalNames.slice(0, PROFESSIONAL_COUNT).map((name, index) =>
      prisma.user.create({
        data: {
          name,
          email: buildEmail('profissional', index + 1),
          password: professionalPasswordHash,
          phone: buildPhone(300 + index),
          role: 'PROFESSIONAL',
          emailVerified: true,
          active: true,
        },
      }),
    ),
  );
  console.log(`✅ ${professionalUsers.length} profissionais criados`);

  // 2. Criar Profissionais
  console.log('\n💼 Criando perfis de profissionais...');

  const specialties = [
    'Corte Clássico',
    'Corte Moderno',
    'Barba e Estilo',
    'Máquina e Acabamento',
    'Corte Rápido',
  ];
  const professionals = await Promise.all(
    professionalUsers.map((user, index) =>
      prisma.professional.create({
        data: {
          userId: user.id,
          specialty: specialties[index % specialties.length],
          bio: `Profissional especializado em ${specialties[index % specialties.length].toLowerCase()}.`,
          active: true,
        },
      }),
    ),
  );
  console.log(`✅ ${professionals.length} profissionais configurados`);

  // 3. Criar Horários de Funcionamento
  console.log('\n⏰ Criando horários de funcionamento...');

  const businessHoursData = [
    // Segunda a Sexta: 09:00 - 19:00 com pausa 12:00 - 13:00
    { dayOfWeek: 1, opensAt: '09:00', closesAt: '19:00', breakStart: '12:00', breakEnd: '13:00' },
    { dayOfWeek: 2, opensAt: '09:00', closesAt: '19:00', breakStart: '12:00', breakEnd: '13:00' },
    { dayOfWeek: 3, opensAt: '09:00', closesAt: '19:00', breakStart: '12:00', breakEnd: '13:00' },
    { dayOfWeek: 4, opensAt: '09:00', closesAt: '19:00', breakStart: '12:00', breakEnd: '13:00' },
    { dayOfWeek: 5, opensAt: '09:00', closesAt: '19:00', breakStart: '12:00', breakEnd: '13:00' },
    // Sábado: 09:00 - 17:00 sem pausa
    { dayOfWeek: 6, opensAt: '09:00', closesAt: '17:00', breakStart: null, breakEnd: null },
  ];

  for (const professional of professionals) {
    await Promise.all(
      businessHoursData.map((hours) =>
        prisma.businessHours.create({
          data: {
            professionalId: professional.id,
            dayOfWeek: hours.dayOfWeek,
            opensAt: hours.opensAt,
            closesAt: hours.closesAt,
            breakStart: hours.breakStart,
            breakEnd: hours.breakEnd,
            active: true,
          },
        }),
      ),
    );
  }
  console.log('✅ Horários de funcionamento criados');

  // 4. Criar Serviços
  console.log('\n✂️  Criando serviços...');

  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Corte Cabelo',
        description: 'Corte tradicional de cabelo',
        category: 'Cortes',
        active: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Barba Completa',
        description: 'Design e aparo completo de barba',
        category: 'Barba',
        active: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Corte na Máquina',
        description: 'Corte rápido com máquina',
        category: 'Cortes',
        active: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Sobrancelha',
        description: 'Design e aparo de sobrancelha',
        category: 'Complementos',
        active: true,
      },
    }),
  ]);
  console.log(`✅ ${services.length} serviços criados`);

  // 5. Vincular Serviços aos Profissionais
  console.log('\n🔗 Vinculando serviços aos profissionais...');

  const durationByServiceId = new Map([
    [services[0].id, 30],
    [services[1].id, 30],
    [services[2].id, 15],
    [services[3].id, 15],
  ]);
  const priceByServiceId = new Map([
    [services[0].id, 40.0],
    [services[1].id, 40.0],
    [services[2].id, 25.0],
    [services[3].id, 15.0],
  ]);

  const serviceProfessionalCreates = professionals.flatMap((professional) => {
    const serviceCount = 2 + Math.floor(Math.random() * 3); // 2-4 serviços
    const selectedServices = shuffleArray(services).slice(0, serviceCount);

    return selectedServices.map((service) =>
      prisma.serviceProfessional.create({
        data: {
          serviceId: service.id,
          professionalId: professional.id,
          price: priceByServiceId.get(service.id) ?? 30.0,
          duration: durationByServiceId.get(service.id) ?? 15,
        },
      }),
    );
  });

  const serviceProfessionals = await Promise.all(serviceProfessionalCreates);
  console.log(`✅ ${serviceProfessionals.length} relações de serviço-profissional criadas`);

  // 6. Criar Bônus para Usuários
  console.log('\n🎁 Criando bônus de usuários...');

  await Promise.all([
    ...clientUsers.map((user) =>
      prisma.userBonus.create({
        data: {
          userId: user.id,
          type: 'BOOKING_POINTS',
          points: Math.floor(Math.random() * 300) + 50,
        },
      }),
    ),
    ...clientUsers.map((user) =>
      prisma.userBonus.create({
        data: {
          userId: user.id,
          type: 'LOYALTY',
          points: Math.floor(Math.random() * 500) + 100,
        },
      }),
    ),
  ]);
  console.log('✅ Bônus de usuários criados');

  // 7. Criar Agendamentos (Bookings)
  console.log('\n📅 Criando agendamentos...');

  const today = new Date();
  const monthStart = startOfMonth(today);

  const serviceById = new Map(services.map((service) => [service.id, service]));
  const serviceProfessionalsByProfessional = new Map<string, typeof serviceProfessionals>();
  for (const serviceProfessional of serviceProfessionals) {
    const list = serviceProfessionalsByProfessional.get(serviceProfessional.professionalId) ?? [];
    list.push(serviceProfessional);
    serviceProfessionalsByProfessional.set(serviceProfessional.professionalId, list);
  }

  const bookingStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'] as const;
  const BOOKING_COUNT = 24;

  const bookings = await Promise.all(
    Array.from({ length: BOOKING_COUNT }, (_, index) => {
      const client = clientUsers[index % clientUsers.length];
      const professional = professionals[Math.floor(Math.random() * professionals.length)];
      const professionalServices = serviceProfessionalsByProfessional.get(professional.id) ?? [];
      const serviceProfessional =
        professionalServices[Math.floor(Math.random() * professionalServices.length)];

      const dayOffset = Math.floor(Math.random() * 14) - 7;
      const hour = 9 + Math.floor(Math.random() * 8);
      const minute = 15 * Math.floor(Math.random() * 4);

      const startDateTime = addDays(today, dayOffset);
      startDateTime.setHours(hour, minute, 0, 0);

      const endDateTime = addMinutes(startDateTime, serviceProfessional.duration);
      const status = bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)];
      const service = serviceById.get(serviceProfessional.serviceId);

      return prisma.booking.create({
        data: {
          userId: client.id,
          professionalId: professional.id,
          startDateTime,
          endDateTime,
          status,
          totalAmount: serviceProfessional.price,
          canceledAt: status === 'CANCELED' ? addMinutes(startDateTime, -30) : undefined,
          items: {
            create: {
              serviceProfessionalId: serviceProfessional.id,
              serviceId: serviceProfessional.serviceId,
              name: service?.name ?? 'Serviço',
              price: serviceProfessional.price,
              duration: serviceProfessional.duration,
            },
          },
        },
      });
    }),
  );
  console.log(`✅ ${bookings.length} agendamentos criados`);

  // 8. Criar Cupons
  console.log('\n🎟️  Criando cupons...');

  const coupons = await Promise.all([
    prisma.coupon.create({
      data: {
        code: 'BEMVINDO10',
        description: 'Desconto de boas-vindas para clientes novos',
        type: 'PERCENTAGE',
        value: 10,
        scope: 'GLOBAL',
        maxUses: 50,
        startDate: monthStart,
        endDate: addDays(monthStart, 30),
        active: true,
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'CORTE20',
        description: 'Desconto exclusivo em cortes',
        type: 'PERCENTAGE',
        value: 20,
        scope: 'SERVICE',
        serviceId: services[0].id,
        maxUses: null,
        startDate: monthStart,
        endDate: null,
        active: true,
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'FIDELIDADE30',
        description: 'Cupom de fidelidade - R$ 30 de desconto',
        type: 'FIXED',
        value: 30,
        scope: 'GLOBAL',
        minBookingValue: 100,
        maxUses: 100,
        startDate: monthStart,
        endDate: null,
        active: true,
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'PEDRO50',
        description: 'Desconto com profissional Pedro',
        type: 'PERCENTAGE',
        value: 15,
        scope: 'PROFESSIONAL',
        professionalId: professionals[0].id,
        maxUses: null,
        startDate: monthStart,
        endDate: addDays(monthStart, 60),
        active: true,
      },
    }),
  ]);
  console.log(`✅ ${coupons.length} cupons criados`);

  console.log('\n✨ Seed concluído com sucesso!\n');
  console.log('📋 Dados criados:');
  console.log(`  - ${adminUsers.length} Admins`);
  console.log(`  - ${clientUsers.length} Clientes`);
  console.log(`  - ${professionals.length} Profissionais`);
  console.log(`  - ${services.length} Serviços`);
  console.log(`  - ${serviceProfessionals.length} Relações Serviço-Profissional`);
  console.log(`  - ${bookings.length} Agendamentos`);
  console.log(`  - ${coupons.length} Cupons`);
  console.log('\n🔐 Senhas padrão (.env):');
  console.log(`  Admins: ${ADMIN_PASSWORD}`);
  console.log(`  Profissionais: ${PROFESSIONAL_PASSWORD}`);
  console.log(`  Clientes: ${CLIENT_PASSWORD}`);
  console.log('\n📧 Emails gerados:');
  console.log(`  Admins: ${adminUsers.map((user) => user.email).join(', ')}`);
  console.log(`  Profissionais: ${professionalUsers.map((user) => user.email).join(', ')}`);
  console.log(`  Clientes: ${clientUsers.map((user) => user.email).join(', ')}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
